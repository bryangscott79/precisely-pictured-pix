import { useProfiles } from '@/contexts/ProfileContext';
import { Moon } from 'lucide-react';

export function BedtimeLockout() {
  const { isBedtimeLocked, activeProfile, isChildProfile } = useProfiles();

  if (!isBedtimeLocked || !isChildProfile) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-b from-indigo-950 to-black">
      <div className="text-center space-y-8 p-8 max-w-md animate-in fade-in zoom-in duration-500">
        {/* Animated moon and stars */}
        <div className="relative">
          <Moon className="w-32 h-32 mx-auto text-yellow-300 drop-shadow-[0_0_30px_rgba(253,224,71,0.5)]" />
          {/* Stars */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse" />
            <div className="absolute top-8 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-150" />
            <div className="absolute top-4 right-8 w-1 h-1 bg-white rounded-full animate-pulse delay-300" />
            <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-500" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
            Time for Bed!
          </h1>
          <p className="text-2xl">🌙 Sweet Dreams 🌙</p>
        </div>

        <p className="text-xl text-indigo-200/70">
          It's past your bedtime ({activeProfile?.bedtime}).
        </p>

        <p className="text-indigo-300/50">
          Screen time is over for tonight. Come back tomorrow!
        </p>

        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur">
          <span className="text-2xl">{activeProfile?.avatar}</span>
          <span className="text-white/70">Goodnight, {activeProfile?.name}!</span>
        </div>
      </div>
    </div>
  );
}
