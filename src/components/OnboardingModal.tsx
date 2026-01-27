import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tv, ArrowUp, ArrowDown, Volume2, Play, LayoutGrid } from 'lucide-react';

const ONBOARDING_KEY = 'epishow-onboarding-seen';

interface OnboardingStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const steps: OnboardingStep[] = [
  {
    icon: <Tv className="w-12 h-12 text-primary" />,
    title: 'Welcome to Epishow',
    description: 'Experience YouTube like TV. Channels play continuously - just sit back and enjoy.',
  },
  {
    icon: (
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center gap-1">
          <ArrowUp className="w-6 h-6 text-primary" />
          <ArrowDown className="w-6 h-6 text-primary" />
        </div>
      </div>
    ),
    title: 'Surf Channels',
    description: 'Use the arrow keys ↑ ↓ to flip through channels, just like a real remote.',
  },
  {
    icon: <LayoutGrid className="w-12 h-12 text-primary" />,
    title: 'Open the Guide',
    description: 'Press G or click the Guide button to see all channels and what\'s playing.',
  },
  {
    icon: (
      <div className="flex items-center gap-3">
        <Play className="w-8 h-8 text-primary" />
        <Volume2 className="w-8 h-8 text-primary" />
      </div>
    ),
    title: 'Control Playback',
    description: 'Press Space or K to play/pause. Press M to mute. Simple.',
  },
];

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(ONBOARDING_KEY);
    if (!hasSeenOnboarding) {
      // Slight delay to let the app load first
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsOpen(false);
  };

  const handleSkip = () => {
    handleComplete();
  };

  const step = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleSkip()}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border/50">
        <div className="flex flex-col items-center text-center py-6 px-4">
          {/* Icon */}
          <div className="mb-6 p-4 rounded-2xl bg-primary/10">
            {step.icon}
          </div>

          {/* Content */}
          <h2 className="text-2xl font-bold mb-3">{step.title}</h2>
          <p className="text-muted-foreground mb-8 max-w-sm">
            {step.description}
          </p>

          {/* Progress dots */}
          <div className="flex items-center gap-2 mb-6">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1"
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Start Watching'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
