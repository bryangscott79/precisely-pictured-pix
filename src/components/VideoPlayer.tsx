import { useEffect, useRef, useState, useCallback } from 'react';
import { Channel, getCurrentPlayback } from '@/data/channels';

interface VideoPlayerProps {
  channel: Channel;
  onVideoChange?: (videoTitle: string) => void;
}

interface YTPlayer {
  loadVideoById: (options: { videoId: string; startSeconds: number }) => void;
  setVolume: (volume: number) => void;
  playVideo: () => void;
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

export function VideoPlayer({ channel, onVideoChange }: VideoPlayerProps) {
  const playerRef = useRef<YTPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const channelIdRef = useRef(channel.id);
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Initialize player when API is loaded
  useEffect(() => {
    if (!isApiLoaded || !containerRef.current) return;
    
    const playback = getCurrentPlayback(channel);
    onVideoChange?.(playback.video.title);

    playerRef.current = new window.YT.Player(containerRef.current, {
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
      playerRef.current?.destroy();
      playerRef.current = null;
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
