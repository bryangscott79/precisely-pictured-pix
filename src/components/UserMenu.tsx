import { useAuth } from '@/hooks/useAuth';
import { useUserTier } from '@/contexts/UserTierContext';
import { LogOut, User, LogIn, Crown, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TierBadge } from '@/components/TierBadge';
import { cn } from '@/lib/utils';

interface UserMenuProps {
  visible: boolean;
  onSignInClick: () => void;
}

export function UserMenu({ visible, onSignInClick }: UserMenuProps) {
  const { user, signOut, isLoading } = useAuth();
  const { tier, isPremium, openUpgradeModal } = useUserTier();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onSignInClick}
        className={cn(
          'glass-panel gap-2 transition-all duration-300',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        )}
      >
        <LogIn className="w-4 h-4" />
        Sign In
      </Button>
    );
  }

  const initials = user.email?.slice(0, 2).toUpperCase() || 'U';
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div
      className={cn(
        'flex items-center gap-2 transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      )}
    >
      <TierBadge showLabel={false} />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="glass-panel gap-2 p-1"
          >
            <Avatar className={cn(
              'w-8 h-8',
              isPremium && 'ring-2 ring-amber-500/50'
            )}>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="glass-panel border-white/10 min-w-[180px]">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium truncate">{user.email}</p>
            <TierBadge className="mt-1" />
          </div>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem className="gap-2 cursor-pointer">
            <User className="w-4 h-4" />
            Profile
          </DropdownMenuItem>
          {!isPremium && (
            <DropdownMenuItem
              className="gap-2 cursor-pointer text-amber-400 focus:text-amber-400"
              onClick={openUpgradeModal}
            >
              <Crown className="w-4 h-4" />
              Upgrade to Premium
            </DropdownMenuItem>
          )}
          {isPremium && (
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={openUpgradeModal}
            >
              <Settings className="w-4 h-4" />
              Manage Subscription
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem
            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
            onClick={() => signOut()}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
