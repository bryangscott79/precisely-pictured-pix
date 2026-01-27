import { useEffect, useMemo, useState } from 'react';
import { X, Shield, Lock, Clock, Grid3X3, Crown } from 'lucide-react';
import { 
  Channel, 
  ChannelCategory,
  ChannelColor,
  categoryNames, 
  getCurrentPlayback, 
  getNextVideo, 
  formatTime,
  formatTimeSlot,
  getChannelSchedule,
  getAvailableChannels,
  ScheduleItem
} from '@/data/channels';
import { useParentalControls } from '@/hooks/useParentalControls';
import { useUserTier } from '@/contexts/UserTierContext';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  music80s: { bg: 'bg-channel-music80s', border: 'border-channel-music80s', text: 'text-channel-music80s' },
  music90s: { bg: 'bg-channel-music90s', border: 'border-channel-music90s', text: 'text-channel-music90s' },
  music00s: { bg: 'bg-channel-music00s', border: 'border-channel-music00s', text: 'text-channel-music00s' },
  music10s: { bg: 'bg-channel-music10s', border: 'border-channel-music10s', text: 'text-channel-music10s' },
  movies: { bg: 'bg-channel-movies', border: 'border-channel-movies', text: 'text-channel-movies' },
  nfl: { bg: 'bg-channel-nfl', border: 'border-channel-nfl', text: 'text-channel-nfl' },
  cinema80s: { bg: 'bg-channel-cinema80s', border: 'border-channel-cinema80s', text: 'text-channel-cinema80s' },
  podcast: { bg: 'bg-channel-podcast', border: 'border-channel-podcast', text: 'text-channel-podcast' },
  localnews: { bg: 'bg-channel-localnews', border: 'border-channel-localnews', text: 'text-channel-localnews' },
};

type ViewMode = 'grid' | 'schedule';

function ChannelCard({ 
  channel, 
  isActive, 
  onClick,
  isLocked,
}: { 
  channel: Channel; 
  isActive: boolean; 
  onClick: () => void;
  isLocked: boolean;
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
      className={`channel-card w-full p-2 md:p-3 text-left transition-all duration-300 ${
        isActive ? `border-2 ${colors.border} shadow-lg` : 'hover:border-muted-foreground/30'
      }`}
      style={isActive ? { boxShadow: `0 0 30px hsl(var(--channel-${channel.color}) / 0.3)` } : undefined}
    >
      <div className="flex items-start gap-2 md:gap-3">
        {/* Channel icon */}
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-lg md:text-xl shrink-0 ${colors.bg}`}>
          {channel.icon}
        </div>

        {/* Channel info */}
        <div className="flex-1 min-w-0 space-y-1 md:space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-xs md:text-sm">{channel.name}</h3>
            {isLocked && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-semibold bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/30">
                <Crown className="w-2.5 h-2.5" />
                Premium
              </span>
            )}
            {isActive && !isLocked && (
              <span className="live-badge text-[8px] md:text-[9px]">
                <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                Watching
              </span>
            )}
          </div>
          
          {/* Now playing */}
          <div className="space-y-1">
            <p className="text-[10px] md:text-xs font-medium line-clamp-1">{playback.video.title}</p>
            <div className="progress-bar h-0.5">
              <div 
                className={`progress-bar-fill ${colors.bg}`}
                style={{ width: `${playback.progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] md:text-[10px] text-muted-foreground">
              <span>{formatTime(playback.positionInVideo)}</span>
              <span>{formatTime(playback.video.duration)}</span>
            </div>
          </div>

          {/* Up next - hidden on mobile */}
          <p className="hidden sm:block text-[10px] text-muted-foreground">
            Up next: <span className="text-foreground/70">{nextVideo.title}</span>
          </p>
        </div>
      </div>
    </button>
  );
}

// Schedule row component for time-based view
function ScheduleRow({
  channel,
  schedule,
  isActive,
  onClick,
}: {
  channel: Channel;
  schedule: ScheduleItem[];
  isActive: boolean;
  onClick: () => void;
}) {
  const colors = colorClasses[channel.color];

  return (
    <div className={`flex border-b border-border/50 ${isActive ? 'bg-muted/30' : ''}`}>
      {/* Channel info column */}
      <button
        onClick={onClick}
        className={`w-32 shrink-0 p-2 flex items-center gap-2 border-r border-border/50 hover:bg-muted/50 transition-colors ${
          isActive ? `border-l-2 ${colors.border}` : ''
        }`}
      >
        <div className={`w-8 h-8 rounded flex items-center justify-center text-base ${colors.bg}`}>
          {channel.icon}
        </div>
        <span className="text-xs font-medium truncate">{channel.name}</span>
      </button>

      {/* Schedule items */}
      <div className="flex-1 flex overflow-x-auto">
        {schedule.map((item, idx) => (
          <div
            key={`${item.video.id}-${idx}`}
            className={`shrink-0 p-2 border-r border-border/30 transition-colors ${
              item.isNowPlaying 
                ? `${colors.bg} bg-opacity-20 border-l-2 ${colors.border}` 
                : 'hover:bg-muted/30'
            }`}
            style={{ 
              width: `${Math.max(120, Math.min(300, item.video.duration / 10))}px` 
            }}
          >
            <div className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground">
                {formatTimeSlot(item.startTime)}
              </p>
              <p className="text-xs font-medium line-clamp-2">{item.video.title}</p>
              <p className="text-[10px] text-muted-foreground">
                {formatTime(item.video.duration)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Time markers for the schedule header
function TimeHeader() {
  const [timeSlots, setTimeSlots] = useState<Date[]>([]);

  useEffect(() => {
    const updateTimeSlots = () => {
      const now = new Date();
      const slots: Date[] = [];
      
      // Round down to nearest 30 minutes
      const startMinutes = Math.floor(now.getMinutes() / 30) * 30;
      const start = new Date(now);
      start.setMinutes(startMinutes, 0, 0);
      
      // Generate 6 time slots (3 hours)
      for (let i = 0; i < 6; i++) {
        const slot = new Date(start.getTime() + i * 30 * 60 * 1000);
        slots.push(slot);
      }
      
      setTimeSlots(slots);
    };

    updateTimeSlots();
    const interval = setInterval(updateTimeSlots, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex border-b border-border sticky top-0 bg-background z-10">
      <div className="w-32 shrink-0 p-2 border-r border-border flex items-center gap-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-semibold text-muted-foreground">Channel</span>
      </div>
      <div className="flex-1 flex">
        {timeSlots.map((slot, idx) => (
          <div 
            key={idx} 
            className="flex-1 p-2 text-center border-r border-border/30 min-w-[120px]"
          >
            <span className={`text-xs font-medium ${idx === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
              {formatTimeSlot(slot)}
            </span>
          </div>
        ))}
      </div>
    </div>
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
  const { isPremium } = useUserTier();
  // Memoize so `availableChannels` doesn't change identity every render.
  // This prevents schedule update effects from re-running continuously.
  const availableChannels = useMemo(
    () => getAvailableChannels(parentalControlsEnabled),
    [parentalControlsEnabled]
  );
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [schedules, setSchedules] = useState<Map<string, ScheduleItem[]>>(new Map());

  // Update schedules
  useEffect(() => {
    if (viewMode !== 'schedule') return;

    const updateSchedules = () => {
      const newSchedules = new Map<string, ScheduleItem[]>();
      availableChannels.forEach(channel => {
        newSchedules.set(channel.id, getChannelSchedule(channel, 3));
      });
      setSchedules(newSchedules);
    };

    updateSchedules();
    const interval = setInterval(updateSchedules, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [viewMode, availableChannels]);

  // Group channels by category
  const channelsByCategory = useMemo(() => {
    return categoryOrder.reduce((acc, category) => {
      const categoryChannels = availableChannels.filter(c => c.category === category);
      if (categoryChannels.length > 0) {
        acc[category] = categoryChannels;
      }
      return acc;
    }, {} as Record<ChannelCategory, Channel[]>);
  }, [availableChannels]);

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
        className={`guide-panel fixed right-0 top-0 bottom-0 overflow-hidden w-full md:w-auto ${
          viewMode === 'schedule' ? 'md:max-w-4xl' : 'md:max-w-md'
        } ${isOpen ? 'slide-in-right' : 'slide-out-right'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-border">
          <h2 className="font-display font-bold text-lg md:text-xl">Channel Guide</h2>
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* View mode toggle - hidden on mobile */}
            <div className="hidden sm:flex rounded-lg overflow-hidden border border-border">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('schedule')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === 'schedule' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                <Clock className="w-4 h-4" />
              </button>
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                onOpenParentalControls();
              }}
              className={`w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center transition-colors ${
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
              className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Force grid view on mobile */}
        {(viewMode === 'grid' || typeof window !== 'undefined' && window.innerWidth < 640) ? (
          // Grid view - grouped by category
          <div className="p-2 md:p-3 space-y-3 md:space-y-4 overflow-y-auto h-[calc(100%-110px)] md:h-[calc(100%-130px)]">
            {categoryOrder.map((category) => {
              const categoryChannels = channelsByCategory[category];
              if (!categoryChannels || categoryChannels.length === 0) return null;

              return (
                <div key={category}>
                  <h3 className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 md:mb-2 px-1">
                    {categoryNames[category]}
                  </h3>
                  <div className="space-y-1.5 md:space-y-2">
                    {categoryChannels.map((channel) => (
                      <ChannelCard
                        key={channel.id}
                        channel={channel}
                        isActive={channel.id === currentChannel.id}
                        isLocked={!!channel.premium && !isPremium}
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
        ) : (
          // Schedule view - time-based
          <div className="h-[calc(100%-130px)] overflow-hidden flex flex-col">
            <TimeHeader />
            <ScrollArea className="flex-1">
              {categoryOrder.map((category) => {
                const categoryChannels = channelsByCategory[category];
                if (!categoryChannels || categoryChannels.length === 0) return null;

                return (
                  <div key={category}>
                    <div className="sticky top-0 bg-muted/80 backdrop-blur-sm px-3 py-1.5 border-b border-border">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {categoryNames[category]}
                      </span>
                    </div>
                    {categoryChannels.map((channel) => (
                      <ScheduleRow
                        key={channel.id}
                        channel={channel}
                        schedule={schedules.get(channel.id) || []}
                        isActive={channel.id === currentChannel.id}
                        onClick={() => {
                          onChannelSelect(channel);
                          onClose();
                        }}
                      />
                    ))}
                  </div>
                );
              })}
            </ScrollArea>
          </div>
        )}

        {/* Footer with parental controls status */}
        <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 border-t border-border bg-background/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-[10px] md:text-xs text-muted-foreground">
            <div className="hidden sm:flex items-center gap-4">
              <span><kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd> Navigate</span>
              <span><kbd className="kbd">Esc</kbd> Close</span>
            </div>
            <span className="text-[10px] sm:ml-auto">
              {availableChannels.length} channels
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
