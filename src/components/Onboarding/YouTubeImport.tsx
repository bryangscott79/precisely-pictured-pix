import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useYouTubeSubscriptions } from '@/hooks/useYouTubeSubscriptions';
import { useAuth } from '@/hooks/useAuth';
import { Youtube, Loader2, Check, SkipForward, RefreshCw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

export function YouTubeImport() {
  const { setStep } = useOnboarding();
  const { session } = useAuth();
  const {
    subscriptions,
    isLoading,
    requiresReauth,
    fetchSubscriptions,
    loadStoredSubscriptions,
    toggleSubscriptionSelection,
    signInWithYouTubeAccess,
  } = useYouTubeSubscriptions();

  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [showList, setShowList] = useState(false);

  // Check if we have a provider token (YouTube access)
  const hasYouTubeAccess = session?.provider_token !== undefined;

  // Load stored subscriptions on mount
  useEffect(() => {
    loadStoredSubscriptions();
  }, [loadStoredSubscriptions]);

  // Auto-fetch if we have YouTube access but haven't fetched yet
  useEffect(() => {
    if (hasYouTubeAccess && !hasAttemptedFetch && subscriptions.length === 0) {
      handleImport();
    }
  }, [hasYouTubeAccess]);

  const handleImport = async () => {
    setHasAttemptedFetch(true);
    const result = await fetchSubscriptions();
    if (result.length > 0) {
      setShowList(true);
    }
  };

  const handleContinue = () => {
    setStep('lineup');
  };

  const handleSkip = () => {
    setStep('lineup');
  };

  const selectedCount = subscriptions.filter((s) => s.is_selected).length;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <Youtube className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Import YouTube Subscriptions</h2>
        <p className="text-muted-foreground">
          {showList
            ? `Select the channels you'd like to see content from`
            : `Connect your YouTube to personalize your experience`}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {!showList ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            {requiresReauth ? (
              <>
                <p className="text-center text-muted-foreground mb-4">
                  We need permission to view your YouTube subscriptions.
                </p>
                <Button
                  size="lg"
                  onClick={signInWithYouTubeAccess}
                  className="gap-2"
                >
                  <Youtube className="w-5 h-5" />
                  Grant YouTube Access
                </Button>
              </>
            ) : isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Fetching your subscriptions...</p>
              </div>
            ) : hasAttemptedFetch && subscriptions.length === 0 ? (
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  No subscriptions found. You can skip this step.
                </p>
                <Button variant="outline" onClick={handleImport} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
              </div>
            ) : (
              <Button
                size="lg"
                onClick={handleImport}
                disabled={isLoading}
                className="gap-2"
              >
                <Youtube className="w-5 h-5" />
                Import My Subscriptions
              </Button>
            )}
          </div>
        ) : (
          <ScrollArea className="h-full pr-4">
            <div className="space-y-2">
              {subscriptions.map((sub) => (
                <label
                  key={sub.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={sub.is_selected}
                    onCheckedChange={(checked) =>
                      toggleSubscriptionSelection(sub.id, checked as boolean)
                    }
                  />
                  <span className="flex-1 truncate">{sub.channel_name}</span>
                  {sub.matched_epishow_channel && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Matched
                    </span>
                  )}
                </label>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 flex justify-between items-center gap-4 pt-6 mt-4 border-t">
        <Button variant="ghost" onClick={handleSkip} className="gap-2">
          <SkipForward className="w-4 h-4" />
          Skip
        </Button>

        {showList && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {selectedCount} selected
            </span>
            <Button onClick={handleContinue} className="gap-2">
              <Check className="w-4 h-4" />
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
