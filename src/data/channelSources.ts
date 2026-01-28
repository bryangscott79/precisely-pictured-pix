import { SearchConfig } from '@/services/youtubeService';

// UPDATED: Prioritize RECENT + TRENDING content, not all-time popular
// Using 'date' order with recency filters to get fresh content
// Broader queries to capture more variety while maintaining quality

export const CHANNEL_SEARCH_CONFIG: Record<string, SearchConfig> = {
  // === EDUCATION ===
  tech: {
    // Tech news and reviews - prioritize recent uploads
    query: 'tech review 2025 OR tech news today OR gadget review new',
    duration: 'medium',
    uploadDate: 'week', // Recent content
    order: 'relevance', // Balance relevance + recency
    minDuration: 300,
    maxDuration: 1800,
    minViews: 50000, // Lowered to capture newer videos
  },
  science: {
    // Science - mix of recent and trending
    query: 'science explained OR scientific discovery 2025 OR physics chemistry biology documentary',
    duration: 'medium',
    uploadDate: 'month',
    order: 'relevance',
    minDuration: 300,
    maxDuration: 2400,
    minViews: 100000,
  },
  history: {
    // History - broader query for variety
    query: 'history documentary OR historical event explained OR ancient history modern',
    duration: 'long',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 600,
    maxDuration: 3600,
    minViews: 200000,
  },
  nature: {
    // Nature documentaries - broader
    query: 'nature documentary 4K OR wildlife animals planet earth ocean',
    duration: 'long',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 600,
    maxDuration: 3600,
    minViews: 300000,
  },

  // === LIFESTYLE ===
  cooking: {
    // Cooking - fresh recipes trending
    query: 'cooking recipe chef OR how to cook meal tutorial kitchen',
    duration: 'medium',
    uploadDate: 'week',
    order: 'relevance',
    minDuration: 300,
    maxDuration: 1800,
    minViews: 100000,
  },
  fitness: {
    // Fitness - fresh workouts
    query: 'workout routine OR home workout OR gym training fitness exercise',
    duration: 'medium',
    uploadDate: 'week',
    order: 'relevance',
    minDuration: 300,
    maxDuration: 2400,
    minViews: 100000,
  },
  travel: {
    // Travel - scenic and recent
    query: 'travel vlog 4K OR travel documentary destination beautiful',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 2400,
    minViews: 100000,
  },

  // === HOBBIES ===
  maker: {
    // Maker/DIY projects - trending builds
    query: 'build project DIY OR engineering maker craft creation',
    duration: 'medium',
    uploadDate: 'month',
    order: 'relevance',
    minDuration: 400,
    maxDuration: 2400,
    minViews: 100000,
  },
  diy: {
    // Home improvement
    query: 'home improvement DIY OR renovation project how to fix repair',
    duration: 'medium',
    uploadDate: 'month',
    order: 'relevance',
    minDuration: 300,
    maxDuration: 1800,
    minViews: 30000,
  },
  automotive: {
    // Cars - new reviews and news
    query: 'car review 2025 OR new car test drive OR automotive news',
    duration: 'medium',
    uploadDate: 'week',
    order: 'relevance',
    minDuration: 400,
    maxDuration: 1800,
    minViews: 100000,
  },
  collecting: {
    // Collectibles - trending
    query: 'collectibles rare OR sports cards OR antiques collection valuable',
    duration: 'medium',
    uploadDate: 'month',
    order: 'relevance',
    minDuration: 300,
    maxDuration: 1800,
    minViews: 20000,
  },
  art: {
    // Art tutorials
    query: 'art tutorial painting OR drawing lesson artist masterclass',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 2400,
    minViews: 50000,
  },

  // === ENTERTAINMENT ===
  gaming: {
    // Gaming - VERY current
    query: 'gaming news 2025 OR new game review OR game trailer gameplay',
    duration: 'medium',
    uploadDate: 'week',
    order: 'date', // Most recent gaming content
    minDuration: 300,
    maxDuration: 1800,
    minViews: 100000,
  },
  sports: {
    // Sports highlights - TODAY's content
    query: 'sports highlights today OR NBA NFL MLB NHL highlights best plays',
    duration: 'medium',
    uploadDate: 'week',
    order: 'date', // Most recent sports
    minDuration: 180,
    maxDuration: 1800,
    minViews: 100000,
  },
  nfl: {
    // NFL - current season
    query: 'NFL highlights 2025 OR NFL best plays touchdowns',
    duration: 'medium',
    uploadDate: 'week',
    order: 'date',
    minDuration: 180,
    maxDuration: 1800,
    minViews: 50000,
  },
  teen: {
    // Teen entertainment - viral/trending
    query: 'challenge viral OR MrBeast OR Dude Perfect trick shot stunt',
    duration: 'medium',
    uploadDate: 'week',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 1800,
    minViews: 500000,
  },
  comedy: {
    // Comedy - recent sketches and clips
    query: 'comedy sketch funny OR late night show clip OR stand up comedian',
    duration: 'medium',
    uploadDate: 'week',
    order: 'viewCount',
    minDuration: 180,
    maxDuration: 1200,
    minViews: 200000,
  },
  movies: {
    // Movie trailers - CURRENT releases
    query: 'official movie trailer 2025 OR new film trailer upcoming',
    duration: 'short',
    uploadDate: 'week',
    order: 'date',
    minDuration: 60,
    maxDuration: 300,
    minViews: 100000,
  },
  cinema80s: {
    // Classic 80s movie clips - all time
    query: '80s movie scene classic film iconic 1980s',
    duration: 'medium',
    uploadDate: 'any',
    order: 'viewCount',
    minDuration: 120,
    maxDuration: 600,
    minViews: 500000,
  },

  // === MUSIC CHANNELS ===
  music: {
    // Current trending music
    query: 'official music video 2025 OR new song music video trending',
    duration: 'short',
    uploadDate: 'week',
    order: 'viewCount', // Trending music
    minDuration: 120,
    maxDuration: 600,
    minViews: 500000,
  },
  music80s: {
    query: '1980s official music video remastered 80s hits',
    duration: 'short',
    uploadDate: 'any',
    order: 'viewCount',
    minDuration: 180,
    maxDuration: 480,
    minViews: 5000000,
  },
  music90s: {
    query: '1990s official music video 90s hits remastered',
    duration: 'short',
    uploadDate: 'any',
    order: 'viewCount',
    minDuration: 180,
    maxDuration: 480,
    minViews: 5000000,
  },
  music00s: {
    query: '2000s official music video hits throwback',
    duration: 'short',
    uploadDate: 'any',
    order: 'viewCount',
    minDuration: 180,
    maxDuration: 480,
    minViews: 5000000,
  },
  music10s: {
    query: '2010s official music video VEVO hits',
    duration: 'short',
    uploadDate: 'any',
    order: 'viewCount',
    minDuration: 180,
    maxDuration: 480,
    minViews: 10000000,
  },

  // === FAMILY CHANNELS ===
  kids: {
    query: 'kids show episode OR children cartoon educational fun',
    duration: 'short',
    uploadDate: 'month',
    order: 'viewCount',
    safeSearch: 'strict',
    minDuration: 60,
    maxDuration: 600,
    minViews: 500000,
  },
  family: {
    query: 'family friendly funny videos OR family entertainment clean',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    safeSearch: 'strict',
    minDuration: 300,
    maxDuration: 1200,
    minViews: 50000,
  },
  faith: {
    query: 'sermon message church OR bible teaching faith inspiration',
    duration: 'medium',
    uploadDate: 'week',
    order: 'date',
    minDuration: 300,
    maxDuration: 3600,
    minViews: 10000,
  },

  // === PODCASTS ===
  podcast: {
    query: 'podcast full episode interview 2025 OR podcast conversation',
    duration: 'long',
    uploadDate: 'week',
    order: 'date', // Most recent episodes
    minDuration: 2400, // At least 40 minutes
    maxDuration: 14400,
    minViews: 20000,
  },
  
  // === LOCAL NEWS ===
  localnews: {
    query: 'local news live today',
    duration: 'any',
    uploadDate: 'today',
    order: 'date',
    minDuration: 0,
    maxDuration: 0,
    minViews: 0,
  },
};

// Legacy channel-based sources (fallback if search doesn't work)
export const CHANNEL_SOURCES: Record<string, { youtubeChannels: string[]; minDuration: number; maxDuration: number; minViews: number }> = {
  tech: {
    youtubeChannels: ['UCsBjURrPoezykLs9EqgamOA'],
    minDuration: 60, maxDuration: 1800, minViews: 100000
  },
  science: {
    youtubeChannels: ['UCsXVk37bltHxD1rDPwtNM8Q'],
    minDuration: 300, maxDuration: 2400, minViews: 500000
  },
};
