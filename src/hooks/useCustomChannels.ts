import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserTier } from '@/contexts/UserTierContext';
import { supabase } from '@/integrations/supabase/client';
import { Channel, ChannelCategory, ContentRating, ChannelColor, Video } from '@/data/channels';
import { SearchConfig } from '@/services/youtubeService';

// Custom channel ID prefix - used to identify custom channels in the system
export const CUSTOM_CHANNEL_PREFIX = 'custom-';

// Database row type for custom channels
export interface CustomChannelRow {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  video_ids: string[];
  youtube_channel_ids: string[] | null;
  topic: string | null;
  search_query: string | null;
  created_at: string;
  updated_at: string;
}

// Input for creating a new custom channel
export interface CreateChannelInput {
  name: string;
  topic: string;
  icon?: string;
  color?: ChannelColor;
}

// Input for updating a custom channel
export interface UpdateChannelInput {
  name?: string;
  topic?: string;
  icon?: string;
  color?: ChannelColor;
}

// Custom channel with metadata
export interface CustomChannel {
  id: string;           // UUID from database
  channelId: string;    // 'custom-{uuid}' for use in app
  name: string;
  topic: string;
  searchQuery: string;
  icon: string;
  color: ChannelColor;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Topic → Search Query Generation
// ============================================

/**
 * Generate a YouTube search query from a user-provided topic.
 * Creates specific queries that directly match the topic.
 */
function generateSearchQuery(topic: string): string {
  const normalized = topic.trim().toLowerCase();
  const cleanTopic = topic.trim();

  // NFL Teams - search for highlights and news
  const nflTeams = [
    'broncos', 'chiefs', 'raiders', 'chargers', 'bills', 'dolphins', 'patriots', 'jets',
    'ravens', 'bengals', 'browns', 'steelers', 'texans', 'colts', 'jaguars', 'titans',
    'cowboys', 'eagles', 'giants', 'commanders', 'bears', 'lions', 'packers', 'vikings',
    'falcons', 'panthers', 'saints', 'buccaneers', 'cardinals', 'rams', 'seahawks', '49ers'
  ];

  for (const team of nflTeams) {
    if (normalized.includes(team)) {
      // Extract team name for search
      return `"${cleanTopic}" highlights 2024 OR "${cleanTopic}" news OR NFL ${team} highlights`;
    }
  }

  // NBA Teams
  const nbaTeams = [
    'lakers', 'celtics', 'warriors', 'bulls', 'heat', 'nets', 'knicks', 'nuggets',
    'suns', 'mavericks', 'bucks', 'sixers', '76ers', 'clippers', 'spurs', 'raptors'
  ];

  for (const team of nbaTeams) {
    if (normalized.includes(team)) {
      return `"${cleanTopic}" highlights 2024 OR "${cleanTopic}" news OR NBA ${team} highlights`;
    }
  }

  // MLB Teams
  const mlbTeams = [
    'yankees', 'red sox', 'dodgers', 'cubs', 'mets', 'braves', 'astros', 'phillies',
    'cardinals', 'giants', 'padres', 'rangers', 'mariners', 'twins', 'guardians'
  ];

  for (const team of mlbTeams) {
    if (normalized.includes(team)) {
      return `"${cleanTopic}" highlights 2024 OR "${cleanTopic}" news OR MLB ${team} highlights`;
    }
  }

  // Sports keywords
  if (normalized.includes('sports') || normalized.includes('football') ||
      normalized.includes('basketball') || normalized.includes('baseball') ||
      normalized.includes('soccer') || normalized.includes('hockey')) {
    return `"${cleanTopic}" highlights 2024 OR "${cleanTopic}" best plays`;
  }

  // Trading cards / collectibles
  if (normalized.includes('cards') || normalized.includes('trading') ||
      normalized.includes('collectible') || normalized.includes('collecting')) {
    return `"${cleanTopic}" OR sports cards breaks OR card collecting`;
  }

  // Common topic patterns with optimized queries
  const topicPatterns: Record<string, string> = {
    'art history': 'art history documentary OR famous paintings explained',
    'pokemon': 'pokemon explained OR pokemon strategy OR pokemon lore',
    'cooking': 'cooking tutorial chef OR recipe how to make',
    'space': 'space documentary OR NASA OR astronomy explained',
    'cars': 'car review 2024 OR automotive news OR vehicle test drive',
    'anime': 'anime explained OR anime analysis OR anime review',
    'history': 'history documentary OR historical events explained',
    'science': 'science explained OR scientific discovery',
    'music theory': 'music theory explained OR music lessons',
    'philosophy': 'philosophy explained OR philosophical ideas',
    'programming': 'programming tutorial OR coding explained',
    'photography': 'photography tutorial OR camera techniques',
    'nature': 'nature documentary 4K OR wildlife',
    'true crime': 'true crime documentary OR criminal investigation',
    'gaming': 'gaming news OR game review 2024 OR gameplay',
  };

  // Check for matching pattern
  for (const [pattern, query] of Object.entries(topicPatterns)) {
    if (normalized.includes(pattern) || pattern.includes(normalized)) {
      return query;
    }
  }

  // Default: search directly for the topic with quotes for exact match
  // This ensures "Denver Broncos" searches for exactly that, not random content
  return `"${cleanTopic}" OR ${cleanTopic} 2024`;
}

/**
 * Get a SearchConfig for fetching videos for a custom channel.
 */
export function getCustomChannelSearchConfig(channel: CustomChannel): SearchConfig {
  const topicLower = channel.topic.toLowerCase();

  // Sports topics need recent content and shorter highlights
  const isSports = topicLower.includes('broncos') || topicLower.includes('sports') ||
    topicLower.includes('nfl') || topicLower.includes('nba') || topicLower.includes('mlb') ||
    topicLower.includes('football') || topicLower.includes('basketball') ||
    topicLower.includes('baseball') || topicLower.includes('highlights');

  // Trading cards need different parameters
  const isCards = topicLower.includes('cards') || topicLower.includes('trading') ||
    topicLower.includes('collectible');

  if (isSports) {
    return {
      query: channel.searchQuery,
      duration: 'medium',
      uploadDate: 'week',    // Recent sports content
      order: 'date',         // Most recent first
      minDuration: 60,       // Highlights can be short
      maxDuration: 3600,
      minViews: 1000,        // Lower threshold for recent content
    };
  }

  if (isCards) {
    return {
      query: channel.searchQuery,
      duration: 'medium',
      uploadDate: 'week',
      order: 'date',
      minDuration: 300,
      maxDuration: 7200,     // Card breaks can be long
      minViews: 500,         // Niche content
    };
  }

  // Default config for other topics
  return {
    query: channel.searchQuery,
    duration: 'medium',
    uploadDate: 'month',
    order: 'relevance',
    minDuration: 300,     // At least 5 minutes
    maxDuration: 3600,    // Max 1 hour
    minViews: 5000,       // Lower threshold
  };
}

/**
 * Convert a custom channel to the standard Channel format for use in the app.
 */
export function toChannelFormat(customChannel: CustomChannel): Channel {
  return {
    id: customChannel.channelId,
    name: customChannel.name,
    icon: customChannel.icon,
    color: customChannel.color,
    category: 'hobbies' as ChannelCategory, // Custom channels go in hobbies
    contentRating: 'PG-13' as ContentRating,
    description: `Your custom ${customChannel.topic} channel`,
    videos: [], // Videos are loaded dynamically
    premium: false, // Custom channels aren't premium-locked (but creating them requires connected/premium)
  };
}

/**
 * Check if a channel ID is a custom channel.
 */
export function isCustomChannel(channelId: string): boolean {
  return channelId.startsWith(CUSTOM_CHANNEL_PREFIX);
}

/**
 * Extract the UUID from a custom channel ID.
 */
export function getCustomChannelUuid(channelId: string): string | null {
  if (!isCustomChannel(channelId)) return null;
  return channelId.slice(CUSTOM_CHANNEL_PREFIX.length);
}

// ============================================
// Hook: useCustomChannels
// ============================================

export function useCustomChannels() {
  const { user } = useAuth();
  const { customChannelLimit, isConnected, openUpgradeModal } = useUserTier();

  const [channels, setChannels] = useState<CustomChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load custom channels from Supabase
  const loadChannels = useCallback(async () => {
    console.log('[CustomChannels] loadChannels called, user:', user?.id);

    if (!user) {
      console.log('[CustomChannels] No user, clearing channels');
      setChannels([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('[CustomChannels] Fetching channels for user:', user.id);
      const { data, error: fetchError } = await supabase
        .from('custom_channels')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('[CustomChannels] Error loading custom channels:', fetchError);
        setError('Failed to load custom channels');
        setChannels([]);
      } else if (data) {
        console.log('[CustomChannels] Loaded channels from DB:', data);
        const customChannels: CustomChannel[] = data.map((row: CustomChannelRow) => ({
          id: row.id,
          channelId: `${CUSTOM_CHANNEL_PREFIX}${row.id}`,
          name: row.name,
          topic: row.topic || row.name, // Fallback to name if no topic
          searchQuery: row.search_query || generateSearchQuery(row.topic || row.name),
          icon: row.icon,
          color: row.color as ChannelColor,
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at),
        }));
        console.log('[CustomChannels] Processed channels:', customChannels);
        setChannels(customChannels);
      }
    } catch (err) {
      console.error('[CustomChannels] Error loading custom channels:', err);
      setError('Failed to load custom channels');
    }

    setIsLoading(false);
  }, [user]);

  // Load channels on mount and when user changes
  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  // Check if user can create more channels
  const canCreateChannel = useMemo(() => {
    if (!isConnected) return false;
    return channels.length < customChannelLimit;
  }, [isConnected, channels.length, customChannelLimit]);

  // Remaining channel slots
  const remainingSlots = useMemo(() => {
    if (customChannelLimit === Infinity) return Infinity;
    return Math.max(0, customChannelLimit - channels.length);
  }, [customChannelLimit, channels.length]);

  // Create a new custom channel
  const createChannel = useCallback(async (input: CreateChannelInput): Promise<CustomChannel | null> => {
    console.log('[CustomChannels] createChannel called with:', input);

    if (!user) {
      console.error('[CustomChannels] No user found');
      setError('You must be signed in to create channels');
      return null;
    }

    console.log('[CustomChannels] User ID:', user.id);
    console.log('[CustomChannels] canCreateChannel:', canCreateChannel);
    console.log('[CustomChannels] isConnected:', isConnected);

    if (!canCreateChannel) {
      if (!isConnected) {
        setError('Sign in to create custom channels');
      } else {
        setError('You have reached your custom channel limit');
        openUpgradeModal();
      }
      return null;
    }

    const searchQuery = generateSearchQuery(input.topic);
    console.log('[CustomChannels] Generated search query:', searchQuery);

    try {
      // First, try inserting with topic and search_query (new schema)
      // If that fails due to missing columns, fall back to basic insert
      const insertData: Record<string, unknown> = {
        user_id: user.id,
        name: input.name,
        icon: input.icon || '📺',
        color: input.color || 'tech',
        video_ids: [], // Required field
      };

      // Try to include topic and search_query (may fail if migration hasn't run)
      insertData.topic = input.topic;
      insertData.search_query = searchQuery;

      console.log('[CustomChannels] Inserting data:', insertData);

      const { data, error: insertError } = await supabase
        .from('custom_channels')
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        console.error('[CustomChannels] Supabase insert error:', insertError);
        console.error('[CustomChannels] Error code:', insertError.code);
        console.error('[CustomChannels] Error message:', insertError.message);
        console.error('[CustomChannels] Error details:', insertError.details);

        // If error is about missing columns, try without topic/search_query
        if (insertError.message?.includes('topic') || insertError.message?.includes('search_query')) {
          console.log('[CustomChannels] Retrying without topic/search_query columns');
          const basicInsert = {
            user_id: user.id,
            name: input.name,
            icon: input.icon || '📺',
            color: input.color || 'tech',
            video_ids: [],
          };

          const { data: fallbackData, error: fallbackError } = await supabase
            .from('custom_channels')
            .insert(basicInsert)
            .select()
            .single();

          if (fallbackError) {
            console.error('[CustomChannels] Fallback insert also failed:', fallbackError);
            setError(`Failed to create channel: ${fallbackError.message}`);
            return null;
          }

          const newChannel: CustomChannel = {
            id: fallbackData.id,
            channelId: `${CUSTOM_CHANNEL_PREFIX}${fallbackData.id}`,
            name: fallbackData.name,
            topic: input.topic, // Use input topic since DB doesn't have it
            searchQuery: searchQuery, // Use generated query
            icon: fallbackData.icon,
            color: fallbackData.color as ChannelColor,
            createdAt: new Date(fallbackData.created_at),
            updatedAt: new Date(fallbackData.updated_at),
          };

          console.log('[CustomChannels] Channel created (fallback):', newChannel);
          setChannels(prev => [...prev, newChannel]);
          setError(null);
          return newChannel;
        }

        setError(`Failed to create channel: ${insertError.message}`);
        return null;
      }

      console.log('[CustomChannels] Insert successful, data:', data);

      const newChannel: CustomChannel = {
        id: data.id,
        channelId: `${CUSTOM_CHANNEL_PREFIX}${data.id}`,
        name: data.name,
        topic: data.topic || input.topic,
        searchQuery: data.search_query || searchQuery,
        icon: data.icon,
        color: data.color as ChannelColor,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      console.log('[CustomChannels] Channel created:', newChannel);
      setChannels(prev => [...prev, newChannel]);
      setError(null);
      return newChannel;
    } catch (err) {
      console.error('[CustomChannels] Unexpected error creating custom channel:', err);
      setError('Failed to create channel');
      return null;
    }
  }, [user, canCreateChannel, isConnected, openUpgradeModal]);

  // Update an existing custom channel
  const updateChannel = useCallback(async (
    channelId: string,
    updates: UpdateChannelInput
  ): Promise<boolean> => {
    if (!user) {
      setError('You must be signed in to update channels');
      return false;
    }

    const uuid = getCustomChannelUuid(channelId);
    if (!uuid) {
      setError('Invalid channel ID');
      return false;
    }

    const updateData: Record<string, unknown> = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.icon !== undefined) updateData.icon = updates.icon;
    if (updates.color !== undefined) updateData.color = updates.color;
    if (updates.topic !== undefined) {
      updateData.topic = updates.topic;
      updateData.search_query = generateSearchQuery(updates.topic);
    }

    try {
      const { error: updateError } = await supabase
        .from('custom_channels')
        .update(updateData)
        .eq('id', uuid)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating custom channel:', updateError);
        setError('Failed to update channel');
        return false;
      }

      // Update local state
      setChannels(prev => prev.map(ch => {
        if (ch.id !== uuid) return ch;
        return {
          ...ch,
          name: updates.name ?? ch.name,
          topic: updates.topic ?? ch.topic,
          searchQuery: updates.topic ? generateSearchQuery(updates.topic) : ch.searchQuery,
          icon: updates.icon ?? ch.icon,
          color: updates.color ?? ch.color,
          updatedAt: new Date(),
        };
      }));

      setError(null);
      return true;
    } catch (err) {
      console.error('Error updating custom channel:', err);
      setError('Failed to update channel');
      return false;
    }
  }, [user]);

  // Delete a custom channel
  const deleteChannel = useCallback(async (channelId: string): Promise<boolean> => {
    if (!user) {
      setError('You must be signed in to delete channels');
      return false;
    }

    const uuid = getCustomChannelUuid(channelId);
    if (!uuid) {
      setError('Invalid channel ID');
      return false;
    }

    try {
      const { error: deleteError } = await supabase
        .from('custom_channels')
        .delete()
        .eq('id', uuid)
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Error deleting custom channel:', deleteError);
        setError('Failed to delete channel');
        return false;
      }

      // Update local state
      setChannels(prev => prev.filter(ch => ch.id !== uuid));
      setError(null);
      return true;
    } catch (err) {
      console.error('Error deleting custom channel:', err);
      setError('Failed to delete channel');
      return false;
    }
  }, [user]);

  // Get a specific custom channel by ID
  const getChannel = useCallback((channelId: string): CustomChannel | null => {
    const uuid = getCustomChannelUuid(channelId);
    if (!uuid) return null;
    return channels.find(ch => ch.id === uuid) || null;
  }, [channels]);

  // Get search config for a custom channel
  const getSearchConfig = useCallback((channelId: string): SearchConfig | null => {
    const channel = getChannel(channelId);
    if (!channel) return null;
    return getCustomChannelSearchConfig(channel);
  }, [getChannel]);

  // Convert all custom channels to Channel format
  const channelsAsChannelFormat = useMemo(() => {
    return channels.map(toChannelFormat);
  }, [channels]);

  return useMemo(() => ({
    // State
    channels,
    channelsAsChannelFormat,
    isLoading,
    error,

    // Limits
    canCreateChannel,
    remainingSlots,
    customChannelLimit,

    // Actions
    createChannel,
    updateChannel,
    deleteChannel,

    // Utilities
    getChannel,
    getSearchConfig,

    // Refresh
    refreshChannels: loadChannels,
  }), [
    channels,
    channelsAsChannelFormat,
    isLoading,
    error,
    canCreateChannel,
    remainingSlots,
    customChannelLimit,
    createChannel,
    updateChannel,
    deleteChannel,
    getChannel,
    getSearchConfig,
    loadChannels,
  ]);
}

// ============================================
// Standalone utilities for non-React contexts
// ============================================

/**
 * Get the search config for a custom channel by ID (requires the channel data).
 * This is exported for use in useDynamicVideos.
 */
export { generateSearchQuery };
