import { useEffect, useState, useCallback, useRef } from 'react';
import { channels, Channel, getCurrentPlayback, getAvailableChannels } from '@/data/channels';
import { VideoPlayer, VideoPlayerHandle } from '@/components/VideoPlayer';
import { PodcastPlayer, PodcastPlayerHandle } from '@/components/PodcastPlayer';
import { InfoBar } from '@/components/InfoBar';
import { ChannelGuide } from '@/components/ChannelGuide';
import { ChannelSwitcher } from '@/components/ChannelSwitcher';
import { KeyboardHints } from '@/components/KeyboardHints';
import { GuideButton } from '@/components/GuideButton';
import { PlaybackControls } from '@/components/PlaybackControls';
import { MobileControls } from '@/components/MobileControls';
import { UserMenu } from '@/components/UserMenu';
import { AuthModal } from '@/components/AuthModal';
import { VoteButtons } from '@/components/VoteButtons';
import { FeedbackMenu } from '@/components/FeedbackMenu';
import { ParentalControlsModal } from '@/components/ParentalControlsModal';
import { OnboardingModal } from '@/components/OnboardingModal';
import { UpgradeModal } from '@/components/UpgradeModal';
import { PremiumChannelLock } from '@/components/PremiumChannelLock';
import { 
  ProfileSwitcher, 
  ProfileSettings, 
  TimeLimitWarning 
} from '@/components/ParentalControls';
import { useParentalControls } from '@/hooks/useParentalControls';
import { useUserTier } from '@/contexts/UserTierContext';
import { useProfiles } from '@/contexts/ProfileContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const IDLE_TIMEOUT = 3000;
const CHANNEL_SWITCH_DISPLAY_TIME = 1500;

export default function Index() {
  const isMobile = useIsMobile();
  const { enabled: parentalControlsEnabled } = useParentalControls();
  const { isPremium, checkSubscription, openUpgradeModal } = useUserTier();
  const { activeProfile, isChildProfile, isChannelAllowed, timeRemaining, isBedtimeLocked } = useProfiles();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get available channels based on profile's content rating
  const availableChannels = channels.filter(c => {
    // First apply parental controls (legacy)
    if (parentalControlsEnabled && c.restricted) return false;
    // Then apply profile-based content filtering
    if (!isChannelAllowed(c.id)) return false;
    return true;
  });

  // Get saved channel or default to first available
  const [currentChannel, setCurrentChannel] = useState<Channel>(() => {
    const savedChannelId = localStorage.getItem('epishow-last-channel');
    const saved = availableChannels.find(c => c.id === savedChannelId);
    return saved || availableChannels[0];
  });
  
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isParentalControlsOpen, setIsParentalControlsOpen] = useState(false);
  const [isProfileSwitcherOpen, setIsProfileSwitcherOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [showChannelSwitcher, setShowChannelSwitcher] = useState(false);
  const [switchDirection, setSwitchDirection] = useState<'up' | 'down' | null>(null);
  const [showHints, setShowHints] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const [currentVideoTitle, setCurrentVideoTitle] = useState<string>('');
  
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const channelSwitchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playerRef = useRef<VideoPlayerHandle | PodcastPlayerHandle>(null);

  // Handle upgrade success/cancel from Stripe redirect
  useEffect(() => {
    const upgrade = searchParams.get('upgrade');
    if (upgrade === 'success') {
      toast.success('Welcome to Premium! Refreshing your subscription...');
      checkSubscription();
      setSearchParams({});
    } else if (upgrade === 'canceled') {
      toast.info('Upgrade canceled');
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, checkSubscription]);

  // Check if current channel is premium-locked
  const isChannelLocked = currentChannel.premium && !isPremium;

  // Ensure current channel is still available when parental controls change
  useEffect(() => {
    if (!availableChannels.find(c => c.id === currentChannel.id)) {
      setCurrentChannel(availableChannels[0]);
    }
  }, [availableChannels, currentChannel.id]);

  // Get current video ID for voting
  useEffect(() => {
    const updateVideoId = () => {
      const playback = getCurrentPlayback(currentChannel);
      setCurrentVideoId(playback.video.id);
    };
    
    updateVideoId();
    const interval = setInterval(updateVideoId, 1000);
    return () => clearInterval(interval);
  }, [currentChannel]);

  // Reset idle timer
  const resetIdleTimer = useCallback(() => {
    setShowUI(true);
    
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    
    idleTimerRef.current = setTimeout(() => {
      if (!isGuideOpen && !isAuthModalOpen && !isParentalControlsOpen) {
        setShowUI(false);
        setShowHints(false);
      }
    }, IDLE_TIMEOUT);
  }, [isGuideOpen, isAuthModalOpen, isParentalControlsOpen]);

  // Handle mouse/touch movement
  useEffect(() => {
    const handleMouseMove = () => resetIdleTimer();
    const handleClick = () => resetIdleTimer();
    const handleTouch = () => resetIdleTimer();
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleTouch);
    
    // Initial timer
    resetIdleTimer();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleTouch);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  // Switch channel
  const switchChannel = useCallback((direction: 'up' | 'down') => {
    const currentIndex = availableChannels.findIndex(c => c.id === currentChannel.id);
    let newIndex: number;
    
    if (direction === 'up') {
      newIndex = currentIndex <= 0 ? availableChannels.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex >= availableChannels.length - 1 ? 0 : currentIndex + 1;
    }
    
    const newChannel = availableChannels[newIndex];
    setCurrentChannel(newChannel);
    localStorage.setItem('epishow-last-channel', newChannel.id);
    
    // Show channel switcher overlay
    setSwitchDirection(direction);
    setShowChannelSwitcher(true);
    
    if (channelSwitchTimerRef.current) {
      clearTimeout(channelSwitchTimerRef.current);
    }
    
    channelSwitchTimerRef.current = setTimeout(() => {
      setShowChannelSwitcher(false);
      setSwitchDirection(null);
    }, CHANNEL_SWITCH_DISPLAY_TIME);
    
    resetIdleTimer();
  }, [availableChannels, currentChannel, resetIdleTimer]);

  // Playback controls - sync state with actual player
  const toggleMute = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.toggleMute();
      // Get actual state from player after toggle
      setTimeout(() => {
        if (playerRef.current) {
          setIsMuted(playerRef.current.isMuted());
        }
      }, 50);
    }
    resetIdleTimer();
  }, [resetIdleTimer]);

  const togglePlayPause = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.togglePlayPause();
      // Get actual state from player after toggle
      setTimeout(() => {
        if (playerRef.current) {
          setIsPlaying(playerRef.current.isPlaying());
        }
      }, 50);
    }
    resetIdleTimer();
  }, [resetIdleTimer]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'g':
          e.preventDefault();
          setIsGuideOpen(prev => !prev);
          break;
        case 'arrowup':
          e.preventDefault();
          if (!isGuideOpen) {
            switchChannel('up');
          }
          break;
        case 'arrowdown':
          e.preventDefault();
          if (!isGuideOpen) {
            switchChannel('down');
          }
          break;
        case 'i':
          e.preventDefault();
          resetIdleTimer();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'k':
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGuideOpen, switchChannel, resetIdleTimer, toggleMute, togglePlayPause]);

  // Handle channel selection from guide
  const handleChannelSelect = useCallback((channel: Channel) => {
    // Check if channel is premium and user doesn't have premium
    if (channel.premium && !isPremium) {
      openUpgradeModal();
      return;
    }
    
    setCurrentChannel(channel);
    localStorage.setItem('epishow-last-channel', channel.id);
    resetIdleTimer();
  }, [resetIdleTimer, isPremium, openUpgradeModal]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelSwitchTimerRef.current) clearTimeout(channelSwitchTimerRef.current);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background crt-effect">
      {/* Video or Podcast Player */}
      {currentChannel.isPodcast ? (
        <PodcastPlayer 
          ref={playerRef}
          channel={currentChannel}
          onVideoChange={(title) => {
            setCurrentVideoTitle(title);
          }}
        />
      ) : (
        <VideoPlayer 
          ref={playerRef}
          channel={currentChannel}
          onVideoChange={(title) => {
            setCurrentVideoTitle(title);
          }}
        />
      )}

      {/* Premium Channel Lock Overlay */}
      {isChannelLocked && (
        <PremiumChannelLock channelName={currentChannel.name} />
      )}

      {/* Top Bar - User Menu */}
      <div className="absolute top-4 right-4 z-20">
        <UserMenu 
          visible={showUI && !isGuideOpen}
          onSignInClick={() => setIsAuthModalOpen(true)}
          onSwitchProfile={() => setIsProfileSwitcherOpen(true)}
          onOpenParentalSettings={() => setIsProfileSettingsOpen(true)}
        />
      </div>

      {/* Time Limit Warning */}
      <TimeLimitWarning />

      {/* Guide Button */}
      <GuideButton 
        onClick={() => setIsGuideOpen(true)} 
        visible={showUI && !isGuideOpen}
      />

      {/* Playback Controls */}
      <PlaybackControls
        visible={showUI && !isGuideOpen && !isChannelLocked && !isBedtimeLocked && (timeRemaining === null || timeRemaining > 0)}
        isMuted={isMuted}
        isPlaying={isPlaying}
        onToggleMute={toggleMute}
        onTogglePlayPause={togglePlayPause}
      />

      {/* Mobile Channel Controls */}
      <MobileControls
        visible={showUI && !isGuideOpen}
        onChannelUp={() => switchChannel('up')}
        onChannelDown={() => switchChannel('down')}
      />

      {/* Vote Buttons and Feedback Menu - above info bar */}
      <div className="absolute bottom-24 md:bottom-32 left-4 md:left-10 z-20 flex items-center gap-2">
        <VoteButtons
          videoId={currentVideoId}
          youtubeId={currentVideoId}
          visible={showUI && !isGuideOpen && !isChannelLocked}
          onAuthRequired={() => setIsAuthModalOpen(true)}
        />
        <FeedbackMenu
          videoId={currentVideoId}
          visible={showUI && !isGuideOpen && !isChannelLocked}
          onAuthRequired={() => setIsAuthModalOpen(true)}
        />
      </div>

      {/* Info Bar */}
      <InfoBar 
        channel={currentChannel} 
        visible={showUI && !isGuideOpen}
        currentVideoTitle={currentVideoTitle}
      />

      {/* Channel Switcher Overlay */}
      <ChannelSwitcher
        channel={currentChannel}
        visible={showChannelSwitcher}
        direction={switchDirection}
      />

      {/* Keyboard Hints (first visit only, desktop only) */}
      {!isMobile && (
        <KeyboardHints 
          visible={showUI && !isGuideOpen}
          onDismiss={() => setShowHints(false)}
        />
      )}

      {/* Channel Guide */}
      <ChannelGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        currentChannel={currentChannel}
        onChannelSelect={handleChannelSelect}
        onOpenParentalControls={() => setIsProfileSettingsOpen(true)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Profile Switcher */}
      <ProfileSwitcher
        open={isProfileSwitcherOpen}
        onOpenChange={setIsProfileSwitcherOpen}
        onOpenSettings={() => {
          setIsProfileSwitcherOpen(false);
          setIsProfileSettingsOpen(true);
        }}
      />

      {/* Profile Settings (Parental Controls) */}
      <ProfileSettings
        open={isProfileSettingsOpen}
        onOpenChange={setIsProfileSettingsOpen}
      />

      {/* Legacy Parental Controls Modal */}
      <ParentalControlsModal
        open={isParentalControlsOpen}
        onOpenChange={setIsParentalControlsOpen}
      />

      {/* Upgrade Modal */}
      <UpgradeModal />

      {/* Onboarding for first-time visitors */}
      <OnboardingModal />
    </div>
  );
}
