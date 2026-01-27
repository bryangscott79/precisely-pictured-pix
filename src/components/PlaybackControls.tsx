import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface PlaybackControlsProps {
  visible: boolean;
  isMuted: boolean;
  isPlaying: boolean;
  volume: number;
  onToggleMute: () => void;
  onTogglePlayPause: () => void;
  onVolumeChange: (volume: number) => void;
}

export function PlaybackControls({
  visible,
  isMuted,
  isPlaying,
  volume,
  onToggleMute,
  onTogglePlayPause,
  onVolumeChange,
}: PlaybackControlsProps) {
  return (
    <div
      className={`fixed bottom-24 md:bottom-32 right-4 md:right-10 flex items-center gap-2 transition-all duration-500 z-30 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <button
        onClick={onTogglePlayPause}
        className="flex items-center gap-2 px-2.5 md:px-3 py-2 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 hover:bg-background/90 active:scale-95 transition-all"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
        <span className="text-xs font-medium text-muted-foreground hidden md:inline">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">K</kbd>
        </span>
      </button>
      
      <button
        onClick={onToggleMute}
        className="flex items-center gap-2 px-2.5 md:px-3 py-2 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 hover:bg-background/90 active:scale-95 transition-all"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
        <span className="text-xs font-medium text-muted-foreground hidden md:inline">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">M</kbd>
        </span>
      </button>

      {/* Volume */}
      <div className="hidden sm:flex items-center gap-2 px-2.5 md:px-3 py-2 rounded-lg bg-background/80 backdrop-blur-md border border-border/50">
        <span className="text-xs font-medium text-muted-foreground tabular-nums w-7 text-right">
          {Math.round(volume)}
        </span>
        <div className="w-20 md:w-28">
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={(v) => onVolumeChange(v[0] ?? 0)}
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
