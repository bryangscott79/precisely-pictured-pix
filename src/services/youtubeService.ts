import { getStoredLanguage } from '@/hooks/useLanguagePreference';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Debug: Log if API key is configured (not the key itself)
console.log('YouTube API configured:', !!YOUTUBE_API_KEY);

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

export type VideoDuration = 'short' | 'medium' | 'long' | 'any';
export type UploadDate = 'today' | 'week' | 'month' | 'year' | 'any';
export type SortOrder = 'relevance' | 'viewCount' | 'date' | 'rating';

export interface SearchConfig {
  query: string;
  duration?: VideoDuration; // short (<4min), medium (4-20min), long (>20min)
  uploadDate?: UploadDate;
  order?: SortOrder;
  safeSearch?: 'none' | 'moderate' | 'strict';
  limit?: number;
  minDuration?: number; // Additional filter in seconds
  maxDuration?: number; // Additional filter in seconds
}

// Calculate the publishedAfter date based on uploadDate filter
function getPublishedAfterDate(uploadDate: UploadDate): string | null {
  const now = new Date();
  switch (uploadDate) {
    case 'today':
      now.setHours(0, 0, 0, 0);
      return now.toISOString();
    case 'week':
      now.setDate(now.getDate() - 7);
      return now.toISOString();
    case 'month':
      now.setMonth(now.getMonth() - 1);
      return now.toISOString();
    case 'year':
      now.setFullYear(now.getFullYear() - 1);
      return now.toISOString();
    default:
      return null;
  }
}

// Search for videos using YouTube Search API
async function searchVideos(config: SearchConfig): Promise<string[]> {
  // Get user's language preference - default to English for now
  const langPref = getStoredLanguage();
  
  // Force English for consistent content (avoiding dubbed versions)
  const languageCode = 'en';
  const regionCode = 'US';
  
  // Add language exclusion terms to filter out dubbed content
  const excludeDubbed = '-doblado -dublado -dublagem -synchronisiert -doppiato -дубляж -吹替';
  const enhancedQuery = `${config.query} ${excludeDubbed}`;
  
  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    q: enhancedQuery,
    maxResults: String(Math.min(config.limit || 25, 50)),
    order: config.order || 'relevance',
    safeSearch: config.safeSearch || 'moderate',
    regionCode: regionCode,
    relevanceLanguage: languageCode,
    videoEmbeddable: 'true',
    key: YOUTUBE_API_KEY,
  });

  // Add duration filter if specified
  if (config.duration && config.duration !== 'any') {
    params.append('videoDuration', config.duration);
  }

  // Add upload date filter if specified
  const publishedAfter = getPublishedAfterDate(config.uploadDate || 'any');
  if (publishedAfter) {
    params.append('publishedAfter', publishedAfter);
  }

  const res = await fetch(`${BASE_URL}/search?${params}`);
  const data = await res.json();
  
  if (data.error) {
    console.error('YouTube Search API error:', data.error);
    return [];
  }

  return data.items?.map((item: any) => item.id.videoId).filter(Boolean) || [];
}

// Get video details (duration, statistics)
async function getVideoDetails(videoIds: string[]): Promise<any[]> {
  if (!videoIds.length) return [];
  const res = await fetch(
    `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`
  );
  const data = await res.json();
  return data.items || [];
}

// Main function: search videos using YouTube Search API with filters
export async function fetchVideosFromSearch(config: SearchConfig): Promise<FetchedVideo[]> {
  const { minDuration = 60, maxDuration = 3600, limit = 25 } = config;
  
  try {
    const videoIds = await searchVideos({ ...config, limit: 50 }); // Fetch more to filter
    if (!videoIds.length) return [];
    
    const details = await getVideoDetails(videoIds);
    
    return details
      .map(v => ({
        id: v.id,
        title: v.snippet.title,
        duration: parseDuration(v.contentDetails.duration),
        views: parseInt(v.statistics?.viewCount || '0')
      }))
      .filter(v => v.duration >= minDuration && v.duration <= maxDuration)
      .slice(0, limit)
      .map(({ id, title, duration }) => ({ id, title, duration }));
  } catch (error) {
    console.error('YouTube Search API error:', error);
    return [];
  }
}

// Legacy function for backward compatibility with channel-based fetching
export async function fetchVideosFromChannel(
  channelId: string,
  options: { minDuration?: number; maxDuration?: number; minViews?: number; limit?: number } = {}
): Promise<FetchedVideo[]> {
  const { minDuration = 60, maxDuration = 3600, minViews = 0, limit = 25 } = options;
  
  try {
    // Get channel's uploads playlist ID
    const channelRes = await fetch(
      `${BASE_URL}/channels?part=contentDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`
    );
    const channelData = await channelRes.json();
    const playlistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!playlistId) return [];
    
    // Get video IDs from playlist
    const playlistRes = await fetch(
      `${BASE_URL}/playlistItems?part=contentDetails&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_API_KEY}`
    );
    const playlistData = await playlistRes.json();
    const videoIds = playlistData.items?.map((item: any) => item.contentDetails.videoId) || [];
    
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
