import { useState, useEffect } from 'react';
import { fetchVideosFromSearch, isYouTubeConfigured, FetchedVideo } from '@/services/youtubeService';
import { CHANNEL_SEARCH_CONFIG } from '@/data/channelSources';
import { channels } from '@/data/channels';

const videoCache: Record<string, { videos: FetchedVideo[]; timestamp: number }> = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export function useDynamicVideos(channelId: string) {
  const [videos, setVideos] = useState<FetchedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    async function loadVideos() {
      setLoading(true);
      
      // Check cache first
      const cached = videoCache[channelId];
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

      // Check if this channel has search config
      const searchConfig = CHANNEL_SEARCH_CONFIG[channelId];
      if (!searchConfig) {
        // No search config for this channel, use static
        setVideos(staticVideos);
        setUsingFallback(true);
        setLoading(false);
        return;
      }

      try {
        console.log(`[${channelId}] Fetching videos with query: "${searchConfig.query}"`);
        // Use YouTube Search API with topic-based queries
        const fetched = await fetchVideosFromSearch({
          ...searchConfig,
          limit: 25
        });

        if (fetched.length > 0) {
          videoCache[channelId] = { videos: fetched, timestamp: Date.now() };
          setVideos(fetched);
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

  return { videos, loading, usingFallback };
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
      limit: 25
    });

    if (fetched.length > 0) {
      videoCache[channelId] = { videos: fetched, timestamp: Date.now() };
    }
  } catch (error) {
    console.error('Error preloading videos:', error);
  }
}
