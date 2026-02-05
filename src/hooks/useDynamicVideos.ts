import { useState, useEffect } from 'react';
import { fetchVideosFromSearch, fetchVideosFromChannel, isYouTubeConfigured, FetchedVideo, SearchConfig } from '@/services/youtubeService';
import { fetchMultipleChannelsViaRss, rssToFetchedVideos, getCuratedChannelsForCategory, CURATED_CHANNELS, fetchChannelVideosViaRss } from '@/services/youtubeRssService';
import { fetchVideosFromMatchedSubscriptions } from '@/services/subscriptionMatcher';
import { updateChannelCache } from '@/services/channelVideoCache';
import { CHANNEL_SEARCH_CONFIG } from '@/data/channelSources';
import { getChannelSearchConfig, getCurrentProgram } from '@/data/scheduledProgramming';
import { channels, Video } from '@/data/channels';
import { isAllowedVideoTitle } from '@/lib/contentGuards';
import { getSavedLocalNewsStation } from '@/hooks/useLocalNews';
import { applyTuningToVideos, augmentQueryWithTuning, isVideoBlockedById } from '@/hooks/useAlgorithmTuning';
import { isCustomChannel, CUSTOM_CHANNEL_PREFIX } from '@/hooks/useCustomChannels';
import { supabase } from '@/integrations/supabase/client';

let videoCache: Record<string, { videos: FetchedVideo[]; timestamp: number; programName?: string; timeBlock?: string }> = {};
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours for RSS-based content (RSS is free!)
const LOCAL_NEWS_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes for local news
const CUSTOM_CHANNEL_CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours for custom channels

// Get current time block name for cache invalidation
function getCurrentTimeBlockName(): string {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 14) return 'midday';
  if (hour >= 14 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'primetime';
  return 'latenight';
}

// Storage for custom channel search configs (set by components that have access to useCustomChannels)
let customChannelConfigs: Record<string, SearchConfig> = {};
// Storage for custom channel topics (for subscription matching)
let customChannelTopics: Record<string, string> = {};

/**
 * Register a custom channel's search config for use by useDynamicVideos.
 * This is called by ChannelGuide or other components that have access to useCustomChannels.
 */
export function registerCustomChannelConfig(channelId: string, config: SearchConfig, topic?: string): void {
  customChannelConfigs[channelId] = config;
  if (topic) {
    customChannelTopics[channelId] = topic;
  }
}

/**
 * Clear a custom channel's search config (e.g., when deleted).
 */
export function unregisterCustomChannelConfig(channelId: string): void {
  delete customChannelConfigs[channelId];
  delete customChannelTopics[channelId];
}

/**
 * Get a custom channel's search config.
 */
function getCustomChannelConfig(channelId: string): SearchConfig | null {
  return customChannelConfigs[channelId] || null;
}

/**
 * Get a custom channel's topic for subscription matching.
 */
function getCustomChannelTopic(channelId: string): string | null {
  return customChannelTopics[channelId] || null;
}

// Clear cache when language changes
if (typeof window !== 'undefined') {
  window.addEventListener('language-changed', () => {
    console.log('Language changed - clearing video cache');
    videoCache = {};
  });
}

// Time block names (4 per day) - used for rotation of fallback content
type TimeBlock = 'early' | 'morning' | 'afternoon' | 'primetime' | 'latenight';
function getCurrentTimeBlock(): TimeBlock {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 9) return 'early';
  if (hour >= 9 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'primetime';
  return 'latenight';
}

// Deterministic shuffle based on day + time block (so all users see same order in same block)
function deterministicShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.abs(Math.floor((Math.sin(seed + i) * 10000) % (i + 1)));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Rotate fallback videos so they differ by time block
function getRotatedFallback(channelId: string): FetchedVideo[] {
  // Custom channels don't have static fallback videos
  if (isCustomChannel(channelId)) {
    return [];
  }

  const staticChannel = channels.find(c => c.id === channelId);
  if (!staticChannel || staticChannel.videos.length === 0) return [];

  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const blockIndex = ['early', 'morning', 'afternoon', 'primetime', 'latenight'].indexOf(getCurrentTimeBlock());
  const seed = dayOfYear * 10 + blockIndex;

  // Map Video to FetchedVideo (they're compatible) and filter out blocked videos
  const videos: FetchedVideo[] = staticChannel.videos
    .filter(v => !isVideoBlockedById(v.id))
    .map(v => ({ id: v.id, title: v.title, duration: v.duration }));
  return deterministicShuffle(videos, seed);
}

/**
 * Check if a channel has curated YouTube channels (for RSS-based fetching)
 */
function hasCuratedChannels(channelId: string): boolean {
  return channelId in CURATED_CHANNELS;
}

/**
 * Fetch videos via RSS feeds (free, no API quota!)
 * Uses a tiered approach: first try multiple channels, if that fails try individual channels
 */
async function fetchViaRss(channelId: string): Promise<FetchedVideo[]> {
  const curatedChannels = getCuratedChannelsForCategory(channelId);
  if (curatedChannels.length === 0) {
    console.log(`[${channelId}] No curated channels for RSS fetching`);
    return [];
  }

  console.log(`[${channelId}] Fetching via RSS from ${curatedChannels.length} channels (FREE - no API quota)`);

  try {
    // Try batch fetch first
    let rssVideos = await fetchMultipleChannelsViaRss(curatedChannels);

    // If batch failed, try individual channels
    if (rssVideos.length === 0) {
      console.log(`[${channelId}] Batch fetch returned 0 videos, trying individual channels`);
      for (const ytChannelId of curatedChannels.slice(0, 3)) {
        const videos = await fetchChannelVideosViaRss(ytChannelId);
        if (videos.length > 0) {
          rssVideos = videos;
          console.log(`[${channelId}] Got ${videos.length} videos from individual channel ${ytChannelId}`);
          break;
        }
      }
    }

    // Convert to FetchedVideo format, excluding shorts
    // Lower view threshold to get more content variety
    const videos = rssToFetchedVideos(rssVideos, {
      excludeShorts: true,
      minViews: 1000, // Lower threshold for more variety
      limit: 40,
      estimatedDuration: 600, // 10 min default
    });

    console.log(`[${channelId}] RSS returned ${videos.length} videos after filtering`);
    return videos;
  } catch (error) {
    console.error(`[${channelId}] RSS fetch error:`, error);
    return [];
  }
}

export function useDynamicVideos(channelId: string) {
  const [videos, setVideos] = useState<FetchedVideo[]>(() => getRotatedFallback(channelId));
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [currentProgramName, setCurrentProgramName] = useState<string | null>(null);

  useEffect(() => {
    async function loadVideos() {
      setLoading(true);

      // Immediately provide rotated fallback so player can start
      const fallbackVideos = getRotatedFallback(channelId);
      if (fallbackVideos.length > 0 && videos.length === 0) {
        setVideos(fallbackVideos);
      }

      // Check for scheduled programming
      const program = getCurrentProgram(channelId);
      const currentProgram = program?.name || null;
      setCurrentProgramName(currentProgram);

      // Create a cache key that includes the program name for scheduled channels
      const cacheKey = currentProgram ? `${channelId}:${currentProgram}` : channelId;
      const currentTimeBlock = getCurrentTimeBlockName();

      // Check cache first (use shorter cache for local news, custom channels)
      // Also invalidate if time block changed (TV-like scheduling)
      const cached = videoCache[cacheKey];
      const cacheDuration = channelId === 'localnews'
        ? LOCAL_NEWS_CACHE_DURATION
        : isCustomChannel(channelId)
          ? CUSTOM_CHANNEL_CACHE_DURATION
          : CACHE_DURATION;
      const cacheValid = cached &&
        Date.now() - cached.timestamp < cacheDuration &&
        cached.timeBlock === currentTimeBlock;

      if (cacheValid) {
        console.log(`[${channelId}] Using cached videos (${cached.videos.length} videos)`);
        setVideos(cached.videos);
        setUsingFallback(false);
        setLoading(false);
        return;
      }

      // ============================================
      // STRATEGY 1: RSS feeds (FREE - no API quota!)
      // ============================================
      if (hasCuratedChannels(channelId) && !isCustomChannel(channelId) && channelId !== 'localnews') {
        const rssVideos = await fetchViaRss(channelId);

        if (rssVideos.length > 0) {
          // Filter and shuffle for variety
          const guarded = rssVideos.filter((v) => isAllowedVideoTitle(channelId, v.title));
          const tuned = applyTuningToVideos(guarded, channelId);
          const shuffled = deterministicShuffle(tuned, Date.now() / (1000 * 60 * 60)); // Shuffle hourly

          if (shuffled.length > 0) {
            videoCache[cacheKey] = {
              videos: shuffled,
              timestamp: Date.now(),
              programName: currentProgram || undefined,
              timeBlock: currentTimeBlock
            };
            // Update shared cache for guide
            updateChannelCache(channelId, shuffled, 'rss');
            setVideos(shuffled);
            setUsingFallback(false);
            setLoading(false);
            return;
          }
        }
        // If RSS failed, fall through to fallback (don't use API to save quota)
        console.log(`[${channelId}] RSS returned no videos, using fallback`);
      }

      // ============================================
      // STRATEGY 2: Local News (RSS from specific channel)
      // ============================================
      if (channelId === 'localnews') {
        const station = getSavedLocalNewsStation();
        if (station?.youtubeChannelId) {
          console.log(`[localnews] Fetching via RSS from ${station.name}`);

          try {
            const rssVideos = await fetchMultipleChannelsViaRss([station.youtubeChannelId]);
            const videos = rssToFetchedVideos(rssVideos, {
              excludeShorts: true,
              minViews: 0, // Local news may have low views
              limit: 20,
              estimatedDuration: 1800, // 30 min default for news
            });

            if (videos.length > 0) {
              videoCache[cacheKey] = {
                videos,
                timestamp: Date.now(),
                timeBlock: currentTimeBlock
              };
              // Update shared cache for guide
              updateChannelCache(channelId, videos, 'rss');
              setVideos(videos);
              setUsingFallback(false);
              setLoading(false);
              return;
            }
          } catch (error) {
            console.error('[localnews] RSS fetch error:', error);
          }
        }
      }

      // ============================================
      // STRATEGY 3: Custom channels
      // Priority: 1) User's subscriptions via RSS (FREE!)
      //           2) YouTube Search API (quota limited)
      // ============================================
      if (isCustomChannel(channelId)) {
        const customConfig = getCustomChannelConfig(channelId);

        // STRATEGY 3A: Try user's subscriptions first (FREE via RSS!)
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          console.log(`[${channelId}] Custom channel - trying subscription matching (FREE)`);

          try {
            // Get topic from registered config or extract from query
            const topic = getCustomChannelTopic(channelId) ||
              customConfig?.query?.replace(/["']/g, '').split(' OR ')[0] ||
              channelId;
            const subscriptionVideos = await fetchVideosFromMatchedSubscriptions(user.id, topic);

            if (subscriptionVideos.length > 0) {
              const guarded = subscriptionVideos.filter((v) => isAllowedVideoTitle(channelId, v.title));
              const tuned = applyTuningToVideos(guarded, channelId);
              const shuffled = deterministicShuffle(tuned, Date.now() / (1000 * 60 * 60));

              if (shuffled.length > 0) {
                videoCache[cacheKey] = {
                  videos: shuffled,
                  timestamp: Date.now(),
                  timeBlock: currentTimeBlock
                };
                // Update shared cache for guide
                updateChannelCache(channelId, shuffled, 'rss');
                setVideos(shuffled);
                setUsingFallback(false);
                setLoading(false);
                console.log(`[${channelId}] Loaded ${shuffled.length} videos from user subscriptions (FREE!)`);
                return;
              }
            }
          } catch (error) {
            console.error(`[${channelId}] Subscription matching error:`, error);
          }
        }

        // STRATEGY 3B: Fall back to YouTube Search API (quota limited)
        if (customConfig && isYouTubeConfigured()) {
          console.log(`[${channelId}] Custom channel - falling back to API (may fail if quota exceeded)`);

          try {
            const fetched = await fetchVideosFromSearch({
              ...customConfig,
              channelType: channelId,
              limit: 15
            });

            if (fetched.length > 0) {
              const guarded = fetched.filter((v) => isAllowedVideoTitle(channelId, v.title));
              const tuned = applyTuningToVideos(guarded, channelId);

              if (tuned.length > 0) {
                videoCache[cacheKey] = {
                  videos: tuned,
                  timestamp: Date.now(),
                  timeBlock: currentTimeBlock
                };
                // Update shared cache for guide
                updateChannelCache(channelId, tuned, 'rss');
                setVideos(tuned);
                setUsingFallback(false);
                setLoading(false);
                return;
              }
            }
          } catch (error) {
            console.error(`[${channelId}] API error (quota likely exceeded):`, error);
          }
        }

        // Custom channel with no results - show empty state with placeholder
        console.warn(`[${channelId}] Custom channel could not load videos`);
        setVideos([]);
        setUsingFallback(true);
        setLoading(false);
        return;
      }

      // ============================================
      // FALLBACK: Use static video list
      // ============================================
      console.log(`[${channelId}] Using rotated fallback videos`);
      setVideos(fallbackVideos);
      setUsingFallback(fallbackVideos.length > 0);
      setLoading(false);
    }

    loadVideos();
  }, [channelId]);

  return { videos, loading, usingFallback, currentProgramName };
}

// Export function to get videos for a channel (for use in non-React contexts)
export function getDynamicVideosForChannel(channelId: string): FetchedVideo[] {
  // Check cache first
  const cached = videoCache[channelId];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.videos;
  }
  // Return rotated fallback instead of unmodified static list
  return getRotatedFallback(channelId);
}

// Preload videos for a channel (useful for preloading next channel)
// Now uses RSS which is free, so we can enable preloading again
export async function preloadChannelVideos(channelId: string): Promise<void> {
  // Check if already cached - if so, skip entirely
  const cached = videoCache[channelId];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return; // Already cached, no need to fetch
  }

  // Only preload channels with curated RSS sources (free)
  if (hasCuratedChannels(channelId)) {
    console.log(`[${channelId}] Preloading via RSS (free)`);
    await fetchViaRss(channelId);
  }
}
