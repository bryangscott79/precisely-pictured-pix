import { useState, useEffect } from 'react';
import { fetchVideosFromChannel, isYouTubeConfigured, FetchedVideo } from '@/services/youtubeService';
import { CHANNEL_SOURCES } from '@/data/channelSources';
import { channels } from '@/data/channels';

const videoCache: Record<string, { videos: FetchedVideo[]; timestamp: number }> = {};
const CACHE_DURATION = 60 * 60 * 1000;

export function useDynamicVideos(channelId: string) {
  const [videos, setVideos] = useState<FetchedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    async function loadVideos() {
      setLoading(true);
      
      const cached = videoCache[channelId];
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setVideos(cached.videos);
        setLoading(false);
        return;
      }

      if (!isYouTubeConfigured()) {
        const staticChannel = channels.find(c => c.id === channelId);
        if (staticChannel) {
          setVideos(staticChannel.videos);
          setUsingFallback(true);
        }
        setLoading(false);
        return;
      }

      const sources = CHANNEL_SOURCES[channelId];
      if (!sources) {
        const staticChannel = channels.find(c => c.id === channelId);
        if (staticChannel) setVideos(staticChannel.videos);
        setLoading(false);
        return;
      }

      try {
        const allVideos: FetchedVideo[] = [];
        for (const ytChannelId of sources.youtubeChannels) {
          const fetched = await fetchVideosFromChannel(ytChannelId, {
            minDuration: sources.minDuration,
            maxDuration: sources.maxDuration,
            minViews: sources.minViews,
            limit: 15
          });
          allVideos.push(...fetched);
        }

        if (allVideos.length > 0) {
          const shuffled = allVideos.sort(() => Math.random() - 0.5).slice(0, 25);
          videoCache[channelId] = { videos: shuffled, timestamp: Date.now() };
          setVideos(shuffled);
        } else {
          const staticChannel = channels.find(c => c.id === channelId);
          if (staticChannel) {
            setVideos(staticChannel.videos);
            setUsingFallback(true);
          }
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        const staticChannel = channels.find(c => c.id === channelId);
        if (staticChannel) {
          setVideos(staticChannel.videos);
          setUsingFallback(true);
        }
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

  const sources = CHANNEL_SOURCES[channelId];
  if (!sources) {
    return;
  }

  try {
    const allVideos: FetchedVideo[] = [];
    for (const ytChannelId of sources.youtubeChannels) {
      const fetched = await fetchVideosFromChannel(ytChannelId, {
        minDuration: sources.minDuration,
        maxDuration: sources.maxDuration,
        minViews: sources.minViews,
        limit: 15
      });
      allVideos.push(...fetched);
    }

    if (allVideos.length > 0) {
      const shuffled = allVideos.sort(() => Math.random() - 0.5).slice(0, 25);
      videoCache[channelId] = { videos: shuffled, timestamp: Date.now() };
    }
  } catch (error) {
    console.error('Error preloading videos:', error);
  }
}
