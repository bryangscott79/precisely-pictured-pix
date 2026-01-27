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
  minViews?: number; // Minimum view count for quality filtering
  channelType?: string; // Channel ID for content type validation
}

// Quality control: Terms to exclude from all searches (UGC, vertical, amateur content)
const QUALITY_EXCLUSIONS = [
  // Language exclusions (dubbed content)
  '-doblado', '-dublado', '-dublagem', '-synchronisiert', '-doppiato', '-дубляж', '-吹替',
  // UGC/amateur markers
  '-vlog', '-shorts', '-TikTok', '-"my first"', '-amateur', '-reaction',
  // Vertical video indicators
  '-vertical', '-#shorts', '-"phone recording"',
  // Low quality markers
  '-"screen recording"', '-compilation',
].join(' ');

// Content type validators based on channel category
function isContentTypeMatch(video: any, channelType?: string): boolean {
  const title = video.snippet?.title?.toLowerCase() || '';
  const channelTitle = video.snippet?.channelTitle?.toLowerCase() || '';
  const description = video.snippet?.description?.toLowerCase() || '';
  const duration = parseInt(video.contentDetails?.duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)?.[0] || '0');
  
  // For podcasts: MUST be a podcast, NOT a music video
  if (channelType === 'podcast') {
    const isPodcast = 
      title.includes('podcast') || 
      title.includes('episode') ||
      title.includes('#') && (title.includes('joe rogan') || title.includes('lex fridman') || title.includes('huberman')) ||
      channelTitle.includes('podcast') ||
      channelTitle.includes('joe rogan') ||
      channelTitle.includes('lex fridman') ||
      channelTitle.includes('huberman');
    
    const isMusic = 
      title.includes('official video') ||
      title.includes('music video') ||
      title.includes('vevo') ||
      channelTitle.includes('vevo') ||
      (title.includes('official') && !title.includes('podcast'));
    
    if (isMusic || !isPodcast) {
      console.log(`[Filter] Excluded non-podcast from podcast channel: ${video.snippet?.title}`);
      return false;
    }
    return true;
  }
  
  // For music channels: MUST be music videos
  if (channelType?.startsWith('music')) {
    const isMusic = 
      title.includes('official') ||
      title.includes('music video') ||
      title.includes('vevo') ||
      channelTitle.includes('vevo') ||
      channelTitle.includes('records');
    
    if (!isMusic) {
      console.log(`[Filter] Excluded non-music from music channel: ${video.snippet?.title}`);
      return false;
    }
    return true;
  }
  
  // For comedy: must be sketch, standup, late night
  if (channelType === 'comedy') {
    const isComedy = 
      title.includes('snl') ||
      title.includes('saturday night live') ||
      title.includes('comedy') ||
      title.includes('standup') ||
      title.includes('stand up') ||
      title.includes('sketch') ||
      title.includes('fallon') ||
      title.includes('conan') ||
      title.includes('kimmel') ||
      channelTitle.includes('comedy') ||
      channelTitle.includes('snl') ||
      channelTitle.includes('tonight show');
    
    return isComedy;
  }
  
  return true; // Default: allow
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
  // Force English for consistent, professional content
  const languageCode = 'en';
  const regionCode = 'US';
  
  // Enhance query with quality exclusions
  const enhancedQuery = `${config.query} ${QUALITY_EXCLUSIONS}`;
  
  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    q: enhancedQuery,
    maxResults: String(Math.min(config.limit || 25, 50)),
    order: config.order || 'viewCount', // Default to view count for quality
    safeSearch: config.safeSearch || 'moderate',
    regionCode: regionCode,
    relevanceLanguage: languageCode,
    videoEmbeddable: 'true',
    videoDefinition: 'high', // Only HD content
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

// Get video details (duration, statistics, aspect ratio)
async function getVideoDetails(videoIds: string[]): Promise<any[]> {
  if (!videoIds.length) return [];
  const res = await fetch(
    `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`
  );
  const data = await res.json();
  return data.items || [];
}

// Check if video is landscape based on thumbnail aspect ratio
function isLandscapeVideo(video: any): boolean {
  const thumbnails = video.snippet?.thumbnails;
  if (!thumbnails) return true; // Assume landscape if no data
  
  // Check maxres or high quality thumbnail dimensions
  const thumb = thumbnails.maxres || thumbnails.high || thumbnails.medium;
  if (thumb && thumb.width && thumb.height) {
    const aspectRatio = thumb.width / thumb.height;
    // Landscape videos have aspect ratio > 1.3 (excludes vertical 9:16 and square 1:1)
    return aspectRatio > 1.3;
  }
  return true; // Assume landscape if no dimensions
}

// Check if video title/channel suggests professional content
function isProfessionalContent(video: any): boolean {
  const title = video.snippet?.title?.toLowerCase() || '';
  const channelTitle = video.snippet?.channelTitle?.toLowerCase() || '';
  const description = video.snippet?.description?.toLowerCase() || '';
  
  // Negative indicators (amateur/UGC content)
  const amateurIndicators = [
    'vlog', 'my first', 'day in my life', 'grwm', 'get ready with me',
    'pov:', 'storytime', '#shorts', 'tiktok', 'reupload', 're-upload',
    'unboxing haul', 'what i got', 'room tour'
  ];
  
  for (const indicator of amateurIndicators) {
    if (title.includes(indicator) || description.includes(indicator)) {
      return false;
    }
  }
  
  // Positive indicators (professional content)
  const professionalIndicators = [
    'official', 'vevo', 'documentary', 'explained', 'tutorial',
    'podcast', 'interview', 'review', 'highlights', 'trailer',
    'ted', 'talks', 'masterclass', 'course', 'lesson'
  ];
  
  // Boost professional channels
  const professionalChannels = [
    'vevo', 'ted', 'netflix', 'hbo', 'espn', 'nfl', 'nba', 'bbc',
    'national geographic', 'discovery', 'history', 'vice', 'vox',
    'veritasium', 'vsauce', 'kurzgesagt', 'fireship', 'mark rober',
    'dude perfect', 'mrwhosetheboss', 'mkbhd', 'linus tech tips',
    'babish', 'gordon ramsay', 'bon appetit', 'tasty', 'epicurious',
    'joe rogan', 'lex fridman', 'huberman', 'jordan peterson',
    'gary vee', 'garyvee', 'adam savage', 'tested', 'simone giertz',
    'tom scott', 'johnny harris', 'wendover', 'half as interesting',
    'donut media', 'top gear', 'grand tour', 'motortrend'
  ];
  
  for (const channel of professionalChannels) {
    if (channelTitle.includes(channel)) {
      return true;
    }
  }
  
  // Check for professional indicators in title
  for (const indicator of professionalIndicators) {
    if (title.includes(indicator)) {
      return true;
    }
  }
  
  return true; // Default to allowing if no negative indicators
}

// Main function: search videos using YouTube Search API with filters
export async function fetchVideosFromSearch(config: SearchConfig): Promise<FetchedVideo[]> {
  const { 
    minDuration = 60, 
    maxDuration = 3600, 
    limit = 25,
    minViews = 50000, // Default minimum 50K views for quality
    channelType
  } = config;
  
  try {
    // Fetch more videos to account for filtering
    const videoIds = await searchVideos({ ...config, limit: 50 });
    if (!videoIds.length) return [];
    
    const details = await getVideoDetails(videoIds);
    
    return details
      .filter(v => {
        // Filter: Landscape only
        if (!isLandscapeVideo(v)) {
          console.log(`[Filter] Excluded vertical/square video: ${v.snippet?.title}`);
          return false;
        }
        
        // Filter: Professional content only
        if (!isProfessionalContent(v)) {
          console.log(`[Filter] Excluded amateur content: ${v.snippet?.title}`);
          return false;
        }
        
        // Filter: Content type must match channel (e.g., podcasts can't be music videos)
        if (channelType && !isContentTypeMatch(v, channelType)) {
          return false;
        }
        
        // Filter: Minimum view count
        const views = parseInt(v.statistics?.viewCount || '0');
        if (views < minViews) {
          return false;
        }
        
        return true;
      })
      .map(v => ({
        id: v.id,
        title: v.snippet.title,
        duration: parseDuration(v.contentDetails.duration),
        views: parseInt(v.statistics?.viewCount || '0')
      }))
      .filter(v => v.duration >= minDuration && v.duration <= maxDuration)
      .sort((a, b) => b.views - a.views) // Sort by popularity
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
  const { minDuration = 60, maxDuration = 3600, minViews = 50000, limit = 25 } = options;
  
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
      .filter(v => isLandscapeVideo(v) && isProfessionalContent(v))
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
