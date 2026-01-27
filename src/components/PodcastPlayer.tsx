import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Channel } from '@/data/channels';
import { CURATED_PODCASTS, PodcastEpisode } from '@/data/podcastSources';
import { cn } from '@/lib/utils';

interface PodcastPlayerProps {
  channel: Channel;
  onVideoChange?: (videoTitle: string) => void;
}

export interface PodcastPlayerHandle {
  togglePlayPause: () => void;
  toggleMute: () => void;
  isMuted: () => boolean;
  isPlaying: () => boolean;
  getCurrentInfo: () => { title: string; videoId: string; duration: number; currentTime: number } | null;
}

interface YTPodcastPlayer {
  loadVideoById: (options: { videoId: string; startSeconds?: number }) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  getPlayerState: () => number;
  getVideoData: () => { video_id: string; title?: string };
  getCurrentTime: () => number;
  getDuration: () => number;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  getPlaybackRate: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  destroy: () => void;
}

interface YTPlayerEvent {
  data: number;
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const PodcastPlayer = forwardRef<PodcastPlayerHandle, PodcastPlayerProps>(
  function PodcastPlayer({ channel, onVideoChange }, ref) {
    const playerRef = useRef<YTPodcastPlayer | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);
    const [isApiLoaded, setIsApiLoaded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeUpdateRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const channelIdRef = useRef(channel.id);

    // Get episodes from curated list - filter to ensure we have valid podcast content
    const episodes = CURATED_PODCASTS;

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      togglePlayPause: () => {
        if (!playerRef.current || !isReady) return;
        try {
          if (isPlaying) {
            playerRef.current.pauseVideo();
          } else {
            playerRef.current.playVideo();
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
      isPlaying: () => isPlaying,
      getCurrentInfo: () => {
        if (!playerRef.current || !isReady || !currentEpisode) return null;
        return {
          title: currentEpisode.title,
          videoId: currentEpisode.id,
          duration,
          currentTime,
        };
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

    // Initialize player
    useEffect(() => {
      if (!isApiLoaded || !containerRef.current || playerRef.current) return;
      if (episodes.length === 0) return;

      // Cleanup existing player if channel changed
      if (channelIdRef.current !== channel.id) {
        channelIdRef.current = channel.id;
      }

      const firstEpisode = episodes[0];
      setCurrentEpisode(firstEpisode);
      setCurrentIndex(0);
      onVideoChange?.(firstEpisode.title);

      const playerId = `podcast-player-${Date.now()}`;
      const playerDiv = document.createElement('div');
      playerDiv.id = playerId;
      playerDiv.style.position = 'absolute';
      playerDiv.style.width = '1px';
      playerDiv.style.height = '1px';
      playerDiv.style.opacity = '0';
      playerDiv.style.pointerEvents = 'none';
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(playerDiv);

      try {
        // Cast to any since YT.Player doesn't expose all methods in its type definition
        const player = new window.YT.Player(playerId, {
          videoId: firstEpisode.id,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            origin: window.location.origin,
            playsinline: 1,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
          },
          events: {
            onReady: () => {
              setIsReady(true);
              if (playerRef.current) {
                playerRef.current.setVolume(100);
                playerRef.current.playVideo();
                setDuration(playerRef.current.getDuration());
              }
            },
            onStateChange: (event: YTPlayerEvent) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                if (playerRef.current) {
                  setDuration(playerRef.current.getDuration());
                }
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              } else if (event.data === window.YT.PlayerState.ENDED) {
                // Auto-advance to next episode
                advanceEpisode(1);
              }
            },
            onError: () => {
              console.error('Podcast player error');
              advanceEpisode(1);
            },
          },
        }) as unknown as YTPodcastPlayer;
        playerRef.current = player;
      } catch (e) {
        console.error('Error creating podcast player:', e);
      }

      return () => {
        if (timeUpdateRef.current) {
          clearInterval(timeUpdateRef.current);
        }
        if (playerRef.current) {
          try {
            playerRef.current.destroy();
          } catch (e) {
            // Ignore
          }
          playerRef.current = null;
        }
        setIsReady(false);
      };
    }, [isApiLoaded, episodes]);

    // Update current time periodically
    useEffect(() => {
      if (!isReady || !isPlaying) {
        if (timeUpdateRef.current) {
          clearInterval(timeUpdateRef.current);
          timeUpdateRef.current = null;
        }
        return;
      }

      timeUpdateRef.current = setInterval(() => {
        if (playerRef.current) {
          try {
            const time = playerRef.current.getCurrentTime();
            setCurrentTime(time);
          } catch (e) {
            // Ignore
          }
        }
      }, 500);

      return () => {
        if (timeUpdateRef.current) {
          clearInterval(timeUpdateRef.current);
          timeUpdateRef.current = null;
        }
      };
    }, [isReady, isPlaying]);

    // Change episode
    const loadEpisode = (episode: PodcastEpisode, index: number) => {
      if (!playerRef.current || !isReady) return;
      
      setCurrentEpisode(episode);
      setCurrentIndex(index);
      setCurrentTime(0);
      onVideoChange?.(episode.title);
      
      try {
        playerRef.current.loadVideoById({ videoId: episode.id });
        setDuration(episode.duration);
      } catch (e) {
        console.error('Error loading episode:', e);
      }
    };

    const advanceEpisode = (delta: number) => {
      const newIndex = (currentIndex + delta + episodes.length) % episodes.length;
      loadEpisode(episodes[newIndex], newIndex);
    };

    // Skip forward/back 15 seconds
    const skip = (seconds: number) => {
      if (!playerRef.current || !isReady) return;
      try {
        const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
        playerRef.current.seekTo(newTime, true);
        setCurrentTime(newTime);
      } catch (e) {
        console.error('Error seeking:', e);
      }
    };

    // Handle progress bar click
    const handleProgressChange = (value: number[]) => {
      if (!playerRef.current || !isReady) return;
      const newTime = (value[0] / 100) * duration;
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    };

    // Handle playback speed change
    const handleSpeedChange = (speed: number) => {
      if (!playerRef.current || !isReady) return;
      try {
        playerRef.current.setPlaybackRate(speed);
        setPlaybackSpeed(speed);
      } catch (e) {
        console.error('Error setting playback rate:', e);
      }
    };

    // Toggle play/pause
    const togglePlay = () => {
      if (!playerRef.current || !isReady) return;
      try {
        if (isPlaying) {
          playerRef.current.pauseVideo();
        } else {
          playerRef.current.playVideo();
        }
      } catch (e) {
        console.error('Error toggling play:', e);
      }
    };

    // Toggle mute
    const toggleMute = () => {
      if (!playerRef.current || !isReady) return;
      try {
        if (isMuted) {
          playerRef.current.unMute();
          setIsMuted(false);
        } else {
          playerRef.current.mute();
          setIsMuted(true);
        }
      } catch (e) {
        console.error('Error toggling mute:', e);
      }
    };

    // Format time display
    const formatTime = (seconds: number): string => {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      
      if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background flex flex-col items-center justify-center overflow-hidden">
        {/* Hidden YouTube player container - positioned off-screen */}
        <div ref={containerRef} className="absolute -left-[9999px] w-px h-px overflow-hidden" />

        {/* Podcast UI */}
        <div className="flex flex-col items-center justify-center w-full max-w-md px-6 py-8 space-y-8">
          {/* Podcast Artwork */}
          <div className="relative group">
            <div 
              className={cn(
                "w-64 h-64 md:w-72 md:h-72 rounded-2xl shadow-2xl overflow-hidden bg-muted",
                "ring-4 ring-primary/20 transition-all duration-300",
                isPlaying && "ring-primary/40"
              )}
            >
              {currentEpisode?.thumbnailUrl ? (
                <img 
                  src={currentEpisode.thumbnailUrl} 
                  alt={currentEpisode.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-primary/30 to-primary/10">
                  🎙️
                </div>
              )}
            </div>
            {/* Animated glow effect when playing */}
            {isPlaying && (
              <div className="absolute -inset-2 bg-primary/20 rounded-3xl blur-xl animate-pulse -z-10" />
            )}
          </div>

          {/* Show Name & Episode Title */}
          <div className="text-center space-y-2 w-full">
            <p className="text-sm font-medium text-primary/80 uppercase tracking-wider">
              {currentEpisode?.showName || 'Podcast'}
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-foreground line-clamp-2 leading-tight">
              {currentEpisode?.title || 'Loading...'}
            </h2>
          </div>

          {/* Progress Bar */}
          <div className="w-full space-y-2">
            <Slider
              value={[progressPercent]}
              onValueChange={handleProgressChange}
              max={100}
              step={0.1}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-4">
            {/* Skip Back 15s */}
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full hover:bg-muted"
              onClick={() => skip(-15)}
            >
              <SkipBack className="h-6 w-6" />
              <span className="sr-only">Skip back 15 seconds</span>
            </Button>

            {/* Play/Pause */}
            <Button
              variant="default"
              size="icon"
              className="h-16 w-16 rounded-full shadow-lg"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
              <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
            </Button>

            {/* Skip Forward 15s */}
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full hover:bg-muted"
              onClick={() => skip(15)}
            >
              <SkipForward className="h-6 w-6" />
              <span className="sr-only">Skip forward 15 seconds</span>
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between w-full px-4">
            {/* Mute Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
              <span className="sr-only">{isMuted ? 'Unmute' : 'Mute'}</span>
            </Button>

            {/* Playback Speed */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 px-3 rounded-full font-mono text-sm"
                >
                  {playbackSpeed}x
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                {PLAYBACK_SPEEDS.map((speed) => (
                  <DropdownMenuItem 
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={cn(
                      "font-mono cursor-pointer",
                      speed === playbackSpeed && "bg-primary/10 font-bold"
                    )}
                  >
                    {speed}x
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Episode Counter */}
            <span className="text-xs text-muted-foreground font-mono">
              {currentIndex + 1}/{episodes.length}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin" />
              <p className="text-muted-foreground font-medium">Loading podcast...</p>
            </div>
          </div>
        )}
      </div>
    );
  }
);
