const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Convert ISO 8601 duration (PT4M13S) to seconds
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  return parseInt(match[1] || '0') * 3600 + parseInt(match[2] || '0') * 60 + parseInt(match[3] || '0');
}

export interface FetchedVideo {
  id: string;
  title: string;
  duration: number;
}

// Get channel's uploads playlist ID
async function getUploadsPlaylistId(channelId: string): Promise<string | null> {
  const res = await fetch(
    `${BASE_URL}/channels?part=contentDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`
  );
  const data = await res.json();
  return data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads || null;
}

// Get video IDs from playlist
async function getPlaylistVideos(playlistId: string, maxResults = 50): Promise<string[]> {
  const res = await fetch(
    `${BASE_URL}/playlistItems?part=contentDetails&playlistId=${playlistId}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
  );
  const data = await res.json();
  return data.items?.map((item: any) => item.contentDetails.videoId) || [];
}

// Get video details
async function getVideoDetails(videoIds: string[]): Promise<any[]> {
  if (!videoIds.length) return [];
  const res = await fetch(
    `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`
  );
  const data = await res.json();
  return data.items || [];
}

// Main function: fetch videos from a YouTube channel
export async function fetchVideosFromChannel(
  channelId: string,
  options: { minDuration?: number; maxDuration?: number; minViews?: number; limit?: number } = {}
): Promise<FetchedVideo[]> {
  const { minDuration = 60, maxDuration = 3600, minViews = 0, limit = 25 } = options;
  
  try {
    const playlistId = await getUploadsPlaylistId(channelId);
    if (!playlistId) return [];
    
    const videoIds = await getPlaylistVideos(playlistId, 50);
    const details = await getVideoDetails(videoIds);
    
    return details
      .map(v => ({
        id: v.id,
        title: v.snippet.title,
        duration: parseDuration(v.contentDetails.duration),
        views: parseInt(v.statistics?.viewCount || '0')
      }))
      .filter(v => v.duration >= minDuration && v.duration <= maxDuration && v.views >= minViews)
      .sort((a, b) => b.views - a.views)
      .slice(0, limit)
      .map(({ id, title, duration }) => ({ id, title, duration }));
  } catch (error) {
    console.error('YouTube API error:', error);
    return [];
  }
}

export function isYouTubeConfigured(): boolean {
  return !!YOUTUBE_API_KEY;
}
