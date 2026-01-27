import { SearchConfig } from '@/services/youtubeService';

// Day of week: 0 = Sunday, 1 = Monday, etc.
export interface ScheduleBlock {
  name: string;
  dayOfWeek: number; // 0-6
  startHour: number; // 0-23 (local time)
  endHour: number;
  searchConfig: SearchConfig;
}

export interface ChannelSchedule {
  channelId: string;
  defaultConfig: SearchConfig;
  schedule: ScheduleBlock[];
}

// Collecting Channel Schedule
export const COLLECTING_SCHEDULE: ChannelSchedule = {
  channelId: 'collecting',
  defaultConfig: {
    query: 'collectibles hobby collection haul -coins',
    duration: 'medium',
    uploadDate: 'month',
    order: 'viewCount',
    minDuration: 300,
    maxDuration: 1800,
  },
  schedule: [
    // MONDAY
    {
      name: 'Antique Roadshow Highlights',
      dayOfWeek: 1, // Monday
      startHour: 9,
      endHour: 12,
      searchConfig: {
        query: 'Antiques Roadshow appraisal rare finds',
        duration: 'medium',
        uploadDate: 'year',
        order: 'viewCount',
        minDuration: 300,
        maxDuration: 1200,
      },
    },
    {
      name: 'Vintage Toy Collection',
      dayOfWeek: 1,
      startHour: 14,
      endHour: 17,
      searchConfig: {
        query: 'vintage toys collection haul 80s 90s action figures',
        duration: 'medium',
        uploadDate: 'month',
        order: 'viewCount',
        minDuration: 300,
        maxDuration: 1800,
      },
    },
    // TUESDAY
    {
      name: 'Sports Cards Morning',
      dayOfWeek: 2,
      startHour: 8,
      endHour: 12,
      searchConfig: {
        query: 'sports cards grading PSA BGS rookie cards',
        duration: 'medium',
        uploadDate: 'week',
        order: 'viewCount',
        minDuration: 300,
        maxDuration: 1800,
      },
    },
    {
      name: 'Live Break Night',
      dayOfWeek: 2, // Tuesday
      startHour: 21, // 9 PM
      endHour: 24, // Midnight
      searchConfig: {
        query: 'live card break sports cards box break opening',
        duration: 'long',
        uploadDate: 'week',
        order: 'date', // Most recent for live content
        minDuration: 900,
        maxDuration: 7200,
      },
    },
    // WEDNESDAY  
    {
      name: 'Pokemon Card Day',
      dayOfWeek: 3,
      startHour: 10,
      endHour: 18,
      searchConfig: {
        query: 'Pokemon cards opening graded PSA CGC rare',
        duration: 'medium',
        uploadDate: 'week',
        order: 'viewCount',
        minDuration: 300,
        maxDuration: 1800,
      },
    },
    {
      name: 'Pokemon Box Breaks',
      dayOfWeek: 3,
      startHour: 19,
      endHour: 23,
      searchConfig: {
        query: 'Pokemon booster box opening case break',
        duration: 'long',
        uploadDate: 'week',
        order: 'date',
        minDuration: 600,
        maxDuration: 3600,
      },
    },
    // THURSDAY
    {
      name: 'Comic Book Collecting',
      dayOfWeek: 4,
      startHour: 10,
      endHour: 15,
      searchConfig: {
        query: 'comic book collection CGC grading haul vintage comics',
        duration: 'medium',
        uploadDate: 'month',
        order: 'viewCount',
        minDuration: 300,
        maxDuration: 1800,
      },
    },
    {
      name: 'Vinyl Record Hour',
      dayOfWeek: 4,
      startHour: 18,
      endHour: 21,
      searchConfig: {
        query: 'vinyl record collection haul rare albums',
        duration: 'medium',
        uploadDate: 'month',
        order: 'viewCount',
        minDuration: 300,
        maxDuration: 1500,
      },
    },
    // FRIDAY
    {
      name: 'Card Break Friday',
      dayOfWeek: 5,
      startHour: 20, // 8 PM
      endHour: 24,
      searchConfig: {
        query: 'card break live opening Topps Panini box break',
        duration: 'long',
        uploadDate: 'week',
        order: 'date',
        minDuration: 900,
        maxDuration: 7200,
      },
    },
    {
      name: 'Watch Collection',
      dayOfWeek: 5,
      startHour: 12,
      endHour: 16,
      searchConfig: {
        query: 'watch collection luxury Rolex Omega vintage watches',
        duration: 'medium',
        uploadDate: 'month',
        order: 'viewCount',
        minDuration: 300,
        maxDuration: 1800,
      },
    },
    // SATURDAY
    {
      name: 'Sneaker Collection',
      dayOfWeek: 6,
      startHour: 10,
      endHour: 14,
      searchConfig: {
        query: 'sneaker collection haul Nike Jordan Yeezy rare',
        duration: 'medium',
        uploadDate: 'month',
        order: 'viewCount',
        minDuration: 300,
        maxDuration: 1500,
      },
    },
    {
      name: 'Garage Sale Treasure Hunt',
      dayOfWeek: 6,
      startHour: 8,
      endHour: 10,
      searchConfig: {
        query: 'garage sale thrift finds antique treasure hunt',
        duration: 'medium',
        uploadDate: 'week',
        order: 'viewCount',
        minDuration: 300,
        maxDuration: 1500,
      },
    },
    {
      name: 'Card Show Saturday',
      dayOfWeek: 6,
      startHour: 15,
      endHour: 20,
      searchConfig: {
        query: 'card show sports cards vintage baseball',
        duration: 'medium',
        uploadDate: 'month',
        order: 'viewCount',
        minDuration: 300,
        maxDuration: 1800,
      },
    },
    // SUNDAY
    {
      name: 'Antique Roadshow Marathon',
      dayOfWeek: 0,
      startHour: 10,
      endHour: 16,
      searchConfig: {
        query: 'Antiques Roadshow valuable rare appraisal',
        duration: 'medium',
        uploadDate: 'year',
        order: 'viewCount',
        minDuration: 300,
        maxDuration: 1200,
      },
    },
    {
      name: 'Obscure Collections',
      dayOfWeek: 0,
      startHour: 17,
      endHour: 21,
      searchConfig: {
        query: 'obscure collection weird hobby memorabilia strange',
        duration: 'medium',
        uploadDate: 'year',
        order: 'viewCount',
        minDuration: 300,
        maxDuration: 1800,
      },
    },
    {
      name: 'Coin & Currency',
      dayOfWeek: 0,
      startHour: 21,
      endHour: 24,
      searchConfig: {
        query: 'rare coins currency collection valuable numismatic',
        duration: 'medium',
        uploadDate: 'month',
        order: 'viewCount',
        minDuration: 300,
        maxDuration: 1200,
      },
    },
  ],
};

// All scheduled channels
export const SCHEDULED_CHANNELS: Record<string, ChannelSchedule> = {
  collecting: COLLECTING_SCHEDULE,
};

// Get the current program for a scheduled channel
export function getCurrentProgram(channelId: string): { name: string; config: SearchConfig } | null {
  const schedule = SCHEDULED_CHANNELS[channelId];
  if (!schedule) return null;

  const now = new Date();
  const dayOfWeek = now.getDay();
  const currentHour = now.getHours();

  // Find matching schedule block
  const currentBlock = schedule.schedule.find(block => 
    block.dayOfWeek === dayOfWeek &&
    currentHour >= block.startHour &&
    currentHour < block.endHour
  );

  if (currentBlock) {
    return {
      name: currentBlock.name,
      config: currentBlock.searchConfig,
    };
  }

  // Return default config if no scheduled block
  return {
    name: 'Mixed Collecting',
    config: schedule.defaultConfig,
  };
}

// Get upcoming programs for display
export function getUpcomingPrograms(channelId: string, count: number = 5): { name: string; dayName: string; time: string }[] {
  const schedule = SCHEDULED_CHANNELS[channelId];
  if (!schedule) return [];

  const now = new Date();
  const dayOfWeek = now.getDay();
  const currentHour = now.getHours();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const upcoming: { name: string; dayName: string; time: string; sortKey: number }[] = [];

  // Look through next 7 days
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const checkDay = (dayOfWeek + dayOffset) % 7;
    
    schedule.schedule
      .filter(block => block.dayOfWeek === checkDay)
      .forEach(block => {
        // Skip if this is today and the block has already started/passed
        if (dayOffset === 0 && block.startHour <= currentHour) {
          return;
        }

        const sortKey = dayOffset * 24 + block.startHour;
        const timeStr = block.startHour >= 12 
          ? `${block.startHour === 12 ? 12 : block.startHour - 12}:00 PM`
          : `${block.startHour === 0 ? 12 : block.startHour}:00 AM`;

        upcoming.push({
          name: block.name,
          dayName: dayOffset === 0 ? 'Today' : dayOffset === 1 ? 'Tomorrow' : dayNames[checkDay],
          time: timeStr,
          sortKey,
        });
      });
  }

  return upcoming
    .sort((a, b) => a.sortKey - b.sortKey)
    .slice(0, count)
    .map(({ name, dayName, time }) => ({ name, dayName, time }));
}

// Get the search config for a channel (scheduled or regular)
export function getChannelSearchConfig(channelId: string, regularConfig: SearchConfig): SearchConfig {
  const program = getCurrentProgram(channelId);
  if (program) {
    console.log(`[${channelId}] Scheduled program: ${program.name}`);
    return program.config;
  }
  return regularConfig;
}
