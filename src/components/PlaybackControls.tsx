import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface PlaybackControlsProps {
  visible: boolean;
  isMuted: boolean;
  isPlaying: boolean;
  onToggleMute: () => void;
  onTogglePlayPause: () => void;
}

export function PlaybackControls({
  visible,
  isMuted,
  isPlaying,
  onToggleMute,
  onTogglePlayPause,
}: PlaybackControlsProps) {
  return (
    <div
      className={`fixed bottom-32 right-6 md:right-10 flex items-center gap-2 transition-all duration-500 z-30 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <button
        onClick={onTogglePlayPause}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 hover:bg-background/90 transition-colors"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
        <span className="text-xs font-medium text-muted-foreground">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">K</kbd>
        </span>
      </button>
      
      <button
        onClick={onToggleMute}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 hover:bg-background/90 transition-colors"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
        <span className="text-xs font-medium text-muted-foreground">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">M</kbd>
        </span>
      </button>
    </div>
  );
}
