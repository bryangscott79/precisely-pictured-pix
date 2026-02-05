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
 * Creates broad queries that capture educational/entertaining content.
 */
function generateSearchQuery(topic: string): string {
  const normalized = topic.trim().toLowerCase();

  // Common topic patterns with optimized queries
  const topicPatterns: Record<string, string> = {
    'art history': 'art history documentary OR famous paintings explained OR art movement history',
    'pokemon': 'pokemon explained OR pokemon guide OR pokemon lore documentary',
    'cooking': 'cooking tutorial chef OR recipe how to make',
    'space': 'space documentary OR NASA universe exploration astronomy',
    'cars': 'car review OR automotive explained OR vehicle documentary',
    'anime': 'anime explained OR anime breakdown OR anime documentary',
    'history': 'history documentary OR historical explained',
    'science': 'science explained OR scientific discovery documentary',
    'music theory': 'music theory explained OR music lessons tutorial',
    'philosophy': 'philosophy explained OR philosophical ideas documentary',
    'psychology': 'psychology explained OR human behavior documentary',
    'economics': 'economics explained OR financial markets documentary',
    'programming': 'programming tutorial OR coding explained developer',
    'photography': 'photography tutorial OR camera techniques explained',
    'architecture': 'architecture documentary OR building design explained',
    'nature': 'nature documentary OR wildlife animals planet',
    'true crime': 'true crime documentary OR criminal investigation',
    'mythology': 'mythology explained OR ancient myths documentary',
  };

  // Check for matching pattern
  for (const [pattern, query] of Object.entries(topicPatterns)) {
    if (normalized.includes(pattern) || pattern.includes(normalized)) {
      return query;
    }
  }

  // Default: generate a broad query from the topic
  // Format: "{topic} explained OR {topic} documentary OR {topic} guide"
  const cleanTopic = topic.trim().replace(/[^\w\s]/g, '');
  return `${cleanTopic} explained OR ${cleanTopic} documentary OR ${cleanTopic} guide tutorial`;
}

/**
 * Get a SearchConfig for fetching videos for a custom channel.
 */
export function getCustomChannelSearchConfig(channel: CustomChannel): SearchConfig {
  return {
    query: channel.searchQuery,
    duration: 'medium',
    uploadDate: 'month',
    order: 'relevance',
    minDuration: 300,     // At least 5 minutes
    maxDuration: 3600,    // Max 1 hour
    minViews: 10000,      // Some quality threshold
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
    if (!user) {
      setChannels([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('custom_channels')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('Error loading custom channels:', fetchError);
        setError('Failed to load custom channels');
        setChannels([]);
      } else if (data) {
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
        setChannels(customChannels);
      }
    } catch (err) {
      console.error('Error loading custom channels:', err);
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
    if (!user) {
      setError('You must be signed in to create channels');
      return null;
    }

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

    try {
      const { data, error: insertError } = await supabase
        .from('custom_channels')
        .insert({
          user_id: user.id,
          name: input.name,
          topic: input.topic,
          search_query: searchQuery,
          icon: input.icon || '📺',
          color: input.color || 'tech',
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating custom channel:', insertError);
        setError('Failed to create channel');
        return null;
      }

      const newChannel: CustomChannel = {
        id: data.id,
        channelId: `${CUSTOM_CHANNEL_PREFIX}${data.id}`,
        name: data.name,
        topic: data.topic || data.name,
        searchQuery: data.search_query || searchQuery,
        icon: data.icon,
        color: data.color as ChannelColor,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      setChannels(prev => [...prev, newChannel]);
      setError(null);
      return newChannel;
    } catch (err) {
      console.error('Error creating custom channel:', err);
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
