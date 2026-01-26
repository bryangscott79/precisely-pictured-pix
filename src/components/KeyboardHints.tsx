import { useEffect, useState } from 'react';
import { Tv, LayoutGrid, ArrowUpDown, Info } from 'lucide-react';

interface KeyboardHintsProps {
  visible: boolean;
  onDismiss: () => void;
}

export function KeyboardHints({ visible, onDismiss }: KeyboardHintsProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if we've shown hints before
    const hasSeenHints = localStorage.getItem('epishow-hints-seen');
    if (!hasSeenHints) {
      setShow(true);
      localStorage.setItem('epishow-hints-seen', 'true');
      
      // Auto-hide after 8 seconds
      const timeout = setTimeout(() => {
        setShow(false);
        onDismiss();
      }, 8000);
      
      return () => clearTimeout(timeout);
    }
  }, [onDismiss]);

  if (!show || !visible) return null;

  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-40 fade-in">
      <div className="flex items-center gap-6 px-6 py-4 rounded-2xl bg-background/90 backdrop-blur-xl border border-border shadow-2xl">
        <div className="flex items-center gap-2">
          <kbd className="kbd">G</kbd>
          <span className="text-sm text-muted-foreground">Guide</span>
        </div>
        <div className="w-px h-6 bg-border" />
        <div className="flex items-center gap-2">
          <kbd className="kbd">↑</kbd>
          <kbd className="kbd">↓</kbd>
          <span className="text-sm text-muted-foreground">Channels</span>
        </div>
        <div className="w-px h-6 bg-border" />
        <div className="flex items-center gap-2">
          <kbd className="kbd">I</kbd>
          <span className="text-sm text-muted-foreground">Info</span>
        </div>
      </div>
    </div>
  );
}
