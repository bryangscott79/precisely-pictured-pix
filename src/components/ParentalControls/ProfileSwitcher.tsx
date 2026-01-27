import { useState } from 'react';
import { useProfiles, Profile, AVATAR_OPTIONS } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Plus, Lock, Settings } from 'lucide-react';
import { PinEntry } from './PinEntry';

interface ProfileSwitcherProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenSettings: () => void;
}

export function ProfileSwitcher({ open, onOpenChange, onOpenSettings }: ProfileSwitcherProps) {
  const { profiles, activeProfile, switchProfile, switchToMainProfile, isChildProfile } = useProfiles();
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [targetProfileId, setTargetProfileId] = useState<string | null>(null);

  const handleProfileSelect = (profile: Profile) => {
    // If currently on child profile and trying to switch to non-child, require PIN
    if (isChildProfile && !profile.isChild) {
      setTargetProfileId(profile.id);
      setShowPinEntry(true);
      return;
    }

    // Direct switch
    switchProfile(profile.id);
    onOpenChange(false);
  };

  const handlePinSubmit = (pin: string) => {
    if (targetProfileId) {
      const success = switchProfile(targetProfileId, pin);
      if (success) {
        setShowPinEntry(false);
        setTargetProfileId(null);
        onOpenChange(false);
        return true;
      }
    } else {
      const success = switchToMainProfile(pin);
      if (success) {
        setShowPinEntry(false);
        onOpenChange(false);
        return true;
      }
    }
    return false;
  };

  const handleSettingsClick = () => {
    if (isChildProfile) {
      // Need PIN to access settings
      setTargetProfileId(null); // null means we want main profile
      setShowPinEntry(true);
    } else {
      onOpenSettings();
    }
  };

  if (showPinEntry) {
    return (
      <Dialog open={open} onOpenChange={(o) => {
        if (!o) setShowPinEntry(false);
        onOpenChange(o);
      }}>
        <DialogContent className="glass-panel border-white/10 max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Enter PIN
            </DialogTitle>
          </DialogHeader>
          <PinEntry
            onSubmit={handlePinSubmit}
            onCancel={() => setShowPinEntry(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle>Who's Watching?</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mt-4">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleProfileSelect(profile)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl transition-all',
                'hover:bg-white/10 active:scale-95',
                activeProfile?.id === profile.id && 'ring-2 ring-primary bg-white/5'
              )}
            >
              <div className={cn(
                'text-5xl p-2 rounded-full',
                profile.isChild ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20' : 'bg-white/10'
              )}>
                {profile.avatar}
              </div>
              <span className="text-sm font-medium truncate max-w-full">
                {profile.name}
              </span>
              {profile.isChild && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                  {profile.maxRating}
                </span>
              )}
            </button>
          ))}

          {/* Add Profile Button - Only show if not on child profile */}
          {!isChildProfile && (
            <button
              onClick={onOpenSettings}
              className={cn(
                'flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all',
                'border-2 border-dashed border-white/20 hover:border-white/40 hover:bg-white/5'
              )}
            >
              <div className="text-3xl p-2 text-white/40">
                <Plus className="w-8 h-8" />
              </div>
              <span className="text-sm text-white/60">Add Profile</span>
            </button>
          )}
        </div>

        {/* Settings Button */}
        <div className="flex justify-center mt-4 pt-4 border-t border-white/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSettingsClick}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            Manage Profiles
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
