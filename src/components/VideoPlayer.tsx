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
        element: HTMLElement,
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
    const channelIdRef = useRef(channel.id);
    const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      togglePlayPause: () => {
        if (!playerRef.current || !isReady) return;
        const state = playerRef.current.getPlayerState();
        if (state === window.YT.PlayerState.PLAYING) {
          playerRef.current.pauseVideo();
          setIsPaused(true);
        } else {
          playerRef.current.playVideo();
          setIsPaused(false);
        }
      },
      toggleMute: () => {
        if (!playerRef.current || !isReady) return;
        if (playerRef.current.isMuted()) {
          playerRef.current.unMute();
          setIsMuted(false);
        } else {
          playerRef.current.mute();
          setIsMuted(true);
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

    const loadVideo = useCallback(() => {
      if (!playerRef.current || !isReady) return;
      
      const playback = getCurrentPlayback(channel);
      onVideoChange?.(playback.video.title);
      
      playerRef.current.loadVideoById({
        videoId: playback.video.id,
        startSeconds: playback.positionInVideo,
      });
    }, [channel, isReady, onVideoChange]);

    // Initialize player when API is loaded - only run once
    useEffect(() => {
      if (!isApiLoaded || !containerRef.current || playerRef.current) return;
      
      const playback = getCurrentPlayback(channel);
      onVideoChange?.(playback.video.title);

      const playerElement = containerRef.current;
      
      playerRef.current = new window.YT.Player(playerElement, {
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
        },
        events: {
          onReady: () => {
            setIsReady(true);
            playerRef.current?.setVolume(100);
            playerRef.current?.playVideo();
          },
          onStateChange: (event: YTPlayerEvent) => {
            // When video ends, load the next one
            if (event.data === window.YT.PlayerState.ENDED) {
              loadVideo();
            }
            // Sync paused state
            if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPaused(true);
            } else if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPaused(false);
            }
          },
          onError: () => {
            // On error, skip to next video
            setTimeout(loadVideo, 1000);
          },
        },
      });

      return () => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
        if (playerRef.current) {
          playerRef.current.destroy();
          playerRef.current = null;
        }
        setIsReady(false);
      };
    }, [isApiLoaded]);

    // Check for video transitions periodically
    useEffect(() => {
      if (!isReady) return;

      checkIntervalRef.current = setInterval(() => {
        const playback = getCurrentPlayback(channel);
        const currentVideoId = playerRef.current?.getVideoData?.()?.video_id;
        
        if (currentVideoId && currentVideoId !== playback.video.id) {
          onVideoChange?.(playback.video.title);
          playerRef.current?.loadVideoById({
            videoId: playback.video.id,
            startSeconds: playback.positionInVideo,
          });
        }
      }, 1000);

      return () => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
      };
    }, [channel, isReady, onVideoChange]);

    // Handle channel changes
    useEffect(() => {
      if (channel.id !== channelIdRef.current) {
        channelIdRef.current = channel.id;
        loadVideo();
      }
    }, [channel.id, loadVideo]);

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
              <p className="text-muted-foreground font-medium">Tuning in...</p>
            </div>
          </div>
        )}
      </div>
    );
  }
);
