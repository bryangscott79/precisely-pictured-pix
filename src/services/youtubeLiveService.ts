/**
 * YouTube Live Stream Service
 *
 * Detects and fetches live streams from YouTube channels without using API quota.
 *
 * Methods:
 * 1. Channel page scraping via CORS proxy - check /live endpoint
 * 2. oEmbed check for known live stream URLs
 * 3. Fallback to RSS for recent videos
 */

const CORS_PROXIES = [
  { base: 'https://api.allorigins.win/raw?url=', encode: true },
  { base: 'https://corsproxy.io/?', encode: true },
];

export interface LiveStreamInfo {
  videoId: string;
  title: string;
  isLive: boolean;
  channelId: string;
}

/**
 * Check if a YouTube channel has a live stream by checking their /live page
 * This is FREE - no API quota!
 */
export async function detectLiveStream(channelId: string): Promise<LiveStreamInfo | null> {
  // YouTube channels have a /live endpoint that redirects to current live stream
  const liveUrl = `https://www.youtube.com/channel/${channelId}/live`;

  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = proxy.encode
        ? `${proxy.base}${encodeURIComponent(liveUrl)}`
        : `${proxy.base}${liveUrl}`;

      const response = await fetch(proxyUrl, {
        signal: AbortSignal.timeout(8000),
        headers: {
          'Accept': 'text/html',
        },
      });

      if (!response.ok) {
        continue;
      }

      const html = await response.text();

      // Look for video ID in the page
      // YouTube embeds the video ID in multiple places
      const videoIdMatch = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
      if (!videoIdMatch) {
        console.log(`[LiveStream] No video ID found for channel ${channelId}`);
        continue;
      }

      const videoId = videoIdMatch[1];

      // Check if it's actually live by looking for live indicators
      const isLive = html.includes('"isLive":true') ||
        html.includes('"isLiveContent":true') ||
        html.includes('"liveBroadcastDetails"') ||
        html.includes('LIVE NOW') ||
        html.includes('"isLiveNow":true');

      // Get the title
      const titleMatch = html.match(/<title>([^<]+)<\/title>/);
      const title = titleMatch ? titleMatch[1].replace(' - YouTube', '').trim() : 'Live Stream';

      if (isLive) {
        console.log(`[LiveStream] Found live stream for ${channelId}: ${videoId}`);
        return {
          videoId,
          title,
          isLive: true,
          channelId,
        };
      } else {
        // They have a video on the /live page but it's not currently live
        // This could be a premiere or recent stream replay
        console.log(`[LiveStream] Channel ${channelId} has /live video ${videoId} but not currently live`);
        return {
          videoId,
          title,
          isLive: false,
          channelId,
        };
      }
    } catch (error) {
      console.warn(`[LiveStream] Error checking live for ${channelId}:`, error);
      continue;
    }
  }

  console.log(`[LiveStream] No live stream found for channel ${channelId}`);
  return null;
}

/**
 * Check multiple channels for live streams
 * Returns the first one found that's actually live
 */
export async function findLiveStreamFromChannels(channelIds: string[]): Promise<LiveStreamInfo | null> {
  // Check channels in parallel for speed
  const results = await Promise.all(
    channelIds.map(id => detectLiveStream(id))
  );

  // First, return any that are currently live
  const liveResult = results.find(r => r?.isLive);
  if (liveResult) {
    return liveResult;
  }

  // If none are live, return the first video found on /live (could be a replay)
  const anyResult = results.find(r => r !== null);
  return anyResult || null;
}

/**
 * Get a live stream or recent video from a local news station
 * Combines live detection with RSS fallback
 */
export async function getLocalNewsStream(
  channelId: string,
  fallbackSearch?: string
): Promise<{ videoId: string; title: string; isLive: boolean } | null> {
  // First, try to detect a live stream
  const liveStream = await detectLiveStream(channelId);

  if (liveStream) {
    return {
      videoId: liveStream.videoId,
      title: liveStream.title,
      isLive: liveStream.isLive,
    };
  }

  // No live stream found - will fall back to RSS in the caller
  return null;
}

/**
 * Build a playlist of live stream + recent videos
 * Live stream goes first if available, then recent clips
 */
export async function buildNewsPlaylist(
  channelId: string,
  recentVideos: { id: string; title: string; duration: number }[]
): Promise<{ id: string; title: string; duration: number; isLive?: boolean }[]> {
  const playlist: { id: string; title: string; duration: number; isLive?: boolean }[] = [];

  // Check for live stream
  const liveStream = await detectLiveStream(channelId);

  if (liveStream) {
    // Add live stream at the beginning
    playlist.push({
      id: liveStream.videoId,
      title: liveStream.title + (liveStream.isLive ? ' (LIVE)' : ''),
      duration: liveStream.isLive ? 3600 : 1800, // 1 hour for live, 30 min for replay
      isLive: liveStream.isLive,
    });
  }

  // Add recent videos (deduping the live stream if it's in there)
  const liveId = liveStream?.videoId;
  for (const video of recentVideos) {
    if (video.id !== liveId) {
      playlist.push(video);
    }
  }

  return playlist;
}
