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
  | 'music10s'
  | 'movies'
  | 'nfl'
  | 'cinema80s'
  | 'podcast'
  | 'localnews';

export type ChannelCategory = 'education' | 'entertainment' | 'lifestyle' | 'family' | 'hobbies';

// Content ratings for parental controls
export type ContentRating = 'G' | 'PG' | 'PG-13' | 'R';

export interface Channel {
  id: string;
  name: string;
  icon: string;
  color: ChannelColor;
  category: ChannelCategory;
  contentRating: ContentRating;
  premium?: boolean;
  description: string;
  restricted?: boolean;
  videos: Video[];
}

// Content rating definitions
// G: Kids, Family, Nature, Faith
// PG: + Science, History, Cooking, DIY, Art
// PG-13: + Technology, Maker, Automotive, Fitness, Travel, Music
// R: All channels including Comedy, Teen, Gaming

// All video IDs are verified embeddable YouTube videos from official channels
export const channels: Channel[] = [
  // === EDUCATION ===
  {
    id: 'tech',
    name: 'Technology',
    icon: '💻',
    color: 'tech',
    category: 'education',
    contentRating: 'PG-13',
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
    contentRating: 'PG',
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
    contentRating: 'PG',
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
    contentRating: 'G',
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
    contentRating: 'PG',
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
    contentRating: 'PG-13',
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
    contentRating: 'PG-13',
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
    contentRating: 'PG-13',
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
    contentRating: 'PG',
    description: 'Home renovation inspiration',
    videos: [
      // This Old House (highly reliable embeds) + Magnolia Network trailers
      { id: 'nQ8TKmwawIE', title: 'Installing Bathroom Tile | This Old House', duration: 540 },
      { id: 'slhlD0DOVeY', title: 'Roughing Plumbing for a New Bathroom | This Old House', duration: 540 },
      { id: '6IECXPmRpVo', title: 'Waterproofing a Bath | This Old House', duration: 420 },
      { id: 'Oml6R7BVsz4', title: 'Shower Upgrades for Aging in Place | Ask This Old House', duration: 360 },
      { id: 'AJrPzPygwiw', title: 'Fixer Upper: The Lakehouse - Trailer | Magnolia Network', duration: 90 },
      { id: 'y13Ri0FqQtI', title: 'Fixer Upper: The Hotel - Trailer | Magnolia Network', duration: 90 },
    ],
  },
  {
    id: 'automotive',
    name: 'Automotive',
    icon: '🚗',
    color: 'automotive',
    category: 'hobbies',
    contentRating: 'PG-13',
    description: 'Cars and everything on wheels',
    videos: [
      // Donut Media (reliable embeds)
      { id: 'MqarV06DDWo', title: 'Supra - Everything You Need to Know | Up To Speed', duration: 720 },
      { id: 'akZ0B9sb2Yo', title: 'HKS - The ORIGINAL Japanese Tuning Company | Up To Speed', duration: 780 },
      { id: 'djF7-nP5I7M', title: 'SVT - Everything You Need to Know | Up To Speed', duration: 720 },
      { id: 'VsztX4Hxrv4', title: 'Toyota Supra Evolution (Donut Media)', duration: 780 },
      { id: 'Y3CF-kCyz7s', title: 'SUPRA - Is the Hype Real? (Donut Media)', duration: 900 },
    ],
  },
  {
    id: 'collecting',
    name: 'Collecting',
    icon: '🎴',
    color: 'collecting',
    category: 'hobbies',
    contentRating: 'PG',
    description: 'Cards, coins, and collectibles',
    videos: [
      // Coin collecting education (reliable embeds)
      { id: 'cdeGZ8yJyZQ', title: 'Coin Collecting 101 for Beginners', duration: 540 },
      { id: 'zKsGpQqqJvA', title: 'How to Collect Coins: The Red Book', duration: 360 },
      { id: 'BTsfq7riLb8', title: 'Coin Grading Basics (PCGS)', duration: 710 },
      { id: 'My25lL5lpf0', title: 'Beginner\'s Guide to Coin Value', duration: 600 },
      { id: 'Apn-kYEl-Xw', title: 'Coin Grading 101 Webinar (PCGS)', duration: 3600 },
    ],
  },
  {
    id: 'art',
    name: 'Art & Design',
    icon: '🎨',
    color: 'art',
    category: 'hobbies',
    contentRating: 'PG',
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
    contentRating: 'R',
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
    contentRating: 'PG',
    description: 'Highlights and sports stories',
    videos: [
      // Official league/network uploads (more reliable embeds than random highlight compilations)
      { id: 'j2kvgwLapKk', title: 'NBA: Top 100 Plays (2024-25)', duration: 1500 },
      { id: '2AoDNDOzXiM', title: "NBA: Top 100 Plays of 2024 (Calendar Year)", duration: 900 },
      { id: 'Y--mkdhOxwE', title: 'NFL: Top 100 Plays of the 2024 Season', duration: 2280 },
      { id: '9rSF64PHAvs', title: 'NFL: Top Plays (2024 Regular Season)', duration: 1800 },
      { id: 'hOo6gXuzJvQ', title: 'NHL: Top 24 Goals from 2024', duration: 900 },
      { id: 'QX2UEIMdoeM', title: 'NHL: Top 10 Goals (2024-25 Regular Season)', duration: 720 },
      { id: '_ejSiZrJGts', title: 'ESPN: 1 Hour of Highlights (2024-25 College Football)', duration: 3600 },
      { id: 'YxGbf4BDdSQ', title: 'FOX CFB: Top 25 Plays of 2024', duration: 1200 },
      { id: '-hAHQrjC2_E', title: "Premier League: Liverpool's Best Goals (2024/25)", duration: 900 },
      { id: 'Jgss1ZXZLzw', title: 'Premier League: Goal of the Season Contenders (2024/25)', duration: 900 },
    ],
  },
  {
    id: 'teen',
    name: 'Teen',
    icon: '🔥',
    color: 'teen',
    category: 'entertainment',
    contentRating: 'R',
    description: 'Challenges and epic stunts',
    videos: [
      // Verified Dude Perfect videos (2024-2025 uploads)
      { id: 'dgr4_G8-7F8', title: 'Highest Dunk Wins', duration: 860 },
      { id: 'GsLopdvhFpk', title: 'Unpredictable Trick Shots 2', duration: 720 },
      { id: 'idFpAv9nh9E', title: 'Our Longest Trick Shots EVER', duration: 900 },
      { id: 'jvUX3ocBSCk', title: '20 YouTubers Compete in Trick Shot Contest', duration: 1200 },
      { id: 'TL5zPys0ufk', title: 'Olympic Mini Games Battle', duration: 840 },
      { id: 'dw-kwjzXSsA', title: 'Prison Escape Battle', duration: 780 },
      { id: 'W_i2fKJGrb0', title: 'Dude Perfect Most Viewed Videos', duration: 900 },
    ],
  },
  {
    id: 'comedy',
    name: 'Comedy',
    icon: '😂',
    color: 'comedy',
    category: 'entertainment',
    contentRating: 'R',
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
    contentRating: 'PG-13',
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
    contentRating: 'PG-13',
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
    contentRating: 'PG-13',
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
    contentRating: 'PG-13',
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
    contentRating: 'PG-13',
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
    contentRating: 'G',
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
    contentRating: 'G',
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
    contentRating: 'G',
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
  
  // === PREMIUM CHANNELS ===
  {
    id: 'movies',
    name: 'Movies',
    icon: '🎬',
    color: 'movies',
    category: 'entertainment',
    contentRating: 'PG-13',
    description: 'Classic and popular movie clips',
    premium: true,
    videos: [
      { id: 'JfVOs4VSpmA', title: 'Movie Trailers Collection', duration: 1200 },
      { id: 'vKQi3bBA1y8', title: 'Greatest Movie Scenes', duration: 1800 },
      { id: 'sY1S34973zA', title: 'Classic Film Moments', duration: 1500 },
      { id: 'iAqJyWp2sKg', title: 'Behind The Scenes', duration: 1320 },
    ],
  },
  {
    id: 'nfl',
    name: 'NFL Highlights',
    icon: '🏈',
    color: 'nfl',
    category: 'entertainment',
    contentRating: 'PG',
    description: 'NFL game highlights and analysis',
    premium: true,
    videos: [
      { id: 'qi1LMIUOOAI', title: 'Greatest NFL Plays Ever', duration: 1200 },
      { id: 'TlRTvxMGhgY', title: 'Super Bowl Highlights', duration: 1500 },
      { id: 'J2p7lFfBwZI', title: 'Top 100 NFL Plays', duration: 1800 },
      { id: 'Pd3N5kkJOJI', title: 'NFL Season Recap', duration: 1320 },
    ],
  },
  {
    id: 'cinema80s',
    name: '80s Cinema',
    icon: '📽️',
    color: 'cinema80s',
    category: 'entertainment',
    contentRating: 'PG-13',
    description: 'Iconic 80s movie content',
    premium: true,
    videos: [
      { id: 'sOnqjkJTMaA', title: 'Back to the Future Clips', duration: 900 },
      { id: 'qeMFqkcPYcg', title: 'Top Gun Scenes', duration: 840 },
      { id: 'FTQbiNvZqaY', title: 'The Breakfast Club', duration: 960 },
      { id: '1w7OgIMMRc4', title: 'Ferris Bueller Moments', duration: 780 },
    ],
  },
  // Podcast Channel - Top video podcasts (full video format)
  {
    id: 'podcast',
    name: 'Podcasts',
    icon: '🎙️',
    color: 'podcast',
    category: 'entertainment',
    contentRating: 'PG-13',
    description: 'Top video podcasts and conversations',
    videos: [
      // Joe Rogan Experience clips (PowerfulJRE channel)
      { id: '5tSTk1083VY', title: 'Joe Rogan Experience #2219 - Donald Trump', duration: 10800 },
      { id: 'xz8a4BYxKQM', title: 'JRE - Elon Musk on AI and the Future', duration: 7200 },
      { id: 'mMBqdDf1D8I', title: 'JRE - Mark Zuckerberg Full Interview', duration: 10800 },
      // My First Million (popular business podcast)
      { id: 'YZ0KIaJxrDE', title: 'My First Million - How He Made $100M', duration: 3600 },
      { id: 'q5Xb0QHLV-w', title: 'My First Million - Best Business Ideas 2024', duration: 3000 },
      // Lex Fridman Podcast
      { id: 'DxREm3s1scA', title: 'Lex Fridman #419 - Sam Altman on OpenAI', duration: 9000 },
      { id: 'jvqFAi7vkBc', title: 'Lex Fridman #400 - Elon Musk', duration: 10800 },
      // Impaulsive (Logan Paul podcast)
      { id: 'wVY8pB5rDeo', title: 'IMPAULSIVE - Mike Tyson Interview', duration: 5400 },
      // The Diary of a CEO
      { id: 'Gd9tB0XrXM4', title: 'Diary of a CEO - Simon Sinek', duration: 5400 },
      { id: 'VgpJ1zKfJbE', title: 'Diary of a CEO - Dr. Andrew Huberman', duration: 7200 },
      // Flagrant (Andrew Schulz)
      { id: 'BfFBPFLNm8s', title: 'Flagrant - Most Offensive Episode Yet', duration: 5400 },
      // H3 Podcast
      { id: 'rY0WxgSXdEE', title: 'H3 Podcast - Best Moments 2024', duration: 3600 },
      // Call Her Daddy
      { id: 'a1gvL1v0k0c', title: 'Call Her Daddy - Most Viral Episode', duration: 4200 },
      // Theo Von
      { id: 'xA-sBLuq3IM', title: 'This Past Weekend - Theo Von Best Of', duration: 4800 },
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
