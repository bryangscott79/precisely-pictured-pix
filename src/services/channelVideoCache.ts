/**
 * Channel Video Cache Service
 *
 * Provides a shared cache of videos for each channel that both the player
 * and the channel guide can use. This ensures the guide shows what will
 * actually play.
 *
 * The cache is populated by RSS feeds (free) and falls back to static videos.
 */

import { Video } from '@/data/channels';
import { FetchedVideo } from './youtubeService';

// Default duration for videos when we don't know the actual duration
const DEFAULT_VIDEO_DURATION = 600; // 10 minutes

interface CachedChannel {
  videos: Video[];
  timestamp: number;
  source: 'rss' | 'static' | 'loading';
}

// Global cache - shared across all components
const channelCache: Map<string, CachedChannel> = new Map();

// Listeners for cache updates
type CacheListener = (channelId: string, videos: Video[]) => void;
const listeners: Set<CacheListener> = new Set();

/**
 * Convert FetchedVideo (from RSS/API) to Video format (for player/guide)
 */
function fetchedToVideo(fetched: FetchedVideo): Video {
  return {
    id: fetched.id,
    title: fetched.title,
    duration: fetched.duration || DEFAULT_VIDEO_DURATION,
  };
}

/**
 * Get cached videos for a channel
 */
export function getCachedVideos(channelId: string): Video[] | null {
  const cached = channelCache.get(channelId);
  if (!cached) return null;
  return cached.videos;
}

/**
 * Get cache info for a channel
 */
export function getCacheInfo(channelId: string): CachedChannel | null {
  return channelCache.get(channelId) || null;
}

/**
 * Update the cache with new videos for a channel
 * This is called by useDynamicVideos when it fetches new content
 */
export function updateChannelCache(
  channelId: string,
  fetchedVideos: FetchedVideo[],
  source: 'rss' | 'static' | 'loading' = 'rss'
): void {
  const videos = fetchedVideos.map(fetchedToVideo);

  channelCache.set(channelId, {
    videos,
    timestamp: Date.now(),
    source,
  });

  // Notify listeners
  listeners.forEach(listener => listener(channelId, videos));

  console.log(`[VideoCache] Updated ${channelId} with ${videos.length} videos (source: ${source})`);
}

/**
 * Subscribe to cache updates
 * Returns an unsubscribe function
 */
export function subscribeToCache(listener: CacheListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Clear cache for a specific channel
 */
export function clearChannelCache(channelId: string): void {
  channelCache.delete(channelId);
}

/**
 * Clear entire cache
 */
export function clearAllCache(): void {
  channelCache.clear();
}

/**
 * Get all cached channel IDs
 */
export function getCachedChannelIds(): string[] {
  return Array.from(channelCache.keys());
}

/**
 * Check if a channel has cached videos
 */
export function hasCache(channelId: string): boolean {
  const cached = channelCache.get(channelId);
  return cached !== undefined && cached.videos.length > 0;
}

/**
 * Get videos for schedule generation
 * Returns cached RSS videos if available, otherwise falls back to static
 */
export function getVideosForSchedule(channelId: string, staticVideos: Video[]): Video[] {
  const cached = channelCache.get(channelId);

  // If we have cached RSS videos, use those
  if (cached && cached.videos.length > 0 && cached.source === 'rss') {
    return cached.videos;
  }

  // Otherwise use static videos as fallback
  return staticVideos;
}
