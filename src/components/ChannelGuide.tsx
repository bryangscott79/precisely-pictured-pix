import { useEffect, useState } from 'react';
import { X, Shield, Lock } from 'lucide-react';
import { 
  channels, 
  Channel, 
  ChannelCategory,
  ChannelColor,
  categoryNames, 
  getCurrentPlayback, 
  getNextVideo, 
  formatTime,
  getAvailableChannels 
} from '@/data/channels';
import { useParentalControls } from '@/hooks/useParentalControls';

interface ChannelGuideProps {
  isOpen: boolean;
  onClose: () => void;
  currentChannel: Channel;
  onChannelSelect: (channel: Channel) => void;
  onOpenParentalControls: () => void;
}

const colorClasses: Record<ChannelColor, { bg: string; border: string; text: string }> = {
  tech: { bg: 'bg-channel-tech', border: 'border-channel-tech', text: 'text-channel-tech' },
  science: { bg: 'bg-channel-science', border: 'border-channel-science', text: 'text-channel-science' },
  maker: { bg: 'bg-channel-maker', border: 'border-channel-maker', text: 'text-channel-maker' },
  cooking: { bg: 'bg-channel-cooking', border: 'border-channel-cooking', text: 'text-channel-cooking' },
  history: { bg: 'bg-channel-history', border: 'border-channel-history', text: 'text-channel-history' },
  diy: { bg: 'bg-channel-diy', border: 'border-channel-diy', text: 'text-channel-diy' },
  sports: { bg: 'bg-channel-sports', border: 'border-channel-sports', text: 'text-channel-sports' },
  collecting: { bg: 'bg-channel-collecting', border: 'border-channel-collecting', text: 'text-channel-collecting' },
  kids: { bg: 'bg-channel-kids', border: 'border-channel-kids', text: 'text-channel-kids' },
  family: { bg: 'bg-channel-family', border: 'border-channel-family', text: 'text-channel-family' },
  faith: { bg: 'bg-channel-faith', border: 'border-channel-faith', text: 'text-channel-faith' },
  automotive: { bg: 'bg-channel-automotive', border: 'border-channel-automotive', text: 'text-channel-automotive' },
  teen: { bg: 'bg-channel-teen', border: 'border-channel-teen', text: 'text-channel-teen' },
  gaming: { bg: 'bg-channel-gaming', border: 'border-channel-gaming', text: 'text-channel-gaming' },
  music: { bg: 'bg-channel-music', border: 'border-channel-music', text: 'text-channel-music' },
  nature: { bg: 'bg-channel-nature', border: 'border-channel-nature', text: 'text-channel-nature' },
  comedy: { bg: 'bg-channel-comedy', border: 'border-channel-comedy', text: 'text-channel-comedy' },
  fitness: { bg: 'bg-channel-fitness', border: 'border-channel-fitness', text: 'text-channel-fitness' },
  travel: { bg: 'bg-channel-travel', border: 'border-channel-travel', text: 'text-channel-travel' },
  art: { bg: 'bg-channel-art', border: 'border-channel-art', text: 'text-channel-art' },
};

function ChannelCard({ 
  channel, 
  isActive, 
  onClick 
}: { 
  channel: Channel; 
  isActive: boolean; 
  onClick: () => void;
}) {
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

  const colors = colorClasses[channel.color];

  return (
    <button
      onClick={onClick}
      className={`channel-card w-full p-3 text-left transition-all duration-300 ${
        isActive ? `border-2 ${colors.border} shadow-lg` : 'hover:border-muted-foreground/30'
      }`}
      style={isActive ? { boxShadow: `0 0 30px hsl(var(--channel-${channel.color}) / 0.3)` } : undefined}
    >
      <div className="flex items-start gap-3">
        {/* Channel icon */}
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 ${colors.bg}`}>
          {channel.icon}
        </div>

        {/* Channel info */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-sm">{channel.name}</h3>
            {isActive && (
              <span className="live-badge text-[9px]">
                <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                Watching
              </span>
            )}
          </div>
          
          {/* Now playing */}
          <div className="space-y-1">
            <p className="text-xs font-medium line-clamp-1">{playback.video.title}</p>
            <div className="progress-bar h-0.5">
              <div 
                className={`progress-bar-fill ${colors.bg}`}
                style={{ width: `${playback.progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{formatTime(playback.positionInVideo)}</span>
              <span>{formatTime(playback.video.duration)}</span>
            </div>
          </div>

          {/* Up next */}
          <p className="text-[10px] text-muted-foreground">
            Up next: <span className="text-foreground/70">{nextVideo.title}</span>
          </p>
        </div>
      </div>
    </button>
  );
}

const categoryOrder: ChannelCategory[] = ['family', 'education', 'entertainment', 'lifestyle', 'hobbies'];

export function ChannelGuide({ 
  isOpen, 
  onClose, 
  currentChannel, 
  onChannelSelect,
  onOpenParentalControls 
}: ChannelGuideProps) {
  const { enabled: parentalControlsEnabled } = useParentalControls();
  const availableChannels = getAvailableChannels(parentalControlsEnabled);

  // Group channels by category
  const channelsByCategory = categoryOrder.reduce((acc, category) => {
    const categoryChannels = availableChannels.filter(c => c.category === category);
    if (categoryChannels.length > 0) {
      acc[category] = categoryChannels;
    }
    return acc;
  }, {} as Record<ChannelCategory, Channel[]>);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="guide-overlay fade-in" onClick={onClose}>
      <div 
        className={`guide-panel fixed right-0 top-0 bottom-0 w-full max-w-md overflow-hidden ${
          isOpen ? 'slide-in-right' : 'slide-out-right'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display font-bold text-xl">Channel Guide</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onOpenParentalControls();
              }}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                parentalControlsEnabled 
                  ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
              title="Parental Controls"
            >
              {parentalControlsEnabled ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
            </button>
            <button 
              onClick={onClose}
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Channel list grouped by category */}
        <div className="p-3 space-y-4 overflow-y-auto h-[calc(100%-130px)]">
          {categoryOrder.map((category) => {
            const categoryChannels = channelsByCategory[category];
            if (!categoryChannels || categoryChannels.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                  {categoryNames[category]}
                </h3>
                <div className="space-y-2">
                  {categoryChannels.map((channel) => (
                    <ChannelCard
                      key={channel.id}
                      channel={channel}
                      isActive={channel.id === currentChannel.id}
                      onClick={() => {
                        onChannelSelect(channel);
                        onClose();
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with parental controls status */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border bg-background/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span><kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd> Navigate</span>
              <span><kbd className="kbd">Esc</kbd> Close</span>
            </div>
            <span className="text-[10px]">
              {availableChannels.length} channels
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
