import { useProfiles } from '@/contexts/ProfileContext';
import { cn } from '@/lib/utils';

interface ProfileIndicatorProps {
  visible: boolean;
  onClick: () => void;
}

export function ProfileIndicator({ visible, onClick }: ProfileIndicatorProps) {
  const { activeProfile, isChildProfile, timeRemaining } = useProfiles();

  if (!activeProfile) return null;

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full',
        'glass-panel hover:bg-white/10 transition-all duration-300',
        'cursor-pointer active:scale-95',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none',
        isChildProfile && 'ring-2 ring-blue-400/50'
      )}
    >
      <span className="text-xl">{activeProfile.avatar}</span>
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium leading-tight">{activeProfile.name}</span>
        {isChildProfile && timeRemaining !== null && (
          <span className="text-xs text-white/50 leading-tight">
            {formatTime(timeRemaining)} left
          </span>
        )}
      </div>
      {isChildProfile && (
        <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-300">
          {activeProfile.maxRating}
        </span>
      )}
    </button>
  );
}
