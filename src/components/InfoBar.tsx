import { useEffect, useState } from 'react';
import { Channel, ChannelColor, getCurrentPlayback, getNextVideo, formatTime } from '@/data/channels';
import { getCurrentProgram } from '@/data/scheduledProgramming';
import { ChevronRight, Calendar } from 'lucide-react';

interface InfoBarProps {
  channel: Channel;
  visible: boolean;
  currentVideoTitle?: string; // Title from actual YouTube player
}

const colorClasses: Record<ChannelColor, string> = {
  tech: 'bg-channel-tech',
  science: 'bg-channel-science',
  maker: 'bg-channel-maker',
  cooking: 'bg-channel-cooking',
  history: 'bg-channel-history',
  diy: 'bg-channel-diy',
  sports: 'bg-channel-sports',
  collecting: 'bg-channel-collecting',
  kids: 'bg-channel-kids',
  family: 'bg-channel-family',
  faith: 'bg-channel-faith',
  automotive: 'bg-channel-automotive',
  teen: 'bg-channel-teen',
  gaming: 'bg-channel-gaming',
  music: 'bg-channel-music',
  nature: 'bg-channel-nature',
  comedy: 'bg-channel-comedy',
  fitness: 'bg-channel-fitness',
  travel: 'bg-channel-travel',
  art: 'bg-channel-art',
  music80s: 'bg-channel-music',
  music90s: 'bg-channel-music',
  music00s: 'bg-channel-music',
  music10s: 'bg-channel-music',
  movies: 'bg-channel-movies',
  nfl: 'bg-channel-nfl',
  cinema80s: 'bg-channel-cinema80s',
  podcast: 'bg-channel-podcast',
  localnews: 'bg-channel-localnews',
};

export function InfoBar({ channel, visible, currentVideoTitle }: InfoBarProps) {
  const [playback, setPlayback] = useState(() => getCurrentPlayback(channel));
  const [nextVideo, setNextVideo] = useState(() => getNextVideo(channel, playback.videoIndex));
  const [currentProgram, setCurrentProgram] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const current = getCurrentPlayback(channel);
      setPlayback(current);
      setNextVideo(getNextVideo(channel, current.videoIndex));
      
      // Check for scheduled programming
      const program = getCurrentProgram(channel.id);
      setCurrentProgram(program?.name || null);
    }, 1000);

    return () => clearInterval(interval);
  }, [channel]);

  // Recalculate when channel changes
  useEffect(() => {
    const current = getCurrentPlayback(channel);
    setPlayback(current);
    setNextVideo(getNextVideo(channel, current.videoIndex));
    
    // Check for scheduled programming
    const program = getCurrentProgram(channel.id);
    setCurrentProgram(program?.name || null);
  }, [channel]);

  const timeRemaining = playback.video.duration - playback.positionInVideo;
  
  // Use actual YouTube title if provided, otherwise fall back to schedule
  const displayTitle = currentVideoTitle || playback.video.title;

  return (
    <div 
      className={`info-bar transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      <div className="px-4 md:px-10 pb-6 md:pb-8 space-y-2 md:space-y-4">
        {/* Channel info */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-lg md:text-xl ${colorClasses[channel.color] || 'bg-channel-music'}`}>
            {channel.icon}
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <h2 className="font-display font-bold text-base md:text-xl">{channel.name}</h2>
            <span className="live-badge text-xs">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white animate-pulse" />
              Live
            </span>
            {currentProgram && (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-primary/20 text-primary-foreground">
                <Calendar className="w-3 h-3" />
                {currentProgram}
              </span>
            )}
          </div>
        </div>

        {/* Video info */}
        <div className="space-y-2 md:space-y-3">
          <h1 className="font-display font-bold text-lg md:text-3xl line-clamp-2 md:line-clamp-1">
            {displayTitle}
          </h1>
          
          {/* Progress bar */}
          <div className="space-y-1 md:space-y-2">
            <div className="progress-bar">
              <div 
                className={`progress-bar-fill ${colorClasses[channel.color] || 'bg-channel-music'}`}
                style={{ width: `${playback.progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs md:text-sm text-muted-foreground">
              <span>{formatTime(playback.positionInVideo)}</span>
              <span>{formatTime(playback.video.duration)}</span>
            </div>
          </div>

          {/* Up next - hidden on small mobile */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <span>Up next in {formatTime(timeRemaining)}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium line-clamp-1">{nextVideo.title}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
