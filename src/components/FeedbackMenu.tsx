import { useState } from 'react';
import { MoreHorizontal, ThumbsUp, Ban, Loader2 } from 'lucide-react';
import { useAlgorithmTuning } from '@/hooks/useAlgorithmTuning';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface FeedbackMenuProps {
  videoId: string;
  visible: boolean;
  onAuthRequired: () => void;
  channelId?: string; // EpiShow channel ID for algorithm tuning
  videoTitle?: string; // Video title for keyword extraction
}

export function FeedbackMenu({ videoId, visible, onAuthRequired, channelId, videoTitle }: FeedbackMenuProps) {
  const { recordPreference } = useAlgorithmTuning();
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: 'more' | 'never') => {
    setIsLoading(true);

    try {
      // Record preference using the algorithm tuning hook
      // This handles both localStorage (anonymous) and Supabase (signed-in) storage
      await recordPreference(videoId, action, { channelId, title: videoTitle });

      toast.success(
        action === 'more'
          ? 'We\'ll show you more content like this!'
          : 'You won\'t see this video again'
      );
    } catch (error) {
      console.error('Error saving preference:', error);
      toast.error('Failed to save preference');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'glass-panel h-9 w-9 transition-all duration-300',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MoreHorizontal className="w-4 h-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="glass-panel border-white/10">
        <DropdownMenuItem
          className="gap-2 cursor-pointer"
          onClick={() => handleAction('more')}
        >
          <ThumbsUp className="w-4 h-4 text-green-400" />
          More like this
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 cursor-pointer text-red-400 focus:text-red-400"
          onClick={() => handleAction('never')}
        >
          <Ban className="w-4 h-4" />
          Never show again
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
