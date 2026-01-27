import { Lock, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserTier } from '@/contexts/UserTierContext';
import { cn } from '@/lib/utils';

interface PremiumChannelLockProps {
  channelName: string;
  className?: string;
}

export function PremiumChannelLock({ channelName, className }: PremiumChannelLockProps) {
  const { openUpgradeModal } = useUserTier();

  return (
    <div
      className={cn(
        'absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm',
        className
      )}
    >
      <div className="text-center space-y-4 p-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
          <Lock className="w-8 h-8 text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-display font-bold">{channelName}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            This channel is available for Premium members
          </p>
        </div>
        <Button
          onClick={openUpgradeModal}
          className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold"
        >
          <Crown className="w-4 h-4" />
          Unlock with Premium
        </Button>
      </div>
    </div>
  );
}
