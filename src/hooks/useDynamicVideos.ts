import { useState, useEffect } from 'react';
import { fetchVideosFromSearch, isYouTubeConfigured, FetchedVideo } from '@/services/youtubeService';
import { CHANNEL_SEARCH_CONFIG } from '@/data/channelSources';
import { getChannelSearchConfig, getCurrentProgram } from '@/data/scheduledProgramming';
import { channels } from '@/data/channels';
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

export function useDynamicVideos(channelId: string) {
  const [videos, setVideos] = useState<FetchedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [currentProgramName, setCurrentProgramName] = useState<string | null>(null);

  useEffect(() => {
    async function loadVideos() {
      setLoading(true);
      
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
        setLoading(false);
        return;
      }

      // Get static channel for fallback
      const staticChannel = channels.find(c => c.id === channelId);
      const staticVideos = staticChannel?.videos || [];

      // If YouTube API not configured, use static videos immediately
      if (!isYouTubeConfigured()) {
        console.log(`[${channelId}] YouTube API not configured, using static fallback`);
        setVideos(staticVideos);
        setUsingFallback(true);
        setLoading(false);
        return;
      }

      // Get base search config
      const baseConfig = CHANNEL_SEARCH_CONFIG[channelId];
      if (!baseConfig) {
        // No search config for this channel, use static
        setVideos(staticVideos);
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
          // API returned nothing, use static fallback
          console.warn(`No videos fetched for ${channelId}, using static fallback`);
          setVideos(staticVideos);
          setUsingFallback(true);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        // Error occurred, use static fallback
        setVideos(staticVideos);
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
  const cached = videoCache[channelId];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.videos;
  }
  // Return static fallback
  const staticChannel = channels.find(c => c.id === channelId);
  return staticChannel?.videos || [];
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
