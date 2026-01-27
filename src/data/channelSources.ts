export const CHANNEL_SOURCES: Record<string, { youtubeChannels: string[]; minDuration: number; maxDuration: number; minViews: number }> = {
  tech: {
    youtubeChannels: ['UCsBjURrPoezykLs9EqgamOA', 'UCBcRF18a7Qf58cCRy5xuWwQ', 'UCBa659QWEk1AI4Tg--mrJ2A'],
    minDuration: 60, maxDuration: 1800, minViews: 100000
  },
  science: {
    youtubeChannels: ['UCsXVk37bltHxD1rDPwtNM8Q', 'UCHnyfMqiRRG1u-2MsSQLbXA', 'UC6nSFpj9HTCZ5t-N3Rm3-HA'],
    minDuration: 300, maxDuration: 2400, minViews: 500000
  },
  history: {
    youtubeChannels: ['UCNIuvl7V8zACPpTmmNIqP2A', 'UCCODtTcd5M1JavPCOr_Uydg'],
    minDuration: 300, maxDuration: 3600, minViews: 500000
  },
  maker: {
    youtubeChannels: ['UCY1kMZp36IQSyNx_9h4mpCg', 'UCj1VqrHhDte54oLgPG4xpuQ', 'UCp68_FLety0O-n9QU6phsgw'],
    minDuration: 300, maxDuration: 2400, minViews: 500000
  },
  cooking: {
    youtubeChannels: ['UChBEbMKI1eCcejTtmI32UEw', 'UCJHA_jMfCvEnv-3kRjTCQXw', 'UC9_p50tH3WmMslWRWKnM7dQ'],
    minDuration: 300, maxDuration: 1800, minViews: 300000
  },
  automotive: {
    youtubeChannels: ['UCL6JmiMXKoXS6bpP1D3bk8g'],
    minDuration: 300, maxDuration: 1800, minViews: 200000
  },
  nature: {
    youtubeChannels: ['UCwmZiChSryoWQCZMIQezgTg', 'UCpVm7bg6pXKo1Pr6k5kxG9A'],
    minDuration: 300, maxDuration: 3600, minViews: 500000
  },
  kids: {
    youtubeChannels: ['UCbCmjCuTUZos6Inko4u57UQ', 'UCLsooMJoIpl_7ux2jvdPB-Q'],
    minDuration: 60, maxDuration: 600, minViews: 1000000
  },
  family: {
    youtubeChannels: ['UC0RhatS1pyxInC00YKjjBqQ'],
    minDuration: 300, maxDuration: 1200, minViews: 100000
  },
  faith: {
    youtubeChannels: ['UCVfwlh9XpX2Y_tQfjeln9QA'],
    minDuration: 300, maxDuration: 1200, minViews: 100000
  },
  fitness: {
    youtubeChannels: ['UCe0TLA0EsQbE-MjuHXevj2A'],
    minDuration: 300, maxDuration: 1200, minViews: 500000
  },
  diy: {
    youtubeChannels: ['UCUtWNBWbFL9We-cdXkiAuJA'],
    minDuration: 300, maxDuration: 1800, minViews: 50000
  },
  gaming: {
    youtubeChannels: ['UCNvzD7Z-g64bPXxGzaQaa4g'],
    minDuration: 300, maxDuration: 1800, minViews: 200000
  },
  travel: {
    youtubeChannels: ['UCBo9TLJiZ5HI5CXFsCxOhmA'],
    minDuration: 300, maxDuration: 1800, minViews: 100000
  },
  comedy: {
    youtubeChannels: ['UCi7GJNg51C3jgmYTUwqoUXA'],
    minDuration: 180, maxDuration: 1200, minViews: 500000
  },
  music: {
    youtubeChannels: ['UCQOxK4Rfy5L8aI3T0BbhVaw'],
    minDuration: 120, maxDuration: 600, minViews: 50000
  },
  music80s: {
    youtubeChannels: ['UCEuOwB9vSL1oPKGNdONB4ig'],
    minDuration: 180, maxDuration: 480, minViews: 100000
  },
  music90s: {
    youtubeChannels: ['UCQ2ZXzSHkQOznthN1WsM8Ng'],
    minDuration: 180, maxDuration: 480, minViews: 100000
  },
  music00s: {
    youtubeChannels: ['UC0RhatS1pyxInC00YKjjBqQ'],
    minDuration: 180, maxDuration: 480, minViews: 100000
  },
  music10s: {
    youtubeChannels: ['UCZkURf9tDolFOeuw_4RD7XQ'],
    minDuration: 180, maxDuration: 480, minViews: 100000
  },
  sports: {
    youtubeChannels: ['UCSXK6dmhFusgBb1jDrj7Q-w', 'UCTl3QQTvqHFjurroKxexy2Q'],
    minDuration: 120, maxDuration: 1800, minViews: 100000
  },
  collecting: {
    youtubeChannels: ['UCF2pD7SFk-FBmeTCIaC_xUg', 'UCYvL0S6QBwXZDdpZwLdRCmA'],
    minDuration: 300, maxDuration: 1800, minViews: 5000
  },
  teen: {
    youtubeChannels: ['UCX6OQ3DkcsbYNE6H8uQQuVA'],
    minDuration: 300, maxDuration: 1800, minViews: 5000000
  },
  art: {
    youtubeChannels: ['UCzM7uTMjhMxb2kFLKWKH7qQ'],
    minDuration: 300, maxDuration: 1800, minViews: 200000
  },
  // Podcast channel uses static content from channels.ts - no dynamic fetching
  // This ensures we only play verified TED Talks and speeches, not random videos
};
