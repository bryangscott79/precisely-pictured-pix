import { useEffect, useState, useCallback, useRef } from 'react';
import { channels, Channel, getCurrentPlayback, getAvailableChannels } from '@/data/channels';
import { VideoPlayer, VideoPlayerHandle } from '@/components/VideoPlayer';
import { InfoBar } from '@/components/InfoBar';
import { ChannelGuide } from '@/components/ChannelGuide';
import { ChannelSwitcher } from '@/components/ChannelSwitcher';
import { KeyboardHints } from '@/components/KeyboardHints';
import { GuideButton } from '@/components/GuideButton';
import { PlaybackControls } from '@/components/PlaybackControls';
import { UserMenu } from '@/components/UserMenu';
import { AuthModal } from '@/components/AuthModal';
import { VoteButtons } from '@/components/VoteButtons';
import { ParentalControlsModal } from '@/components/ParentalControlsModal';
import { useParentalControls } from '@/hooks/useParentalControls';

const IDLE_TIMEOUT = 3000;
const CHANNEL_SWITCH_DISPLAY_TIME = 1500;

export default function Index() {
  const { enabled: parentalControlsEnabled } = useParentalControls();
  const availableChannels = getAvailableChannels(parentalControlsEnabled);

  // Get saved channel or default to first available
  const [currentChannel, setCurrentChannel] = useState<Channel>(() => {
    const savedChannelId = localStorage.getItem('epishow-last-channel');
    const saved = availableChannels.find(c => c.id === savedChannelId);
    return saved || availableChannels[0];
  });
  
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isParentalControlsOpen, setIsParentalControlsOpen] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [showChannelSwitcher, setShowChannelSwitcher] = useState(false);
  const [switchDirection, setSwitchDirection] = useState<'up' | 'down' | null>(null);
  const [showHints, setShowHints] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const channelSwitchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playerRef = useRef<VideoPlayerHandle>(null);

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

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = () => resetIdleTimer();
    const handleClick = () => resetIdleTimer();
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    
    // Initial timer
    resetIdleTimer();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
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

  // Playback controls
  const toggleMute = useCallback(() => {
    playerRef.current?.toggleMute();
    setIsMuted(prev => !prev);
    resetIdleTimer();
  }, [resetIdleTimer]);

  const togglePlayPause = useCallback(() => {
    playerRef.current?.togglePlayPause();
    setIsPlaying(prev => !prev);
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
    setCurrentChannel(channel);
    localStorage.setItem('epishow-last-channel', channel.id);
    resetIdleTimer();
  }, [resetIdleTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelSwitchTimerRef.current) clearTimeout(channelSwitchTimerRef.current);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background crt-effect">
      {/* Video Player */}
      <VideoPlayer 
        ref={playerRef}
        channel={currentChannel}
        onVideoChange={() => {}}
      />

      {/* Top Bar - User Menu */}
      <div className="absolute top-4 right-4 z-20">
        <UserMenu 
          visible={showUI && !isGuideOpen}
          onSignInClick={() => setIsAuthModalOpen(true)}
        />
      </div>

      {/* Guide Button */}
      <GuideButton 
        onClick={() => setIsGuideOpen(true)} 
        visible={showUI && !isGuideOpen}
      />

      {/* Playback Controls */}
      <PlaybackControls
        visible={showUI && !isGuideOpen}
        isMuted={isMuted}
        isPlaying={isPlaying}
        onToggleMute={toggleMute}
        onTogglePlayPause={togglePlayPause}
      />

      {/* Vote Buttons - above info bar */}
      <div className="absolute bottom-32 left-6 md:left-10 z-20">
        <VoteButtons
          videoId={currentVideoId}
          youtubeId={currentVideoId}
          visible={showUI && !isGuideOpen}
          onAuthRequired={() => setIsAuthModalOpen(true)}
        />
      </div>

      {/* Info Bar */}
      <InfoBar 
        channel={currentChannel} 
        visible={showUI && !isGuideOpen}
      />

      {/* Channel Switcher Overlay */}
      <ChannelSwitcher
        channel={currentChannel}
        visible={showChannelSwitcher}
        direction={switchDirection}
      />

      {/* Keyboard Hints (first visit only) */}
      <KeyboardHints 
        visible={showUI && !isGuideOpen}
        onDismiss={() => setShowHints(false)}
      />

      {/* Channel Guide */}
      <ChannelGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        currentChannel={currentChannel}
        onChannelSelect={handleChannelSelect}
        onOpenParentalControls={() => setIsParentalControlsOpen(true)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Parental Controls Modal */}
      <ParentalControlsModal
        open={isParentalControlsOpen}
        onOpenChange={setIsParentalControlsOpen}
      />
    </div>
  );
}
