import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
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
  getVideoData: () => { video_id: string; title?: string };
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
    const currentChannelIdRef = useRef(channel.id);
    const currentVideoIdRef = useRef<string>('');
    const channelRef = useRef(channel);
    const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isInitializingRef = useRef(false);
    const failedByChannelRef = useRef<Record<string, Set<string>>>({});

    useEffect(() => {
      channelRef.current = channel;
    }, [channel]);

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

    // Safe method to load a video
    const safeLoadVideo = (videoId: string, startSeconds: number) => {
      if (!playerRef.current || !isReady) return false;
      
      try {
        if (typeof playerRef.current.loadVideoById === 'function') {
          playerRef.current.loadVideoById({ videoId, startSeconds });
          currentVideoIdRef.current = videoId;
          return true;
        }
      } catch (e) {
        console.error('Error loading video:', e);
      }
      return false;
    };

    const getActualVideoId = (): string => {
      try {
        const data = playerRef.current?.getVideoData?.();
        return data?.video_id || '';
      } catch {
        return '';
      }
    };

    const markFailed = (channelId: string, videoId: string) => {
      if (!videoId) return;
      if (!failedByChannelRef.current[channelId]) {
        failedByChannelRef.current[channelId] = new Set();
      }
      failedByChannelRef.current[channelId].add(videoId);
    };

    const getNextPlayable = (liveChannel: Channel, startIndex: number) => {
      const failed = failedByChannelRef.current[liveChannel.id] || new Set<string>();
      for (let offset = 0; offset < liveChannel.videos.length; offset++) {
        const idx = (startIndex + offset) % liveChannel.videos.length;
        const candidate = liveChannel.videos[idx];
        if (!failed.has(candidate.id)) return { video: candidate, videoIndex: idx };
      }
      // If everything is failed, just fall back to the scheduled video.
      const playback = getCurrentPlayback(liveChannel);
      return { video: playback.video, videoIndex: playback.videoIndex };
    };

    // Initialize player - only once when API is ready
    useEffect(() => {
      if (!isApiLoaded || !containerRef.current || isInitializingRef.current) return;
      if (playerRef.current) return; // Already initialized
      
      isInitializingRef.current = true;
      
      const liveChannel = channelRef.current;
      const playback = getCurrentPlayback(liveChannel);
      currentVideoIdRef.current = playback.video.id;
      currentChannelIdRef.current = liveChannel.id;
      onVideoChange?.(playback.video.title);

      // Create player element
      const playerId = `yt-player-${Date.now()}`;
      const playerDiv = document.createElement('div');
      playerDiv.id = playerId;
      playerDiv.style.width = '100%';
      playerDiv.style.height = '100%';
      containerRef.current.innerHTML = ''; // Clear any existing content
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
            playsinline: 1,
            // Disable end screen and related videos
            endscreen: 0,
          },
          events: {
            onReady: () => {
              isInitializingRef.current = false;
              setIsReady(true);
              if (playerRef.current) {
                playerRef.current.setVolume(100);
                playerRef.current.playVideo();
              }
            },
            onStateChange: (event: YTPlayerEvent) => {
              // Ignore stale events from a previous load/channel.
              const actualId = getActualVideoId();
              if (actualId && currentVideoIdRef.current && actualId !== currentVideoIdRef.current) {
                return;
              }

              if (event.data === window.YT.PlayerState.ENDED) {
                // Video ended - immediately load next scheduled video to prevent end screen
                const live = channelRef.current;
                const currentPlayback = getCurrentPlayback(live);
                const nextIndex = (currentPlayback.videoIndex + 1) % live.videos.length;
                const nextVideo = live.videos[nextIndex];
                onVideoChange?.(nextVideo.title);
                // Load from beginning since this is a fresh video
                safeLoadVideo(nextVideo.id, 0);
              }
              if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPaused(true);
              } else if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPaused(false);

                // Guardrail: if anything other than this channel's allowlist is playing, force back.
                const live = channelRef.current;
                const playingId = getActualVideoId();
                if (playingId) {
                  currentVideoIdRef.current = playingId;

                  const isAllowed = live.videos.some((v) => v.id === playingId);
                  if (!isAllowed) {
                    const pb = getCurrentPlayback(live);
                    onVideoChange?.(pb.video.title);
                    safeLoadVideo(pb.video.id, pb.positionInVideo);
                    return;
                  }
                }
              }
            },
            onError: () => {
              // On error, try the next video
              setTimeout(() => {
                const live = channelRef.current;
                const current = getCurrentPlayback(live);
                markFailed(live.id, current.video.id);

                const next = getNextPlayable(live, current.videoIndex + 1);
                onVideoChange?.(next.video.title);
                safeLoadVideo(next.video.id, 0);
              }, 2000);
            },
          },
        });
      } catch (e) {
        console.error('Error creating player:', e);
        isInitializingRef.current = false;
      }

      return () => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
        if (playerRef.current) {
          try {
            playerRef.current.destroy();
          } catch (e) {
            // Ignore destroy errors
          }
          playerRef.current = null;
        }
        setIsReady(false);
        isInitializingRef.current = false;
      };
    }, [isApiLoaded]); // Only depend on API loaded state

    // Handle channel changes - just load new video, don't recreate player
    useEffect(() => {
      if (!isReady || !playerRef.current) return;
      if (channel.id === currentChannelIdRef.current) return;
      
      currentChannelIdRef.current = channel.id;
      const playback = getCurrentPlayback(channel);
      onVideoChange?.(playback.video.title);

      // Cut old audio immediately during channel transitions.
      try {
        playerRef.current.pauseVideo();
      } catch {
        // ignore
      }

      safeLoadVideo(playback.video.id, playback.positionInVideo);
    }, [channel.id, isReady, onVideoChange]);

    // Periodic sync check - ensure we're playing the right video
    useEffect(() => {
      if (!isReady) return;

      // Clear any existing interval
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }

      checkIntervalRef.current = setInterval(() => {
        if (!playerRef.current || !isReady) return;
        
        // Always use the latest channel
        const live = channelRef.current;
        const playback = getCurrentPlayback(live);
        const failed = failedByChannelRef.current[live.id];

        // If the scheduled video is known-bad, skip forward.
        if (failed?.has(playback.video.id)) {
          const next = getNextPlayable(live, playback.videoIndex + 1);
          if (currentVideoIdRef.current !== next.video.id) {
            onVideoChange?.(next.video.title);
            safeLoadVideo(next.video.id, 0);
          }
          return;
        }
        
        // Only switch if we're on the WRONG video entirely (different video ID)
        // Don't reload if we're already playing the right video - this prevents the restart loop
        const actualPlaying = getActualVideoId();
        if (actualPlaying && actualPlaying !== playback.video.id && currentVideoIdRef.current !== playback.video.id) {
          onVideoChange?.(playback.video.title);
          safeLoadVideo(playback.video.id, playback.positionInVideo);
        }
      }, 5000); // Check every 5 seconds, less aggressive

      return () => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
      };
    }, [isReady, onVideoChange]);

    return (
      <div className="absolute inset-0 bg-black overflow-hidden">
        {/* Container with overflow hidden to clip any YouTube overlays */}
        <div 
          ref={containerRef} 
          className="w-full h-full"
          style={{ 
            pointerEvents: 'none',
            // Slightly scale up to hide YouTube end screen borders
            transform: 'scale(1.02)',
            transformOrigin: 'center center',
          }}
        />
        {/* Overlay to block any clicks on YouTube elements */}
        <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }} />
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-20">
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
