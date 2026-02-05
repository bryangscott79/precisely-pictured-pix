import { useState } from 'react';
import { Plus, Loader2, Sparkles, Crown, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCustomChannels, CreateChannelInput } from '@/hooks/useCustomChannels';
import { useUserTier } from '@/contexts/UserTierContext';
import { useAuth } from '@/hooks/useAuth';
import { ChannelColor } from '@/data/channels';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CustomChannelCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onChannelCreated?: (channelId: string) => void;
}

// Available emojis for channel icons
const EMOJI_OPTIONS = [
  '📺', '🎬', '🎮', '🎨', '🎵', '📚', '🔬', '🌍', '🏆', '💡',
  '🎯', '🚀', '🌟', '🎭', '🎪', '🎸', '📷', '🎥', '🏠', '🌿',
  '🐾', '🍳', '💪', '🧘', '🎓', '💻', '🛠️', '✈️', '🎾', '⚽',
];

// Available colors for channels
const COLOR_OPTIONS: { value: ChannelColor; label: string; class: string }[] = [
  { value: 'tech', label: 'Blue', class: 'bg-channel-tech' },
  { value: 'science', label: 'Purple', class: 'bg-channel-science' },
  { value: 'maker', label: 'Orange', class: 'bg-channel-maker' },
  { value: 'cooking', label: 'Red', class: 'bg-channel-cooking' },
  { value: 'history', label: 'Brown', class: 'bg-channel-history' },
  { value: 'nature', label: 'Green', class: 'bg-channel-nature' },
  { value: 'gaming', label: 'Indigo', class: 'bg-channel-gaming' },
  { value: 'music', label: 'Pink', class: 'bg-channel-music' },
  { value: 'fitness', label: 'Cyan', class: 'bg-channel-fitness' },
  { value: 'art', label: 'Magenta', class: 'bg-channel-art' },
];

// Topic suggestions for inspiration
const TOPIC_SUGGESTIONS = [
  'Art History',
  'Space Exploration',
  'Pokemon',
  'Guitar Lessons',
  'Philosophy',
  'True Crime',
  'Ancient Rome',
  'Woodworking',
  'Chess',
  'Anime Analysis',
];

export function CustomChannelCreator({
  isOpen,
  onClose,
  onChannelCreated,
}: CustomChannelCreatorProps) {
  const { user } = useAuth();
  const { isConnected, isPremium, openUpgradeModal } = useUserTier();
  const {
    createChannel,
    canCreateChannel,
    remainingSlots,
    customChannelLimit,
    error: hookError,
  } = useCustomChannels();

  const [topic, setTopic] = useState('');
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📺');
  const [selectedColor, setSelectedColor] = useState<ChannelColor>('tech');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate name from topic
  const handleTopicChange = (value: string) => {
    setTopic(value);
    // Auto-generate a name if user hasn't manually edited it
    if (!name || name === `${topic} Channel` || topic === '') {
      setName(value ? `${value} Channel` : '');
    }
    setError(null);
  };

  const handleCreate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for your channel');
      return;
    }

    if (!name.trim()) {
      setError('Please enter a name for your channel');
      return;
    }

    setIsCreating(true);
    setError(null);

    const input: CreateChannelInput = {
      name: name.trim(),
      topic: topic.trim(),
      icon: selectedEmoji,
      color: selectedColor,
    };

    const newChannel = await createChannel(input);

    if (newChannel) {
      toast.success(`Created "${newChannel.name}" channel!`);
      onChannelCreated?.(newChannel.channelId);
      handleClose();
    } else {
      setError(hookError || 'Failed to create channel');
    }

    setIsCreating(false);
  };

  const handleClose = () => {
    setTopic('');
    setName('');
    setSelectedEmoji('📺');
    setSelectedColor('tech');
    setError(null);
    onClose();
  };

  // Not signed in
  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Create Custom Channel
            </DialogTitle>
            <DialogDescription>
              Sign in to create your own custom channels with any topic you want.
            </DialogDescription>
          </DialogHeader>

          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              Custom channels let you create personalized content streams based on any topic.
            </p>
            <Button onClick={handleClose}>
              Sign In to Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // User is connected but has reached their limit
  if (!canCreateChannel && isConnected && !isPremium) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              Channel Limit Reached
            </DialogTitle>
            <DialogDescription>
              You've used all {customChannelLimit} of your custom channel slots.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20">
              <p className="text-sm font-medium text-amber-400 mb-2">
                Upgrade to Premium
              </p>
              <p className="text-sm text-muted-foreground">
                Get unlimited custom channels, plus access to premium content like Movies, NFL Highlights, and 80s Cinema.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Maybe Later
              </Button>
              <Button
                onClick={() => {
                  handleClose();
                  openUpgradeModal();
                }}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-600 hover:to-yellow-600"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Create Custom Channel
          </DialogTitle>
          <DialogDescription>
            Create a channel that streams content about any topic you're interested in.
            {remainingSlots !== Infinity && (
              <span className="block mt-1 text-xs">
                {remainingSlots} {remainingSlots === 1 ? 'slot' : 'slots'} remaining
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Topic input */}
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="e.g., Art History, Pokemon, Guitar Lessons..."
              value={topic}
              onChange={(e) => handleTopicChange(e.target.value)}
              className="text-base"
              autoFocus
            />
            {/* Topic suggestions */}
            <div className="flex flex-wrap gap-1.5">
              {TOPIC_SUGGESTIONS.slice(0, 5).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleTopicChange(suggestion);
                  }}
                  className="px-2 py-0.5 text-xs rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Channel name */}
          <div className="space-y-2">
            <Label htmlFor="name">Channel Name</Label>
            <Input
              id="name"
              placeholder="My Custom Channel"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Emoji picker */}
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-1">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedEmoji(emoji);
                  }}
                  className={cn(
                    'w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all',
                    selectedEmoji === emoji
                      ? 'bg-primary/20 ring-2 ring-primary scale-110'
                      : 'bg-muted hover:bg-muted/80'
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedColor(color.value);
                  }}
                  className={cn(
                    'w-8 h-8 rounded-full transition-all',
                    color.class,
                    selectedColor === color.value
                      ? 'ring-2 ring-offset-2 ring-offset-background ring-white scale-110'
                      : 'hover:scale-105'
                  )}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          {topic && (
            <div className="p-3 rounded-lg border bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">Preview:</p>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center text-xl',
                    COLOR_OPTIONS.find((c) => c.value === selectedColor)?.class || 'bg-channel-tech'
                  )}
                >
                  {selectedEmoji}
                </div>
                <div>
                  <p className="font-semibold text-sm">{name || 'My Channel'}</p>
                  <p className="text-xs text-muted-foreground">
                    Streaming {topic} content
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isCreating}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating || !topic.trim() || !name.trim()}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Channel
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Button to open the creator modal
export function CreateChannelButton({
  onClick,
  variant = 'default',
}: {
  onClick: () => void;
  variant?: 'default' | 'compact';
}) {
  const { isConnected, isPremium } = useUserTier();
  const { canCreateChannel, remainingSlots } = useCustomChannels();

  if (!isConnected) {
    return null; // Don't show button if not signed in
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className="w-full p-2 rounded-lg border border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30 transition-all flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <Plus className="w-4 h-4" />
        <span className="text-xs font-medium">Create Channel</span>
        {!isPremium && remainingSlots !== Infinity && (
          <span className="text-[10px] text-muted-foreground">
            ({remainingSlots} left)
          </span>
        )}
      </button>
    );
  }

  return (
    <Button onClick={onClick} variant="outline" className="gap-2">
      <Plus className="w-4 h-4" />
      Create Custom Channel
      {!isPremium && remainingSlots !== Infinity && (
        <span className="text-xs text-muted-foreground ml-1">
          ({remainingSlots} left)
        </span>
      )}
    </Button>
  );
}
