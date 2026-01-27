import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export type OnboardingStep = 'welcome' | 'interests' | 'youtube' | 'lineup' | 'complete';

export interface ChannelLineupItem {
  channelId: string;
  position: number;
  isCustom: boolean;
}

interface OnboardingState {
  currentStep: OnboardingStep;
  selectedInterests: string[];
  youtubeConnected: boolean;
  channelLineup: ChannelLineupItem[];
  isCompleted: boolean;
}

interface OnboardingContextType {
  state: OnboardingState;
  isLoading: boolean;
  isOnboardingOpen: boolean;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  setStep: (step: OnboardingStep) => void;
  setInterests: (interests: string[]) => void;
  toggleInterest: (interest: string) => void;
  setChannelLineup: (lineup: ChannelLineupItem[]) => void;
  addChannelToLineup: (channelId: string) => void;
  removeChannelFromLineup: (channelId: string) => void;
  reorderLineup: (from: number, to: number) => void;
  continueAsGuest: () => void;
  completeOnboarding: () => Promise<void>;
  needsOnboarding: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const INTEREST_TO_CHANNEL_MAP: Record<string, string[]> = {
  science: ['science', 'nature'],
  technology: ['tech'],
  history: ['history'],
  cooking: ['cooking'],
  fitness: ['fitness'],
  gaming: ['gaming'],
  faith: ['faith'],
  kids: ['kids', 'family'],
  nature: ['nature'],
  automotive: ['automotive'],
  comedy: ['comedy'],
  music: ['music', 'music80s', 'music90s', 'music00s', 'music10s'],
  diy: ['diy', 'maker'],
  art: ['art'],
  sports: ['sports'],
  travel: ['travel'],
  podcasts: ['podcast'],
  teen: ['teen'],
};

export const AVAILABLE_INTERESTS = [
  { id: 'science', label: 'Science', icon: '🔬' },
  { id: 'technology', label: 'Technology', icon: '💻' },
  { id: 'history', label: 'History', icon: '📜' },
  { id: 'cooking', label: 'Cooking', icon: '🍳' },
  { id: 'fitness', label: 'Fitness', icon: '💪' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
  { id: 'faith', label: 'Faith', icon: '✝️' },
  { id: 'kids', label: 'Kids', icon: '🧒' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'automotive', label: 'Automotive', icon: '🚗' },
  { id: 'comedy', label: 'Comedy', icon: '😂' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'diy', label: 'DIY & Maker', icon: '🔧' },
  { id: 'art', label: 'Art & Design', icon: '🎨' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'podcasts', label: 'Podcasts', icon: '🎙️' },
  { id: 'teen', label: 'Teen', icon: '🔥' },
];

const DEFAULT_STATE: OnboardingState = {
  currentStep: 'welcome',
  selectedInterests: [],
  youtubeConnected: false,
  channelLineup: [],
  isCompleted: false,
};

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [state, setState] = useState<OnboardingState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);

  // Check if user has completed onboarding
  useEffect(() => {
    const checkOnboarding = async () => {
      if (authLoading) return;
      
      // Guest mode - check localStorage
      if (!user) {
        const guestCompleted = localStorage.getItem('epishow-guest-onboarding-completed');
        if (!guestCompleted) {
          setIsOnboardingOpen(true);
        }
        setIsLoading(false);
        setHasCheckedOnboarding(true);
        return;
      }

      // Logged in user - check database
      try {
        const { data, error } = await supabase
          .from('user_onboarding')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching onboarding:', error);
          setIsLoading(false);
          setHasCheckedOnboarding(true);
          return;
        }

        if (!data || !data.completed_at) {
          // User hasn't completed onboarding
          if (data) {
            setState({
              currentStep: 'interests',
              selectedInterests: data.selected_interests || [],
              youtubeConnected: data.youtube_connected || false,
              channelLineup: [],
              isCompleted: false,
            });
          }
          setIsOnboardingOpen(true);
        } else {
          // Load saved lineup
          const { data: lineupData } = await supabase
            .from('user_channel_lineup')
            .select('*')
            .eq('user_id', user.id)
            .order('position');

          setState({
            currentStep: 'complete',
            selectedInterests: data.selected_interests || [],
            youtubeConnected: data.youtube_connected || false,
            channelLineup: lineupData?.map(l => ({
              channelId: l.channel_id,
              position: l.position,
              isCustom: l.is_custom,
            })) || [],
            isCompleted: true,
          });
        }
      } catch (err) {
        console.error('Onboarding check failed:', err);
      } finally {
        setIsLoading(false);
        setHasCheckedOnboarding(true);
      }
    };

    checkOnboarding();
  }, [user, authLoading]);

  const openOnboarding = useCallback(() => setIsOnboardingOpen(true), []);
  const closeOnboarding = useCallback(() => setIsOnboardingOpen(false), []);

  const setStep = useCallback((step: OnboardingStep) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const setInterests = useCallback((interests: string[]) => {
    setState(prev => ({ ...prev, selectedInterests: interests }));
  }, []);

  const toggleInterest = useCallback((interest: string) => {
    setState(prev => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interest)
        ? prev.selectedInterests.filter(i => i !== interest)
        : [...prev.selectedInterests, interest],
    }));
  }, []);

  const setChannelLineup = useCallback((lineup: ChannelLineupItem[]) => {
    setState(prev => ({ ...prev, channelLineup: lineup }));
  }, []);

  const addChannelToLineup = useCallback((channelId: string) => {
    setState(prev => {
      if (prev.channelLineup.some(l => l.channelId === channelId)) return prev;
      return {
        ...prev,
        channelLineup: [
          ...prev.channelLineup,
          { channelId, position: prev.channelLineup.length, isCustom: false },
        ],
      };
    });
  }, []);

  const removeChannelFromLineup = useCallback((channelId: string) => {
    setState(prev => ({
      ...prev,
      channelLineup: prev.channelLineup
        .filter(l => l.channelId !== channelId)
        .map((l, i) => ({ ...l, position: i })),
    }));
  }, []);

  const reorderLineup = useCallback((from: number, to: number) => {
    setState(prev => {
      const lineup = [...prev.channelLineup];
      const [moved] = lineup.splice(from, 1);
      lineup.splice(to, 0, moved);
      return {
        ...prev,
        channelLineup: lineup.map((l, i) => ({ ...l, position: i })),
      };
    });
  }, []);

  const continueAsGuest = useCallback(() => {
    localStorage.setItem('epishow-guest-onboarding-completed', 'true');
    setState(prev => ({ ...prev, isCompleted: true }));
    setIsOnboardingOpen(false);
  }, []);

  const completeOnboarding = useCallback(async () => {
    if (!user) {
      continueAsGuest();
      return;
    }

    try {
      // Generate default lineup from interests if empty
      let lineup = state.channelLineup;
      if (lineup.length === 0) {
        const channelIds = new Set<string>();
        state.selectedInterests.forEach(interest => {
          const channels = INTEREST_TO_CHANNEL_MAP[interest] || [];
          channels.forEach(c => channelIds.add(c));
        });
        lineup = Array.from(channelIds).map((channelId, i) => ({
          channelId,
          position: i,
          isCustom: false,
        }));
      }

      // Save onboarding data
      const { error: onboardingError } = await supabase
        .from('user_onboarding')
        .upsert({
          user_id: user.id,
          selected_interests: state.selectedInterests,
          youtube_connected: state.youtubeConnected,
          completed_at: new Date().toISOString(),
        });

      if (onboardingError) throw onboardingError;

      // Save channel lineup
      if (lineup.length > 0) {
        // Delete existing lineup first
        await supabase
          .from('user_channel_lineup')
          .delete()
          .eq('user_id', user.id);

        const { error: lineupError } = await supabase
          .from('user_channel_lineup')
          .insert(
            lineup.map(l => ({
              user_id: user.id,
              channel_id: l.channelId,
              position: l.position,
              is_custom: l.isCustom,
            }))
          );

        if (lineupError) throw lineupError;
      }

      setState(prev => ({
        ...prev,
        channelLineup: lineup,
        isCompleted: true,
        currentStep: 'complete',
      }));
      setIsOnboardingOpen(false);
    } catch (err) {
      console.error('Failed to save onboarding:', err);
      throw err;
    }
  }, [user, state, continueAsGuest]);

  const needsOnboarding = !isLoading && !state.isCompleted && hasCheckedOnboarding;

  return (
    <OnboardingContext.Provider
      value={{
        state,
        isLoading,
        isOnboardingOpen,
        openOnboarding,
        closeOnboarding,
        setStep,
        setInterests,
        toggleInterest,
        setChannelLineup,
        addChannelToLineup,
        removeChannelFromLineup,
        reorderLineup,
        continueAsGuest,
        completeOnboarding,
        needsOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
