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
};

export function ChannelSwitcher({ channel, visible, direction }: ChannelSwitcherProps) {
  if (!visible) return null;

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 fade-in px-4 w-full max-w-md">
      <div className="flex flex-col items-center gap-3 md:gap-4 p-4 md:p-8 rounded-2xl bg-background/90 backdrop-blur-xl border border-border shadow-2xl">
        {/* Direction indicator */}
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${colorClasses[channel.color]}`}>
          {direction === 'up' ? (
            <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
          ) : (
            <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-white" />
          )}
        </div>

        {/* Channel info */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-2xl md:text-3xl ${colorClasses[channel.color]}`}>
            {channel.icon}
          </div>
          <div className="text-left">
            <h2 className="font-display font-bold text-lg md:text-2xl">{channel.name}</h2>
            <p className="text-muted-foreground text-sm md:text-base line-clamp-1">{channel.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
