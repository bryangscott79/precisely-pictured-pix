import { Channel, ChannelColor } from '@/data/channels';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ChannelSwitcherProps {
  channel: Channel;
  visible: boolean;
  direction: 'up' | 'down' | null;
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
  music80s: 'bg-channel-music80s',
  music90s: 'bg-channel-music90s',
  music00s: 'bg-channel-music00s',
  music10s: 'bg-channel-music10s',
  movies: 'bg-channel-movies',
  nfl: 'bg-channel-nfl',
  cinema80s: 'bg-channel-cinema80s',
  podcast: 'bg-channel-podcast',
};

export function ChannelSwitcher({ channel, visible, direction }: ChannelSwitcherProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 fade-in">
      <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-background/90 backdrop-blur-xl border border-border shadow-2xl">
        {/* Direction indicator */}
        <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${colorClasses[channel.color]}`}>
          {direction === 'up' ? (
            <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-white" />
          ) : (
            <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-white" />
          )}
        </div>

        {/* Channel icon */}
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-xl md:text-2xl ${colorClasses[channel.color]}`}>
          {channel.icon}
        </div>

        {/* Channel info */}
        <div className="text-left">
          <h2 className="font-display font-bold text-base md:text-lg">{channel.name}</h2>
          <p className="text-muted-foreground text-xs md:text-sm line-clamp-1 max-w-[200px]">{channel.description}</p>
        </div>
      </div>
    </div>
  );
}
