/**
 * YouTube RSS Feed Service v2
 *
 * Fetches videos from YouTube channels using RSS feeds (completely free, no API quota).
 * Each channel has an RSS feed at: https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID
 *
 * Benefits:
 * - No API quota usage (unlimited requests!)
 * - Always up-to-date (YouTube updates feeds in real-time)
 * - Returns latest 15 videos per channel
 *
 * Limitations:
 * - Only works for specific channels (not search queries)
 * - No duration info in RSS (we estimate from the API later or use defaults)
 * - Limited to 15 most recent videos per channel
 */

import { FetchedVideo } from './youtubeService';

const YOUTUBE_RSS_BASE = 'https://www.youtube.com/feeds/videos.xml';

// Multiple CORS proxies for reliability (fallback chain)
// Each proxy has slightly different URL format requirements
const CORS_PROXIES = [
  { base: 'https://api.allorigins.win/raw?url=', encode: true },
  { base: 'https://corsproxy.io/?', encode: true },
  { base: 'https://api.codetabs.com/v1/proxy?quest=', encode: true },
  { base: 'https://cors-anywhere.herokuapp.com/', encode: false },
];

// Track which proxy is working best
let currentProxyIndex = 0;

export interface RssVideo {
  id: string;
  title: string;
  channelId: string;
  channelName: string;
  publishedAt: Date;
  thumbnail: string;
  views: number;
  isShort: boolean;
}

/**
 * Parse YouTube RSS feed XML into video objects
 */
function parseRssFeed(xml: string): RssVideo[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');

  const entries = doc.querySelectorAll('entry');
  const videos: RssVideo[] = [];

  entries.forEach(entry => {
    const videoId = entry.querySelector('yt\\:videoId, videoId')?.textContent;
    const title = entry.querySelector('title')?.textContent;
    const channelId = entry.querySelector('yt\\:channelId, channelId')?.textContent;
    const channelName = entry.querySelector('author > name')?.textContent;
    const published = entry.querySelector('published')?.textContent;
    const link = entry.querySelector('link[rel="alternate"]')?.getAttribute('href') || '';

    // Get view count from media:statistics
    const stats = entry.querySelector('media\\:statistics, statistics');
    const views = parseInt(stats?.getAttribute('views') || '0');

    // Check if it's a Short:
    // 1. URL contains /shorts/
    // 2. Title contains #shorts or #short
    // 3. Title is very short (less than 30 chars) and has hashtags
    const titleLower = (title || '').toLowerCase();
    const isShort = link.includes('/shorts/') ||
      titleLower.includes('#shorts') ||
      titleLower.includes('#short') ||
      (title && title.length < 30 && title.includes('#'));

    if (videoId && title) {
      videos.push({
        id: videoId,
        title,
        channelId: channelId || '',
        channelName: channelName || '',
        publishedAt: published ? new Date(published) : new Date(),
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        views,
        isShort,
      });
    }
  });

  return videos;
}

/**
 * Fetch videos from a YouTube channel using RSS feed (no API quota!)
 * Tries multiple CORS proxies for reliability
 */
export async function fetchChannelVideosViaRss(channelId: string): Promise<RssVideo[]> {
  const feedUrl = `${YOUTUBE_RSS_BASE}?channel_id=${channelId}`;
  console.log(`[RSS] Starting fetch for channel ${channelId}`);

  // Try each proxy in order, starting from the last successful one
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    const proxyIndex = (currentProxyIndex + i) % CORS_PROXIES.length;
    const proxy = CORS_PROXIES[proxyIndex];

    try {
      // Build URL based on proxy requirements
      const proxyUrl = proxy.encode
        ? `${proxy.base}${encodeURIComponent(feedUrl)}`
        : `${proxy.base}${feedUrl}`;

      console.log(`[RSS] Trying proxy ${proxyIndex}: ${proxy.base.substring(0, 30)}...`);

      const response = await fetch(proxyUrl, {
        signal: AbortSignal.timeout(10000), // 10 second timeout per proxy
        headers: {
          'Accept': 'application/xml, text/xml, */*',
        },
      });

      if (!response.ok) {
        console.warn(`[RSS] Proxy ${proxyIndex} failed for ${channelId}: HTTP ${response.status}`);
        continue;
      }

      const xml = await response.text();
      console.log(`[RSS] Proxy ${proxyIndex} returned ${xml.length} chars`);

      // Validate it's actually XML (be more lenient with validation)
      if (!xml.includes('<feed') && !xml.includes('<entry') && !xml.includes('<?xml')) {
        console.warn(`[RSS] Proxy ${proxyIndex} returned non-XML for ${channelId}:`, xml.substring(0, 200));
        continue;
      }

      const videos = parseRssFeed(xml);

      // Only accept if we got videos
      if (videos.length === 0) {
        console.warn(`[RSS] Proxy ${proxyIndex} XML parsed but no videos found for ${channelId}`);
        continue;
      }

      // Remember which proxy worked
      currentProxyIndex = proxyIndex;
      console.log(`[RSS] ✅ Fetched ${videos.length} videos from channel ${channelId} (proxy ${proxyIndex})`);
      return videos;
    } catch (error) {
      console.warn(`[RSS] Proxy ${proxyIndex} error for ${channelId}:`, error instanceof Error ? error.message : error);
      continue;
    }
  }

  // All proxies failed
  console.error(`[RSS] ❌ All ${CORS_PROXIES.length} proxies failed for channel ${channelId}`);
  return [];
}

/**
 * Fetch videos from multiple YouTube channels and combine them
 * Uses staggered requests to avoid rate limiting
 */
export async function fetchMultipleChannelsViaRss(channelIds: string[]): Promise<RssVideo[]> {
  const results: RssVideo[][] = [];

  // Fetch channels in small batches with delay to avoid rate limiting
  const BATCH_SIZE = 2;
  const BATCH_DELAY = 500; // 500ms between batches

  for (let i = 0; i < channelIds.length; i += BATCH_SIZE) {
    const batch = channelIds.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(id => fetchChannelVideosViaRss(id))
    );
    results.push(...batchResults);

    // Small delay between batches (but not after the last batch)
    if (i + BATCH_SIZE < channelIds.length) {
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
    }
  }

  // Flatten and sort by publish date (newest first)
  const allVideos = results.flat();
  allVideos.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  return allVideos;
}

/**
 * Check if a video is embeddable using YouTube's oEmbed endpoint (free, no API quota)
 * Returns true if video can be embedded, false otherwise
 */
export async function isVideoEmbeddable(videoId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { signal: AbortSignal.timeout(3000) }
    );
    return response.ok;
  } catch {
    // If we can't check, assume it's embeddable
    return true;
  }
}

/**
 * Validate a batch of videos for embeddability (checks in parallel)
 * Returns only embeddable video IDs
 */
export async function filterEmbeddableVideos(videoIds: string[]): Promise<Set<string>> {
  const results = await Promise.all(
    videoIds.map(async (id) => ({
      id,
      embeddable: await isVideoEmbeddable(id),
    }))
  );
  return new Set(results.filter(r => r.embeddable).map(r => r.id));
}

/**
 * Convert RSS videos to FetchedVideo format for compatibility with existing player
 * Note: Duration is estimated since RSS doesn't include it
 */
export function rssToFetchedVideos(
  rssVideos: RssVideo[],
  options: {
    excludeShorts?: boolean;
    minViews?: number;
    limit?: number;
    estimatedDuration?: number; // Default duration to use (in seconds)
  } = {}
): FetchedVideo[] {
  const {
    excludeShorts = true,
    minViews = 0,
    limit = 25,
    estimatedDuration = 600, // Default 10 minutes
  } = options;

  let filtered = rssVideos;

  // Filter out Shorts if requested
  if (excludeShorts) {
    filtered = filtered.filter(v => !v.isShort);
  }

  // Filter by minimum views
  if (minViews > 0) {
    filtered = filtered.filter(v => v.views >= minViews);
  }

  // Convert to FetchedVideo format
  return filtered.slice(0, limit).map(v => ({
    id: v.id,
    title: v.title,
    duration: estimatedDuration, // We'll get actual duration via API if needed
  }));
}

/**
 * Curated channel lists for each EpiShow channel category
 * These are hand-picked quality YouTube channels that match each category
 */
export const CURATED_CHANNELS: Record<string, string[]> = {
  // Technology
  tech: [
    'UCBJycsmduvYEL83R_U4JriQ', // MKBHD
    'UCXuqSBlHAE6Xw-yeJA0Tunw', // Linus Tech Tips
    'UCVHFbqXqoYvEWM1Ddxl0QKg', // Android Authority
    'UC0vBXGSyV14uvJ4hECDOl0Q', // Techquickie
    'UCsTcErHg8oDvUnTzoqsYeNw', // Unbox Therapy
  ],

  // Science
  science: [
    'UCsXVk37bltHxD1rDPwtNM8Q', // Kurzgesagt
    'UC6nSFpj9HTCZ5t-N3Rm3-HA', // Vsauce
    'UCZYTClx2T1of7BRZ86-8fow', // SciShow
    'UC7_gcs09iThXybpVgjHZ_7g', // PBS Space Time
    'UCHnyfMqiRRG1u-2MsSQLbXA', // Veritasium
  ],

  // Maker/DIY
  maker: [
    'UCY1kMZp36IQSyNx_9h4mpCg', // Mark Rober
    'UCfMJ2MchTSW2kWaT0kK94Yw', // William Osman
    'UC3KEoMzNz8eYnwBC34RaKCQ', // Simone Giertz
    'UCkhZ3X6pVbrEs_VzIPfwWgQ', // Stuff Made Here
    'UCAL3JXZSzSm8AlZyD3nQdBA', // Practical Engineering
  ],

  // Cooking
  cooking: [
    'UCRIZtPl9nb9RiXc9btSTQNw', // Joshua Weissman
    'UCJHA_jMfCvEnv-3kRjTCQXw', // Binging with Babish
    'UCqqJQ_cXSat0KIAVfIfKkVA', // J. Kenji Lopez-Alt
    'UC9_p50tH3WmMslWRWKnM7dQ', // Adam Ragusea
    'UCekQr9znsk2vWxBo3YiLq2w', // You Suck At Cooking
  ],

  // Automotive
  automotive: [
    'UCsAegdhiYLEoaFGuJFVrqFQ', // Donut Media
    'UCQMle4QI2zJuOI5W5TOyOcQ', // Doug DeMuro
    'UCgJRL30YS6XFxq9Ga8W2J3A', // ChrisFix
    'UCF9cEcWTgqKm4BYeSKAL0rQ', // Jason Cammisa
    'UCDqf_L2GvW7gocj9APg1P6w', // Hoonigan
  ],

  // Gaming
  gaming: [
    'UCX6OQ3DkcsbYNE6H8uQQuVA', // MrBeast Gaming
    'UC-lHJZR3Gqxm24_Vd_AJ5Yw', // PewDiePie
    'UCOpNcN46UbXVtpKMrmU4Abg', // jacksepticeye
    'UCYzPXprvl5Y-Sf0g4vX-m6g', // Game Grumps
    'UCWX2lF1OYVZ7V_G7jVCjfbg', // Girlfriend Reviews
  ],

  // Comedy/Entertainment
  comedy: [
    'UCLkAepWjdylmXSltofFvsYQ', // WIRED
    'UCi7GJNg51C3jgmYTUwqoUXA', // SNL
    'UCa6vGFO9ty8v5KZJXQxdhaw', // Jimmy Kimmel Live
    'UC8-Th83bH_thdKZDJCrn88g', // The Tonight Show
    'UCVTyTA7-g9nopHeHbeuvpRA', // Late Night with Seth Meyers
  ],

  // Sports
  sports: [
    'UCYZp1SdnPDKVWj0pVWiR5XA', // ESPN
    'UCDVYQ4Zhbm3S2dlz7P1GBDg', // NFL
    'UCWJ2lWNubArHWmf3FIHbfcQ', // NBA
    'UCs7LIHnGEPEQZQNBPwqbM7A', // House of Highlights
    'UCo_q6aOlvPH7M-j_XGWVgXg', // Bleacher Report
  ],

  // Music - Official artist channels and music videos
  music: [
    'UCIwFjwMjI0y7PDBVEO9-bkQ', // Justin Bieber
    'UC0WP5P-ufpRfjbNrmOWwLBQ', // The Weeknd
    'UC0RhatS1pyxInC00YKjjBqQ', // Bruno Mars
    'UCqECaJ8Gagnn7YCbPEzWH6g', // Taylor Swift
    'UCsRM0YB_dabtEPGPTKo-gcw', // Ariana Grande
  ],

  // Nature/Documentary
  nature: [
    'UCwmZiChSryoWQCZMIQezgTg', // BBC Earth
    'UCpVm7bg6pXKo1Pr6k5kxG9A', // National Geographic
    'UCGaOvAFinZ7BCN_FDmw74fQ', // Netflix (documentaries)
  ],

  // Kids
  kids: [
    'UCbCmjCuTUZos6Inko4u57UQ', // CoComelon
    'UCkFJOXSQdj8M0WDKO6PbDOQ', // Super Simple Songs
    'UC4NALVCmcmL5ntpKx19zJUQ', // Blippi
  ],

  // Podcasts
  podcast: [
    'UCnxGkOGNMqQEUMvroOWps6Q', // The Joe Rogan Experience
    'UCSHZKyawb77ixDdsGog4iWA', // Lex Fridman
    'UC2D2CMWXMOVWx7giW1n3LIg', // Huberman Lab
    'UCLXo7UDZvByw2ixzpQCufnA', // The Diary Of A CEO
  ],

  // Travel
  travel: [
    'UC3o_gaqvLoPSRVMc2GmkDxg', // Kara and Nate
    'UCnTsUMBOA8E-OHJE-UrFOnA', // Yes Theory
    'UC0n9yiP-AD2DpuuYCDwlNxQ', // Drew Binsky
  ],

  // History
  history: [
    'UCHdos0HAIEhIMqUc9L3Cmzg', // History Channel
    'UC22BdTgxefuvUivrjesETjg', // The Infographics Show
    'UCsXVk37bltHxD1rDPwtNM8Q', // Kurzgesagt (has history content too)
  ],

  // Fitness
  fitness: [
    'UCe0TLA0EsQbE-MjuHXevj2A', // ATHLEAN-X
    'UCOFCwvhDoUvYcfpD7RJKQwA', // Blogilates
    'UCqjwF8rxRsotnojGl4gM0Zw', // The Fitness Marshall
  ],

  // Art
  art: [
    'UCxcnsr1R5Ge_fbTu5ajt8DQ', // Proko
    'UCMQXw5Qv5GtZM5XoYsPCPYg', // Jazza
    'UCEvQrmfLHQMHrRfSbbm7hCQ', // The Art Assignment
  ],

  // Home DIY
  diy: [
    'UCTs-d2DgyuJVRICivxe2Ktg', // This Old House
    'UCkfSY35R4y1JXs9tXxPwPew', // Home RenoVision DIY
  ],

  // Collecting - Sports Cards, Trading Cards, Coins
  collecting: [
    'UC4PooJDVVYqWPxPfqRmB-7A', // Jabs Family (sports cards)
    'UCqU-KyxhvL1_xJQF_Bq7fdQ', // Sports Card Radio
    'UC8Zbrk6kZ-R_WYUojwD1rSg', // Packman (card breaks)
    'UCwS9TZTJFSrGJZ45Dsg4uNQ', // Gary Vee (cards)
    'UCNRGRm_5VJe0R7_R0MeKvQA', // Stacking Slabs
  ],
};

/**
 * Get curated channel IDs for a given EpiShow channel
 */
export function getCuratedChannelsForCategory(category: string): string[] {
  return CURATED_CHANNELS[category] || [];
}
