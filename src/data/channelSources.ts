import { SearchConfig } from '@/services/youtubeService';

// DIRECT, LITERAL search queries for each channel
// Each query is specifically designed to return ONLY content matching the channel purpose
// Uses exact channel names, show names, and content types to ensure accuracy

export const CHANNEL_SEARCH_CONFIG: Record<string, SearchConfig> = {
  // === EDUCATION ===
  tech: {
    // Tech reviews and explainers from major tech channels
    query: '"MKBHD" OR "Linus Tech Tips" OR "Marques Brownlee" tech review',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 1800,
    minViews: 100000,
  },
  science: {
    // Science education from verified science educators
    query: '"Veritasium" OR "Kurzgesagt" OR "SmarterEveryDay" science',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 2400,
    minViews: 500000,
  },
  history: {
    // History documentaries and educational content
    query: '"OverSimplified" OR "Kings and Generals" OR "History Channel" documentary',
    duration: 'long',
    uploadDate: 'year',
    order: 'viewCount',
    minDuration: 600,
    maxDuration: 3600,
    minViews: 300000,
  },
  nature: {
    // Nature documentaries from major networks
    query: '"BBC Earth" OR "National Geographic" wildlife documentary',
    duration: 'long',
    uploadDate: 'year',
    order: 'viewCount',
    minDuration: 600,
    maxDuration: 3600,
    minViews: 500000,
  },

  // === LIFESTYLE ===
  cooking: {
    // Cooking shows from celebrity chefs and cooking channels
    query: '"Gordon Ramsay" OR "Babish" OR "Joshua Weissman" cooking recipe',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 1800,
    minViews: 200000,
  },
  fitness: {
    // Workout videos from fitness channels
    query: '"POPSUGAR Fitness" OR "Blogilates" OR "Athlean-X" workout',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 2400,
    minViews: 300000,
  },
  travel: {
    // Travel documentaries and destination videos
    query: 'travel documentary 4K destination beautiful scenery',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 2400,
    minViews: 200000,
  },

  // === HOBBIES ===
  maker: {
    // Maker/engineering projects from top creators
    query: '"Mark Rober" OR "Adam Savage Tested" OR "Simone Giertz" build project',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 400,
    maxDuration: 2400,
    minViews: 200000,
  },
  diy: {
    // Home improvement and DIY from TV shows
    query: '"This Old House" OR "Magnolia Network" home renovation DIY',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 1800,
    minViews: 50000,
  },
  automotive: {
    // Car content from major automotive channels
    query: '"Donut Media" OR "Doug DeMuro" OR "Top Gear" car review',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 400,
    maxDuration: 1800,
    minViews: 200000,
  },
  collecting: {
    // Collectibles, cards, coins
    query: '"Antiques Roadshow" OR "PSA" sports cards collectibles grading',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 1800,
    minViews: 30000,
  },
  art: {
    // Art tutorials and painting
    query: '"Bob Ross" painting OR art tutorial masterclass professional',
    duration: 'medium',
    uploadDate: 'year',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 2400,
    minViews: 100000,
  },

  // === ENTERTAINMENT ===
  gaming: {
    // Gaming from major gaming outlets
    query: '"IGN" OR "GameSpot" game review gameplay trailer',
    duration: 'medium',
    uploadDate: 'week',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 1800,
    minViews: 300000,
  },
  sports: {
    // Sports highlights - ONLY from official sports accounts
    // Very strict query to prevent kids content, songs, parodies from appearing
    query: '"ESPN" "NFL" "NBA" "NHL" "MLB" "Premier League" highlights official -kids -song -music -parody -cartoon -animation -nursery -preschool -toddler -children -family -funny -compilation -remix -cover',
    duration: 'medium',
    uploadDate: 'week',
    order: 'viewCount',
    minDuration: 180,
    maxDuration: 1800,
    minViews: 500000, // Higher threshold to ensure official content
  },
  nfl: {
    // NFL specific content
    query: '"NFL" official highlights touchdowns best plays',
    duration: 'medium',
    uploadDate: 'week',
    order: 'viewCount',
    minDuration: 180,
    maxDuration: 1800,
    minViews: 200000,
  },
  teen: {
    // Teen entertainment - challenges and stunts
    query: '"Dude Perfect" OR "MrBeast" challenge trick shot',
    duration: 'medium',
    uploadDate: 'week',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 1800,
    minViews: 1000000,
  },
  comedy: {
    // Comedy from TV shows and late night
    query: '"SNL" OR "Saturday Night Live" OR "Jimmy Fallon" OR "Conan" comedy sketch',
    duration: 'medium',
    uploadDate: 'week',
    order: 'viewCount',
    minDuration: 180,
    maxDuration: 1200,
    minViews: 300000,
  },
  movies: {
    // Movie trailers from studios
    query: 'official movie trailer 2024 2025 film studio',
    duration: 'short',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 60,
    maxDuration: 300,
    minViews: 500000,
  },
  cinema80s: {
    // Classic 80s movie clips
    query: '80s movie scene classic film iconic remastered',
    duration: 'medium',
    uploadDate: 'any',
    order: 'viewCount',
    minDuration: 120,
    maxDuration: 600,
    minViews: 500000,
  },

  // === MUSIC CHANNELS - Very specific to era ===
  music: {
    // Current music videos from VEVO
    query: 'official music video VEVO 2024 2025',
    duration: 'short',
    uploadDate: 'week',
    order: 'viewCount',
    minDuration: 120,
    maxDuration: 600,
    minViews: 1000000,
  },
  music80s: {
    // 1980s music videos only
    query: '1980s official music video remastered hits',
    duration: 'short',
    uploadDate: 'any',
    order: 'viewCount',
    minDuration: 180,
    maxDuration: 480,
    minViews: 5000000,
  },
  music90s: {
    // 1990s music videos only
    query: '1990s official music video remastered hits',
    duration: 'short',
    uploadDate: 'any',
    order: 'viewCount',
    minDuration: 180,
    maxDuration: 480,
    minViews: 5000000,
  },
  music00s: {
    // 2000s music videos only
    query: '2000s official music video hits throwback',
    duration: 'short',
    uploadDate: 'any',
    order: 'viewCount',
    minDuration: 180,
    maxDuration: 480,
    minViews: 5000000,
  },
  music10s: {
    // 2010s music videos only
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
    // Kids content from major children's networks
    query: '"Sesame Street" OR "CoComelon" OR "Bluey" kids official',
    duration: 'short',
    uploadDate: 'month',
    order: 'viewCount',
    safeSearch: 'strict',
    minDuration: 60,
    maxDuration: 600,
    minViews: 1000000,
  },
  family: {
    // Family-friendly entertainment
    query: '"America\'s Funniest Home Videos" OR "AFV" family funny clean',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    safeSearch: 'strict',
    minDuration: 300,
    maxDuration: 1200,
    minViews: 100000,
  },
  faith: {
    // Faith-based content from major ministries
    query: '"BibleProject" OR "Joel Osteen" OR "TD Jakes" sermon message',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 3600,
    minViews: 50000,
  },

  // === PODCASTS - CRITICAL: Must be actual podcast episodes ===
  podcast: {
    // ONLY full podcast episodes from major podcasters
    // Exclude music by requiring "podcast" and "episode" in results
    query: '"Joe Rogan Experience" OR "Lex Fridman Podcast" OR "Huberman Lab" full episode',
    duration: 'long',
    uploadDate: 'week',
    order: 'date', // Most recent episodes
    minDuration: 2400, // At least 40 minutes - this is key to filter out non-podcasts
    maxDuration: 14400, // Up to 4 hours
    minViews: 50000,
  },
  
  // === LOCAL NEWS ===
  // This is a dynamic channel - the search query is generated based on user's selected station
  // See useLocalNews.ts and useDynamicVideos.ts for implementation
  localnews: {
    // Default query - will be overridden by user's selected station
    query: 'local news live today',
    duration: 'any',
    uploadDate: 'today',
    order: 'date',
    minDuration: 0, // Live streams can be any length
    maxDuration: 0, // No max for live
    minViews: 0, // Live streams may have lower view counts
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
