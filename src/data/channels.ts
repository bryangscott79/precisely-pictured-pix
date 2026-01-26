export interface Video {
  id: string;
  title: string;
  duration: number; // in seconds
}

export interface Channel {
  id: string;
  name: string;
  icon: string;
  color: 'tech' | 'science' | 'maker' | 'cooking' | 'history';
  description: string;
  videos: Video[];
}

export const channels: Channel[] = [
  {
    id: 'tech',
    name: 'Technology',
    icon: '💻',
    color: 'tech',
    description: 'Tech explainers and reviews',
    videos: [
      { id: 'vk2vJsXTBsk', title: 'How NASA Reinvented The Wheel', duration: 1062 }, // 17:42
      { id: 'N2u6EDwumdQ', title: 'Spinning Disk Flywheel Battery', duration: 903 }, // 15:03
      { id: 'zLZSjSj10K4', title: 'Why Lightbulbs Might Be The Best Invention Ever', duration: 1398 }, // 23:18
      { id: 'erLbbextvlY', title: 'How Do Computers Remember?', duration: 1020 }, // 17:00
      { id: 'A_BlNA7bBxo', title: 'The World in UV', duration: 780 }, // 13:00
    ],
  },
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    color: 'science',
    description: 'Educational science content',
    videos: [
      { id: 'BTT6L2OU6hw', title: 'What Happens When You Eliminate Squirrels', duration: 1247 }, // 20:47
      { id: 'IgXiPoFdHD4', title: 'Why We Haven\'t Cured Cancer', duration: 1523 }, // 25:23
      { id: 'pTn6Ewhb27k', title: 'Why No One Has Measured The Speed Of Light', duration: 1128 }, // 18:48
      { id: 'D5_ogU4Jzt4', title: 'The Infinite Pattern That Never Repeats', duration: 1281 }, // 21:21
      { id: 'X9otDixAtFw', title: 'How Trees Bend the Laws of Physics', duration: 990 }, // 16:30
    ],
  },
  {
    id: 'maker',
    name: 'Maker',
    icon: '🔧',
    color: 'maker',
    description: 'DIY and engineering projects',
    videos: [
      { id: 'h4T_LlK1VE4', title: 'Glitterbomb Trap Catches Porch Pirates', duration: 1422 }, // 23:42
      { id: 'RHvZGlGjvfc', title: "World's Largest Nerf Gun", duration: 636 }, // 10:36
      { id: 'Kou7ur5xt_4', title: 'World Record Elephant Toothpaste', duration: 841 }, // 14:01
      { id: 'QwXK4e4uqXY', title: 'Building A Massive Bow', duration: 1140 }, // 19:00
      { id: 'yLLLMfPtQkQ', title: 'Automatic Pool Stick vs Expert', duration: 1260 }, // 21:00
    ],
  },
  {
    id: 'cooking',
    name: 'Cooking',
    icon: '🍳',
    color: 'cooking',
    description: 'Recipe and cooking technique videos',
    videos: [
      { id: 'lxLcWcZwfzQ', title: 'Perfect Pan Pizza', duration: 522 }, // 8:42
      { id: '8Q_9h6VKm9c', title: 'The Secrets of Neapolitan Pizza', duration: 1847 }, // 30:47
      { id: 'PnCby4iHbZE', title: 'Homemade Ramen From Scratch', duration: 924 }, // 15:24
      { id: 'nfxpwbWBNuU', title: 'The Creamy Pasta Method', duration: 840 }, // 14:00
      { id: '8F8MBp-GBWE', title: 'Perfect Steak Every Time', duration: 720 }, // 12:00
    ],
  },
  {
    id: 'history',
    name: 'History',
    icon: '📜',
    color: 'history',
    description: 'Historical documentaries and explainers',
    videos: [
      { id: '0OR7O7FzNh4', title: 'The Wild West of Internet History', duration: 2156 }, // 35:56
      { id: '2fNDWKKF_5Y', title: 'The Most Dangerous Computer Virus', duration: 1342 }, // 22:22
      { id: 'oV6rvLP-Ul8', title: 'The History of the Internet', duration: 874 }, // 14:34
      { id: 'UCj8bbYNETE', title: 'The Story of Tetris', duration: 1800 }, // 30:00
      { id: 'aQs4YGT5wbk', title: 'How We Lost The Saturn V', duration: 1500 }, // 25:00
    ],
  },
];

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
