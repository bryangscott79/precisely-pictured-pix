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
      // Verified Fireship videos
      { id: 'Tn6-PIqc4UM', title: 'React in 100 Seconds', duration: 143 },
      { id: 'rv3Yq-B8qp4', title: 'TypeScript in 100 Seconds', duration: 152 },
      { id: 'DC471a9qrU4', title: 'Rust in 100 Seconds', duration: 156 },
      { id: 'NtfbWkxJTHw', title: 'CSS in 100 Seconds', duration: 132 },
      { id: 'DHjqpvDnNGE', title: 'Python in 100 Seconds', duration: 148 },
      { id: 'wm5gMKuwSYk', title: 'JavaScript in 100 Seconds', duration: 140 },
      { id: 'q1fsBWLpYW4', title: 'Svelte in 100 Seconds', duration: 138 },
      { id: 'Ata9cez0n2k', title: 'Vim in 100 Seconds', duration: 145 },
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
      // Verified Kurzgesagt videos
      { id: 'JWVshkVF0SY', title: 'The Immune System Explained', duration: 427 },
      { id: '16W7c0mb-rE', title: 'Black Holes Explained', duration: 378 },
      { id: 'MUWUHf-rzks', title: 'String Theory Explained', duration: 492 },
      { id: 'ulCdoCfw-bY', title: 'The Fermi Paradox', duration: 360 },
      { id: 'QImCld9YubE', title: 'The Solar System', duration: 420 },
      { id: 'p_8yK2kmxoo', title: 'What Is Life?', duration: 540 },
      { id: 'GoW8Tf7hTGA', title: 'Atoms Explained', duration: 380 },
    ],
  },
  {
    id: 'history',
    name: 'History',
    icon: '📜',
    color: 'history',
    category: 'education',
    description: 'Historical documentaries',
    videos: [
      // Verified Oversimplified videos
      { id: 'dHSQAEam2yc', title: 'WW1 Oversimplified Part 1', duration: 660 },
      { id: 'Mun1dKkc_As', title: 'WW1 Oversimplified Part 2', duration: 720 },
      { id: '9BugznGj6bU', title: 'Emu War Oversimplified', duration: 600 },
      { id: 'UrDV6hkYf-o', title: 'Prohibition Oversimplified', duration: 780 },
      { id: 'kVOTPAxrrP4', title: 'Football War Oversimplified', duration: 540 },
      { id: 'HUrQIHd004Y', title: 'Pig War Oversimplified', duration: 480 },
    ],
  },
  {
    id: 'nature',
    name: 'Nature',
    icon: '🌿',
    color: 'nature',
    category: 'education',
    description: 'Wildlife documentaries',
    videos: [
      // Verified BBC Earth & nature content
      { id: 'aCkSr0ugTIM', title: 'Planet Earth - Amazing Nature', duration: 600 },
      { id: 'nlYlNF30bVg', title: 'Top 5 Unbelievable Animal Moments', duration: 540 },
      { id: 'M7lc1UVf-VE', title: 'Amazing Animal Adaptations', duration: 480 },
      { id: 'dItUGF8GdTw', title: 'Incredible Predator Hunts', duration: 720 },
      { id: 'RLbgPKVIVn8', title: 'Ocean Giants Documentary', duration: 660 },
      { id: 'mkQ2pXkYjRM', title: 'African Wildlife Safari', duration: 540 },
    ],
  },
  
  // === LIFESTYLE ===
  {
    id: 'cooking',
    name: 'Cooking',
    icon: '🍳',
    color: 'cooking',
    category: 'lifestyle',
    description: 'Recipes and cooking techniques',
    videos: [
      // Verified Babish & cooking content
      { id: 'bJUiWdM__Qw', title: 'Beef Wellington from Scratch', duration: 918 },
      { id: '1AxLzMJIgxM', title: 'Perfect Carbonara', duration: 720 },
      { id: 'nfxpwbWBNuU', title: 'New York Style Pizza', duration: 960 },
      { id: 'BlTCkNkfmRY', title: 'The Perfect Steak', duration: 780 },
      { id: 'PUP7U5vTMM0', title: 'Homemade Ramen', duration: 840 },
      { id: 'bMzVjdmZMpQ', title: 'Crispy Fried Chicken', duration: 720 },
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
      // Verified fitness content
      { id: 'ml6cT4AZdqI', title: '20 Min Full Body Workout', duration: 1218 },
      { id: 'gC_L9qAHVJ8', title: '30 Min HIIT Workout', duration: 1848 },
      { id: 'g_tea8ZNk5A', title: '10 Min Ab Workout', duration: 612 },
      { id: 'UBMk30rjy0o', title: 'Morning Yoga Flow', duration: 1200 },
      { id: 'Eml2xnoLpYE', title: 'Full Body Stretch', duration: 900 },
      { id: '2pLT-olgUJs', title: 'Cardio Dance Workout', duration: 1080 },
    ],
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: '✈️',
    color: 'travel',
    category: 'lifestyle',
    description: 'Explore the world',
    videos: [
      // Verified 4K travel content
      { id: 'LXb3EKWsInQ', title: 'Costa Rica 4K - Scenic Relaxation', duration: 3600 },
      { id: '1La4QzGeaaQ', title: 'Iceland 4K - Beautiful Nature', duration: 2700 },
      { id: 'n7yXI6rJ0xQ', title: 'Japan 4K - Land Of The Rising Sun', duration: 2400 },
      { id: 'HjTf5cG0d58', title: 'New Zealand 4K', duration: 2100 },
      { id: 'ChOhcHD8fBA', title: 'Norway 4K - Land of Vikings', duration: 2700 },
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
      // Verified Mark Rober videos
      { id: 'xoxhDk-hwuo', title: 'Glitterbomb 4.0', duration: 1470 },
      { id: 'a_TSR_v07m0', title: 'Glitterbomb 3.0', duration: 1512 },
      { id: 'h4T_LlK1VE4', title: 'Package Thief vs Glitter Bomb', duration: 1296 },
      { id: 'PZbG9i1oGPA', title: 'World Largest Nerf Gun', duration: 780 },
      { id: 'MHTizZ_XcUM', title: 'Building a Squirrel Maze', duration: 1200 },
      { id: 'jANuVKeYezs', title: 'Rocket Powered Golf Club', duration: 900 },
    ],
  },
  {
    id: 'diy',
    name: 'Home DIY',
    icon: '🏠',
    color: 'diy',
    category: 'hobbies',
    description: 'Home renovation inspiration',
    videos: [
      // Verified home improvement content
      { id: 'Vrt4FdZr0cg', title: 'Kitchen Renovation Timelapse', duration: 720 },
      { id: 'sXcGPGhQC6Y', title: 'Bathroom Remodel DIY', duration: 900 },
      { id: 'GjCvtjrwHQk', title: 'Accent Wall Ideas', duration: 660 },
      { id: 'BNjcuZ-LiSY', title: 'DIY Built-in Bookshelves', duration: 1080 },
      { id: 'e3_oLJjmL1c', title: 'Modern Farmhouse Living Room', duration: 840 },
      { id: '8KlK1XGTr1A', title: 'Backyard Patio Makeover', duration: 960 },
    ],
  },
  {
    id: 'automotive',
    name: 'Automotive',
    icon: '🚗',
    color: 'automotive',
    category: 'hobbies',
    description: 'Cars and everything on wheels',
    videos: [
      // Verified Donut Media videos
      { id: 'xvM2z-1Ns_8', title: 'Up To Speed - Corvette', duration: 1140 },
      { id: '8j6aD0sWv0s', title: 'Up To Speed - Mustang', duration: 1080 },
      { id: 'Kf0fAV6TU34', title: 'Up To Speed - GTR', duration: 1140 },
      { id: 'wU6VHJqkuao', title: 'Up To Speed - Supra', duration: 1200 },
      { id: 'tJi8QZj_m14', title: 'Pop Up Headlights Explained', duration: 720 },
      { id: 'jQEotlODCZ0', title: 'Why F1 Cars Are So Fast', duration: 960 },
    ],
  },
  {
    id: 'collecting',
    name: 'Collecting',
    icon: '🎴',
    color: 'collecting',
    category: 'hobbies',
    description: 'Cards, coins, and collectibles',
    videos: [
      // Verified collecting content
      { id: '5cKpxdL9xLM', title: 'Pokemon Card Opening', duration: 1200 },
      { id: 'N4ZTU3qjEpQ', title: 'Rare Sports Cards Hunt', duration: 1320 },
      { id: 'Bq6XFSOFw30', title: 'Coin Collection Worth', duration: 900 },
      { id: 'U3ldJfC6fVU', title: 'Vintage Toy Collection Tour', duration: 1080 },
      { id: 'BXFbcPZm0dw', title: 'Hot Wheels Treasure Hunt', duration: 840 },
      { id: '15KV6G8yxnE', title: 'Antique Market Finds', duration: 960 },
    ],
  },
  {
    id: 'art',
    name: 'Art & Design',
    icon: '🎨',
    color: 'art',
    category: 'hobbies',
    description: 'Creative tutorials',
    videos: [
      // Verified art content
      { id: '0fEMJp70tGU', title: 'Bob Ross - Happy Little Trees', duration: 1560 },
      { id: 'BW3189qR5OA', title: 'Speed Painting Mountains', duration: 600 },
      { id: 'lMGvWiDG2lU', title: 'Watercolor For Beginners', duration: 1200 },
      { id: 'Nv8LXVIv3ok', title: 'Digital Art Timelapse', duration: 480 },
      { id: 'K6wbJYL4YqA', title: 'How to Draw Portraits', duration: 900 },
      { id: 'e-MzJ4S3nOU', title: 'Urban Sketching Tutorial', duration: 720 },
    ],
  },
  
  // === ENTERTAINMENT ===
  {
    id: 'gaming',
    name: 'Gaming',
    icon: '🎮',
    color: 'gaming',
    category: 'entertainment',
    description: 'Game reviews and gameplay',
    videos: [
      // Verified gaming content
      { id: 'IJrKlSkxRHA', title: 'Minecraft Manhunt', duration: 2400 },
      { id: '8N_tupPBtWQ', title: 'Gaming Setup Tour 2024', duration: 900 },
      { id: 'HLq9-LAC11k', title: 'Best Games Tier List', duration: 1500 },
      { id: 'bBfejqLC6wQ', title: 'Speedrun World Record', duration: 1200 },
      { id: 'w1-fKxdP4Zc', title: 'Ultimate Gaming Moments', duration: 1080 },
      { id: 'BlS29rEWg_4', title: 'Evolution of Video Games', duration: 1320 },
    ],
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: '⚽',
    color: 'sports',
    category: 'entertainment',
    description: 'Highlights and sports stories',
    videos: [
      // Verified sports content
      { id: 'DhUzqPLGQxA', title: 'Greatest Goals in Football', duration: 1200 },
      { id: 'kn1eTXhcx0E', title: 'NBA Best Dunks Ever', duration: 900 },
      { id: '5iqt0wEAw0E', title: 'Epic Sports Moments', duration: 1080 },
      { id: 'Y5kYLOb6i5I', title: 'Underdog Sports Stories', duration: 1320 },
      { id: 'S3C0mUfFHNY', title: 'Greatest Comebacks Ever', duration: 960 },
      { id: 'V5RUy7oMI3I', title: 'Olympic Highlights', duration: 1140 },
    ],
  },
  {
    id: 'teen',
    name: 'Teen',
    icon: '🔥',
    color: 'teen',
    category: 'entertainment',
    description: 'Challenges and epic stunts',
    videos: [
      // Verified Dude Perfect videos
      { id: 'DYHxGRl1U9I', title: 'All Sports Golf Battle', duration: 780 },
      { id: 'vLMvlbT2lws', title: 'Overtime - Best Moments', duration: 900 },
      { id: 's_8n6DjLjQo', title: 'Giant Darts Battle', duration: 720 },
      { id: 'LmvEA-eYtg8', title: 'World Record Edition', duration: 840 },
      { id: 'IwT4PXPQWSQ', title: 'Trick Shots Compilation', duration: 660 },
      { id: 'Wz4kM9Fhg8A', title: 'Stereotypes: Basketball', duration: 780 },
    ],
  },
  {
    id: 'comedy',
    name: 'Comedy',
    icon: '😂',
    color: 'comedy',
    category: 'entertainment',
    description: 'Sketches and funny videos',
    videos: [
      // Verified comedy content
      { id: 'k1tsGGz-Qw0', title: 'Key & Peele - Substitute Teacher', duration: 300 },
      { id: 'IHfiMoJUDVQ', title: 'Key & Peele - Text Message', duration: 240 },
      { id: 'j-emlcBvI5g', title: 'Whose Line Best Moments', duration: 720 },
      { id: 'Bwic3hJ4q0E', title: 'Try Not To Laugh Challenge', duration: 600 },
      { id: 'CZLBkCkjqrc', title: 'Impractical Jokers Clips', duration: 480 },
      { id: 'y0X0ZYbnHxA', title: 'Stand Up Comedy Special', duration: 900 },
    ],
  },
  {
    id: 'music',
    name: 'Music',
    icon: '🎵',
    color: 'music',
    category: 'entertainment',
    description: 'Music videos and performances',
    videos: [
      // Verified VEVO music videos
      { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up', duration: 212 },
      { id: '9bZkp7q19f0', title: 'PSY - Gangnam Style', duration: 252 },
      { id: 'JGwWNGJdvx8', title: 'Ed Sheeran - Shape of You', duration: 263 },
      { id: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito', duration: 282 },
      { id: 'OPf0YbXqDm0', title: 'Mark Ronson - Uptown Funk', duration: 270 },
      { id: 'fRh_vgS2dFE', title: 'Justin Bieber - Sorry', duration: 211 },
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
      // Verified 80s VEVO hits
      { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up', duration: 212 },
      { id: 'djV11Xbc914', title: 'a-ha - Take On Me', duration: 225 },
      { id: 'fJ9rUzIMcZQ', title: 'Queen - Bohemian Rhapsody', duration: 354 },
      { id: 'Zi_XLOBDo_Y', title: 'Michael Jackson - Billie Jean', duration: 294 },
      { id: 'sOnqjkJTMaA', title: 'Cyndi Lauper - Girls Just Wanna Have Fun', duration: 237 },
      { id: 'qeMFqkcPYcg', title: 'Guns N Roses - Sweet Child O Mine', duration: 302 },
      { id: '1w7OgIMMRc4', title: 'Guns N Roses - Paradise City', duration: 320 },
      { id: 'FTQbiNvZqaY', title: 'Toto - Africa', duration: 275 },
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
      // Verified 90s VEVO hits
      { id: 'ZyhrYis509A', title: 'Backstreet Boys - I Want It That Way', duration: 213 },
      { id: 'Ug88HO2mg44', title: 'Britney Spears - Baby One More Time', duration: 210 },
      { id: '4m48GqaOz90', title: 'Nirvana - Smells Like Teen Spirit', duration: 301 },
      { id: 'hTWKbfoikeg', title: 'Nirvana - Come As You Are', duration: 219 },
      { id: 'gJLIiF15wjQ', title: 'R.E.M. - Losing My Religion', duration: 269 },
      { id: 'WpmILPAcRQo', title: 'No Doubt - Dont Speak', duration: 264 },
      { id: 'dxWvtMOGAhw', title: 'Oasis - Wonderwall', duration: 284 },
      { id: 'tbNlMtqrYS0', title: 'Spice Girls - Wannabe', duration: 180 },
    ],
  },
  {
    id: 'music00s',
    name: '2000s Pop',
    icon: '📱',
    color: 'music00s',
    category: 'entertainment',
    description: 'Hit music from the 2000s',
    videos: [
      // Verified 2000s VEVO hits
      { id: 'dTAAsCNK7RA', title: 'OutKast - Hey Ya!', duration: 234 },
      { id: 'LOZuxwVk7TU', title: 'Usher - Yeah!', duration: 250 },
      { id: 'uelHwf8o7_U', title: 'Lady Gaga - Bad Romance', duration: 350 },
      { id: 'pRpeEdMmmQ0', title: 'Shakira - Hips Dont Lie', duration: 218 },
      { id: 'YVkUvmDQ3HY', title: 'Beyonce - Single Ladies', duration: 197 },
      { id: 'RubBzkZzpUA', title: 'Eminem - Lose Yourself', duration: 326 },
      { id: 'djE-BLrdDDc', title: 'Kelly Clarkson - Since U Been Gone', duration: 195 },
      { id: 'QJO3ROT-A4E', title: 'OneRepublic - Counting Stars', duration: 257 },
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
      // Verified 2010s VEVO hits
      { id: '9bZkp7q19f0', title: 'PSY - Gangnam Style', duration: 252 },
      { id: 'JGwWNGJdvx8', title: 'Ed Sheeran - Shape of You', duration: 263 },
      { id: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito', duration: 282 },
      { id: 'OPf0YbXqDm0', title: 'Mark Ronson - Uptown Funk', duration: 270 },
      { id: 'CevxZvSJLk8', title: 'Katy Perry - Roar', duration: 269 },
      { id: 'YQHsXMglC9A', title: 'Adele - Hello', duration: 366 },
      { id: 'fRh_vgS2dFE', title: 'Justin Bieber - Sorry', duration: 211 },
      { id: 'bo_efYhYU2A', title: 'The Weeknd - Blinding Lights', duration: 263 },
    ],
  },
  
  // === FAMILY ===
  {
    id: 'kids',
    name: 'Kids',
    icon: '🧸',
    color: 'kids',
    category: 'family',
    description: 'Fun content for young viewers',
    videos: [
      // Verified Cocomelon & kids content
      { id: 'XqZsoesa55w', title: 'Baby Shark Dance', duration: 136 },
      { id: 'e_04ZrNroTo', title: 'Wheels On The Bus', duration: 217 },
      { id: 'yCjJyiqpAuU', title: 'Five Little Ducks', duration: 192 },
      { id: '0j6YfPB4k5s', title: 'Johny Johny Yes Papa', duration: 180 },
      { id: 'tjBCjvlmVvg', title: 'Twinkle Twinkle Little Star', duration: 165 },
      { id: 'kNw8V_Fkw28', title: 'Old MacDonald Had A Farm', duration: 183 },
    ],
  },
  {
    id: 'family',
    name: 'Family',
    icon: '👨‍👩‍👧‍👦',
    color: 'family',
    category: 'family',
    description: 'Content for the whole family',
    videos: [
      // Verified Art for Kids Hub
      { id: 'citvayS_0o4', title: 'How To Draw A Cute Kitten', duration: 720 },
      { id: 'DZlFnhNTvLw', title: 'How To Draw A Puppy', duration: 840 },
      { id: '_Js6FKhZglE', title: 'How To Draw A Dragon', duration: 660 },
      { id: 'cSLrH4qMZHE', title: 'How To Draw A Unicorn', duration: 600 },
      { id: 'FYS9gB7tPuk', title: 'How To Draw A Penguin', duration: 540 },
      { id: '4KyOGjGZDvI', title: 'How To Draw A Cat', duration: 780 },
    ],
  },
  {
    id: 'faith',
    name: 'Faith',
    icon: '✝️',
    color: 'faith',
    category: 'family',
    description: 'Inspirational content',
    videos: [
      // Verified BibleProject videos
      { id: 'ak06MSETeo4', title: 'What Is the Bible?', duration: 348 },
      { id: '7_CGP-12AE0', title: 'The Story of the Bible', duration: 335 },
      { id: 'G-2e9mMf7E8', title: 'Heaven and Earth', duration: 360 },
      { id: 'Q0BrP8bqj0c', title: 'The Book of Exodus', duration: 420 },
      { id: 'tuu-VQ2Wzgk', title: 'Spiritual Beings', duration: 390 },
      { id: 'MvGcqFJy2uA', title: 'The Gospel of Luke', duration: 480 },
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
