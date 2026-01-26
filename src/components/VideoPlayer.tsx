import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Channel, getCurrentPlayback } from '@/data/channels';

interface VideoPlayerProps {
  channel: Channel;
  onVideoChange?: (videoTitle: string) => void;
}

export interface VideoPlayerHandle {
  togglePlayPause: () => void;
  toggleMute: () => void;
  isMuted: () => boolean;
  isPlaying: () => boolean;
}

interface YTPlayer {
  loadVideoById: (options: { videoId: string; startSeconds: number }) => void;
  setVolume: (volume: number) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  getPlayerState: () => number;
  getVideoData: () => { video_id: string };
  destroy: () => void;
}

interface YTPlayerEvent {
  data: number;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        element: HTMLElement | string,
        options: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: () => void;
            onStateChange?: (event: YTPlayerEvent) => void;
            onError?: () => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  function VideoPlayer({ channel, onVideoChange }, ref) {
    const playerRef = useRef<YTPlayer | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);
    const [isApiLoaded, setIsApiLoaded] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [playerKey, setPlayerKey] = useState(0); // Force remount on channel change
    const currentChannelRef = useRef(channel.id);
    const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const playerIdRef = useRef(`yt-player-${Date.now()}`);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      togglePlayPause: () => {
        if (!playerRef.current || !isReady) return;
        try {
          const state = playerRef.current.getPlayerState();
          if (state === window.YT.PlayerState.PLAYING) {
            playerRef.current.pauseVideo();
            setIsPaused(true);
          } else {
            playerRef.current.playVideo();
            setIsPaused(false);
          }
        } catch (e) {
          console.error('Error toggling play/pause:', e);
        }
      },
      toggleMute: () => {
        if (!playerRef.current || !isReady) return;
        try {
          if (playerRef.current.isMuted()) {
            playerRef.current.unMute();
            setIsMuted(false);
          } else {
            playerRef.current.mute();
            setIsMuted(true);
          }
        } catch (e) {
          console.error('Error toggling mute:', e);
        }
      },
      isMuted: () => isMuted,
      isPlaying: () => !isPaused,
    }));

    // Load YouTube IFrame API
    useEffect(() => {
      if (window.YT && window.YT.Player) {
        setIsApiLoaded(true);
        return;
      }

      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsApiLoaded(true);
      };
    }, []);

    // Cleanup function
    const destroyPlayer = useCallback(() => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.error('Error destroying player:', e);
        }
        playerRef.current = null;
      }
      setIsReady(false);
    }, []);

    // Handle channel changes - destroy and recreate player
    useEffect(() => {
      if (channel.id !== currentChannelRef.current) {
        console.log(`Channel changed from ${currentChannelRef.current} to ${channel.id}`);
        currentChannelRef.current = channel.id;
        
        // Destroy existing player
        destroyPlayer();
        
        // Generate new player ID and trigger remount
        playerIdRef.current = `yt-player-${Date.now()}`;
        setPlayerKey(prev => prev + 1);
      }
    }, [channel.id, destroyPlayer]);

    // Initialize player when API is loaded
    useEffect(() => {
      if (!isApiLoaded || !containerRef.current) return;
      
      // Don't initialize if player already exists
      if (playerRef.current) return;

      const playback = getCurrentPlayback(channel);
      console.log(`Initializing player for channel ${channel.id}, video ${playback.video.id}`);
      onVideoChange?.(playback.video.title);

      // Create a fresh div for the player
      const playerId = playerIdRef.current;
      const existingPlayer = document.getElementById(playerId);
      if (existingPlayer) {
        existingPlayer.remove();
      }

      const playerDiv = document.createElement('div');
      playerDiv.id = playerId;
      playerDiv.style.width = '100%';
      playerDiv.style.height = '100%';
      containerRef.current.appendChild(playerDiv);

      try {
        playerRef.current = new window.YT.Player(playerId, {
          videoId: playback.video.id,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            start: Math.floor(playback.positionInVideo),
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              console.log(`Player ready for channel ${channel.id}`);
              setIsReady(true);
              playerRef.current?.setVolume(100);
              playerRef.current?.playVideo();
            },
            onStateChange: (event: YTPlayerEvent) => {
              if (event.data === window.YT.PlayerState.ENDED) {
                // Video ended, load next one based on current time
                const newPlayback = getCurrentPlayback(channel);
                console.log(`Video ended, loading ${newPlayback.video.id}`);
                onVideoChange?.(newPlayback.video.title);
                playerRef.current?.loadVideoById({
                  videoId: newPlayback.video.id,
                  startSeconds: newPlayback.positionInVideo,
                });
              }
              if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPaused(true);
              } else if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPaused(false);
              }
            },
            onError: () => {
              // On error, try loading the correct video for current time
              console.log('Player error, attempting recovery...');
              setTimeout(() => {
                const newPlayback = getCurrentPlayback(channel);
                onVideoChange?.(newPlayback.video.title);
                playerRef.current?.loadVideoById({
                  videoId: newPlayback.video.id,
                  startSeconds: newPlayback.positionInVideo,
                });
              }, 1000);
            },
          },
        });
      } catch (e) {
        console.error('Error creating player:', e);
      }

      return () => {
        destroyPlayer();
      };
    }, [isApiLoaded, playerKey, channel, onVideoChange, destroyPlayer]);

    // Check for video transitions periodically
    useEffect(() => {
      if (!isReady || !playerRef.current) return;

      checkIntervalRef.current = setInterval(() => {
        const playback = getCurrentPlayback(channel);
        try {
          const currentVideoId = playerRef.current?.getVideoData?.()?.video_id;
          
          if (currentVideoId && currentVideoId !== playback.video.id) {
            console.log(`Time sync: switching from ${currentVideoId} to ${playback.video.id}`);
            onVideoChange?.(playback.video.title);
            playerRef.current?.loadVideoById({
              videoId: playback.video.id,
              startSeconds: playback.positionInVideo,
            });
          }
        } catch (e) {
          // Player might not be ready
        }
      }, 2000);

      return () => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
      };
    }, [channel, isReady, onVideoChange]);

    return (
      <div className="absolute inset-0 bg-black channel-switch">
        <div 
          ref={containerRef} 
          className="w-full h-full"
          style={{ pointerEvents: 'none' }}
        />
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-muted border-t-foreground rounded-full animate-spin" />
              <p className="text-muted-foreground font-medium">Tuning in to {channel.name}...</p>
            </div>
          </div>
        )}
      </div>
    );
  }
);
