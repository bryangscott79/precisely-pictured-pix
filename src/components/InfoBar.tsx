import { useEffect, useState } from 'react';
import { Channel, ChannelColor, getCurrentPlayback, getNextVideo, formatTime, getChannelDuration } from '@/data/channels';
import { ChevronRight } from 'lucide-react';

interface InfoBarProps {
  channel: Channel;
  visible: boolean;
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
};

export function InfoBar({ channel, visible }: InfoBarProps) {
  const [playback, setPlayback] = useState(() => getCurrentPlayback(channel));
  const [nextVideo, setNextVideo] = useState(() => getNextVideo(channel, playback.videoIndex));

  useEffect(() => {
    const interval = setInterval(() => {
      const current = getCurrentPlayback(channel);
      setPlayback(current);
      setNextVideo(getNextVideo(channel, current.videoIndex));
    }, 1000);

    return () => clearInterval(interval);
  }, [channel]);

  // Recalculate when channel changes
  useEffect(() => {
    const current = getCurrentPlayback(channel);
    setPlayback(current);
    setNextVideo(getNextVideo(channel, current.videoIndex));
  }, [channel]);

  const timeRemaining = playback.video.duration - playback.positionInVideo;

  return (
    <div 
      className={`info-bar transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      <div className="px-6 md:px-10 pb-8 space-y-4">
        {/* Channel info */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${colorClasses[channel.color]}`}>
            {channel.icon}
          </div>
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-xl">{channel.name}</h2>
            <span className="live-badge">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Live
            </span>
          </div>
        </div>

        {/* Video info */}
        <div className="space-y-3">
          <h1 className="font-display font-bold text-2xl md:text-3xl line-clamp-1">
            {playback.video.title}
          </h1>
          
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="progress-bar">
              <div 
                className={`progress-bar-fill ${colorClasses[channel.color]}`}
                style={{ width: `${playback.progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(playback.positionInVideo)}</span>
              <span>{formatTime(playback.video.duration)}</span>
            </div>
          </div>

          {/* Up next */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Up next in {formatTime(timeRemaining)}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium line-clamp-1">{nextVideo.title}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
