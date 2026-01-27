import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useOnboarding, ChannelLineupItem } from '@/contexts/OnboardingContext';
import { channels as allChannels } from '@/data/channels';
import { cn } from '@/lib/utils';
import { ArrowLeft, GripVertical, X, Plus, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

// Map interests to channel IDs
const INTEREST_TO_CHANNELS: Record<string, string[]> = {
  science: ['science', 'nature'],
  technology: ['tech'],
  history: ['history'],
  cooking: ['cooking'],
  fitness: ['fitness'],
  gaming: ['gaming'],
  faith: ['faith'],
  kids: ['kids', 'family'],
  nature: ['nature'],
  automotive: ['automotive'],
  comedy: ['comedy'],
  music: ['music', 'music80s', 'music90s', 'music00s', 'music10s'],
  diy: ['diy', 'maker'],
  art: ['art'],
  sports: ['sports'],
  travel: ['travel'],
  podcasts: ['podcast'],
  teen: ['teen'],
};

export function ChannelLineup() {
  const { state, setStep, setChannelLineup, removeChannelFromLineup, completeOnboarding } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);
  const [showAddMore, setShowAddMore] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Generate initial lineup from interests
  useEffect(() => {
    if (state.channelLineup.length === 0 && state.selectedInterests.length > 0) {
      const channelIds = new Set<string>();
      state.selectedInterests.forEach(interest => {
        const channels = INTEREST_TO_CHANNELS[interest] || [];
        channels.forEach(c => channelIds.add(c));
      });

      const lineup: ChannelLineupItem[] = Array.from(channelIds)
        .filter(id => allChannels.some(c => c.id === id))
        .map((channelId, i) => ({
          channelId,
          position: i,
          isCustom: false,
        }));

      setChannelLineup(lineup);
    }
  }, [state.selectedInterests, state.channelLineup.length, setChannelLineup]);

  const lineupChannels = state.channelLineup
    .sort((a, b) => a.position - b.position)
    .map(item => {
      const channel = allChannels.find(c => c.id === item.channelId);
      return channel ? { ...item, channel } : null;
    })
    .filter(Boolean) as Array<ChannelLineupItem & { channel: typeof allChannels[0] }>;

  const availableToAdd = allChannels.filter(
    c => !c.premium && !state.channelLineup.some(l => l.channelId === c.id)
  );

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newLineup = [...state.channelLineup];
    const [dragged] = newLineup.splice(draggedIndex, 1);
    newLineup.splice(index, 0, dragged);

    setChannelLineup(newLineup.map((l, i) => ({ ...l, position: i })));
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleAddChannel = (channelId: string) => {
    const newLineup = [
      ...state.channelLineup,
      { channelId, position: state.channelLineup.length, isCustom: false },
    ];
    setChannelLineup(newLineup);
    setShowAddMore(false);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await completeOnboarding();
      toast.success('Your channel lineup is ready!');
    } catch (err) {
      toast.error('Failed to save your preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Channel Lineup</h2>
        <p className="text-muted-foreground">
          Drag to reorder. Your #1 channel plays first.
        </p>
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto space-y-2 px-1">
        {lineupChannels.map((item, index) => (
          <div
            key={item.channelId}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border bg-card transition-all',
              draggedIndex === index && 'opacity-50 scale-95',
              'hover:border-primary/50'
            )}
          >
            <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
            <span className="w-8 text-center font-mono text-muted-foreground">
              {index + 1}.
            </span>
            <span className="text-2xl">{item.channel.icon}</span>
            <span className="flex-1 font-medium">{item.channel.name}</span>
            <button
              onClick={() => removeChannelFromLineup(item.channelId)}
              className="p-1 hover:bg-destructive/10 rounded transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        ))}

        {/* Add More Button */}
        {!showAddMore ? (
          <button
            onClick={() => setShowAddMore(true)}
            className="flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all w-full text-muted-foreground"
          >
            <Plus className="w-4 h-4" />
            Add More Channels
          </button>
        ) : (
          <div className="border rounded-lg p-3 bg-muted/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Add a channel</span>
              <button
                onClick={() => setShowAddMore(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {availableToAdd.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => handleAddChannel(channel.id)}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10 transition-colors text-left"
                >
                  <span>{channel.icon}</span>
                  <span className="text-sm truncate">{channel.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep('interests')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <Button
          onClick={handleComplete}
          disabled={isLoading || lineupChannels.length === 0}
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Start Watching
        </Button>
      </div>
    </div>
  );
}
