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

// Fallback curated podcast episodes (verified embeddable)
export const CURATED_PODCASTS: PodcastEpisode[] = [
  // TED Talks Audio
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
  // NPR Tiny Desk Concerts (audio-focused performances)
  { 
    id: 'ferZnZ0_rSM', 
    title: 'Lizzo: Tiny Desk Concert',
    showName: 'NPR Tiny Desk',
    duration: 1026,
    thumbnailUrl: 'https://img.youtube.com/vi/ferZnZ0_rSM/maxresdefault.jpg'
  },
  { 
    id: 'uwUt1fVLb3E', 
    title: 'Mac Miller: Tiny Desk Concert',
    showName: 'NPR Tiny Desk',
    duration: 1080,
    thumbnailUrl: 'https://img.youtube.com/vi/uwUt1fVLb3E/maxresdefault.jpg'
  },
  { 
    id: 'QKzobTCIRDw', 
    title: 'Tyler, the Creator: Tiny Desk Concert',
    showName: 'NPR Tiny Desk',
    duration: 960,
    thumbnailUrl: 'https://img.youtube.com/vi/QKzobTCIRDw/maxresdefault.jpg'
  },
  { 
    id: 'fOZ-MySzAac', 
    title: 'H.E.R.: Tiny Desk Concert',
    showName: 'NPR Tiny Desk',
    duration: 1140,
    thumbnailUrl: 'https://img.youtube.com/vi/fOZ-MySzAac/maxresdefault.jpg'
  },
  // Interview/Discussion style
  { 
    id: 'L_Guz73e6fw', 
    title: 'Why we sleep',
    showName: 'TED Talks',
    duration: 1140,
    thumbnailUrl: 'https://img.youtube.com/vi/L_Guz73e6fw/maxresdefault.jpg'
  },
  { 
    id: 'RcGyVTAoXEU', 
    title: 'The happy secret to better work',
    showName: 'TED Talks',
    duration: 725,
    thumbnailUrl: 'https://img.youtube.com/vi/RcGyVTAoXEU/maxresdefault.jpg'
  },
  { 
    id: 'xNvsnPCs0gY', 
    title: 'Jacob Collier: Tiny Desk Concert',
    showName: 'NPR Tiny Desk',
    duration: 1320,
    thumbnailUrl: 'https://img.youtube.com/vi/xNvsnPCs0gY/maxresdefault.jpg'
  },
  { 
    id: 'DloZ4vBzYCs', 
    title: 'Thundercat: Tiny Desk Concert',
    showName: 'NPR Tiny Desk',
    duration: 900,
    thumbnailUrl: 'https://img.youtube.com/vi/DloZ4vBzYCs/maxresdefault.jpg'
  },
  { 
    id: 'kJQP7kiw5Fk', 
    title: 'Anderson .Paak: Tiny Desk Concert',
    showName: 'NPR Tiny Desk',
    duration: 1080,
    thumbnailUrl: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg'
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
    id: 'A-52-Qz0_wg', 
    title: 'Daniel Kahneman: Thinking, Fast and Slow',
    showName: 'Talks at Google',
    duration: 3600,
    thumbnailUrl: 'https://img.youtube.com/vi/A-52-Qz0_wg/maxresdefault.jpg'
  },
  { 
    id: 'UF8uR6Z6KLc', 
    title: 'Steve Jobs Stanford Commencement Speech',
    showName: 'Stanford',
    duration: 912,
    thumbnailUrl: 'https://img.youtube.com/vi/UF8uR6Z6KLc/maxresdefault.jpg'
  },
  { 
    id: 'cef35Fk7YD8', 
    title: 'Dua Lipa: Tiny Desk Concert',
    showName: 'NPR Tiny Desk',
    duration: 960,
    thumbnailUrl: 'https://img.youtube.com/vi/cef35Fk7YD8/maxresdefault.jpg'
  },
  { 
    id: '_J4QPz52Sfo', 
    title: 'How to practice effectively',
    showName: 'TED-Ed',
    duration: 270,
    thumbnailUrl: 'https://img.youtube.com/vi/_J4QPz52Sfo/maxresdefault.jpg'
  },
  { 
    id: 'BQ4yd2W50No', 
    title: 'Sam Smith: Tiny Desk Concert',
    showName: 'NPR Tiny Desk',
    duration: 900,
    thumbnailUrl: 'https://img.youtube.com/vi/BQ4yd2W50No/maxresdefault.jpg'
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
