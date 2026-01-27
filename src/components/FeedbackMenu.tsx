import { useState } from 'react';
import { MoreHorizontal, ThumbsUp, Ban, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
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
}

const LOCAL_STORAGE_KEY = 'epishow-preferences';

function getLocalPreferences(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function setLocalPreference(videoId: string, action: string) {
  const prefs = getLocalPreferences();
  prefs[videoId] = action;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prefs));
}

export function FeedbackMenu({ videoId, visible, onAuthRequired }: FeedbackMenuProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: 'more' | 'never') => {
    // Always save to localStorage for free users
    setLocalPreference(videoId, action);

    if (user) {
      // Sync to database for connected users
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from('user_preferences')
          .upsert(
            { user_id: user.id, video_id: videoId, action },
            { onConflict: 'user_id,video_id,action' }
          );

        if (error) throw error;
      } catch (error) {
        console.error('Error saving preference:', error);
      } finally {
        setIsLoading(false);
      }
    }

    toast.success(
      action === 'more' 
        ? 'We\'ll show you more content like this!' 
        : 'You won\'t see this video again'
    );
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
