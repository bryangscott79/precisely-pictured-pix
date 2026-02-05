import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserTier } from '@/contexts/UserTierContext';
import { useLanguagePreference } from '@/hooks/useLanguagePreference';
import { useLocalNewsStation } from '@/hooks/useLocalNews';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TierBadge } from '@/components/TierBadge';
import {
  User,
  Youtube,
  Globe,
  Users,
  CreditCard,
  Shield,
  ChevronRight,
  Crown,
  Check,
  Tv
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenLanguageSettings: () => void;
  onOpenParentalSettings: () => void;
  onOpenLocalNewsSettings: () => void;
  onConnectYouTube: () => void;
}

export function ProfileSettingsModal({
  open,
  onOpenChange,
  onOpenLanguageSettings,
  onOpenParentalSettings,
  onOpenLocalNewsSettings,
  onConnectYouTube,
}: ProfileSettingsModalProps) {
  const { user, session } = useAuth();
  const { tier, isPremium, openUpgradeModal } = useUserTier();
  const { language } = useLanguagePreference();
  const localStation = useLocalNewsStation();

  if (!user) return null;

  const initials = user.email?.slice(0, 2).toUpperCase() || 'U';
  const avatarUrl = user.user_metadata?.avatar_url;
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  // Check if YouTube is connected (has provider_token with YouTube scope)
  const hasYouTubeConnected = !!session?.provider_token;

  const handleSettingClick = (action: () => void) => {
    onOpenChange(false);
    setTimeout(action, 150);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Account Settings</DialogTitle>
        </DialogHeader>

        {/* Profile Header */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border">
          <Avatar className={cn(
            'w-16 h-16',
            isPremium && 'ring-2 ring-primary/50'
          )}>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{displayName}</h3>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            <TierBadge className="mt-1.5" />
          </div>
        </div>

        {/* Settings List */}
        <div className="space-y-1 mt-2">
          {/* Account Section */}
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-2">
            Account
          </div>
          
          <SettingsItem
            icon={<User className="w-5 h-5" />}
            label="Profile Information"
            description="Name, email, avatar"
            onClick={() => {}}
          />

          <SettingsItem
            icon={<Shield className="w-5 h-5" />}
            label="Security"
            description="Password, login methods"
            onClick={() => {}}
          />

          {/* Subscription Section */}
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-2 mt-4">
            Subscription
          </div>

          {isPremium ? (
            <SettingsItem
              icon={<CreditCard className="w-5 h-5" />}
              label="Manage Subscription"
              description="Billing, payment method"
              onClick={() => handleSettingClick(openUpgradeModal)}
            />
          ) : (
            <SettingsItem
              icon={<Crown className="w-5 h-5 text-primary" />}
              label="Upgrade to Premium"
              description="Unlock all features for $9.99/mo"
              onClick={() => handleSettingClick(openUpgradeModal)}
              highlight
            />
          )}

          {/* Connected Services Section */}
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-2 mt-4">
            Connected Services
          </div>

          <SettingsItem
            icon={<Youtube className="w-5 h-5 text-destructive" />}
            label="YouTube"
            description={hasYouTubeConnected ? "Connected" : "Import your subscriptions"}
            onClick={() => handleSettingClick(onConnectYouTube)}
            status={hasYouTubeConnected ? 'connected' : undefined}
          />

          {/* Preferences Section */}
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-2 mt-4">
            Preferences
          </div>

          <SettingsItem
            icon={<Globe className="w-5 h-5" />}
            label="Language"
            description={language.name}
            onClick={() => handleSettingClick(onOpenLanguageSettings)}
          />

          <SettingsItem
            icon={<Tv className="w-5 h-5" />}
            label="Local News"
            description={localStation ? `${localStation.name}` : "Set your location"}
            onClick={() => handleSettingClick(onOpenLocalNewsSettings)}
            status={localStation ? 'connected' : undefined}
          />

          <SettingsItem
            icon={<Users className="w-5 h-5" />}
            label="Parental Controls"
            description="Manage profiles & restrictions"
            onClick={() => handleSettingClick(onOpenParentalSettings)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  highlight?: boolean;
  status?: 'connected' | 'disconnected';
}

function SettingsItem({ icon, label, description, onClick, highlight, status }: SettingsItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left",
        "hover:bg-muted focus:bg-muted focus:outline-none",
        highlight && "bg-primary/10 hover:bg-primary/20"
      )}
    >
      <div className={cn(
        "flex-shrink-0",
        highlight ? "text-primary" : "text-muted-foreground"
      )}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className={cn(
          "font-medium",
          highlight && "text-primary"
        )}>
          {label}
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {description}
        </div>
      </div>
      {status === 'connected' ? (
        <Check className="w-5 h-5 text-accent flex-shrink-0" />
      ) : (
        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      )}
    </button>
  );
}
