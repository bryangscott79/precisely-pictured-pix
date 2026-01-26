export interface Video {
  id: string;
  title: string;
  duration: number; // in seconds
}

export type ChannelColor = 
  | 'tech' 
  | 'science' 
  | 'maker' 
  | 'cooking' 
  | 'history'
  | 'diy'
  | 'sports'
  | 'collecting'
  | 'kids'
  | 'family'
  | 'faith'
  | 'automotive'
  | 'teen'
  | 'gaming'
  | 'music'
  | 'nature'
  | 'comedy'
  | 'fitness'
  | 'travel'
  | 'art';

export type ChannelCategory = 'education' | 'entertainment' | 'lifestyle' | 'family' | 'hobbies';

export interface Channel {
  id: string;
  name: string;
  icon: string;
  color: ChannelColor;
  category: ChannelCategory;
  description: string;
  restricted?: boolean; // If true, requires parental controls off
  videos: Video[];
}

export const channels: Channel[] = [
  // === EDUCATION ===
  {
    id: 'tech',
    name: 'Technology',
    icon: '💻',
    color: 'tech',
    category: 'education',
    description: 'Tech explainers and reviews',
    videos: [
      { id: 'XRr1kaXKBsU', title: 'How Does a Quantum Computer Work?', duration: 687 },
      { id: 'cUzklzVXJwo', title: 'Spinning Black Holes', duration: 918 },
      { id: 'JXeJANDKwDc', title: 'Why Gravity is NOT a Force', duration: 1018 },
      { id: 'wMFPe-DwULM', title: 'Why No One Has Measured The Speed Of Light', duration: 1128 },
      { id: 'U47Rg3KP8Oc', title: 'The Unexpected Math Behind How Computers Work', duration: 900 },
    ],
  },
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    color: 'science',
    category: 'education',
    description: 'Educational science content',
    videos: [
      { id: 'BTT6L2OU6hw', title: 'What Happens When You Eliminate Squirrels', duration: 1247 },
      { id: 'IgXiPoFdHD4', title: "Why We Haven't Cured Cancer", duration: 1523 },
      { id: 'pTn6Ewhb27k', title: 'Why No One Has Measured The Speed Of Light', duration: 1128 },
      { id: 'D5_ogU4Jzt4', title: 'The Infinite Pattern That Never Repeats', duration: 1281 },
      { id: 'X9otDixAtFw', title: 'How Trees Bend the Laws of Physics', duration: 990 },
    ],
  },
  {
    id: 'history',
    name: 'History',
    icon: '📜',
    color: 'history',
    category: 'education',
    description: 'Historical documentaries and explainers',
    videos: [
      { id: '0OR7O7FzNh4', title: 'The Wild West of Internet History', duration: 2156 },
      { id: '2fNDWKKF_5Y', title: 'The Most Dangerous Computer Virus', duration: 1342 },
      { id: 'oV6rvLP-Ul8', title: 'The History of the Internet', duration: 874 },
      { id: 'UCj8bbYNETE', title: 'The Story of Tetris', duration: 1800 },
      { id: 'aQs4YGT5wbk', title: 'How We Lost The Saturn V', duration: 1500 },
    ],
  },
  {
    id: 'nature',
    name: 'Nature',
    icon: '🌿',
    color: 'nature',
    category: 'education',
    description: 'Wildlife and nature documentaries',
    videos: [
      { id: 'aBtYYKhyYXw', title: 'The Secret Life of Plants', duration: 1320 },
      { id: 'A-7GqcOV5fY', title: 'Ocean Mysteries Revealed', duration: 1560 },
      { id: '9zb9dGN3xMM', title: 'The Hidden World of Insects', duration: 1180 },
      { id: 'Z6KGWYuN7AE', title: 'Amazing Animal Migrations', duration: 1440 },
      { id: 'R4C1U_8uiGs', title: 'Life in the Deep Ocean', duration: 1680 },
    ],
  },
  
  // === LIFESTYLE ===
  {
    id: 'cooking',
    name: 'Cooking',
    icon: '🍳',
    color: 'cooking',
    category: 'lifestyle',
    description: 'Recipe and cooking technique videos',
    videos: [
      { id: 'lxLcWcZwfzQ', title: 'Perfect Pan Pizza', duration: 522 },
      { id: '8Q_9h6VKm9c', title: 'The Secrets of Neapolitan Pizza', duration: 1847 },
      { id: 'PnCby4iHbZE', title: 'Homemade Ramen From Scratch', duration: 924 },
      { id: 'nfxpwbWBNuU', title: 'The Creamy Pasta Method', duration: 840 },
      { id: '8F8MBp-GBWE', title: 'Perfect Steak Every Time', duration: 720 },
    ],
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icon: '💪',
    color: 'fitness',
    category: 'lifestyle',
    description: 'Workouts and health tips',
    videos: [
      { id: 'UBMk30rjy0o', title: 'Full Body HIIT Workout', duration: 1200 },
      { id: 'oAPCPjnU1wA', title: 'Yoga for Beginners', duration: 1500 },
      { id: '2pLT-olgUJs', title: 'Core Strength Fundamentals', duration: 900 },
      { id: 'BHY0FxzoKZE', title: 'Stretching for Flexibility', duration: 1080 },
      { id: 'gC_L9qAHVJ8', title: 'Strength Training Basics', duration: 1320 },
    ],
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: '✈️',
    color: 'travel',
    category: 'lifestyle',
    description: 'Explore the world from your couch',
    videos: [
      { id: 'zxJQgrgXJTw', title: 'Hidden Gems of Japan', duration: 1560 },
      { id: 'UKfmjwW752A', title: 'The Most Beautiful Places on Earth', duration: 1800 },
      { id: 'ljCWHy9J--A', title: 'Street Food Adventures', duration: 1320 },
      { id: 'xU9Ke3SFzDI', title: 'Ancient Ruins Explored', duration: 1440 },
      { id: '3J1_lLa7qPk', title: 'Budget Travel Tips', duration: 1200 },
    ],
  },
  
  // === HOBBIES ===
  {
    id: 'maker',
    name: 'Maker',
    icon: '🔧',
    color: 'maker',
    category: 'hobbies',
    description: 'DIY and engineering projects',
    videos: [
      { id: 'h4T_LlK1VE4', title: 'Glitterbomb Trap Catches Porch Pirates', duration: 1422 },
      { id: 'RHvZGlGjvfc', title: "World's Largest Nerf Gun", duration: 636 },
      { id: 'Kou7ur5xt_4', title: 'World Record Elephant Toothpaste', duration: 841 },
      { id: 'QwXK4e4uqXY', title: 'Building A Massive Bow', duration: 1140 },
      { id: 'yLLLMfPtQkQ', title: 'Automatic Pool Stick vs Expert', duration: 1260 },
    ],
  },
  {
    id: 'diy',
    name: 'Home DIY',
    icon: '🏠',
    color: 'diy',
    category: 'hobbies',
    description: 'Home improvement and crafts',
    videos: [
      { id: '2rPAEjgLiYY', title: 'Amazing Home Transformations', duration: 1320 },
      { id: '8czMRm1N8qQ', title: 'DIY Furniture Builds', duration: 1080 },
      { id: 'vtd-_l0DU6s', title: 'Kitchen Renovation Tips', duration: 1440 },
      { id: 'DQG2_wBdVoU', title: 'Woodworking for Beginners', duration: 1560 },
      { id: '3WwmN2F5pS8', title: 'Smart Home on a Budget', duration: 1200 },
    ],
  },
  {
    id: 'automotive',
    name: 'Automotive',
    icon: '🚗',
    color: 'automotive',
    category: 'hobbies',
    description: 'Cars, trucks, and everything on wheels',
    videos: [
      { id: 'cKOSw-3vZT8', title: 'Supercar Showdown', duration: 1560 },
      { id: 'KqPX3BkMGOU', title: 'The Art of Car Restoration', duration: 1800 },
      { id: 'iLIZsTbq8fE', title: 'Engine Rebuilds Explained', duration: 1320 },
      { id: '5oH9Nr3bKsw', title: 'Off-Road Adventures', duration: 1440 },
      { id: 'UKfmjwW752A', title: 'Electric vs Gas: The Showdown', duration: 1200 },
    ],
  },
  {
    id: 'collecting',
    name: 'Collecting',
    icon: '🎴',
    color: 'collecting',
    category: 'hobbies',
    description: 'Cards, coins, toys and collectibles',
    videos: [
      { id: 'oc_9r4ITz2Q', title: 'Most Expensive Pokemon Cards', duration: 1380 },
      { id: '8pFKBbN0QU4', title: 'Rare Coin Hunting', duration: 1200 },
      { id: 'j_0iDpdGJxw', title: 'Vintage Toy Collection Tour', duration: 1560 },
      { id: 'lAU1OjBPdQQ', title: 'Sports Card Investing', duration: 1320 },
      { id: 'GxvOwD2J4zA', title: 'Comic Book Collecting Guide', duration: 1440 },
    ],
  },
  {
    id: 'art',
    name: 'Art & Design',
    icon: '🎨',
    color: 'art',
    category: 'hobbies',
    description: 'Creative tutorials and inspiration',
    videos: [
      { id: 'wAIP6fI0NAI', title: 'Digital Art Masterclass', duration: 1680 },
      { id: 'l8eVdCHTU9I', title: 'Watercolor Techniques', duration: 1320 },
      { id: 'ihcTJIFnc_c', title: 'Drawing Fundamentals', duration: 1440 },
      { id: 'sLnGwN7Vu58', title: 'Graphic Design Principles', duration: 1200 },
      { id: 'evQsOFCep30', title: 'Photography Tips & Tricks', duration: 1560 },
    ],
  },
  
  // === ENTERTAINMENT ===
  {
    id: 'gaming',
    name: 'Gaming',
    icon: '🎮',
    color: 'gaming',
    category: 'entertainment',
    description: 'Game reviews, esports, and walkthroughs',
    videos: [
      { id: 'bxdSjIWj_1U', title: 'Top 10 Games of the Year', duration: 1560 },
      { id: '41qC3w3UUkU', title: 'The History of Nintendo', duration: 2100 },
      { id: 'MBRqu0YOH14', title: 'Speedrunning World Records', duration: 1320 },
      { id: 'k8ws_APXilE', title: 'Hidden Gaming Secrets', duration: 1440 },
      { id: 'Q5m1_8LVPNs', title: 'Retro Gaming Collection', duration: 1200 },
    ],
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: '⚽',
    color: 'sports',
    category: 'entertainment',
    description: 'Highlights, analysis, and sports stories',
    videos: [
      { id: '7Bz9FJp6UeA', title: 'Greatest Sports Moments', duration: 1680 },
      { id: '1lG-7VR5Lzc', title: 'Behind the Scenes: Pro Athletes', duration: 1440 },
      { id: '8pFKBbN0QU4', title: 'Training Like a Champion', duration: 1320 },
      { id: 'cKOSw-3vZT8', title: 'Extreme Sports Compilation', duration: 1200 },
      { id: 'Js7v1YMO5dI', title: 'Underdog Stories', duration: 1560 },
    ],
  },
  {
    id: 'teen',
    name: 'Teen',
    icon: '🔥',
    color: 'teen',
    category: 'entertainment',
    description: 'Dude Perfect, challenges, and epic stunts',
    videos: [
      { id: 'EsidXvT3NZ8', title: 'World Record Edition', duration: 1020 },
      { id: 'lDq9-QQB1AU', title: 'Giant Dart Board Trick Shots', duration: 960 },
      { id: 'lxLcWcZwfzQ', title: 'Extreme Sports Challenge', duration: 1140 },
      { id: 'vHxGZ8rbyOM', title: 'Impossible Trick Shot Battle', duration: 1080 },
      { id: 'rlSfzPnb1xc', title: 'Viral Challenges Compilation', duration: 1200 },
    ],
  },
  {
    id: 'comedy',
    name: 'Comedy',
    icon: '😂',
    color: 'comedy',
    category: 'entertainment',
    description: 'Sketches, stand-up, and funny videos',
    restricted: true, // May contain mature humor
    videos: [
      { id: 'hQZYCcN8A-o', title: 'Best Comedy Sketches', duration: 1200 },
      { id: '0omja1ivpx0', title: 'Stand-Up Highlights', duration: 1440 },
      { id: 'nK1N2i70sjs', title: 'Hilarious Fails Compilation', duration: 960 },
      { id: 'cKOSw-3vZT8', title: 'Prank Videos Gone Right', duration: 1080 },
      { id: 'Z6KGWYuN7AE', title: 'Funny Animal Moments', duration: 900 },
    ],
  },
  {
    id: 'music',
    name: 'Music',
    icon: '🎵',
    color: 'music',
    category: 'entertainment',
    description: 'Performances, covers, and music stories',
    videos: [
      { id: 'kJQP7kiw5Fk', title: 'Live Concert Highlights', duration: 1680 },
      { id: 'JGwWNGJdvx8', title: 'The Story Behind the Song', duration: 1320 },
      { id: 'dQw4w9WgXcQ', title: 'Classic Music Videos', duration: 1200 },
      { id: 'CevxZvSJLk8', title: 'Amazing Street Performances', duration: 1440 },
      { id: 'hT_nvWreIhg', title: 'Music Production Secrets', duration: 1560 },
    ],
  },
  
  // === FAMILY ===
  {
    id: 'kids',
    name: 'Kids',
    icon: '🧸',
    color: 'kids',
    category: 'family',
    description: 'Safe, fun content for young viewers',
    videos: [
      { id: 'VFa0b_IIRac', title: 'Fun Learning Adventures', duration: 1200 },
      { id: '9zb9dGN3xMM', title: 'Cool Science for Kids', duration: 900 },
      { id: 'Z6KGWYuN7AE', title: 'Amazing Animal Facts', duration: 1080 },
      { id: 'Uh5oF7dOmzI', title: 'Art Projects for Kids', duration: 960 },
      { id: 'vtd-_l0DU6s', title: 'Fun Experiments at Home', duration: 1140 },
    ],
  },
  {
    id: 'family',
    name: 'Family',
    icon: '👨‍👩‍👧‍👦',
    color: 'family',
    category: 'family',
    description: 'Content the whole family can enjoy',
    videos: [
      { id: 'Z6KGWYuN7AE', title: 'Family Game Night Ideas', duration: 1320 },
      { id: '8czMRm1N8qQ', title: 'DIY Family Projects', duration: 1440 },
      { id: 'ljCWHy9J--A', title: 'Family Travel Adventures', duration: 1560 },
      { id: 'lAU1OjBPdQQ', title: 'Cooking with Kids', duration: 1200 },
      { id: 'VFa0b_IIRac', title: 'Family Movie Night Picks', duration: 1080 },
    ],
  },
  {
    id: 'faith',
    name: 'Faith',
    icon: '✝️',
    color: 'faith',
    category: 'family',
    description: 'Inspirational and faith-based content',
    videos: [
      { id: 'Sly4dCT5P7E', title: 'Sunday Morning Inspiration', duration: 1800 },
      { id: '3J1_lLa7qPk', title: 'Stories of Hope', duration: 1440 },
      { id: 'xU9Ke3SFzDI', title: 'Biblical History Explored', duration: 1680 },
      { id: 'Js7v1YMO5dI', title: 'Faith in Action', duration: 1320 },
      { id: 'A-7GqcOV5fY', title: 'Peaceful Worship Music', duration: 2400 },
    ],
  },
];

// Category display names
export const categoryNames: Record<ChannelCategory, string> = {
  education: 'Education',
  entertainment: 'Entertainment',
  lifestyle: 'Lifestyle',
  family: 'Family',
  hobbies: 'Hobbies & Interests',
};

// Get channels by category
export function getChannelsByCategory(category: ChannelCategory): Channel[] {
  return channels.filter(c => c.category === category);
}

// Get available channels based on parental controls
export function getAvailableChannels(parentalControlsEnabled: boolean): Channel[] {
  if (parentalControlsEnabled) {
    return channels.filter(c => !c.restricted);
  }
  return channels;
}

// Calculate total duration for a channel
export function getChannelDuration(channel: Channel): number {
  return channel.videos.reduce((acc, video) => acc + video.duration, 0);
}

// Get current video and position based on time
export function getCurrentPlayback(channel: Channel): {
  video: Video;
  videoIndex: number;
  positionInVideo: number;
  progress: number;
} {
  const totalDuration = getChannelDuration(channel);
  const now = new Date();
  const secondsSinceMidnight = 
    now.getHours() * 3600 + 
    now.getMinutes() * 60 + 
    now.getSeconds();
  
  // Position in the loop
  let positionInLoop = secondsSinceMidnight % totalDuration;
  
  // Find current video
  let accumulated = 0;
  for (let i = 0; i < channel.videos.length; i++) {
    const video = channel.videos[i];
    if (accumulated + video.duration > positionInLoop) {
      const positionInVideo = positionInLoop - accumulated;
      const progress = (positionInVideo / video.duration) * 100;
      return { video, videoIndex: i, positionInVideo, progress };
    }
    accumulated += video.duration;
  }
  
  // Fallback to first video
  return { 
    video: channel.videos[0], 
    videoIndex: 0, 
    positionInVideo: 0, 
    progress: 0 
  };
}

// Get next video
export function getNextVideo(channel: Channel, currentIndex: number): Video {
  const nextIndex = (currentIndex + 1) % channel.videos.length;
  return channel.videos[nextIndex];
}

// Format seconds to mm:ss or hh:mm:ss
export function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
