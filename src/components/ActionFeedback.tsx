import { useEffect, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Captions, CaptionsOff } from 'lucide-react';

interface ActionFeedbackProps {
  action: 'mute' | 'unmute' | 'play' | 'pause' | 'captions-on' | 'captions-off' | null;
  onComplete: () => void;
}

export function ActionFeedback({ action, onComplete }: ActionFeedbackProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!action) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 800);

    return () => clearTimeout(timer);
  }, [action, onComplete]);

  if (!action || !visible) return null;

  const getIcon = () => {
    switch (action) {
      case 'mute':
        return <VolumeX className="w-16 h-16" />;
      case 'unmute':
        return <Volume2 className="w-16 h-16" />;
      case 'play':
        return <Play className="w-16 h-16" />;
      case 'pause':
        return <Pause className="w-16 h-16" />;
      case 'captions-on':
        return <Captions className="w-16 h-16" />;
      case 'captions-off':
        return <CaptionsOff className="w-16 h-16" />;
      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (action) {
      case 'mute':
        return 'Muted';
      case 'unmute':
        return 'Unmuted';
      case 'play':
        return 'Playing';
      case 'pause':
        return 'Paused';
      case 'captions-on':
        return 'Captions On';
      case 'captions-off':
        return 'Captions Off';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div 
        className="flex flex-col items-center gap-3 px-8 py-6 rounded-2xl bg-background/80 backdrop-blur-xl border border-border shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="text-foreground">
          {getIcon()}
        </div>
        <span className="text-lg font-medium text-foreground">
          {getLabel()}
        </span>
      </div>
    </div>
  );
}
