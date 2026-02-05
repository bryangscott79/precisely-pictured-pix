/**
 * Subscription Matcher Service
 *
 * Matches user's YouTube subscriptions to custom channel topics
 * and provides RSS-based video fetching from those matched channels.
 *
 * This is FREE - no API quota usage!
 */

import { supabase } from '@/integrations/supabase/client';
import { fetchMultipleChannelsViaRss, rssToFetchedVideos } from './youtubeRssService';
import { FetchedVideo } from './youtubeService';

export interface UserSubscription {
  youtube_channel_id: string;
  channel_name: string;
}

/**
 * Get all of a user's imported YouTube subscriptions
 */
export async function getUserSubscriptions(userId: string): Promise<UserSubscription[]> {
  try {
    const { data, error } = await supabase
      .from('imported_subscriptions')
      .select('youtube_channel_id, channel_name')
      .eq('user_id', userId)
      .eq('is_selected', true); // Only get selected subscriptions

    if (error) {
      console.error('[SubscriptionMatcher] Error fetching subscriptions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('[SubscriptionMatcher] Error:', error);
    return [];
  }
}

/**
 * Match subscriptions to a topic using keyword matching.
 * Returns YouTube channel IDs that match the topic.
 */
export function matchSubscriptionsToTopic(
  subscriptions: UserSubscription[],
  topic: string
): string[] {
  const topicLower = topic.toLowerCase();
  const topicWords = topicLower.split(/\s+/).filter(w => w.length > 2);

  // Keywords to look for based on topic
  const keywordSets = generateKeywordsForTopic(topic);

  const matches: { channelId: string; score: number }[] = [];

  for (const sub of subscriptions) {
    const nameLower = sub.channel_name.toLowerCase();
    let score = 0;

    // Exact topic match in channel name (highest priority)
    if (nameLower.includes(topicLower)) {
      score += 100;
    }

    // Check each keyword set
    for (const keyword of keywordSets) {
      if (nameLower.includes(keyword.toLowerCase())) {
        score += 10;
      }
    }

    // Check individual topic words
    for (const word of topicWords) {
      if (nameLower.includes(word)) {
        score += 5;
      }
    }

    if (score > 0) {
      matches.push({ channelId: sub.youtube_channel_id, score });
    }
  }

  // Sort by score (highest first) and return channel IDs
  matches.sort((a, b) => b.score - a.score);

  // Return top 5 matches
  return matches.slice(0, 5).map(m => m.channelId);
}

/**
 * Generate keywords to search for based on topic
 */
function generateKeywordsForTopic(topic: string): string[] {
  const normalized = topic.toLowerCase();
  const keywords: string[] = [topic];

  // NFL Teams
  const nflTeamKeywords: Record<string, string[]> = {
    'broncos': ['denver', 'broncos', 'mile high', 'nfl'],
    'chiefs': ['kansas city', 'chiefs', 'kc', 'nfl'],
    'raiders': ['las vegas', 'raiders', 'oakland', 'nfl'],
    'cowboys': ['dallas', 'cowboys', 'america\'s team', 'nfl'],
    'packers': ['green bay', 'packers', 'cheese', 'nfl'],
    '49ers': ['san francisco', '49ers', 'niners', 'nfl'],
    'eagles': ['philadelphia', 'eagles', 'philly', 'nfl'],
    'bills': ['buffalo', 'bills', 'nfl'],
    'dolphins': ['miami', 'dolphins', 'nfl'],
    'patriots': ['new england', 'patriots', 'boston', 'nfl'],
  };

  for (const [team, teamKeywords] of Object.entries(nflTeamKeywords)) {
    if (normalized.includes(team)) {
      keywords.push(...teamKeywords);
    }
  }

  // Sports topics
  if (normalized.includes('sports') || normalized.includes('card')) {
    keywords.push('sports', 'cards', 'trading', 'collectible', 'breaks', 'hobby');
  }

  // NBA Teams
  if (normalized.includes('lakers') || normalized.includes('celtics') ||
      normalized.includes('warriors') || normalized.includes('nba')) {
    keywords.push('nba', 'basketball', 'hoops');
  }

  // MLB Teams
  if (normalized.includes('yankees') || normalized.includes('dodgers') ||
      normalized.includes('cubs') || normalized.includes('mlb')) {
    keywords.push('mlb', 'baseball');
  }

  // General interest topics
  const topicKeywords: Record<string, string[]> = {
    'pokemon': ['pokemon', 'pokémon', 'tcg', 'cards', 'nintendo'],
    'art': ['art', 'drawing', 'painting', 'creative', 'artist'],
    'cooking': ['cooking', 'recipe', 'chef', 'food', 'kitchen'],
    'gaming': ['gaming', 'game', 'gameplay', 'gamer', 'playthrough'],
    'music': ['music', 'song', 'artist', 'band', 'concert'],
    'tech': ['tech', 'technology', 'gadget', 'review', 'unboxing'],
  };

  for (const [key, values] of Object.entries(topicKeywords)) {
    if (normalized.includes(key)) {
      keywords.push(...values);
    }
  }

  return [...new Set(keywords)]; // Remove duplicates
}

/**
 * Fetch videos for a custom channel by matching user's subscriptions to the topic.
 * This is the main entry point - completely FREE via RSS!
 */
export async function fetchVideosFromMatchedSubscriptions(
  userId: string,
  topic: string
): Promise<FetchedVideo[]> {
  console.log(`[SubscriptionMatcher] Fetching videos for topic: "${topic}"`);

  // Step 1: Get user's subscriptions
  const subscriptions = await getUserSubscriptions(userId);

  if (subscriptions.length === 0) {
    console.log('[SubscriptionMatcher] No subscriptions found for user');
    return [];
  }

  console.log(`[SubscriptionMatcher] Found ${subscriptions.length} user subscriptions`);

  // Step 2: Match subscriptions to topic
  const matchedChannelIds = matchSubscriptionsToTopic(subscriptions, topic);

  if (matchedChannelIds.length === 0) {
    console.log(`[SubscriptionMatcher] No subscriptions matched topic: "${topic}"`);
    // Log some subscription names for debugging
    console.log('[SubscriptionMatcher] User subscriptions include:',
      subscriptions.slice(0, 10).map(s => s.channel_name).join(', '));
    return [];
  }

  console.log(`[SubscriptionMatcher] Matched ${matchedChannelIds.length} channels to topic`);

  // Step 3: Fetch videos via RSS (FREE!)
  const rssVideos = await fetchMultipleChannelsViaRss(matchedChannelIds);

  if (rssVideos.length === 0) {
    console.log('[SubscriptionMatcher] RSS fetch returned no videos');
    return [];
  }

  // Step 4: Convert to FetchedVideo format
  const videos = rssToFetchedVideos(rssVideos, {
    excludeShorts: true,
    minViews: 0, // Don't filter by views for personalized content
    limit: 30,
    estimatedDuration: 600,
  });

  console.log(`[SubscriptionMatcher] Returning ${videos.length} videos from matched subscriptions`);
  return videos;
}

/**
 * Cache for matched channel IDs to avoid repeated database queries
 */
const matchedChannelsCache: Map<string, { channels: string[]; timestamp: number }> = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Get matched channel IDs with caching
 */
export async function getMatchedChannelsCached(
  userId: string,
  topic: string
): Promise<string[]> {
  const cacheKey = `${userId}:${topic}`;
  const cached = matchedChannelsCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.channels;
  }

  const subscriptions = await getUserSubscriptions(userId);
  const channels = matchSubscriptionsToTopic(subscriptions, topic);

  matchedChannelsCache.set(cacheKey, {
    channels,
    timestamp: Date.now(),
  });

  return channels;
}
