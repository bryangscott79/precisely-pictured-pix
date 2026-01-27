import { Crown, Check, User } from 'lucide-react';
import { useUserTier } from '@/contexts/UserTierContext';
import { cn } from '@/lib/utils';

interface TierBadgeProps {
  className?: string;
  showLabel?: boolean;
}

export function TierBadge({ className, showLabel = true }: TierBadgeProps) {
  const { tier, isPremium, isConnected } = useUserTier();

  if (tier === 'free') {
    return null;
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold',
        isPremium
          ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/30'
          : 'bg-primary/20 text-primary border border-primary/30',
        className
      )}
    >
      {isPremium ? (
        <Crown className="w-3 h-3" />
      ) : (
        <Check className="w-3 h-3" />
      )}
      {showLabel && (
        <span>{isPremium ? 'Premium' : 'Connected'}</span>
      )}
    </div>
  );
}
