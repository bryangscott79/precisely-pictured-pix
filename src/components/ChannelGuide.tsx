import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { channels, Channel, getCurrentPlayback, getNextVideo, formatTime } from '@/data/channels';

interface ChannelGuideProps {
  isOpen: boolean;
  onClose: () => void;
  currentChannel: Channel;
  onChannelSelect: (channel: Channel) => void;
}

const colorClasses = {
  tech: { bg: 'bg-channel-tech', border: 'border-channel-tech', text: 'text-channel-tech' },
  science: { bg: 'bg-channel-science', border: 'border-channel-science', text: 'text-channel-science' },
  maker: { bg: 'bg-channel-maker', border: 'border-channel-maker', text: 'text-channel-maker' },
  cooking: { bg: 'bg-channel-cooking', border: 'border-channel-cooking', text: 'text-channel-cooking' },
  history: { bg: 'bg-channel-history', border: 'border-channel-history', text: 'text-channel-history' },
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
      className={`channel-card w-full p-4 text-left transition-all duration-300 ${
        isActive ? `border-2 ${colors.border} shadow-lg` : 'hover:border-muted-foreground/30'
      }`}
      style={isActive ? { boxShadow: `0 0 30px hsl(var(--channel-${channel.color}) / 0.3)` } : undefined}
    >
      <div className="flex items-start gap-4">
        {/* Channel icon */}
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0 ${colors.bg}`}>
          {channel.icon}
        </div>

        {/* Channel info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-lg">{channel.name}</h3>
            {isActive && (
              <span className="live-badge text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Watching
              </span>
            )}
          </div>
          
          {/* Now playing */}
          <div className="space-y-1">
            <p className="text-sm font-medium line-clamp-1">{playback.video.title}</p>
            <div className="progress-bar h-1">
              <div 
                className={`progress-bar-fill ${colors.bg}`}
                style={{ width: `${playback.progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(playback.positionInVideo)}</span>
              <span>{formatTime(playback.video.duration)}</span>
            </div>
          </div>

          {/* Up next */}
          <p className="text-xs text-muted-foreground">
            Up next: <span className="text-foreground/70">{nextVideo.title}</span>
          </p>
        </div>
      </div>
    </button>
  );
}

export function ChannelGuide({ isOpen, onClose, currentChannel, onChannelSelect }: ChannelGuideProps) {
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
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display font-bold text-2xl">Channel Guide</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel list */}
        <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-80px)]">
          {channels.map((channel) => (
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

        {/* Keyboard hints */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background/80 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span><kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd> Navigate</span>
            <span><kbd className="kbd">Enter</kbd> Select</span>
            <span><kbd className="kbd">Esc</kbd> Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
