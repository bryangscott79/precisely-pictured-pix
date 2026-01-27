import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export type ContentRating = 'G' | 'PG' | 'PG-13' | 'R';

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  isChild: boolean;
  pin?: string;
  maxRating: ContentRating;
  allowedChannels?: string[];
  dailyLimitMinutes?: number;
  bedtime?: string; // "HH:MM" format
}

// Content rating hierarchy - what's allowed at each level
export const RATING_CHANNELS: Record<ContentRating, string[]> = {
  'G': ['kids', 'family', 'nature', 'faith'],
  'PG': ['kids', 'family', 'nature', 'faith', 'science', 'history', 'cooking', 'diy', 'art'],
  'PG-13': ['kids', 'family', 'nature', 'faith', 'science', 'history', 'cooking', 'diy', 'art', 
            'tech', 'maker', 'automotive', 'fitness', 'travel', 'music', 'music80s', 'music90s', 'music00s', 'music10s', 'podcast'],
  'R': [], // Empty means all channels allowed
};

// Avatar options for profiles
export const AVATAR_OPTIONS = ['🧒', '👧', '👦', '👶', '🧒🏻', '👧🏻', '👦🏻', '🧒🏽', '👧🏽', '👦🏽', '🧒🏿', '👧🏿', '👦🏿', '🐻', '🦁', '🐰', '🐶', '🐱', '🦊', '🐼'];

interface WatchSession {
  startTime: number;
  totalWatched: number; // in seconds
}

interface ProfileContextType {
  profiles: Profile[];
  activeProfile: Profile | null;
  isChildProfile: boolean;
  watchSession: WatchSession | null;
  timeRemaining: number | null; // in seconds
  isBedtimeLocked: boolean;
  createProfile: (profile: Omit<Profile, 'id'>) => void;
  updateProfile: (id: string, updates: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;
  switchProfile: (id: string, pin?: string) => boolean;
  switchToMainProfile: (pin: string) => boolean;
  isChannelAllowed: (channelId: string) => boolean;
  getMainProfile: () => Profile | null;
  resetDailyWatch: () => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

const PROFILES_STORAGE_KEY = 'epishow_profiles';
const ACTIVE_PROFILE_KEY = 'epishow_active_profile';
const WATCH_SESSION_KEY = 'epishow_watch_session';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function getDefaultMainProfile(): Profile {
  return {
    id: 'main',
    name: 'Main',
    avatar: '👤',
    isChild: false,
    maxRating: 'R',
  };
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [watchSession, setWatchSession] = useState<WatchSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isBedtimeLocked, setIsBedtimeLocked] = useState(false);

  // Load profiles from storage
  useEffect(() => {
    const stored = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProfiles(parsed);
      } catch {
        // Initialize with main profile
        setProfiles([getDefaultMainProfile()]);
      }
    } else {
      setProfiles([getDefaultMainProfile()]);
    }

    // Load active profile
    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
    setActiveProfileId(activeId || 'main');

    // Load watch session
    const sessionData = localStorage.getItem(WATCH_SESSION_KEY);
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        // Check if session is from today
        const sessionDate = new Date(session.startTime);
        const today = new Date();
        if (sessionDate.toDateString() === today.toDateString()) {
          setWatchSession(session);
        } else {
          // Reset for new day
          localStorage.removeItem(WATCH_SESSION_KEY);
        }
      } catch {
        localStorage.removeItem(WATCH_SESSION_KEY);
      }
    }
  }, []);

  // Save profiles to storage
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    }
  }, [profiles]);

  // Save active profile
  useEffect(() => {
    if (activeProfileId) {
      localStorage.setItem(ACTIVE_PROFILE_KEY, activeProfileId);
    }
  }, [activeProfileId]);

  // Get active profile
  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0] || null;
  const isChildProfile = activeProfile?.isChild || false;

  // Check bedtime lockout
  useEffect(() => {
    const checkBedtime = () => {
      if (!activeProfile?.bedtime || !activeProfile.isChild) {
        setIsBedtimeLocked(false);
        return;
      }

      const now = new Date();
      const [hours, minutes] = activeProfile.bedtime.split(':').map(Number);
      const bedtimeToday = new Date();
      bedtimeToday.setHours(hours, minutes, 0, 0);

      // Bedtime is active from the set time until 6 AM next day
      const morningTime = new Date();
      morningTime.setHours(6, 0, 0, 0);
      if (morningTime <= now) {
        morningTime.setDate(morningTime.getDate() + 1);
      }

      const isAfterBedtime = now >= bedtimeToday || now.getHours() < 6;
      setIsBedtimeLocked(isAfterBedtime && now.getHours() >= hours);
    };

    checkBedtime();
    const interval = setInterval(checkBedtime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [activeProfile]);

  // Track watch time for time limits
  useEffect(() => {
    if (!activeProfile?.dailyLimitMinutes || !activeProfile.isChild) {
      setTimeRemaining(null);
      return;
    }

    const limitSeconds = activeProfile.dailyLimitMinutes * 60;
    
    // Initialize or update watch session
    if (!watchSession) {
      const newSession: WatchSession = {
        startTime: Date.now(),
        totalWatched: 0,
      };
      setWatchSession(newSession);
      localStorage.setItem(WATCH_SESSION_KEY, JSON.stringify(newSession));
      setTimeRemaining(limitSeconds);
    } else {
      const elapsed = Math.floor((Date.now() - watchSession.startTime) / 1000);
      const remaining = Math.max(0, limitSeconds - (watchSession.totalWatched + elapsed));
      setTimeRemaining(remaining);
    }

    // Update time remaining every second
    const interval = setInterval(() => {
      if (watchSession) {
        const elapsed = Math.floor((Date.now() - watchSession.startTime) / 1000);
        const remaining = Math.max(0, limitSeconds - (watchSession.totalWatched + elapsed));
        setTimeRemaining(remaining);

        // Save updated session
        const updatedSession = {
          ...watchSession,
          totalWatched: watchSession.totalWatched + 1,
        };
        setWatchSession(updatedSession);
        localStorage.setItem(WATCH_SESSION_KEY, JSON.stringify(updatedSession));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeProfile, watchSession]);

  const createProfile = useCallback((profile: Omit<Profile, 'id'>) => {
    const newProfile: Profile = {
      ...profile,
      id: generateId(),
    };
    setProfiles(prev => [...prev, newProfile]);
  }, []);

  const updateProfile = useCallback((id: string, updates: Partial<Profile>) => {
    setProfiles(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ));
  }, []);

  const deleteProfile = useCallback((id: string) => {
    if (id === 'main') return; // Can't delete main profile
    setProfiles(prev => prev.filter(p => p.id !== id));
    if (activeProfileId === id) {
      setActiveProfileId('main');
    }
  }, [activeProfileId]);

  const switchProfile = useCallback((id: string, pin?: string): boolean => {
    const profile = profiles.find(p => p.id === id);
    if (!profile) return false;

    // If switching from a child profile, require PIN of the main profile
    if (activeProfile?.isChild && !profile.isChild) {
      const mainProfile = profiles.find(p => !p.isChild && p.pin);
      if (mainProfile?.pin && pin !== mainProfile.pin) {
        return false;
      }
    }

    setActiveProfileId(id);
    
    // Reset watch session for new profile
    if (profile.isChild && profile.dailyLimitMinutes) {
      const sessionData = localStorage.getItem(WATCH_SESSION_KEY);
      if (!sessionData) {
        const newSession: WatchSession = {
          startTime: Date.now(),
          totalWatched: 0,
        };
        setWatchSession(newSession);
        localStorage.setItem(WATCH_SESSION_KEY, JSON.stringify(newSession));
      }
    }
    
    return true;
  }, [profiles, activeProfile]);

  const switchToMainProfile = useCallback((pin: string): boolean => {
    const mainProfile = profiles.find(p => !p.isChild);
    if (!mainProfile) return false;

    // Check PIN if set
    if (mainProfile.pin && mainProfile.pin !== pin) {
      return false;
    }

    setActiveProfileId(mainProfile.id);
    return true;
  }, [profiles]);

  const isChannelAllowed = useCallback((channelId: string): boolean => {
    if (!activeProfile) return true;
    if (!activeProfile.isChild) return true;

    // Check custom allowed channels first
    if (activeProfile.allowedChannels && activeProfile.allowedChannels.length > 0) {
      return activeProfile.allowedChannels.includes(channelId);
    }

    // Check by content rating
    const rating = activeProfile.maxRating;
    if (rating === 'R') return true; // All channels allowed

    const allowedByRating = RATING_CHANNELS[rating];
    return allowedByRating.includes(channelId);
  }, [activeProfile]);

  const getMainProfile = useCallback(() => {
    return profiles.find(p => !p.isChild) || null;
  }, [profiles]);

  const resetDailyWatch = useCallback(() => {
    localStorage.removeItem(WATCH_SESSION_KEY);
    setWatchSession(null);
    setTimeRemaining(activeProfile?.dailyLimitMinutes ? activeProfile.dailyLimitMinutes * 60 : null);
  }, [activeProfile]);

  return (
    <ProfileContext.Provider value={{
      profiles,
      activeProfile,
      isChildProfile,
      watchSession,
      timeRemaining,
      isBedtimeLocked,
      createProfile,
      updateProfile,
      deleteProfile,
      switchProfile,
      switchToMainProfile,
      isChannelAllowed,
      getMainProfile,
      resetDailyWatch,
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfiles() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfiles must be used within ProfileProvider');
  }
  return context;
}
