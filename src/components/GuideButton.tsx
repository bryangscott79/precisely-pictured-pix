import { LayoutGrid } from 'lucide-react';

interface GuideButtonProps {
  onClick: () => void;
  visible: boolean;
}

export function GuideButton({ onClick, visible }: GuideButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed top-6 left-6 z-30 flex items-center gap-2 px-4 py-2.5 rounded-xl
        bg-background/80 backdrop-blur-xl border border-border
        hover:bg-muted transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
      `}
    >
      <LayoutGrid className="w-5 h-5" />
      <span className="font-medium text-sm hidden sm:inline">Guide</span>
      <kbd className="kbd hidden sm:inline">G</kbd>
    </button>
  );
}
