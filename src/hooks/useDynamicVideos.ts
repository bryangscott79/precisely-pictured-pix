import { useState, useEffect } from 'react';
import { fetchVideosFromSearch, isYouTubeConfigured, FetchedVideo } from '@/services/youtubeService';
import { CHANNEL_SEARCH_CONFIG } from '@/data/channelSources';
import { getChannelSearchConfig, getCurrentProgram } from '@/data/scheduledProgramming';
import { channels, Video } from '@/data/channels';
import { isAllowedVideoTitle } from '@/lib/contentGuards';

let videoCache: Record<string, { videos: FetchedVideo[]; timestamp: number; programName?: string }> = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

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
  const staticChannel = channels.find(c => c.id === channelId);
  if (!staticChannel || staticChannel.videos.length === 0) return [];
  
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const blockIndex = ['early', 'morning', 'afternoon', 'primetime', 'latenight'].indexOf(getCurrentTimeBlock());
  const seed = dayOfYear * 10 + blockIndex;
  
  // Map Video to FetchedVideo (they're compatible)
  const videos: FetchedVideo[] = staticChannel.videos.map(v => ({ id: v.id, title: v.title, duration: v.duration }));
  return deterministicShuffle(videos, seed);
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
      
      // Check cache first
      const cached = videoCache[cacheKey];
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setVideos(cached.videos);
        setUsingFallback(false);
        setLoading(false);
        return;
      }

      // If YouTube API not configured, use rotated fallback
      if (!isYouTubeConfigured()) {
        console.log(`[${channelId}] YouTube API not configured, using rotated fallback`);
        setVideos(fallbackVideos);
        setUsingFallback(true);
        setLoading(false);
        return;
      }

      // Get base search config
      const baseConfig = CHANNEL_SEARCH_CONFIG[channelId];
      if (!baseConfig) {
        // No search config for this channel, use rotated fallback
        setVideos(fallbackVideos);
        setUsingFallback(true);
        setLoading(false);
        return;
      }

      // Apply scheduled programming if available
      const searchConfig = getChannelSearchConfig(channelId, baseConfig);

      try {
        console.log(`[${channelId}] Fetching videos with query: "${searchConfig.query}"${currentProgram ? ` (Program: ${currentProgram})` : ''}`);
        // Use YouTube Search API with topic-based queries
        // Pass channelType to enable content-type-specific filtering (e.g., podcasts vs music)
        const fetched = await fetchVideosFromSearch({
          ...searchConfig,
          channelType: channelId, // Pass channel ID for content type validation
          limit: 25
        });

        // Final title-only guard (catches cases where search/metadata filtering misses).
        const guarded = fetched.filter((v) => isAllowedVideoTitle(channelId, v.title));

        if (guarded.length > 0) {
          videoCache[cacheKey] = { videos: guarded, timestamp: Date.now(), programName: currentProgram || undefined };
          setVideos(guarded);
          setUsingFallback(false);
        } else {
          // API returned nothing, use rotated fallback
          console.warn(`No videos fetched for ${channelId}, using rotated fallback`);
          setVideos(fallbackVideos);
          setUsingFallback(true);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        // Error occurred, use rotated fallback
        setVideos(fallbackVideos);
        setUsingFallback(true);
      }
      
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
export async function preloadChannelVideos(channelId: string): Promise<void> {
  const cached = videoCache[channelId];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return; // Already cached
  }

  if (!isYouTubeConfigured()) {
    return;
  }

  const searchConfig = CHANNEL_SEARCH_CONFIG[channelId];
  if (!searchConfig) {
    return;
  }

  try {
    const fetched = await fetchVideosFromSearch({
      ...searchConfig,
      channelType: channelId,
      limit: 25
    });

    if (fetched.length > 0) {
      videoCache[channelId] = { videos: fetched, timestamp: Date.now() };
    }
  } catch (error) {
    console.error('Error preloading videos:', error);
  }
}
