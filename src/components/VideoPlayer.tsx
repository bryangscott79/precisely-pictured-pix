import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Channel, Video } from '@/data/channels';
import { useDynamicVideos, getDynamicVideosForChannel } from '@/hooks/useDynamicVideos';

interface VideoPlayerProps {
  channel: Channel;
  onVideoChange?: (videoTitle: string) => void;
}

export interface VideoPlayerHandle {
  togglePlayPause: () => void;
  toggleMute: () => void;
  isMuted: () => boolean;
  isPlaying: () => boolean;
  getCurrentInfo: () => { title: string; videoId: string; duration: number; currentTime: number } | null;
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
  getCurrentTime: () => number;
  getDuration: () => number;
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

// Get current playback based on synchronized schedule using dynamic videos
function getCurrentPlaybackDynamic(channelId: string, videos: Video[]): { video: Video; videoIndex: number; positionInVideo: number } {
  if (videos.length === 0) {
    return { video: { id: '', title: '', duration: 0 }, videoIndex: 0, positionInVideo: 0 };
  }

  const totalDuration = videos.reduce((sum, v) => sum + v.duration, 0);
  const now = Date.now();
  const position = (now / 1000) % totalDuration;
  
  let elapsed = 0;
  for (let i = 0; i < videos.length; i++) {
    if (elapsed + videos[i].duration > position) {
      return {
        video: videos[i],
        videoIndex: i,
        positionInVideo: position - elapsed
      };
    }
    elapsed += videos[i].duration;
  }
  
  return { video: videos[0], videoIndex: 0, positionInVideo: 0 };
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
    const currentVideoIndexRef = useRef<number>(0);
    const channelRef = useRef(channel);
    const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const endScreenCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isInitializingRef = useRef(false);
    const failedVideosRef = useRef<Set<string>>(new Set());
    const hasSkippedEndRef = useRef(false);
    const videosRef = useRef<Video[]>([]);

    // Use dynamic videos hook
    const { videos: dynamicVideos, loading: videosLoading } = useDynamicVideos(channel.id);

    // Update refs when props change
    useEffect(() => {
      channelRef.current = channel;
    }, [channel]);

    // Update videos ref when dynamic videos change
    useEffect(() => {
      if (dynamicVideos.length > 0) {
        videosRef.current = dynamicVideos;
      } else if (!videosLoading) {
        // If not loading and no dynamic videos, fall back to static
        videosRef.current = channel.videos;
      }
    }, [dynamicVideos, channel.videos, videosLoading]);

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
      getCurrentInfo: () => {
        if (!playerRef.current || !isReady) return null;
        try {
          const data = playerRef.current.getVideoData?.();
          const currentTime = playerRef.current.getCurrentTime?.() || 0;
          const duration = playerRef.current.getDuration?.() || 0;
          return {
            title: data?.title || '',
            videoId: data?.video_id || '',
            duration,
            currentTime,
          };
        } catch {
          return null;
        }
      },
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

    const getActualVideoTitle = (): string => {
      try {
        const data = playerRef.current?.getVideoData?.();
        return data?.title || '';
      } catch {
        return '';
      }
    };

    // Get next playable video (skipping failed ones)
    const getNextPlayableVideo = (startIndex: number): { video: Video; index: number } => {
      const videos = videosRef.current;
      if (videos.length === 0) {
        return { video: { id: '', title: '', duration: 0 }, index: 0 };
      }

      for (let offset = 0; offset < videos.length; offset++) {
        const idx = (startIndex + offset) % videos.length;
        const video = videos[idx];
        if (!failedVideosRef.current.has(video.id)) {
          return { video, index: idx };
        }
      }
      
      // All videos failed, reset and try first one
      failedVideosRef.current.clear();
      return { video: videos[0], index: 0 };
    };

    // Advance to next video
    const advanceToNextVideo = () => {
      const videos = videosRef.current;
      if (videos.length === 0) return;

      const nextIndex = (currentVideoIndexRef.current + 1) % videos.length;
      const { video, index } = getNextPlayableVideo(nextIndex);
      
      currentVideoIndexRef.current = index;
      onVideoChange?.(video.title);
      safeLoadVideo(video.id, 0);
    };

    // Initialize player - only once when API is ready and videos are loaded
    useEffect(() => {
      if (!isApiLoaded || !containerRef.current || isInitializingRef.current) return;
      if (playerRef.current) return; // Already initialized
      
      // Wait for videos - either from dynamic hook or static fallback
      const hasVideos = videosRef.current.length > 0;
      const stillLoading = videosLoading && dynamicVideos.length === 0;
      if (stillLoading && !hasVideos) return;
      
      // If still no videos after loading, use static fallback
      if (!hasVideos) {
        videosRef.current = channel.videos;
      }
      
      if (videosRef.current.length === 0) return; // Still no videos
      
      isInitializingRef.current = true;
      
      const videos = videosRef.current;
      const playback = getCurrentPlaybackDynamic(channel.id, videos);
      currentVideoIdRef.current = playback.video.id;
      currentVideoIndexRef.current = playback.videoIndex;
      currentChannelIdRef.current = channel.id;
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
              // Ignore stale events from a previous load/channel
              const actualId = getActualVideoId();
              if (actualId && currentVideoIdRef.current && actualId !== currentVideoIdRef.current) {
                return;
              }

              if (event.data === window.YT.PlayerState.ENDED) {
                // Video ended - immediately load next video to prevent end screen
                advanceToNextVideo();
              }
              if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPaused(true);
              } else if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPaused(false);

                // When video starts playing, update title with actual YouTube title
                const playingId = getActualVideoId();
                if (playingId) {
                  currentVideoIdRef.current = playingId;
                  
                  setTimeout(() => {
                    const actualTitle = getActualVideoTitle();
                    if (actualTitle) {
                      onVideoChange?.(actualTitle);
                    }
                  }, 500);
                }
              }
            },
            onError: () => {
              // Mark video as failed and skip to next immediately
              const failedId = currentVideoIdRef.current;
              if (failedId) {
                failedVideosRef.current.add(failedId);
                console.warn(`Video ${failedId} failed, skipping to next`);
              }
              
              // Skip immediately - don't wait
              advanceToNextVideo();
            },
          },
        });
      } catch (e) {
        console.error('Error creating player:', e);
        isInitializingRef.current = false;
      }

      return () => {
        // Aggressive cleanup - mute first, then destroy
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
        if (endScreenCheckRef.current) {
          clearInterval(endScreenCheckRef.current);
          endScreenCheckRef.current = null;
        }
        if (playerRef.current) {
          try {
            // Mute and pause immediately to prevent ghost audio
            playerRef.current.mute();
            playerRef.current.pauseVideo();
          } catch (e) {
            // Ignore errors
          }
          try {
            playerRef.current.destroy();
          } catch (e) {
            // Ignore destroy errors
          }
          playerRef.current = null;
        }
        // Also clear the container to remove any orphaned iframes
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
        setIsReady(false);
        isInitializingRef.current = false;
      };
    }, [isApiLoaded, videosLoading, dynamicVideos.length, channel.id, channel.videos]);

    // Handle channel changes - load new video from dynamic content
    useEffect(() => {
      if (!isReady || !playerRef.current) return;
      if (channel.id === currentChannelIdRef.current) return;
      
      currentChannelIdRef.current = channel.id;
      failedVideosRef.current.clear(); // Clear failed videos for new channel
      
      // Get videos for the new channel (from cache or static fallback)
      const newVideos = getDynamicVideosForChannel(channel.id);
      const videosToUse = newVideos.length > 0 ? newVideos : channel.videos;
      videosRef.current = videosToUse;
      
      const playback = getCurrentPlaybackDynamic(channel.id, videosToUse);
      currentVideoIndexRef.current = playback.videoIndex;
      onVideoChange?.(playback.video.title);

      // Mute and pause IMMEDIATELY to stop ghost audio
      try {
        playerRef.current.mute();
        playerRef.current.pauseVideo();
      } catch {
        // ignore
      }

      // Small delay to ensure audio is cut before loading new video
      setTimeout(() => {
        if (playerRef.current) {
          safeLoadVideo(playback.video.id, playback.positionInVideo);
          // Unmute after new video loads
          try {
            playerRef.current.unMute();
          } catch {
            // ignore
          }
        }
      }, 50);
    }, [channel.id, isReady, onVideoChange]);

    // Update videos when dynamic videos finish loading
    useEffect(() => {
      if (videosLoading || dynamicVideos.length === 0) return;
      if (!isReady || !playerRef.current) return;
      if (channel.id !== currentChannelIdRef.current) return;
      
      // Videos just loaded, update the ref
      videosRef.current = dynamicVideos;
    }, [dynamicVideos, videosLoading, isReady, channel.id]);

    // Periodic check for failed videos
    useEffect(() => {
      if (!isReady) return;

      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }

      checkIntervalRef.current = setInterval(() => {
        if (!playerRef.current || !isReady) return;
        
        const videos = videosRef.current;
        if (videos.length === 0) return;

        // Check if current video is in failed set
        const currentId = currentVideoIdRef.current;
        if (currentId && failedVideosRef.current.has(currentId)) {
          advanceToNextVideo();
        }
      }, 10000);

      return () => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
      };
    }, [isReady, onVideoChange]);

    // End screen prevention - skip to next video before YouTube's end screen appears
    useEffect(() => {
      if (!isReady) return;

      if (endScreenCheckRef.current) {
        clearInterval(endScreenCheckRef.current);
      }

      endScreenCheckRef.current = setInterval(() => {
        if (!playerRef.current || !isReady) return;
        
        try {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          
          // If we're within 15 seconds of the end, skip to next video
          if (duration > 0 && currentTime > 0 && (duration - currentTime) < 15 && !hasSkippedEndRef.current) {
            hasSkippedEndRef.current = true;
            advanceToNextVideo();
            
            setTimeout(() => {
              hasSkippedEndRef.current = false;
            }, 2000);
          }
        } catch (e) {
          // Ignore errors from getting time
        }
      }, 1000);

      return () => {
        if (endScreenCheckRef.current) {
          clearInterval(endScreenCheckRef.current);
          endScreenCheckRef.current = null;
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
            transform: 'scale(1.02)',
            transformOrigin: 'center center',
          }}
        />
        {/* Overlay to block any clicks on YouTube elements */}
        <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }} />
        {(!isReady || videosLoading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-muted border-t-foreground rounded-full animate-spin" />
              <p className="text-muted-foreground font-medium">
                {videosLoading ? 'Loading channel content...' : `Tuning in to ${channel.name}...`}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
);
