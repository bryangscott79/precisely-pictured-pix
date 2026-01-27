import { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/hooks/useAuth';
import { WelcomeScreen } from './WelcomeScreen';
import { InterestSelection } from './InterestSelection';
import { ChannelLineup } from './ChannelLineup';
import { cn } from '@/lib/utils';

const STEPS = ['welcome', 'interests', 'lineup'] as const;

export function OnboardingFlow() {
  const { state, isOnboardingOpen, closeOnboarding, setStep, isLoading } = useOnboarding();
  const { user, isLoading: authLoading } = useAuth();

  // When user signs in, move to interests step
  useEffect(() => {
    if (user && state.currentStep === 'welcome') {
      setStep('interests');
    }
  }, [user, state.currentStep, setStep]);

  if (isLoading || authLoading) return null;

  const currentStepIndex = STEPS.indexOf(state.currentStep as typeof STEPS[number]);

  return (
    <Dialog open={isOnboardingOpen} onOpenChange={(open) => !open && closeOnboarding()}>
      <DialogContent 
        className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col p-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Progress Dots */}
        {state.currentStep !== 'welcome' && state.currentStep !== 'complete' && (
          <div className="flex justify-center gap-2 pt-6">
            {STEPS.slice(1).map((step, i) => (
              <div
                key={step}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  i < currentStepIndex ? 'bg-primary' : 
                  i === currentStepIndex ? 'bg-primary' : 'bg-muted'
                )}
              />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6">
          {state.currentStep === 'welcome' && <WelcomeScreen />}
          {state.currentStep === 'interests' && <InterestSelection />}
          {state.currentStep === 'lineup' && <ChannelLineup />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
