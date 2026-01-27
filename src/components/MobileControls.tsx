import { ChevronUp, ChevronDown } from 'lucide-react';

interface MobileControlsProps {
  visible: boolean;
  onChannelUp: () => void;
  onChannelDown: () => void;
}

export function MobileControls({ visible, onChannelUp, onChannelDown }: MobileControlsProps) {
  return (
    <div
      className={`fixed right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 md:hidden transition-all duration-300 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
      }`}
    >
      <button
        onClick={onChannelUp}
        className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-md border border-border/50 flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Previous channel"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
      <button
        onClick={onChannelDown}
        className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-md border border-border/50 flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Next channel"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </div>
  );
}
