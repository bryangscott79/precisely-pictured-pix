import { Button } from '@/components/ui/button';
import { useOnboarding, AVAILABLE_INTERESTS } from '@/contexts/OnboardingContext';
import { cn } from '@/lib/utils';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';

export function InterestSelection() {
  const { state, toggleInterest, setStep } = useOnboarding();
  const { selectedInterests } = state;

  const canContinue = selectedInterests.length >= 3;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">What are you into?</h2>
        <p className="text-muted-foreground">
          Select at least 3 to personalize your lineup.
        </p>
      </div>

      {/* Interest Grid */}
      <div className="flex-1 overflow-y-auto px-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {AVAILABLE_INTERESTS.map((interest) => {
            const isSelected = selectedInterests.includes(interest.id);
            return (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={cn(
                  'relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200',
                  'hover:border-primary/50 hover:bg-primary/5',
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card'
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                )}
                <span className="text-2xl mb-1">{interest.icon}</span>
                <span className="text-sm font-medium">{interest.label}</span>
                {interest.examples && (
                  <span className="text-[10px] text-muted-foreground mt-0.5 text-center leading-tight">
                    {interest.examples}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep('welcome')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="text-sm text-muted-foreground">
          {selectedInterests.length}/3 minimum
        </div>

        <Button
          onClick={() => setStep('youtube')}
          disabled={!canContinue}
          className="gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
