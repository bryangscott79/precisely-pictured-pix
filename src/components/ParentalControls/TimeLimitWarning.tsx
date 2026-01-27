import { useEffect, useState } from 'react';
import { useProfiles } from '@/contexts/ProfileContext';
import { cn } from '@/lib/utils';
import { Clock, Moon } from 'lucide-react';

export function TimeLimitWarning() {
  const { timeRemaining, isBedtimeLocked, activeProfile, isChildProfile } = useProfiles();
  const [showWarning, setShowWarning] = useState(false);
  const [warningLevel, setWarningLevel] = useState<'5min' | '1min' | 'expired'>('5min');

  useEffect(() => {
    if (!isChildProfile || timeRemaining === null) {
      setShowWarning(false);
      return;
    }

    if (timeRemaining <= 0) {
      setShowWarning(true);
      setWarningLevel('expired');
    } else if (timeRemaining <= 60) {
      setShowWarning(true);
      setWarningLevel('1min');
    } else if (timeRemaining <= 300) {
      setShowWarning(true);
      setWarningLevel('5min');
    } else {
      setShowWarning(false);
    }
  }, [timeRemaining, isChildProfile]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${secs}s`;
  };

  // Bedtime lockout overlay
  if (isBedtimeLocked && isChildProfile) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-lg">
        <div className="text-center space-y-6 p-8 max-w-md">
          <Moon className="w-24 h-24 mx-auto text-indigo-400 animate-pulse" />
          <h1 className="text-4xl font-bold">Time for Bed! 🌙</h1>
          <p className="text-xl text-white/70">
            It's past {activeProfile?.bedtime}. Screen time is over for tonight.
          </p>
          <p className="text-white/50">
            Come back tomorrow for more fun!
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-white/40">
            <span>{activeProfile?.avatar}</span>
            <span>{activeProfile?.name}'s bedtime</span>
          </div>
        </div>
      </div>
    );
  }

  // Time limit expired overlay
  if (showWarning && warningLevel === 'expired') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-lg">
        <div className="text-center space-y-6 p-8 max-w-md">
          <Clock className="w-24 h-24 mx-auto text-red-400" />
          <h1 className="text-4xl font-bold">Time's Up! ⏰</h1>
          <p className="text-xl text-white/70">
            You've used all your screen time for today.
          </p>
          <p className="text-white/50">
            Come back tomorrow for more fun!
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-white/40">
            <span>{activeProfile?.avatar}</span>
            <span>{activeProfile?.name} - Daily limit: {activeProfile?.dailyLimitMinutes} min</span>
          </div>
        </div>
      </div>
    );
  }

  // Warning banners
  if (!showWarning) return null;

  return (
    <div
      className={cn(
        'fixed top-4 left-1/2 -translate-x-1/2 z-50',
        'flex items-center gap-3 px-4 py-2 rounded-full',
        'backdrop-blur-lg shadow-lg animate-in fade-in slide-in-from-top-4',
        warningLevel === '1min' 
          ? 'bg-red-500/90 text-white' 
          : 'bg-amber-500/90 text-black'
      )}
    >
      <Clock className="w-5 h-5" />
      <span className="font-medium">
        {warningLevel === '1min' 
          ? `Only ${formatTime(timeRemaining || 0)} left!`
          : `${formatTime(timeRemaining || 0)} remaining`
        }
      </span>
    </div>
  );
}
