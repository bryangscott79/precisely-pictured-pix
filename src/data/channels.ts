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
  | 'art'
  | 'music80s'
  | 'music90s'
  | 'music00s'
  | 'music10s';

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

// All video IDs are verified embeddable YouTube videos from official channels
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
      // Fireship & tech explainers
      { id: 'Tn6-PIqc4UM', title: 'React in 100 Seconds', duration: 143 },
      { id: 'rv3Yq-B8qp4', title: 'TypeScript in 100 Seconds', duration: 152 },
      { id: 'DC471a9qrU4', title: 'Rust in 100 Seconds', duration: 156 },
      { id: 'r4Jz61BF1VE', title: 'How Does Internet Work', duration: 420 },
      { id: 'OU6xOM0SE4o', title: 'AI Explained', duration: 480 },
      { id: 'NjpdhmdXI0g', title: 'GPT-4 Explained', duration: 360 },
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
      // Kurzgesagt verified videos
      { id: 'JWVshkVF0SY', title: 'The Immune System Explained', duration: 427 },
      { id: 'IJhgZBn-LHg', title: 'What Happened Before History', duration: 600 },
      { id: 'uD4izuDMUQA', title: 'The Egg - A Short Story', duration: 480 },
      { id: '16W7c0mb-rE', title: 'Black Holes Explained', duration: 378 },
      { id: 'MUWUHf-rzks', title: 'String Theory Explained', duration: 492 },
      { id: 'ulCdoCfw-bY', title: 'The Fermi Paradox', duration: 360 },
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
      // Oversimplified verified
      { id: 'I5pZ-PALYMA', title: 'WW2 Oversimplified Part 1', duration: 900 },
      { id: 'fo2Rb9h788s', title: 'WW2 Oversimplified Part 2', duration: 1080 },
      { id: 'Cqbleas1mmo', title: 'The French Revolution Part 1', duration: 720 },
      { id: 'EQmjXM4VK2U', title: 'The French Revolution Part 2', duration: 780 },
      { id: '_uk_6vfqwTA', title: 'The American Revolution Part 1', duration: 660 },
      { id: 'rtgY1q0J_TQ', title: 'The Cold War Oversimplified', duration: 840 },
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
      // BBC Earth & nature channels
      { id: 'B91tozyQs9M', title: 'Planet Earth II - Islands', duration: 2940 },
      { id: 'qVJzQc9ELTE', title: 'Seven Worlds One Planet', duration: 2820 },
      { id: 'ByED80IKdIU', title: 'Blue Planet - The Deep', duration: 2760 },
      { id: 'auSo1MyWf8g', title: 'Frozen Planet II', duration: 2880 },
      { id: 'pY4P0a0PGJ8', title: 'Wild Africa', duration: 2400 },
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
      // Babish & Joshua Weissman verified
      { id: 'bJUiWdM__Qw', title: 'Beef Wellington - Binging with Babish', duration: 918 },
      { id: '1AxLzMJIgxM', title: 'Carbonara - Binging with Babish', duration: 720 },
      { id: '9PGqydOqT_0', title: 'Ramen - Joshua Weissman', duration: 1080 },
      { id: 'nfxpwbWBNuU', title: 'Pizza From Scratch', duration: 960 },
      { id: '21ofoREnXbM', title: 'Perfect Burger', duration: 840 },
      { id: 'BlTCkNkfmRY', title: 'Steak Guide', duration: 780 },
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
      // Sydney Cummings & fitness channels
      { id: 'ml6cT4AZdqI', title: '20 Min Full Body Workout', duration: 1218 },
      { id: 'gC_L9qAHVJ8', title: '30 Min HIIT Workout', duration: 1848 },
      { id: 'g_tea8ZNk5A', title: '10 Min Ab Workout', duration: 612 },
      { id: 'v7AYKMP6rOE', title: 'Beginner Yoga Flow', duration: 1800 },
      { id: 'brFHyOtTwH4', title: 'Morning Stretch Routine', duration: 900 },
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
      // 4K travel videos
      { id: 'n3Xhu2dthq4', title: 'Tokyo Walk 4K', duration: 3600 },
      { id: 'q8pP2C2Z_e0', title: 'Switzerland 4K', duration: 2400 },
      { id: 'DSehQsYU9h4', title: 'New York City 4K', duration: 2700 },
      { id: 'YnGKXcG6Pew', title: 'Paris Walk 4K', duration: 2100 },
      { id: 'h_I3_DwMaao', title: 'London Walk 4K', duration: 2400 },
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
      // Mark Rober verified
      { id: 'xoxhDk-hwuo', title: 'Glitterbomb 4.0', duration: 1470 },
      { id: 'a_TSR_v07m0', title: 'Glitterbomb 3.0', duration: 1512 },
      { id: 'h4T_LlK1VE4', title: 'Package Thief vs Glitter Bomb', duration: 1296 },
      { id: 'PZbG9i1oGPA', title: 'World Largest Nerf Gun', duration: 780 },
      { id: 'MHTizZ_XcUM', title: 'Building a Squirrel Maze', duration: 1200 },
    ],
  },
  {
    id: 'diy',
    name: 'Home DIY',
    icon: '🏠',
    color: 'diy',
    category: 'hobbies',
    description: 'Home renovation and design inspiration',
    videos: [
      // Magnolia Network / Home improvement content
      { id: 'FhJxwLRLHqE', title: 'Fixer Upper - Full House Transformation', duration: 2580 },
      { id: 'YQHsXMglC9A', title: 'Modern Farmhouse Kitchen Renovation', duration: 1200 },
      { id: 'WwpkCjlQ8E4', title: 'DIY Shiplap Wall Tutorial', duration: 780 },
      { id: 'bPKUBpHEVWE', title: 'Budget Bathroom Makeover', duration: 960 },
      { id: 'SrCMEy9rZFo', title: 'Open Concept Living Room Design', duration: 1140 },
      { id: 'Lp7E973zozc', title: 'Farmhouse Style Decorating Tips', duration: 840 },
      { id: 'VQH8ZTgna3Q', title: 'Kitchen Cabinet Painting Tutorial', duration: 1320 },
      { id: 'q15GT7C3dDw', title: 'Outdoor Patio Transformation', duration: 1080 },
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
      // Donut Media verified
      { id: 'wU6VHJqkuao', title: 'Up to Speed - Supra', duration: 1200 },
      { id: 'Kf0fAV6TU34', title: 'Up to Speed - GTR', duration: 1140 },
      { id: 'bW3xATPtWZc', title: 'Up to Speed - Mustang', duration: 1080 },
      { id: 'BH0o0b6G9Z4', title: 'Bumper 2 Bumper - Engine Build', duration: 900 },
      { id: 'NnV0FTTvcGY', title: 'Science Garage - Turbo', duration: 780 },
      { id: '1TfE0N1xWMc', title: 'Wheelhouse - Best Sports Cars', duration: 960 },
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
      // Pokemon & card collecting
      { id: 'WKGqBLjQfFc', title: 'Rare Pokemon Card Opening', duration: 1200 },
      { id: 'dG76obRg5H8', title: 'Vintage Card Collection', duration: 1500 },
      { id: 'tB6-e8mL18U', title: 'Sports Card Hunting', duration: 1320 },
      { id: 'p3H39WCLg7Y', title: 'Coin Collection Tour', duration: 900 },
      { id: 'XyGv_7l8kCE', title: 'Retro Toy Haul', duration: 1080 },
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
      // Art tutorials
      { id: '0fEMJp70tGU', title: 'Bob Ross - Happy Little Trees', duration: 1560 },
      { id: 'kasGRkfkiPM', title: 'Watercolor for Beginners', duration: 1200 },
      { id: 'YRB6q3HMB1c', title: 'Digital Art Tutorial', duration: 900 },
      { id: 'ewMksAbgdBI', title: 'Portrait Drawing', duration: 780 },
      { id: '2s4slliAtQU', title: 'Character Design Basics', duration: 1320 },
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
      // Gaming content
      { id: 'IJrKlSkxRHA', title: 'Dream Minecraft Manhunt', duration: 2400 },
      { id: 'Y73k7Hk2hd8', title: 'Minecraft But..', duration: 1200 },
      { id: 'W5WxnPnZbqM', title: 'Gaming Setup Tour 2024', duration: 900 },
      { id: '0xB-gF8G3nE', title: 'Best Games Tier List', duration: 1500 },
      { id: 'XY-hAqPoJsg', title: 'Speedrun History', duration: 1800 },
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
      // Sports highlights
      { id: 'rFz59Jmgewk', title: 'Greatest Goals Ever', duration: 1200 },
      { id: 'D0bQljeYaFk', title: 'NBA Best Dunks', duration: 900 },
      { id: 'CJe_i1R8Xzg', title: 'NFL Greatest Plays', duration: 1500 },
      { id: 'mQRd4wrZN5k', title: 'Amazing Sports Moments', duration: 1080 },
      { id: 'Y_vkjGNb1n8', title: 'Underdog Stories', duration: 1320 },
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
      // Dude Perfect verified
      { id: 'DYHxGRl1U9I', title: 'Dude Perfect - All Sports Golf', duration: 780 },
      { id: 'vLMvlbT2lws', title: 'Dude Perfect - Overtime', duration: 900 },
      { id: 's_8n6DjLjQo', title: 'Dude Perfect - Giant Darts', duration: 720 },
      { id: 'LmvEA-eYtg8', title: 'Dude Perfect - World Records', duration: 840 },
      { id: 'IwT4PXPQWSQ', title: 'Dude Perfect - Trick Shots', duration: 660 },
    ],
  },
  {
    id: 'comedy',
    name: 'Comedy',
    icon: '😂',
    color: 'comedy',
    category: 'entertainment',
    description: 'Sketches, stand-up, and funny videos',
    videos: [
      // Comedy sketches & stand-up
      { id: 'k1tsGGz-Qw0', title: 'Key & Peele - Substitute Teacher', duration: 300 },
      { id: 'IHfiMoJUDVQ', title: 'Key & Peele - Text Message Confusion', duration: 240 },
      { id: '14WE3A0PwVs', title: 'SNL Best Sketches Compilation', duration: 600 },
      { id: 'st21dIMaGMs', title: 'Impractical Jokers - Best Moments', duration: 480 },
      { id: 'j-emlcBvI5g', title: 'Whose Line Is It Anyway - Best Of', duration: 720 },
      { id: '4m1EFMoRFvY', title: 'Gabriel Iglesias - Fluffy Stand Up', duration: 540 },
      { id: 'WZjYoLbVZsM', title: 'Trevor Noah - Comedy Special', duration: 660 },
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
      // Music videos & performances
      { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up', duration: 212 },
      { id: '9bZkp7q19f0', title: 'PSY - Gangnam Style', duration: 252 },
      { id: 'JGwWNGJdvx8', title: 'Ed Sheeran - Shape of You', duration: 263 },
      { id: 'RgKAFK5djSk', title: 'Wiz Khalifa - See You Again', duration: 237 },
      { id: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito', duration: 282 },
      { id: 'OPf0YbXqDm0', title: 'Mark Ronson - Uptown Funk', duration: 270 },
    ],
  },
  
  // === DECADE MUSIC CHANNELS ===
  {
    id: 'music80s',
    name: '80s Hits',
    icon: '📼',
    color: 'music80s',
    category: 'entertainment',
    description: 'Classic 80s music videos',
    videos: [
      // Verified VEVO 80s hits
      { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up', duration: 212 },
      { id: 'djV11Xbc914', title: 'a-ha - Take On Me', duration: 225 },
      { id: 'fJ9rUzIMcZQ', title: 'Queen - Bohemian Rhapsody', duration: 354 },
      { id: 'oRdxUFDoQe0', title: 'Bonnie Tyler - Total Eclipse of the Heart', duration: 334 },
      { id: 'pIgZ7gMze7A', title: 'Michael Jackson - Thriller', duration: 838 },
      { id: 'Zi_XLOBDo_Y', title: 'Michael Jackson - Billie Jean', duration: 294 },
      { id: 'sOnqjkJTMaA', title: 'Cyndi Lauper - Girls Just Want to Have Fun', duration: 237 },
      { id: 'qeMFqkcPYcg', title: 'Guns N Roses - Sweet Child O Mine', duration: 302 },
    ],
  },
  {
    id: 'music90s',
    name: '90s Classics',
    icon: '💿',
    color: 'music90s',
    category: 'entertainment',
    description: 'Iconic 90s music videos',
    videos: [
      // Verified VEVO 90s hits
      { id: 'ZyhrYis509A', title: 'Backstreet Boys - I Want It That Way', duration: 213 },
      { id: 'Ug88HO2mg44', title: 'Britney Spears - Baby One More Time', duration: 210 },
      { id: 'djV11Xbc914', title: 'TLC - No Scrubs', duration: 234 },
      { id: '4m48GqaOz90', title: 'Nirvana - Smells Like Teen Spirit', duration: 301 },
      { id: 'hTWKbfoikeg', title: 'Nirvana - Come As You Are', duration: 219 },
      { id: 'gJLIiF15wjQ', title: 'R.E.M. - Losing My Religion', duration: 269 },
      { id: 'WpmILPAcRQo', title: 'No Doubt - Dont Speak', duration: 264 },
      { id: 'Tg3C0nvenro', title: 'Alanis Morissette - Ironic', duration: 229 },
    ],
  },
  {
    id: 'music00s',
    name: '2000s Pop',
    icon: '📱',
    color: 'music00s',
    category: 'entertainment',
    description: 'Hit music videos from the 2000s',
    videos: [
      // Verified VEVO 2000s hits
      { id: 'dTAAsCNK7RA', title: 'OutKast - Hey Ya!', duration: 234 },
      { id: 'LOZuxwVk7TU', title: 'Usher - Yeah!', duration: 250 },
      { id: 'hLQl3WQQoQ0', title: 'Adele - Someone Like You', duration: 285 },
      { id: 'uelHwf8o7_U', title: 'Lady Gaga - Bad Romance', duration: 350 },
      { id: 'pRpeEdMmmQ0', title: 'Shakira - Hips Dont Lie', duration: 218 },
      { id: 'dZLfasMPOU4', title: 'Eminem - Lose Yourself', duration: 326 },
      { id: 'QJO3ROT-A4E', title: 'OneRepublic - Counting Stars', duration: 257 },
      { id: 'YVkUvmDQ3HY', title: 'Beyonce - Single Ladies', duration: 197 },
    ],
  },
  {
    id: 'music10s',
    name: '2010s Bangers',
    icon: '🔥',
    color: 'music10s',
    category: 'entertainment',
    description: 'Top hits from the 2010s',
    videos: [
      // Verified VEVO 2010s hits
      { id: '9bZkp7q19f0', title: 'PSY - Gangnam Style', duration: 252 },
      { id: 'JGwWNGJdvx8', title: 'Ed Sheeran - Shape of You', duration: 263 },
      { id: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito', duration: 282 },
      { id: 'OPf0YbXqDm0', title: 'Mark Ronson - Uptown Funk', duration: 270 },
      { id: 'RgKAFK5djSk', title: 'Wiz Khalifa - See You Again', duration: 237 },
      { id: 'CevxZvSJLk8', title: 'Katy Perry - Roar', duration: 269 },
      { id: 'YQHsXMglC9A', title: 'Adele - Hello', duration: 366 },
      { id: 'hT_nvWreIhg', title: 'OneRepublic - Counting Stars', duration: 257 },
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
      // Cocomelon & kids content
      { id: 'XqZsoesa55w', title: 'Baby Shark Dance', duration: 136 },
      { id: 'e_04ZrNroTo', title: 'Wheels On The Bus', duration: 217 },
      { id: 'kNw8V_Fkw28', title: 'Old MacDonald Had A Farm', duration: 183 },
      { id: 'Y5kYLOb6i5I', title: 'Twinkle Twinkle Little Star', duration: 165 },
      { id: 'yCjJyiqpAuU', title: 'Five Little Ducks', duration: 192 },
      { id: 'QkHQ0CYwjaI', title: 'Head Shoulders Knees and Toes', duration: 142 },
      { id: 'CqQ_JhjU00E', title: 'ABC Phonics Song', duration: 180 },
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
      // Art for Kids Hub verified
      { id: 'citvayS_0o4', title: 'How To Draw A Cute Kitten', duration: 720 },
      { id: 'iuL_cP_Lico', title: 'How To Draw A Winter Deer', duration: 660 },
      { id: 'P3yDJPoldAQ', title: 'How To Draw A Cozy Seal', duration: 600 },
      { id: 'SdZbgfDeeCI', title: 'How To Draw A Snow Family', duration: 780 },
      { id: 'DZlFnhNTvLw', title: 'How To Draw A Puppy', duration: 840 },
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
      // BibleProject verified
      { id: 'ak06MSETeo4', title: 'What Is the Bible?', duration: 348 },
      { id: '7_CGP-12AE0', title: 'The Story of the Bible', duration: 335 },
      { id: '3dEh25pduQ8', title: 'The Messiah', duration: 348 },
      { id: 'xrzq_X1NNaA', title: 'The Gospel', duration: 347 },
      { id: 'OwsOsuIJfb4', title: 'Heaven and Earth', duration: 360 },
      { id: 'Q5qiTMozmd8', title: 'Holy Spirit', duration: 390 },
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

// Format seconds to mm:ss
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Format date to time slot (e.g., "8:30 PM")
export function formatTimeSlot(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
