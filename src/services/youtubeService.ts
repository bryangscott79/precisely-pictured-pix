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
  youtubeChannelId?: string; // Specific YouTube channel ID to fetch from
}

// Quality control: Terms to exclude from all searches (UGC, vertical, amateur content)
const QUALITY_EXCLUSIONS = [
  // Language exclusions (non-English content)
  '-doblado', '-dublado', '-dublagem', '-synchronisiert', '-doppiato', '-дубляж', '-吹替',
  '-hindi', '-हिंदी', '-bollywood', '-tamil', '-telugu', '-kannada', '-malayalam', '-marathi',
  '-भोजपुरी', '-punjabi', '-bengali', '-gujarati', '-odia', '-assamese',
  '-korean', '-한국어', '-日本語', '-japanese', '-中文', '-chinese', '-thai', '-vietnamese',
  '-arabic', '-العربية', '-turkish', '-türkçe', '-russian', '-русский',
  '-spanish', '-español', '-portuguese', '-português', '-french', '-français', '-german', '-deutsch',
  '-italian', '-italiano', '-indonesian', '-bahasa',
  // UGC/amateur markers
  '-vlog', '-shorts', '-TikTok', '-"my first"', '-amateur', '-reaction',
  // Vertical video indicators
  '-vertical', '-#shorts', '-"phone recording"',
  // Low quality markers
  '-"screen recording"', '-compilation', '-"full movie"', '-"full film"',
].join(' ');

// Content type validators based on channel category
function isContentTypeMatch(video: any, channelType?: string): boolean {
  const title = video.snippet?.title?.toLowerCase() || '';
  const channelTitle = video.snippet?.channelTitle?.toLowerCase() || '';
  const description = video.snippet?.description?.toLowerCase() || '';
  
  // Global exclusions for ALL channels - kids content in wrong places
  const kidsIndicators = [
    'nursery', 'preschool', 'toddler', 'cocomelon', 'pinkfong', 'baby shark',
    'kids song', 'children song', 'learning for kids', 'abc song', 'phonics',
    'sesame street', 'peppa pig', 'paw patrol', 'bluey'
  ];
  
  // Don't apply kids filter to kids/family channels
  if (channelType !== 'kids' && channelType !== 'family') {
    for (const indicator of kidsIndicators) {
      if (title.includes(indicator) || channelTitle.includes(indicator)) {
        console.log(`[Filter] Excluded kids content from ${channelType} channel: ${video.snippet?.title}`);
        return false;
      }
    }
  }
  
  // For sports: MUST be from official sports sources
  if (channelType === 'sports' || channelType === 'nfl') {
    const officialSportsChannels = [
      'espn', 'nfl', 'nba', 'mlb', 'nhl', 'mls', 'premier league', 
      'uefa', 'fifa', 'fox sports', 'cbs sports', 'nbc sports',
      'bleacher report', 'house of highlights', 'sportscenter',
      'sky sports', 'bt sport', 'dazn', 'tennis channel',
      'pga tour', 'wwe', 'ufc', 'bellator'
    ];
    
    const isSportsChannel = officialSportsChannels.some(ch => channelTitle.includes(ch));
    const hasSportsKeywords = ['highlights', 'goals', 'touchdown', 'home run', 'dunk', 'knockout', 
                               'game recap', 'best plays', 'top 10', 'season'].some(kw => title.includes(kw));
    
    // Must be from a sports channel OR have sports keywords AND not be kids/music content
    const isKidsOrMusic = title.includes('song') || title.includes('music') || 
                          title.includes('parody') || title.includes('cartoon') ||
                          title.includes('animation') || title.includes('funny');
    
    if (isKidsOrMusic) {
      console.log(`[Filter] Excluded non-sports content: ${video.snippet?.title}`);
      return false;
    }
    
    if (!isSportsChannel && !hasSportsKeywords) {
      console.log(`[Filter] Excluded from sports - not sports channel/content: ${video.snippet?.title}`);
      return false;
    }
    
    return true;
  }
  
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

// Get time-based programming block (like TV scheduling)
function getTimeBlock(): { name: string; seed: number } {
  const now = new Date();
  const hour = now.getHours();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);

  // 4-hour programming blocks that change throughout the day
  let blockName: string;
  if (hour >= 6 && hour < 10) blockName = 'morning';
  else if (hour >= 10 && hour < 14) blockName = 'midday';
  else if (hour >= 14 && hour < 18) blockName = 'afternoon';
  else if (hour >= 18 && hour < 22) blockName = 'primetime';
  else blockName = 'latenight';

  // Seed based on day + block for consistent programming within each block
  const blockIndex = ['morning', 'midday', 'afternoon', 'primetime', 'latenight'].indexOf(blockName);
  const seed = dayOfYear * 10 + blockIndex;

  return { name: blockName, seed };
}

// Deterministic shuffle for consistent ordering within a time block
function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let currentSeed = seed;

  const random = () => {
    currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff;
    return currentSeed / 0x7fffffff;
  };

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
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

// Check if content is primarily English
function isEnglishContent(video: any): boolean {
  const title = video.snippet?.title || '';
  const channelTitle = video.snippet?.channelTitle || '';
  const description = video.snippet?.description || '';
  const combined = `${title} ${channelTitle} ${description}`.toLowerCase();

  // Non-English script detection (Devanagari, Arabic, CJK, Cyrillic, Thai, etc.)
  const nonLatinScripts = /[\u0900-\u097F\u0600-\u06FF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\u0400-\u04FF\u0E00-\u0E7F\uAC00-\uD7AF\u1100-\u11FF]/;
  if (nonLatinScripts.test(title) || nonLatinScripts.test(channelTitle)) {
    console.log(`[Filter] Non-English script detected: ${title}`);
    return false;
  }

  // Common non-English words/phrases in titles
  const nonEnglishIndicators = [
    // Hindi/Indian
    'hindi', 'हिंदी', 'bollywood', 'desi', 'bhojpuri', 'tamil', 'telugu', 'kannada',
    'malayalam', 'marathi', 'punjabi', 'bengali', 'gujarati', 'indian movie',
    'south indian', 'zee tv', 'sony sab', 'colors tv', 't-series', 'saregama',
    // Spanish
    'español', 'latino', 'telenovela', 'en español', 'spanish',
    // Portuguese
    'português', 'brasileir', 'em português',
    // Korean
    '한국', 'korean', 'k-pop', 'k-drama', 'kpop', 'kdrama',
    // Japanese
    '日本', 'anime', 'japanese', 'j-pop', 'jpop',
    // Chinese
    '中文', 'chinese', 'mandarin', 'cantonese',
    // Arabic
    'العربية', 'arabic',
    // Russian
    'русский', 'russian',
    // Thai
    'ไทย', 'thai',
    // Vietnamese
    'việt', 'vietnamese',
    // Turkish
    'türk', 'turkish',
    // Indonesian
    'indonesia', 'bahasa',
    // French
    'français', 'french',
    // German
    'deutsch', 'german',
  ];

  for (const indicator of nonEnglishIndicators) {
    if (combined.includes(indicator)) {
      console.log(`[Filter] Non-English indicator "${indicator}" found: ${title}`);
      return false;
    }
  }

  return true;
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
    channelType,
    youtubeChannelId
  } = config;

  try {
    // If we have a specific YouTube channel ID, fetch from that channel
    if (youtubeChannelId) {
      console.log(`[YouTube] Fetching from channel: ${youtubeChannelId}`);
      return await fetchVideosFromChannel(youtubeChannelId, {
        minDuration: minDuration || 0,
        maxDuration: maxDuration || 7200,
        minViews: 0, // Don't filter by views for specific channels
        limit: limit || 25
      });
    }

    // Fetch fewer videos to save API quota (each video detail costs 1 unit)
    const videoIds = await searchVideos({ ...config, limit: 25 });
    if (!videoIds.length) return [];

    const details = await getVideoDetails(videoIds);

    const filtered = details
      .filter(v => {
        // Filter: English content only (strongest filter first)
        if (!isEnglishContent(v)) {
          return false;
        }

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
      .sort((a, b) => b.views - a.views); // Sort by popularity first

    // Get time block for TV-like scheduling
    const timeBlock = getTimeBlock();

    // Take top videos by views, then shuffle based on time block
    // This ensures quality content but different order each programming block
    const topVideos = filtered.slice(0, Math.min(filtered.length, limit * 2));
    const shuffled = seededShuffle(topVideos, timeBlock.seed);

    console.log(`[Schedule] Time block: ${timeBlock.name}, seed: ${timeBlock.seed}, videos: ${shuffled.length}`);

    return shuffled
      .slice(0, limit)
      .map(({ id, title, duration }) => ({ id, title, duration }));
  } catch (error) {
    console.error('YouTube Search API error:', error);
    return [];
  }
}

// Fetch videos directly from a specific YouTube channel
export async function fetchVideosFromChannel(
  channelId: string,
  options: { minDuration?: number; maxDuration?: number; minViews?: number; limit?: number; skipFilters?: boolean } = {}
): Promise<FetchedVideo[]> {
  const { minDuration = 60, maxDuration = 3600, minViews = 0, limit = 25, skipFilters = false } = options;

  console.log(`[YouTube] fetchVideosFromChannel: ${channelId}, options:`, options);

  try {
    // Get channel's uploads playlist ID
    const channelRes = await fetch(
      `${BASE_URL}/channels?part=contentDetails,snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`
    );
    const channelData = await channelRes.json();

    if (channelData.error) {
      console.error('[YouTube] Channel API error:', channelData.error);
      return [];
    }

    const channelInfo = channelData.items?.[0];
    if (!channelInfo) {
      console.error('[YouTube] Channel not found:', channelId);
      return [];
    }

    console.log(`[YouTube] Found channel: ${channelInfo.snippet?.title}`);
    const playlistId = channelInfo.contentDetails?.relatedPlaylists?.uploads;
    if (!playlistId) {
      console.error('[YouTube] No uploads playlist for channel:', channelId);
      return [];
    }

    // Get video IDs from playlist (most recent first)
    const playlistRes = await fetch(
      `${BASE_URL}/playlistItems?part=contentDetails,snippet&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_API_KEY}`
    );
    const playlistData = await playlistRes.json();

    if (playlistData.error) {
      console.error('[YouTube] Playlist API error:', playlistData.error);
      return [];
    }

    const videoIds = playlistData.items?.map((item: any) => item.contentDetails.videoId) || [];
    console.log(`[YouTube] Found ${videoIds.length} videos in channel`);

    if (!videoIds.length) return [];

    const details = await getVideoDetails(videoIds);

    // For local news and specific channels, apply minimal filtering
    // (just duration, landscape check)
    let filteredVideos = details;

    if (!skipFilters) {
      filteredVideos = details.filter(v => {
        // Always check for landscape
        if (!isLandscapeVideo(v)) {
          console.log(`[Filter] Skipping vertical video: ${v.snippet?.title}`);
          return false;
        }
        return true;
      });
    }

    const result = filteredVideos
      .map(v => ({
        id: v.id,
        title: v.snippet.title,
        duration: parseDuration(v.contentDetails.duration),
        views: parseInt(v.statistics?.viewCount || '0'),
        publishedAt: new Date(v.snippet.publishedAt)
      }))
      .filter(v => {
        // Apply duration filters (0 = no limit)
        if (minDuration > 0 && v.duration < minDuration) return false;
        if (maxDuration > 0 && v.duration > maxDuration) return false;
        // Apply view filter only if set
        if (minViews > 0 && v.views < minViews) return false;
        return true;
      })
      // Sort by publish date (most recent first) for news content
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, limit)
      .map(({ id, title, duration }) => ({ id, title, duration }));

    console.log(`[YouTube] Returning ${result.length} videos from channel`);
    return result;
  } catch (error) {
    console.error('[YouTube] Channel fetch error:', error);
    return [];
  }
}

export function isYouTubeConfigured(): boolean {
  return !!YOUTUBE_API_KEY;
}
