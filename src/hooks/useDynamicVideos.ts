import { useState, useEffect } from 'react';
import { fetchVideosFromChannel, isYouTubeConfigured, FetchedVideo } from '@/services/youtubeService';
import { CHANNEL_SOURCES } from '@/data/channelSources';
import { channels } from '@/data/channels';

// In-memory cache
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

      // If YouTube not configured, use static fallback
      if (!isYouTubeConfigured()) {
        const staticChannel = channels.find(c => c.id === channelId);
        if (staticChannel) {
          setVideos(staticChannel.videos);
          setUsingFallback(true);
        }
        setLoading(false);
        return;
      }

      // Fetch from YouTube
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
          const sorted = allVideos.sort((a, b) => Math.random() - 0.5).slice(0, 25);
          videoCache[channelId] = { videos: sorted, timestamp: Date.now() };
          setVideos(sorted);
        } else {
          // Fallback to static
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
