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
      { id: 'aircAruvnKk', title: 'How Does a Computer Work?', duration: 687 },
      { id: 'PtKhbbcc3-Y', title: 'The Evolution of Smartphones', duration: 918 },
      { id: 'GcDshWmhF4A', title: 'How AI Is Changing Everything', duration: 1018 },
      { id: 'X4YSy7Vhvxw', title: 'The Future of Technology', duration: 1128 },
      { id: 'WRdJCFEqFTU', title: 'Building a Gaming PC', duration: 900 },
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
      { id: 'QqsLTNkzvaY', title: 'The Largest Black Holes in the Universe', duration: 1247 },
      { id: 'DkzQxw16G9w', title: 'How Evolution Works', duration: 1523 },
      { id: '3MOwRTTq1bY', title: 'The Science of Earthquakes', duration: 1128 },
      { id: 'tlTKTTt47WE', title: 'How Your Brain Works', duration: 1281 },
      { id: 'rDiUVS_-4_Q', title: 'The Physics of Flight', duration: 990 },
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
      { id: 'USocy1X3SRM', title: 'Ancient Egypt Mysteries', duration: 2156 },
      { id: 'EpE6h4OBkSE', title: 'World War II Documentary', duration: 1342 },
      { id: 'jNgP6d9HraI', title: 'The Roman Empire', duration: 874 },
      { id: 'xuCn8ux2gbs', title: 'Medieval Times Explained', duration: 1800 },
      { id: 'Q-mkVSasZIM', title: 'The Industrial Revolution', duration: 1500 },
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
      { id: 'nlYlNF30bVg', title: 'Planet Earth: Beautiful Nature', duration: 1320 },
      { id: 'qVv4OwA1IYs', title: 'Ocean Life Documentary', duration: 1560 },
      { id: 'zVfHpPxQCDY', title: 'African Wildlife Safari', duration: 1180 },
      { id: 'ShFAeNdiEiA', title: 'Amazing Birds of Paradise', duration: 1440 },
      { id: 'aqz-KE-bpKQ', title: 'Deep Sea Creatures', duration: 1680 },
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
      { id: 'bJUiWdM__Qw', title: "Gordon Ramsay's Perfect Steak", duration: 522 },
      { id: 'ZJy1ajvMU1k', title: 'Italian Pasta Masterclass', duration: 1847 },
      { id: 'CZDFwqHkPec', title: 'Easy Homemade Pizza', duration: 924 },
      { id: 'rjwwR1L_nAI', title: 'Asian Cooking Basics', duration: 840 },
      { id: '1jJh-Wpfuz0', title: 'Baking Bread at Home', duration: 720 },
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
      { id: 'ml6cT4AZdqI', title: '20 Min Full Body Workout', duration: 1200 },
      { id: 'v7AYKMP6rOE', title: '10 Min Morning Yoga', duration: 600 },
      { id: '149Iac5fmoE', title: 'HIIT Cardio Workout', duration: 900 },
      { id: 'g_tea8ZNk5A', title: 'Core Strength Training', duration: 1080 },
      { id: 'UBnSkpYWL8Q', title: 'Stretching Routine', duration: 1320 },
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
      { id: 'WLIv7HnZ_fE', title: 'Beautiful Japan Travel', duration: 1560 },
      { id: 'CWhbY7aLF4I', title: 'Exploring Iceland', duration: 1800 },
      { id: 'HQfzwFloVqA', title: 'Thailand Adventure', duration: 1320 },
      { id: 'cNVZEVq3KzY', title: 'Italy Travel Guide', duration: 1440 },
      { id: 'GdwnrjTjGyk', title: 'New Zealand Road Trip', duration: 1200 },
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
      { id: 'xoxhDk-hwuo', title: 'Glitterbomb vs Package Thieves', duration: 1422 },
      { id: 'ik2AwjR5fhg', title: 'Building a Treehouse', duration: 636 },
      { id: 'HvNK68wrwmU', title: 'DIY Electric Skateboard', duration: 841 },
      { id: 'fxJWin195kU', title: 'Making Things From Scratch', duration: 1140 },
      { id: 'MeNR0guNn70', title: 'Electronics for Beginners', duration: 1260 },
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
      { id: 'Xjnj2ZcMpls', title: 'Home Renovation Tips', duration: 1320 },
      { id: 'YaD2E3wVJFw', title: 'Building Custom Furniture', duration: 1080 },
      { id: 'xycDbGT-R-U', title: 'Kitchen Makeover Ideas', duration: 1440 },
      { id: 'hPpLEfcevQU', title: 'Woodworking Projects', duration: 1560 },
      { id: 'NLi3IQyMnEo', title: 'DIY Home Decor', duration: 1200 },
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
      { id: 'iFEVlNsOhJg', title: 'Car Restoration Project', duration: 1560 },
      { id: '4oAbXQcOSoI', title: 'Sports Car Review', duration: 1800 },
      { id: 'Ub5q7TlKNDw', title: 'How Engines Work', duration: 1320 },
      { id: 'LBPMj8aa9mI', title: 'Classic Car Collection', duration: 1440 },
      { id: 'YbEbgtMD9vU', title: 'Electric Cars Explained', duration: 1200 },
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
      { id: 'yJBvnbeTyPg', title: 'Rare Pokemon Cards Found', duration: 1380 },
      { id: 'aqIHKWd9rSc', title: 'Coin Collecting Guide', duration: 1200 },
      { id: 'QRrQj8nuJo4', title: 'Vintage Toy Collection', duration: 1560 },
      { id: 'V2VZ_FhVpbU', title: 'Sports Card Investing', duration: 1320 },
      { id: '2Tp-kbkw3yw', title: 'Comic Book Collecting', duration: 1440 },
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
      { id: '6ZH3Lj2PcNo', title: 'Digital Art Tutorial', duration: 1680 },
      { id: 'sP3sEz02i-8', title: 'Watercolor Painting Tips', duration: 1320 },
      { id: 'ewMksAbgdBI', title: 'Drawing for Beginners', duration: 1440 },
      { id: 'k6F3q5X19u0', title: 'Graphic Design Basics', duration: 1200 },
      { id: '7IME0LWdH4s', title: 'Photography Masterclass', duration: 1560 },
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
      { id: 'HCLaC5yyXEI', title: 'Best Games of 2024', duration: 1560 },
      { id: 'izxXGuVL21o', title: 'Gaming Setup Tour', duration: 2100 },
      { id: '4A4wW0khp_Y', title: 'Speedrun World Record', duration: 1320 },
      { id: 'lZqrG1bdGtg', title: 'Game Development Story', duration: 1440 },
      { id: 'K0GZMA6c0T4', title: 'Retro Gaming Collection', duration: 1200 },
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
      { id: 'N4nwMDZYXTI', title: 'Greatest Sports Moments', duration: 1680 },
      { id: 'gHy7xvPoPl4', title: 'Pro Athlete Training', duration: 1440 },
      { id: 'mJ1H6OZ0rcY', title: 'Championship Highlights', duration: 1320 },
      { id: 'ZDkWRP67Xjc', title: 'Sports Documentary', duration: 1200 },
      { id: 'AYUxGNMOZ8s', title: 'Underdog Stories', duration: 1560 },
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
      { id: 'M0jmSsQ5ptw', title: 'Trick Shot Battle', duration: 1020 },
      { id: 'YmM4q5M8QTQ', title: 'Epic Water Park Challenge', duration: 960 },
      { id: 'HO0u1ACbL18', title: 'Extreme Sports Compilation', duration: 1140 },
      { id: 'BzHf7eFLaWM', title: 'Crazy Stunts Gone Right', duration: 1080 },
      { id: 'z3AsM59RXQc', title: 'Viral Challenges', duration: 1200 },
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
      { id: 'AJZNxI0xG7A', title: 'Best Comedy Sketches', duration: 1200 },
      { id: 'pJTGAtLH7Hw', title: 'Stand-Up Comedy Special', duration: 1440 },
      { id: 'nBHkIWAJitg', title: 'Funny Moments Compilation', duration: 960 },
      { id: 'kav7tifmyTg', title: 'Improv Comedy Show', duration: 1080 },
      { id: 'YZ6K3m9TsPs', title: 'Comedy Roast Highlights', duration: 900 },
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
      { id: 'JGwWNGJdvx8', title: 'Shape of You - Ed Sheeran', duration: 263 },
      { id: 'kJQP7kiw5Fk', title: 'Despacito', duration: 282 },
      { id: 'RgKAFK5djSk', title: 'See You Again', duration: 237 },
      { id: 'CevxZvSJLk8', title: 'Roar - Katy Perry', duration: 269 },
      { id: 'hT_nvWreIhg', title: 'Counting Stars', duration: 273 },
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
      { id: 'tVlcKp3bWH8', title: 'Fun Learning Songs', duration: 1200 },
      { id: 'Eoe18I7OdVQ', title: 'Science for Kids', duration: 900 },
      { id: 'PHi24jgLO-I', title: 'Animal Adventures', duration: 1080 },
      { id: 'L0MK7qz13bU', title: 'Art Time for Kids', duration: 960 },
      { id: 'loYYEoOOPVQ', title: 'Fun Experiments', duration: 1140 },
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
      { id: '4TYv2PhG89A', title: 'Family Game Night', duration: 1320 },
      { id: 'c1ikJwOx3ro', title: 'DIY Family Crafts', duration: 1440 },
      { id: 'PKffm2hxaB0', title: 'Family Travel Vlog', duration: 1560 },
      { id: 'F9eLv6qH_qE', title: 'Cooking with Family', duration: 1200 },
      { id: '_OQcJZplWzo', title: 'Family Adventure Day', duration: 1080 },
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
      { id: 'M7hy-HMrVmc', title: 'Inspirational Stories', duration: 1800 },
      { id: 'YHcBM3hyQ4M', title: 'Morning Devotional', duration: 1440 },
      { id: 'Kppx4bzfAaE', title: 'Gospel Music Collection', duration: 1680 },
      { id: 'ClWf7C1JUEo', title: 'Faith and Hope', duration: 1320 },
      { id: 'U8EDgciZZFc', title: 'Peaceful Worship', duration: 2400 },
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

// Get schedule for the next N hours
export interface ScheduleItem {
  video: Video;
  startTime: Date;
  endTime: Date;
  isNowPlaying: boolean;
}

export function getChannelSchedule(channel: Channel, hoursAhead: number = 3): ScheduleItem[] {
  const schedule: ScheduleItem[] = [];
  const now = new Date();
  const endTime = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);
  
  const totalDuration = getChannelDuration(channel);
  const secondsSinceMidnight = 
    now.getHours() * 3600 + 
    now.getMinutes() * 60 + 
    now.getSeconds();
  
  // Find the current position in the loop
  let positionInLoop = secondsSinceMidnight % totalDuration;
  
  // Find which video is currently playing and when it started
  let accumulated = 0;
  let currentVideoIndex = 0;
  for (let i = 0; i < channel.videos.length; i++) {
    const video = channel.videos[i];
    if (accumulated + video.duration > positionInLoop) {
      currentVideoIndex = i;
      break;
    }
    accumulated += video.duration;
  }
  
  // Calculate when the current video started
  const positionInCurrentVideo = positionInLoop - accumulated;
  let currentTime = new Date(now.getTime() - positionInCurrentVideo * 1000);
  
  // Build schedule
  let videoIndex = currentVideoIndex;
  while (currentTime < endTime) {
    const video = channel.videos[videoIndex];
    const videoStartTime = new Date(currentTime);
    const videoEndTime = new Date(currentTime.getTime() + video.duration * 1000);
    
    const isNowPlaying = videoStartTime <= now && now < videoEndTime;
    
    schedule.push({
      video,
      startTime: videoStartTime,
      endTime: videoEndTime,
      isNowPlaying,
    });
    
    currentTime = videoEndTime;
    videoIndex = (videoIndex + 1) % channel.videos.length;
    
    // Safety: prevent infinite loops
    if (schedule.length > 100) break;
  }
  
  return schedule;
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

// Format time as 12-hour clock
export function formatTimeSlot(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}
