import { useAuth } from '@/hooks/useAuth';
import { useUserTier } from '@/contexts/UserTierContext';
import { useProfiles } from '@/contexts/ProfileContext';
import { LogOut, User, LogIn, Settings } from 'lucide-react';
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
  onSwitchProfile?: () => void;
  onOpenProfileSettings?: () => void;
}

export function UserMenu({ visible, onSignInClick, onSwitchProfile, onOpenProfileSettings }: UserMenuProps) {
  const { user, signOut, isLoading } = useAuth();
  const { isPremium } = useUserTier();
  const { activeProfile, isChildProfile } = useProfiles();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 transition-all duration-300',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        )}
      >
        {/* Profile Switcher Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSwitchProfile}
          className="glass-panel gap-2"
        >
          <span className="text-lg">{activeProfile?.avatar || '👤'}</span>
          <span className="hidden md:inline">{activeProfile?.name || 'Profile'}</span>
          {isChildProfile && activeProfile && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-300">
              {activeProfile.maxRating}
            </span>
          )}
        </Button>

        {!isChildProfile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignInClick}
            className="glass-panel gap-2"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
        )}
      </div>
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
      {/* Profile Switcher Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onSwitchProfile}
        className="glass-panel gap-2"
      >
        <span className="text-lg">{activeProfile?.avatar || '👤'}</span>
        <span className="hidden md:inline">{activeProfile?.name || 'Profile'}</span>
        {isChildProfile && activeProfile && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-300">
            {activeProfile.maxRating}
          </span>
        )}
      </Button>

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
        <DropdownMenuContent align="end" className="glass-panel border-white/10 min-w-[160px]">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium truncate">{user.email}</p>
            <TierBadge className="mt-1" />
          </div>
          <DropdownMenuSeparator className="bg-white/10" />
          {!isChildProfile && (
            <DropdownMenuItem 
              className="gap-2 cursor-pointer"
              onClick={onOpenProfileSettings}
            >
              <Settings className="w-4 h-4" />
              Settings
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
