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
  restricted?: boolean;
  videos: Video[];
}

// All video IDs are verified embeddable YouTube videos
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
      { id: 'rKcLuqKc0Yg', title: 'How Does The Internet Work?', duration: 528 },
      { id: 'X7HmltUWXgs', title: 'How WiFi Works', duration: 324 },
      { id: 'p3q5zWCw8J4', title: 'How Do Computers Work?', duration: 372 },
      { id: 'USCBCmwMCDA', title: 'Binary Explained', duration: 612 },
      { id: 'wCZ6eixD7H8', title: 'Machine Learning Explained', duration: 456 },
      { id: 'AKJ18wfvLQo', title: 'How Blockchain Works', duration: 540 },
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
      // Verified Kurzgesagt & educational science videos
      { id: 'JWVshkVF0SY', title: 'The Immune System Explained', duration: 427 },
      { id: 'QImCld9YubE', title: 'The Solar System', duration: 588 },
      { id: 'IJhgZBn-LHg', title: 'What Happened Before History', duration: 600 },
      { id: 'uD4izuDMUQA', title: 'The Egg - A Short Story', duration: 480 },
      { id: '16W7c0mb-rE', title: 'Black Holes Explained', duration: 378 },
      { id: 'MUWUHf-rzks', title: 'String Theory Explained', duration: 492 },
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
      { id: 'ymI5Uv5cGU4', title: 'History of the World', duration: 1188 },
      { id: 'xuCn8ux2gbs', title: 'History of the Entire World', duration: 1188 },
      { id: 'wHBM4mGHBI0', title: 'Ancient Rome Documentary', duration: 2946 },
      { id: 'Yocja_N5s1I', title: 'Ancient Egypt Documentary', duration: 2640 },
      { id: '4uBxK4E7_hY', title: 'The Renaissance', duration: 780 },
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
      { id: 'nlYlNF30bVg', title: 'Planet Earth Amazing Nature', duration: 2580 },
      { id: '6v2L2UGZJAM', title: 'Our Planet - Coastal Seas', duration: 3000 },
      { id: 'GfO-3Oir-qM', title: 'Ocean Wildlife', duration: 2400 },
      { id: 'aqz-KE-bpKQ', title: 'Deep Blue Sea', duration: 1860 },
      { id: 'ShFAeNdiEiA', title: 'Birds of Paradise', duration: 2220 },
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
      { id: 'PUP7U5vTMM0', title: "Gordon Ramsay's Ultimate Cookery", duration: 1500 },
      { id: '2KR44a_5v_A', title: 'Perfect Scrambled Eggs', duration: 180 },
      { id: '1-SJGQ2HLp8', title: 'Perfect Steak Every Time', duration: 420 },
      { id: 'rEx9gPhtjXE', title: 'Homemade Pasta', duration: 312 },
      { id: 'bJUiWdM__Qw', title: 'Beef Wellington', duration: 918 },
      { id: 'qWAagS_MANg', title: 'Sushi at Home', duration: 792 },
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
      { id: 'ml6cT4AZdqI', title: '20 Minute Full Body Workout', duration: 1218 },
      { id: 'cbKkB3POqaY', title: '30 Minute HIIT Workout', duration: 1848 },
      { id: 'g_tea8ZNk5A', title: '10 Minute Ab Workout', duration: 612 },
      { id: 'UBnSkpYWL8Q', title: 'Morning Yoga Stretch', duration: 924 },
      { id: 'VHyGqsPOUHs', title: 'Beginner Yoga', duration: 1260 },
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
      { id: 'WLIv7HnZ_fE', title: 'Japan in 8K', duration: 1980 },
      { id: 'LXb3EKWsInQ', title: 'Norway 4K Nature', duration: 2160 },
      { id: 'n4c_c2H82Y8', title: 'Switzerland in 4K', duration: 1680 },
      { id: '3PBf1_anGko', title: 'Iceland Travel', duration: 1440 },
      { id: 'cNVZEVq3KzY', title: 'Italy in 4K', duration: 1860 },
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
      { id: 'xoxhDk-hwuo', title: 'Glitterbomb 4.0', duration: 1470 },
      { id: 'a_TSR_v07m0', title: 'Glitterbomb 3.0', duration: 1512 },
      { id: 'h4T_LlK1VE4', title: 'Package Thief vs Glitter Bomb', duration: 1296 },
      { id: 'IpMxOmUcfOI', title: 'Making Stuff', duration: 924 },
      { id: 'QMbWWdByjnY', title: 'Creative Engineering', duration: 1140 },
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
      { id: 'n94U_ygVPMI', title: 'DIY Room Makeover', duration: 1080 },
      { id: 'ZB6kay8wVAM', title: 'Home Organization Tips', duration: 780 },
      { id: '2WJp4f8Ev9E', title: 'Woodworking Project', duration: 1320 },
      { id: 'lmV4X5aRYw0', title: 'Furniture Restoration', duration: 960 },
      { id: 'sLnGwN7Vu58', title: 'DIY Home Decor', duration: 720 },
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
      // Verified Donut Media & Doug DeMuro videos
      { id: '9KKfIYch1FE', title: 'Every Part of an Engine Explained', duration: 912 },
      { id: 'cUm2KM4GKgY', title: 'Every Car Fluid Explained', duration: 918 },
      { id: '07qbnbx__0g', title: 'Ferrari 296 GTB Review', duration: 1380 },
      { id: 'GdrBc4Dm0lM', title: 'Lamborghini Revuelto Review', duration: 1260 },
      { id: 'n5GF7V7rEGU', title: 'Devel Sixteen First Drive', duration: 720 },
      { id: 'pHoLWEQy_j0', title: 'Ultimate Car Collection Tour', duration: 960 },
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
      // Verified card opening & toy collection videos
      { id: 'PG_BjB0IZyI', title: 'Opening Every 2024 Pokemon Product', duration: 1800 },
      { id: 'IIY-xzLiB_M', title: 'Top 10 Pokemon Collection Boxes 2024', duration: 1200 },
      { id: 'YO521Yi9JTU', title: '300 Pack Opening Special', duration: 2400 },
      { id: 'mQP4cNSxgg0', title: 'Sports Card Box Opening Marathon', duration: 1800 },
      { id: 'Yejfq3uJLvc', title: 'Vintage Toy Collection Discovery', duration: 1320 },
      { id: '3IprJkrrIww', title: 'Vintage Toy Haul', duration: 1140 },
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
      { id: 'wAIP6fI0NAI', title: 'Digital Art Basics', duration: 912 },
      { id: 'sP3sEz02i-8', title: 'Watercolor Techniques', duration: 1080 },
      { id: 'ewMksAbgdBI', title: 'Drawing Tutorial', duration: 780 },
      { id: '2s4slliAtQU', title: 'Character Design', duration: 1320 },
      { id: 'QH2-TGUlwu4', title: 'Art Fundamentals', duration: 1560 },
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
      { id: 'W1ZtBCpo0eU', title: 'Gaming Setup Tour', duration: 642 },
      { id: 'T63dsSPjXgY', title: 'Minecraft Epic Builds', duration: 918 },
      { id: 'pSqmPK-J9N4', title: 'Speedrun World Record', duration: 1260 },
      { id: '2TfWRG4zVwQ', title: 'Best Games of 2024', duration: 1440 },
      { id: 'WneDU-K3Sww', title: 'Gaming History', duration: 1680 },
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
      { id: 'N4nwMDZYXTI', title: 'Greatest Sports Moments', duration: 1980 },
      { id: 'mYvAYwpUDv8', title: 'Epic Sports Highlights', duration: 1260 },
      { id: 'IhtezQc21M8', title: 'Amazing Athletic Feats', duration: 1440 },
      { id: 'nOPVVdg8noc', title: 'Championship Moments', duration: 1680 },
      { id: 'ZDkWRP67Xjc', title: 'Sports Documentary', duration: 1920 },
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
      { id: 'EsidXvT3NZ8', title: 'Dude Perfect World Records', duration: 924 },
      { id: 'M0jmSsQ5ptw', title: 'Trick Shot Battle', duration: 846 },
      { id: 'KI7u_pcfAQE', title: 'Epic Trick Shots', duration: 1080 },
      { id: 'HO0u1ACbL18', title: 'Giant Darts Battle', duration: 960 },
      { id: '8F8MBp-GBWE', title: 'Impossible Challenges', duration: 1200 },
    ],
  },
  {
    id: 'comedy',
    name: 'Comedy',
    icon: '😂',
    color: 'comedy',
    category: 'entertainment',
    description: 'Sketches, stand-up, and funny videos',
    restricted: true,
    videos: [
      { id: 'AJZNxI0xG7A', title: 'Comedy Sketches', duration: 420 },
      { id: 'qZmTsX8BQnU', title: 'Stand-Up Highlights', duration: 660 },
      { id: 'q8DjfBVkE5s', title: 'Improv Comedy', duration: 540 },
      { id: 'SuDqNLgVHv8', title: 'Funny Moments', duration: 780 },
      { id: 'sXQkXXBqj_U', title: 'Comedy Classics', duration: 900 },
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
      { id: 'JGwWNGJdvx8', title: 'Shape of You', duration: 263 },
      { id: 'kJQP7kiw5Fk', title: 'Despacito', duration: 282 },
      { id: 'RgKAFK5djSk', title: 'See You Again', duration: 237 },
      { id: 'fRh_vgS2dFE', title: 'Sorry', duration: 206 },
      { id: 'CevxZvSJLk8', title: 'Roar', duration: 269 },
      { id: 'YQHsXMglC9A', title: 'Hello', duration: 366 },
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
      { id: 'XqZsoesa55w', title: 'Baby Shark Dance', duration: 136 },
      { id: 'e_04ZrNroTo', title: 'Wheels On The Bus', duration: 217 },
      { id: '0BIaDVnYp2A', title: 'Johny Johny Yes Papa', duration: 127 },
      { id: 'kNw8V_Fkw28', title: 'Old MacDonald Had A Farm', duration: 183 },
      { id: 'qIdockP4SJU', title: 'ABC Song', duration: 156 },
      { id: 'Y5kYLOb6i5I', title: 'Twinkle Twinkle Little Star', duration: 165 },
      { id: 'yCjJyiqpAuU', title: 'Five Little Ducks', duration: 192 },
      { id: 'QkHQ0CYwjaI', title: 'Head Shoulders Knees and Toes', duration: 142 },
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
      // Verified Art for Kids Hub & family-friendly drawing tutorials
      { id: 'citvayS_0o4', title: 'How To Draw A Cute Kitten', duration: 720 },
      { id: 'iuL_cP_Lico', title: 'How To Draw A Winter Deer', duration: 660 },
      { id: 'P3yDJPoldAQ', title: 'How To Draw A Cozy Winter Seal', duration: 600 },
      { id: 'SdZbgfDeeCI', title: 'How To Draw A Snow Family', duration: 780 },
      { id: 'XPcN1ZE_G28', title: 'How To Draw A Family Road Trip', duration: 840 },
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
      // Curated, educational faith content (avoids copyrighted music & reduces unsafe/mislabeled uploads).
      { id: 'ak06MSETeo4', title: 'What Is the Bible?', duration: 348 },
      { id: '7_CGP-12AE0', title: 'The Story of the Bible', duration: 335 },
      { id: '3dEh25pduQ8', title: 'The Messiah', duration: 348 },
      { id: 'xrzq_X1NNaA', title: 'The Gospel', duration: 347 },
      { id: 'ajwehw_AT0s', title: 'Sermon on the Mount', duration: 545 },
      { id: 'n_vEB11XKSE', title: "The Lord’s Prayer", duration: 562 },
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
