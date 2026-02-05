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

// CORS proxy for client-side RSS fetching
// In production, you'd want to use a Supabase Edge Function for this
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

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

    // Check if it's a Short (URL contains /shorts/)
    const isShort = link.includes('/shorts/');

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
 */
export async function fetchChannelVideosViaRss(channelId: string): Promise<RssVideo[]> {
  const feedUrl = `${YOUTUBE_RSS_BASE}?channel_id=${channelId}`;

  try {
    // Use CORS proxy for client-side fetching
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(feedUrl)}`);

    if (!response.ok) {
      console.error(`[RSS] Failed to fetch feed for ${channelId}: ${response.status}`);
      return [];
    }

    const xml = await response.text();
    const videos = parseRssFeed(xml);

    console.log(`[RSS] Fetched ${videos.length} videos from channel ${channelId}`);
    return videos;
  } catch (error) {
    console.error(`[RSS] Error fetching channel ${channelId}:`, error);
    return [];
  }
}

/**
 * Fetch videos from multiple YouTube channels and combine them
 */
export async function fetchMultipleChannelsViaRss(channelIds: string[]): Promise<RssVideo[]> {
  const results = await Promise.all(
    channelIds.map(id => fetchChannelVideosViaRss(id))
  );

  // Flatten and sort by publish date (newest first)
  const allVideos = results.flat();
  allVideos.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  return allVideos;
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

  // Music
  music: [
    'UC-9-kyTW8ZkZNDHQJ6FgpwQ', // Music
    'UCVHFbqXqoYvEWM1Ddxl0QKg', // Vevo
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

  // Collecting
  collecting: [
    'UCTyMzKBK-9aYv6bBnVbD4cg', // Grand Poobear (card collecting)
  ],
};

/**
 * Get curated channel IDs for a given EpiShow channel
 */
export function getCuratedChannelsForCategory(category: string): string[] {
  return CURATED_CHANNELS[category] || [];
}
