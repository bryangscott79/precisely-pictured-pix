// Curated podcast sources from YouTube channels
// These are audio-focused content creators with podcast-style episodes

export const PODCAST_SOURCES = {
  podcast: {
    youtubeChannels: [
      'UCzQUP1qoWDoEbmsQxvdjxgQ', // PowerfulJRE (Joe Rogan Experience highlights)
      'UCAuUUnT6oDeKwE6v1USguen', // TED Talks Audio
      'UC4eYXhJI4-7wSWc8UNRwD4A', // NPR Tiny Desk
    ],
    minDuration: 300,  // 5 min minimum
    maxDuration: 7200, // 2 hour maximum
    minViews: 50000
  }
};

// Podcast episode metadata for display
export interface PodcastEpisode {
  id: string;
  title: string;
  showName: string;
  duration: number;
  thumbnailUrl?: string;
}

// Curated podcast episodes - verified embeddable TED Talks and NPR content
// These are actual talks and performances, NOT music videos
export const CURATED_PODCASTS: PodcastEpisode[] = [
  // TED Talks - verified working
  { 
    id: 'arj7oStGLkU', 
    title: 'Inside the mind of a master procrastinator',
    showName: 'TED Talks',
    duration: 853,
    thumbnailUrl: 'https://img.youtube.com/vi/arj7oStGLkU/maxresdefault.jpg'
  },
  { 
    id: '8jPQjjsBbIc', 
    title: 'How great leaders inspire action',
    showName: 'TED Talks',
    duration: 1081,
    thumbnailUrl: 'https://img.youtube.com/vi/8jPQjjsBbIc/maxresdefault.jpg'
  },
  { 
    id: 'iCvmsMzlF7o', 
    title: 'The power of vulnerability',
    showName: 'TED Talks',
    duration: 1213,
    thumbnailUrl: 'https://img.youtube.com/vi/iCvmsMzlF7o/maxresdefault.jpg'
  },
  { 
    id: 'H14bBuluwB8', 
    title: 'Your body language may shape who you are',
    showName: 'TED Talks',
    duration: 1266,
    thumbnailUrl: 'https://img.youtube.com/vi/H14bBuluwB8/maxresdefault.jpg'
  },
  { 
    id: 'oRSij0gffXA', 
    title: 'How to speak so that people want to listen',
    showName: 'TED Talks',
    duration: 600,
    thumbnailUrl: 'https://img.youtube.com/vi/oRSij0gffXA/maxresdefault.jpg'
  },
  { 
    id: 'Unzc731iCUY', 
    title: 'How to make stress your friend',
    showName: 'TED Talks',
    duration: 870,
    thumbnailUrl: 'https://img.youtube.com/vi/Unzc731iCUY/maxresdefault.jpg'
  },
  { 
    id: 'RcGyVTAoXEU', 
    title: 'The happy secret to better work',
    showName: 'TED Talks',
    duration: 725,
    thumbnailUrl: 'https://img.youtube.com/vi/RcGyVTAoXEU/maxresdefault.jpg'
  },
  { 
    id: 'UF8uR6Z6KLc', 
    title: 'Steve Jobs Stanford Commencement Speech',
    showName: 'Stanford',
    duration: 912,
    thumbnailUrl: 'https://img.youtube.com/vi/UF8uR6Z6KLc/maxresdefault.jpg'
  },
  { 
    id: '_J4QPz52Sfo', 
    title: 'How to practice effectively',
    showName: 'TED-Ed',
    duration: 270,
    thumbnailUrl: 'https://img.youtube.com/vi/_J4QPz52Sfo/maxresdefault.jpg'
  },
  { 
    id: 'eIho2S0ZahI', 
    title: 'How to learn anything faster',
    showName: 'TED Talks',
    duration: 780,
    thumbnailUrl: 'https://img.youtube.com/vi/eIho2S0ZahI/maxresdefault.jpg'
  },
  { 
    id: 'lmyZMtPVodo', 
    title: 'Why we procrastinate',
    showName: 'TED-Ed',
    duration: 300,
    thumbnailUrl: 'https://img.youtube.com/vi/lmyZMtPVodo/maxresdefault.jpg'
  },
  { 
    id: 'JI8AMRbqY6w', 
    title: '3 secrets of resilient people',
    showName: 'TED Talks',
    duration: 720,
    thumbnailUrl: 'https://img.youtube.com/vi/JI8AMRbqY6w/maxresdefault.jpg'
  },
  { 
    id: 'Hu4Yvq-g7_Y', 
    title: 'The skill of self confidence',
    showName: 'TEDx Talks',
    duration: 840,
    thumbnailUrl: 'https://img.youtube.com/vi/Hu4Yvq-g7_Y/maxresdefault.jpg'
  },
  { 
    id: 'P6FORpg0KVo', 
    title: 'What makes a good life',
    showName: 'TED Talks',
    duration: 780,
    thumbnailUrl: 'https://img.youtube.com/vi/P6FORpg0KVo/maxresdefault.jpg'
  },
  { 
    id: 'IWdzrZdRa38', 
    title: 'The art of asking',
    showName: 'TED Talks',
    duration: 810,
    thumbnailUrl: 'https://img.youtube.com/vi/IWdzrZdRa38/maxresdefault.jpg'
  },
  { 
    id: 'r9LelXa3U_I', 
    title: 'Grit: The power of passion and perseverance',
    showName: 'TED Talks',
    duration: 366,
    thumbnailUrl: 'https://img.youtube.com/vi/r9LelXa3U_I/maxresdefault.jpg'
  },
  { 
    id: 'k5GkSPXSU74', 
    title: 'The surprising science of happiness',
    showName: 'TED Talks',
    duration: 1260,
    thumbnailUrl: 'https://img.youtube.com/vi/k5GkSPXSU74/maxresdefault.jpg'
  },
  { 
    id: 'ITTxTCz4Ums', 
    title: 'Your brain on video games',
    showName: 'TED Talks',
    duration: 1080,
    thumbnailUrl: 'https://img.youtube.com/vi/ITTxTCz4Ums/maxresdefault.jpg'
  },
  { 
    id: '36m1o-tM05g', 
    title: 'The power of introverts',
    showName: 'TED Talks',
    duration: 1140,
    thumbnailUrl: 'https://img.youtube.com/vi/36m1o-tM05g/maxresdefault.jpg'
  },
  { 
    id: 'GIJDXHXqDPE', 
    title: 'This is what happens when you reply to spam email',
    showName: 'TED Talks',
    duration: 960,
    thumbnailUrl: 'https://img.youtube.com/vi/GIJDXHXqDPE/maxresdefault.jpg'
  },
];

// Get curated podcasts for display (top 20 sorted by duration for variety)
export function getCuratedPodcasts(): PodcastEpisode[] {
  return [...CURATED_PODCASTS]
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 20);
}

// Convert PodcastEpisode to Video format for channel compatibility
export function podcastsToVideos(): { id: string; title: string; duration: number }[] {
  return CURATED_PODCASTS.map(ep => ({
    id: ep.id,
    title: ep.title,
    duration: ep.duration
  }));
}
