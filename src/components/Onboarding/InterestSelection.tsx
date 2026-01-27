import { Button } from '@/components/ui/button';
import { useOnboarding, AVAILABLE_INTERESTS } from '@/contexts/OnboardingContext';
import { cn } from '@/lib/utils';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';

export function InterestSelection() {
  const { state, toggleInterest, setStep } = useOnboarding();
  const { selectedInterests } = state;

  const canContinue = selectedInterests.length >= 3;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="text-center mb-4 shrink-0">
        <h2 className="text-2xl font-bold mb-2">What are you into?</h2>
        <p className="text-muted-foreground">
          Select at least 3 to personalize your lineup.
        </p>
      </div>

      {/* Interest Grid - scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto px-1 -mx-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-2">
          {AVAILABLE_INTERESTS.map((interest) => {
            const isSelected = selectedInterests.includes(interest.id);
            return (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={cn(
                  'relative flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all duration-200',
                  'hover:border-primary/50 hover:bg-primary/5',
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card'
                )}
              >
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                )}
                <span className="text-xl mb-0.5">{interest.icon}</span>
                <span className="text-xs font-medium">{interest.label}</span>
                {interest.examples && (
                  <span className="text-[9px] text-muted-foreground mt-0.5 text-center leading-tight">
                    {interest.examples}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer - fixed at bottom */}
      <div className="pt-4 mt-auto flex items-center justify-between shrink-0 border-t border-border">
        <Button
          variant="ghost"
          onClick={() => setStep('welcome')}
          className="gap-2"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="text-sm text-muted-foreground">
          {selectedInterests.length}/3 minimum
        </div>

        <Button
          onClick={() => setStep('localnews')}
          disabled={!canContinue}
          className="gap-2"
          size="sm"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
