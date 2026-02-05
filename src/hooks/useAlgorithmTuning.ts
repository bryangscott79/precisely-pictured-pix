import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const LOCAL_PREFERENCES_KEY = 'epishow-preferences';
const LOCAL_TUNING_KEY = 'epishow-tuning-profile';

export type PreferenceAction = 'up' | 'down' | 'more' | 'never';

export interface VideoPreference {
  videoId: string;
  action: PreferenceAction;
  channelId?: string;    // EpiShow channel where this video appeared
  keywords?: string[];   // Extracted from title
  timestamp: number;
}

export interface TuningProfile {
  // Channels to boost (user liked videos from these)
  boostedChannels: Record<string, number>;  // channelId → weight
  // Channels to suppress (user disliked videos from these)
  suppressedChannels: Record<string, number>;
  // Keywords to boost
  boostedKeywords: string[];
  // Keywords to suppress
  suppressedKeywords: string[];
  // Video IDs to never show
  blockedVideoIds: string[];
  // Last updated
  lastUpdated: number;
}

const EMPTY_PROFILE: TuningProfile = {
  boostedChannels: {},
  suppressedChannels: {},
  boostedKeywords: [],
  suppressedKeywords: [],
  blockedVideoIds: [],
  lastUpdated: Date.now(),
};

// Stop words to filter out when extracting keywords
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'this', 'that', 'these', 'those', 'it', 'its', 'you', 'your', 'we',
  'my', 'i', 'how', 'what', 'why', 'when', 'where', 'which', 'who',
  'official', 'video', 'hd', '4k', '2025', '2024', '2023', 'new', 'full',
  'episode', 'part', 'season', 'trailer', 'teaser', 'clip', 'scene',
]);

// Helper: Extract keywords from video title
function extractKeywords(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word))
    .slice(0, 5);
}

// Get preferences from localStorage
function getLocalPreferences(): VideoPreference[] {
  try {
    const stored = localStorage.getItem(LOCAL_PREFERENCES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading local preferences:', e);
  }
  return [];
}

// Save preferences to localStorage
function saveLocalPreferences(prefs: VideoPreference[]): void {
  try {
    localStorage.setItem(LOCAL_PREFERENCES_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Error saving local preferences:', e);
  }
}

// Get tuning profile from localStorage
function getLocalTuningProfile(): TuningProfile | null {
  try {
    const stored = localStorage.getItem(LOCAL_TUNING_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading local tuning profile:', e);
  }
  return null;
}

// Save tuning profile to localStorage
function saveTuningProfile(profile: TuningProfile): void {
  try {
    localStorage.setItem(LOCAL_TUNING_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving tuning profile:', e);
  }
}

// Merge local and DB preferences (DB takes precedence for same videoId)
function mergePreferences(
  local: VideoPreference[],
  db: VideoPreference[]
): VideoPreference[] {
  const merged = new Map<string, VideoPreference>();

  // Add local first
  local.forEach(p => merged.set(p.videoId, p));

  // DB overwrites (more recent/authoritative)
  db.forEach(p => merged.set(p.videoId, p));

  return Array.from(merged.values());
}

// Build tuning profile from preferences
function buildTuningProfile(prefs: VideoPreference[]): TuningProfile {
  const profile: TuningProfile = {
    boostedChannels: {},
    suppressedChannels: {},
    boostedKeywords: [],
    suppressedKeywords: [],
    blockedVideoIds: [],
    lastUpdated: Date.now(),
  };

  const boostedKeywordsSet = new Set<string>();
  const suppressedKeywordsSet = new Set<string>();

  prefs.forEach(pref => {
    // Track blocked videos
    if (pref.action === 'never') {
      profile.blockedVideoIds.push(pref.videoId);
    }

    // Track channel preferences
    if (pref.channelId) {
      if (pref.action === 'up' || pref.action === 'more') {
        profile.boostedChannels[pref.channelId] =
          (profile.boostedChannels[pref.channelId] || 0) + 1;
      } else if (pref.action === 'down') {
        profile.suppressedChannels[pref.channelId] =
          (profile.suppressedChannels[pref.channelId] || 0) + 1;
      }
    }

    // Track keyword preferences
    if (pref.keywords && pref.keywords.length > 0) {
      if (pref.action === 'up' || pref.action === 'more') {
        pref.keywords.forEach(kw => boostedKeywordsSet.add(kw));
      } else if (pref.action === 'down' || pref.action === 'never') {
        pref.keywords.forEach(kw => suppressedKeywordsSet.add(kw));
      }
    }
  });

  // Convert sets to arrays
  profile.boostedKeywords = Array.from(boostedKeywordsSet);
  profile.suppressedKeywords = Array.from(suppressedKeywordsSet);

  return profile;
}

export function useAlgorithmTuning() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<VideoPreference[]>([]);
  const [tuningProfile, setTuningProfile] = useState<TuningProfile>(
    () => getLocalTuningProfile() || EMPTY_PROFILE
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage and optionally Supabase
  const loadPreferences = useCallback(async () => {
    setIsLoading(true);

    // Always load from localStorage first (instant)
    const localPrefs = getLocalPreferences();

    if (user) {
      // Merge with Supabase data for signed-in users
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id);

        if (!error && data) {
          const dbPrefs: VideoPreference[] = data.map(p => ({
            videoId: p.video_id,
            action: p.action as PreferenceAction,
            timestamp: new Date(p.created_at).getTime(),
          }));

          // Merge: DB takes precedence for same videoId
          const merged = mergePreferences(localPrefs, dbPrefs);
          setPreferences(merged);

          const profile = buildTuningProfile(merged);
          setTuningProfile(profile);
          saveTuningProfile(profile);

          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.error('Error loading preferences from Supabase:', e);
      }
    }

    // Use local preferences only
    setPreferences(localPrefs);
    const profile = buildTuningProfile(localPrefs);
    setTuningProfile(profile);
    saveTuningProfile(profile);
    setIsLoading(false);
  }, [user]);

  // Load preferences on mount and when user changes
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  // Record a new preference
  const recordPreference = useCallback(async (
    videoId: string,
    action: PreferenceAction,
    metadata?: { channelId?: string; title?: string }
  ) => {
    // Extract keywords from title
    const keywords = metadata?.title
      ? extractKeywords(metadata.title)
      : [];

    const pref: VideoPreference = {
      videoId,
      action,
      channelId: metadata?.channelId,
      keywords,
      timestamp: Date.now(),
    };

    // Update state and localStorage
    setPreferences(prev => {
      const updated = prev.filter(p => p.videoId !== videoId);
      updated.push(pref);

      // Save to localStorage
      saveLocalPreferences(updated);

      // Rebuild and save profile
      const profile = buildTuningProfile(updated);
      setTuningProfile(profile);
      saveTuningProfile(profile);

      return updated;
    });

    // Sync to Supabase for signed-in users
    if (user) {
      try {
        // Use upsert to handle duplicates
        const { error } = await supabase
          .from('user_preferences')
          .upsert(
            {
              user_id: user.id,
              video_id: videoId,
              action,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'user_id,video_id',
              ignoreDuplicates: false,
            }
          );

        if (error) {
          console.error('Error saving preference to Supabase:', error);
        }
      } catch (e) {
        console.error('Error syncing preference:', e);
      }
    }
  }, [user]);

  // Remove a preference
  const removePreference = useCallback(async (videoId: string) => {
    setPreferences(prev => {
      const updated = prev.filter(p => p.videoId !== videoId);
      saveLocalPreferences(updated);

      const profile = buildTuningProfile(updated);
      setTuningProfile(profile);
      saveTuningProfile(profile);

      return updated;
    });

    if (user) {
      try {
        await supabase
          .from('user_preferences')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', videoId);
      } catch (e) {
        console.error('Error removing preference from Supabase:', e);
      }
    }
  }, [user]);

  // Get preference for a specific video
  const getPreference = useCallback((videoId: string): PreferenceAction | null => {
    const pref = preferences.find(p => p.videoId === videoId);
    return pref?.action || null;
  }, [preferences]);

  // Check if a video is blocked
  const isVideoBlocked = useCallback((videoId: string): boolean => {
    return tuningProfile.blockedVideoIds.includes(videoId);
  }, [tuningProfile.blockedVideoIds]);

  // Apply tuning to a list of videos (filter and reorder)
  const applyTuning = useCallback(<T extends { id: string; title: string }>(
    videos: T[],
    channelId: string
  ): T[] => {
    // Filter out blocked videos
    let filtered = videos.filter(v =>
      !tuningProfile.blockedVideoIds.includes(v.id)
    );

    // Score and sort by preference alignment
    const scored = filtered.map(video => {
      let score = 0;
      const titleLower = video.title.toLowerCase();

      // Boost for matching keywords (+2 per keyword)
      tuningProfile.boostedKeywords.forEach(kw => {
        if (titleLower.includes(kw.toLowerCase())) score += 2;
      });

      // Suppress for negative keywords (-3 per keyword)
      tuningProfile.suppressedKeywords.forEach(kw => {
        if (titleLower.includes(kw.toLowerCase())) score -= 3;
      });

      // Channel preference
      const boost = tuningProfile.boostedChannels[channelId] || 0;
      const suppress = tuningProfile.suppressedChannels[channelId] || 0;
      score += boost - suppress;

      return { video, score };
    });

    // Sort by score (descending), maintaining relative order for ties
    scored.sort((a, b) => b.score - a.score);

    return scored.map(({ video }) => video);
  }, [tuningProfile]);

  // Augment search query based on preferences
  const augmentSearchQuery = useCallback((
    baseQuery: string,
    _channelId: string
  ): string => {
    let augmented = baseQuery;

    // Add top boosted keywords (limit to 3 to not overwhelm query)
    const topBoosted = tuningProfile.boostedKeywords.slice(0, 3);
    if (topBoosted.length > 0) {
      augmented += ` ${topBoosted.join(' OR ')}`;
    }

    // Exclude suppressed keywords (limit to 3)
    tuningProfile.suppressedKeywords.slice(0, 3).forEach(kw => {
      // Only exclude if keyword is specific enough
      if (kw.length > 3) {
        augmented += ` -"${kw}"`;
      }
    });

    return augmented;
  }, [tuningProfile]);

  // Memoized return value
  return useMemo(() => ({
    // State
    preferences,
    tuningProfile,
    isLoading,

    // Actions
    recordPreference,
    removePreference,
    getPreference,

    // Query helpers
    isVideoBlocked,
    applyTuning,
    augmentSearchQuery,

    // Refresh
    refreshPreferences: loadPreferences,
  }), [
    preferences,
    tuningProfile,
    isLoading,
    recordPreference,
    removePreference,
    getPreference,
    isVideoBlocked,
    applyTuning,
    augmentSearchQuery,
    loadPreferences,
  ]);
}

// Export helper for use outside React components
export { extractKeywords };

// ============================================
// Non-hook utilities for use in other contexts
// ============================================

/**
 * Get the current tuning profile from localStorage (for non-React contexts)
 */
export function getTuningProfile(): TuningProfile {
  return getLocalTuningProfile() || EMPTY_PROFILE;
}

/**
 * Check if a video is blocked (for non-React contexts)
 */
export function isVideoBlockedById(videoId: string): boolean {
  const profile = getTuningProfile();
  return profile.blockedVideoIds.includes(videoId);
}

/**
 * Apply tuning to a list of videos (for non-React contexts)
 */
export function applyTuningToVideos<T extends { id: string; title: string }>(
  videos: T[],
  channelId: string
): T[] {
  const profile = getTuningProfile();

  // Filter out blocked videos
  let filtered = videos.filter(v =>
    !profile.blockedVideoIds.includes(v.id)
  );

  // Score and sort by preference alignment
  const scored = filtered.map(video => {
    let score = 0;
    const titleLower = video.title.toLowerCase();

    // Boost for matching keywords (+2 per keyword)
    profile.boostedKeywords.forEach(kw => {
      if (titleLower.includes(kw.toLowerCase())) score += 2;
    });

    // Suppress for negative keywords (-3 per keyword)
    profile.suppressedKeywords.forEach(kw => {
      if (titleLower.includes(kw.toLowerCase())) score -= 3;
    });

    // Channel preference
    const boost = profile.boostedChannels[channelId] || 0;
    const suppress = profile.suppressedChannels[channelId] || 0;
    score += boost - suppress;

    return { video, score };
  });

  // Sort by score (descending), maintaining relative order for ties
  scored.sort((a, b) => b.score - a.score);

  return scored.map(({ video }) => video);
}

/**
 * Augment a search query with user preferences (for non-React contexts)
 */
export function augmentQueryWithTuning(baseQuery: string): string {
  const profile = getTuningProfile();
  let augmented = baseQuery;

  // Add top boosted keywords (limit to 3 to not overwhelm query)
  const topBoosted = profile.boostedKeywords.slice(0, 3);
  if (topBoosted.length > 0) {
    augmented += ` ${topBoosted.join(' OR ')}`;
  }

  // Exclude suppressed keywords (limit to 3)
  profile.suppressedKeywords.slice(0, 3).forEach(kw => {
    // Only exclude if keyword is specific enough
    if (kw.length > 3) {
      augmented += ` -"${kw}"`;
    }
  });

  return augmented;
}
