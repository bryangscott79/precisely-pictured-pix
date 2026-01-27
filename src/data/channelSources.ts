import { SearchConfig } from '@/services/youtubeService';

// Search-based configuration for each channel
// Uses YouTube Search API with topic queries and filters for fresh, relevant content
export const CHANNEL_SEARCH_CONFIG: Record<string, SearchConfig> = {
  tech: {
    query: 'technology explained programming tutorial',
    duration: 'medium', // 4-20 minutes
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 180,
    maxDuration: 1800,
  },
  science: {
    query: 'science documentary explained educational',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 2400,
  },
  history: {
    query: 'history documentary ancient civilizations',
    duration: 'long', // >20 minutes
    uploadDate: 'year',
    order: 'viewCount',
    minDuration: 600,
    maxDuration: 3600,
  },
  maker: {
    query: 'DIY project maker engineering build',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 2400,
  },
  cooking: {
    query: 'cooking recipe tutorial chef',
    duration: 'medium',
    uploadDate: 'week',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 1800,
  },
  automotive: {
    query: 'cars review automotive supercar',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 1800,
  },
  nature: {
    query: 'nature documentary wildlife 4K',
    duration: 'long',
    uploadDate: 'year',
    order: 'viewCount',
    minDuration: 600,
    maxDuration: 3600,
  },
  kids: {
    query: 'kids educational songs cartoon',
    duration: 'short', // <4 minutes
    uploadDate: 'month',
    order: 'viewCount',
    safeSearch: 'strict',
    minDuration: 60,
    maxDuration: 600,
  },
  family: {
    query: 'family friendly entertainment comedy',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    safeSearch: 'strict',
    minDuration: 300,
    maxDuration: 1200,
  },
  faith: {
    query: 'bible study sermon christian inspirational',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 1800,
  },
  fitness: {
    query: 'full body workout HIIT cardio gym -cooking -food -recipe',
    duration: 'medium',
    uploadDate: 'week',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 2400,
  },
  diy: {
    query: 'home improvement renovation DIY project',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 1800,
  },
  gaming: {
    query: 'gaming gameplay walkthrough review',
    duration: 'medium',
    uploadDate: 'week',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 1800,
  },
  travel: {
    query: 'travel 4K destination vacation',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 2400,
  },
  comedy: {
    query: 'stand up comedy special SNL Jimmy Fallon Conan late night show American comedian',
    duration: 'medium',
    uploadDate: 'week',
    order: 'viewCount',
    minDuration: 180,
    maxDuration: 1200,
  },
  music: {
    query: 'music video official audio',
    duration: 'short',
    uploadDate: 'week',
    order: 'viewCount',
    minDuration: 120,
    maxDuration: 600,
  },
  music80s: {
    query: '80s music hits classic rock pop 1980s',
    duration: 'short',
    uploadDate: 'any',
    order: 'viewCount',
    minDuration: 180,
    maxDuration: 480,
  },
  music90s: {
    query: '90s music hits grunge pop rock 1990s',
    duration: 'short',
    uploadDate: 'any',
    order: 'viewCount',
    minDuration: 180,
    maxDuration: 480,
  },
  music00s: {
    query: '2000s music hits pop rock rnb',
    duration: 'short',
    uploadDate: 'any',
    order: 'viewCount',
    minDuration: 180,
    maxDuration: 480,
  },
  music10s: {
    query: '2010s music hits pop edm',
    duration: 'short',
    uploadDate: 'any',
    order: 'viewCount',
    minDuration: 180,
    maxDuration: 480,
  },
  sports: {
    query: 'sports highlights NFL NBA soccer goals',
    duration: 'medium',
    uploadDate: 'week', // Fresh sports content
    order: 'viewCount', // Most popular
    minDuration: 180,
    maxDuration: 1800,
  },
  collecting: {
    // Default query - actual content is driven by scheduledProgramming.ts
    query: 'collectibles sports cards Pokemon antiques rare finds -coins',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 1800,
  },
  teen: {
    query: 'challenge viral trending entertainment',
    duration: 'medium',
    uploadDate: 'week',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 1800,
  },
  art: {
    query: 'art tutorial painting drawing creative',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 1800,
  },
  nfl: {
    query: 'NFL highlights football touchdowns playoffs',
    duration: 'medium',
    uploadDate: 'week',
    order: 'viewCount',
    minDuration: 180,
    maxDuration: 1800,
  },
  movies: {
    query: 'movie trailer film official teaser',
    duration: 'short',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 60,
    maxDuration: 300,
  },
  cinema80s: {
    query: '80s movie scene classic film 1980s',
    duration: 'medium',
    uploadDate: 'any',
    order: 'viewCount',
    minDuration: 120,
    maxDuration: 600,
  },
  podcast: {
    query: 'podcast full episode interview Joe Rogan Lex Fridman',
    duration: 'long', // Podcasts are long-form
    uploadDate: 'week', // Fresh episodes
    order: 'viewCount',
    minDuration: 1800, // At least 30 min
    maxDuration: 14400, // Up to 4 hours
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
