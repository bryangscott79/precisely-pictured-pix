import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, LogIn } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserMenuProps {
  visible: boolean;
  onSignInClick: () => void;
}

export function UserMenu({ visible, onSignInClick }: UserMenuProps) {
  const { user, signOut, isLoading } = useAuth();

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'glass-panel gap-2 transition-all duration-300 p-1',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          )}
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-panel border-white/10 min-w-[180px]">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <User className="w-4 h-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          className="gap-2 cursor-pointer text-red-400 focus:text-red-400"
          onClick={() => signOut()}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
