// YouTube Channel IDs for each Epishow channel
export const CHANNEL_SOURCES: Record<string, { youtubeChannels: string[]; minDuration: number; maxDuration: number; minViews: number }> = {
  tech: {
    youtubeChannels: ['UCsBjURrPoezykLs9EqgamOA', 'UCBcRF18a7Qf58cCRy5xuWwQ'], // Fireship, MKBHD
    minDuration: 60, maxDuration: 1800, minViews: 100000
  },
  science: {
    youtubeChannels: ['UCsXVk37bltHxD1rDPwtNM8Q', 'UCHnyfMqiRRG1u-2MsSQLbXA'], // Kurzgesagt, Veritasium
    minDuration: 300, maxDuration: 2400, minViews: 500000
  },
  history: {
    youtubeChannels: ['UCNIuvl7V8zACPpTmmNIqP2A'], // Oversimplified
    minDuration: 300, maxDuration: 3600, minViews: 500000
  },
  maker: {
    youtubeChannels: ['UCY1kMZp36IQSyNx_9h4mpCg', 'UCj1VqrHhDte54oLgPG4xpuQ'], // Mark Rober, Stuff Made Here
    minDuration: 300, maxDuration: 2400, minViews: 500000
  },
  cooking: {
    youtubeChannels: ['UChBEbMKI1eCcejTtmI32UEw', 'UCJHA_jMfCvEnv-3kRjTCQXw'], // Joshua Weissman, Babish
    minDuration: 300, maxDuration: 1800, minViews: 300000
  },
  automotive: {
    youtubeChannels: ['UCL6JmiMXKoXS6bpP1D3bk8g'], // Donut Media
    minDuration: 300, maxDuration: 1800, minViews: 200000
  },
  nature: {
    youtubeChannels: ['UCwmZiChSryoWQCZMIQezgTg'], // BBC Earth
    minDuration: 300, maxDuration: 3600, minViews: 500000
  },
  kids: {
    youtubeChannels: ['UCbCmjCuTUZos6Inko4u57UQ'], // Cocomelon
    minDuration: 60, maxDuration: 600, minViews: 1000000
  },
  faith: {
    youtubeChannels: ['UCVfwlh9XpX2Y_tQfjeln9QA'], // Bible Project
    minDuration: 300, maxDuration: 1200, minViews: 100000
  },
  fitness: {
    youtubeChannels: ['UCe0TLA0EsQbE-MjuHXevj2A'], // Athlean-X
    minDuration: 300, maxDuration: 1200, minViews: 500000
  },
  diy: {
    youtubeChannels: ['UCUtWNBWbFL9We-cdXkiAuJA'], // This Old House
    minDuration: 300, maxDuration: 1800, minViews: 50000
  },
  gaming: {
    youtubeChannels: ['UCNvzD7Z-g64bPXxGzaQaa4g'], // Gameranx
    minDuration: 300, maxDuration: 1800, minViews: 200000
  },
  travel: {
    youtubeChannels: ['UCBo9TLJiZ5HI5CXFsCxOhmA'], // Kara and Nate
    minDuration: 300, maxDuration: 1800, minViews: 100000
  },
  comedy: {
    youtubeChannels: ['UCUsN5ZwHx2kILm84-jPDeXw'], // Comedy Central
    minDuration: 180, maxDuration: 1200, minViews: 500000
  },
  music: {
    youtubeChannels: ['UCQOxK4Rfy5L8aI3T0BbhVaw'], // Vintage Music
    minDuration: 120, maxDuration: 600, minViews: 50000
  },
  sports: {
    youtubeChannels: ['UCTl3QQTvqHFjurroKxexy2Q'], // Olympic Channel
    minDuration: 120, maxDuration: 1800, minViews: 100000
  },
  collecting: {
    youtubeChannels: ['UCZB4D4_AHaXlBvt3Z2Vf9Zw'], // PCGS
    minDuration: 300, maxDuration: 1800, minViews: 5000
  },
  family: {
    youtubeChannels: ['UC0RhatS1pyxInC00YKjjBqQ'], // Art for Kids Hub
    minDuration: 300, maxDuration: 1200, minViews: 100000
  },
  teen: {
    youtubeChannels: ['UCX6OQ3DkcsbYNE6H8uQQuVA'], // MrBeast
    minDuration: 300, maxDuration: 1800, minViews: 10000000
  },
  art: {
    youtubeChannels: ['UCzM7uTMjhMxb2kFLKWKH7qQ'], // Jazza
    minDuration: 300, maxDuration: 1800, minViews: 200000
  }
};
