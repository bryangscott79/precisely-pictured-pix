import { useState } from 'react';
import { useProfiles, Profile, ContentRating, AVATAR_OPTIONS, RATING_CHANNELS } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Trash2, Plus, Lock, Pencil, ChevronLeft } from 'lucide-react';
import { PinEntry } from './PinEntry';
import { channels } from '@/data/channels';
import { toast } from 'sonner';

interface ProfileSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SettingsView = 'list' | 'edit' | 'create' | 'pin';

export function ProfileSettings({ open, onOpenChange }: ProfileSettingsProps) {
  const { profiles, createProfile, updateProfile, deleteProfile, getMainProfile } = useProfiles();
  const [view, setView] = useState<SettingsView>('list');
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🧒');
  const [maxRating, setMaxRating] = useState<ContentRating>('PG');
  const [dailyLimitEnabled, setDailyLimitEnabled] = useState(false);
  const [dailyLimitMinutes, setDailyLimitMinutes] = useState(60);
  const [bedtimeEnabled, setBedtimeEnabled] = useState(false);
  const [bedtime, setBedtime] = useState('20:00');
  const [allowedChannels, setAllowedChannels] = useState<string[]>([]);
  const [useCustomChannels, setUseCustomChannels] = useState(false);

  const resetForm = () => {
    setName('');
    setAvatar('🧒');
    setMaxRating('PG');
    setDailyLimitEnabled(false);
    setDailyLimitMinutes(60);
    setBedtimeEnabled(false);
    setBedtime('20:00');
    setAllowedChannels([]);
    setUseCustomChannels(false);
  };

  const loadProfileToForm = (profile: Profile) => {
    setName(profile.name);
    setAvatar(profile.avatar);
    setMaxRating(profile.maxRating);
    setDailyLimitEnabled(!!profile.dailyLimitMinutes);
    setDailyLimitMinutes(profile.dailyLimitMinutes || 60);
    setBedtimeEnabled(!!profile.bedtime);
    setBedtime(profile.bedtime || '20:00');
    setAllowedChannels(profile.allowedChannels || []);
    setUseCustomChannels(!!profile.allowedChannels && profile.allowedChannels.length > 0);
  };

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile);
    loadProfileToForm(profile);
    setView('edit');
  };

  const handleCreateNew = () => {
    resetForm();
    setEditingProfile(null);
    setView('create');
  };

  const handleSaveProfile = (pin?: string) => {
    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    const profileData: Omit<Profile, 'id'> = {
      name: name.trim(),
      avatar,
      isChild: true,
      pin,
      maxRating,
      dailyLimitMinutes: dailyLimitEnabled ? dailyLimitMinutes : undefined,
      bedtime: bedtimeEnabled ? bedtime : undefined,
      allowedChannels: useCustomChannels ? allowedChannels : undefined,
    };

    if (editingProfile) {
      updateProfile(editingProfile.id, { ...profileData, id: editingProfile.id, pin: pin || editingProfile.pin });
      toast.success('Profile updated');
    } else {
      createProfile(profileData);
      toast.success('Profile created');
    }

    setView('list');
    resetForm();
  };

  const handleDeleteProfile = (profile: Profile) => {
    if (confirm(`Delete ${profile.name}'s profile? This cannot be undone.`)) {
      deleteProfile(profile.id);
      toast.success('Profile deleted');
    }
  };

  const handlePinComplete = (pin: string) => {
    handleSaveProfile(pin);
    return true;
  };

  const handleSetMainPin = () => {
    setEditingProfile(getMainProfile());
    setView('pin');
  };

  const handleMainPinComplete = (pin: string) => {
    const mainProfile = getMainProfile();
    if (mainProfile) {
      updateProfile(mainProfile.id, { pin });
      toast.success('Main profile PIN set');
    }
    setView('list');
    return true;
  };

  const toggleChannel = (channelId: string) => {
    setAllowedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const getChannelsForRating = (rating: ContentRating): string[] => {
    if (rating === 'R') return channels.map(c => c.id);
    return RATING_CHANNELS[rating];
  };

  const renderList = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-white/70">Profiles</h3>
        {profiles.map(profile => (
          <div
            key={profile.id}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg',
              'bg-white/5 hover:bg-white/10 transition-colors'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{profile.avatar}</span>
              <div>
                <p className="font-medium">{profile.name}</p>
                <p className="text-xs text-white/50">
                  {profile.isChild ? `${profile.maxRating} rating` : 'Main profile'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {profile.isChild && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditProfile(profile)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteProfile(profile)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
              {!profile.isChild && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSetMainPin}
                  className="gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {profile.pin ? 'Change PIN' : 'Set PIN'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button onClick={handleCreateNew} className="w-full gap-2">
        <Plus className="w-4 h-4" />
        Add Child Profile
      </Button>
    </div>
  );

  const renderForm = () => (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => { setView('list'); resetForm(); }}
        className="gap-2 -ml-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </Button>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Child's name"
              maxLength={20}
            />
          </div>

          <div className="space-y-2">
            <Label>Avatar</Label>
            <div className="grid grid-cols-10 gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={cn(
                    'text-2xl p-2 rounded-lg transition-all',
                    avatar === av ? 'bg-primary/30 ring-2 ring-primary' : 'hover:bg-white/10'
                  )}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Content Rating</Label>
            <Select value={maxRating} onValueChange={(v) => setMaxRating(v as ContentRating)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="G">G - Kids, Family, Nature, Faith only</SelectItem>
                <SelectItem value="PG">PG - + Science, History, Cooking, DIY, Art</SelectItem>
                <SelectItem value="PG-13">PG-13 - + Tech, Maker, Auto, Fitness, Music</SelectItem>
                <SelectItem value="R">R - All channels</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="limits" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Daily Time Limit</Label>
              <p className="text-sm text-white/50">Limit daily watching time</p>
            </div>
            <Switch checked={dailyLimitEnabled} onCheckedChange={setDailyLimitEnabled} />
          </div>

          {dailyLimitEnabled && (
            <div className="space-y-2">
              <Label>Minutes per day</Label>
              <Select
                value={dailyLimitMinutes.toString()}
                onValueChange={(v) => setDailyLimitMinutes(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="180">3 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div>
              <Label>Bedtime Lockout</Label>
              <p className="text-sm text-white/50">Block viewing after bedtime</p>
            </div>
            <Switch checked={bedtimeEnabled} onCheckedChange={setBedtimeEnabled} />
          </div>

          {bedtimeEnabled && (
            <div className="space-y-2">
              <Label>Bedtime</Label>
              <Input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="channels" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Custom Channel Selection</Label>
              <p className="text-sm text-white/50">Override rating-based selection</p>
            </div>
            <Switch checked={useCustomChannels} onCheckedChange={setUseCustomChannels} />
          </div>

          {useCustomChannels ? (
            <ScrollArea className="h-[200px] border border-white/10 rounded-lg p-2">
              <div className="space-y-1">
                {channels.filter(c => !c.premium).map(channel => (
                  <label
                    key={channel.id}
                    className={cn(
                      'flex items-center gap-3 p-2 rounded-lg cursor-pointer',
                      'hover:bg-white/5 transition-colors',
                      allowedChannels.includes(channel.id) && 'bg-primary/20'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={allowedChannels.includes(channel.id)}
                      onChange={() => toggleChannel(channel.id)}
                      className="sr-only"
                    />
                    <span className="text-lg">{channel.icon}</span>
                    <span className="flex-1">{channel.name}</span>
                    {allowedChannels.includes(channel.id) && (
                      <span className="text-primary">✓</span>
                    )}
                  </label>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-sm text-white/70 mb-2">
                Channels allowed with <strong>{maxRating}</strong> rating:
              </p>
              <div className="flex flex-wrap gap-2">
                {channels
                  .filter(c => !c.premium && getChannelsForRating(maxRating).includes(c.id))
                  .map(channel => (
                    <span
                      key={channel.id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 rounded text-sm"
                    >
                      {channel.icon} {channel.name}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <DialogFooter>
        <Button variant="ghost" onClick={() => { setView('list'); resetForm(); }}>
          Cancel
        </Button>
        <Button onClick={() => setView('pin')}>
          {editingProfile ? 'Update Profile' : 'Create Profile'}
        </Button>
      </DialogFooter>
    </div>
  );

  const renderPinSetup = () => (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setView(editingProfile?.isChild === false ? 'list' : 'edit')}
        className="gap-2 -ml-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">
          {editingProfile?.isChild === false ? 'Set Main Profile PIN' : `Set PIN for ${name}`}
        </h3>
        <p className="text-sm text-white/60">
          This PIN is required to exit the child profile
        </p>
      </div>

      <PinEntry
        onSubmit={editingProfile?.isChild === false ? handleMainPinComplete : handlePinComplete}
        onCancel={() => setView(editingProfile?.isChild === false ? 'list' : 'edit')}
        isCreating
      />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-white/10 max-w-lg max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {view === 'list' && 'Parental Controls'}
            {view === 'create' && 'Create Child Profile'}
            {view === 'edit' && `Edit ${editingProfile?.name}'s Profile`}
            {view === 'pin' && 'Set PIN'}
          </DialogTitle>
        </DialogHeader>

        {view === 'list' && renderList()}
        {(view === 'create' || view === 'edit') && renderForm()}
        {view === 'pin' && renderPinSetup()}
      </DialogContent>
    </Dialog>
  );
}
