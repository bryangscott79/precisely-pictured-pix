import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Tv, User, Sparkles } from 'lucide-react';

export function WelcomeScreen() {
  const { signInWithGoogle, isLoading } = useAuth();
  const { continueAsGuest, setStep } = useOnboarding();
  const { user } = useAuth();

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  // If user is already signed in, skip to interests
  if (user) {
    setStep('interests');
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
      {/* Logo/Icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
          <Tv className="w-12 h-12 text-primary" />
        </div>
        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500" />
      </div>

      {/* Headline */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        Welcome to <span className="text-primary">Epishow</span>
      </h1>

      {/* Tagline */}
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        TV for the streaming generation.<br />
        Lean back. We'll handle the remote.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button
          size="lg"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={continueAsGuest}
          className="w-full gap-2"
        >
          <User className="w-4 h-4" />
          Continue as Guest
        </Button>
      </div>

      {/* Feature comparison */}
      <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-muted-foreground max-w-sm">
        <div className="text-left space-y-1">
          <p className="font-medium text-foreground">Guest</p>
          <p>• Curated channels</p>
          <p>• Same for everyone</p>
        </div>
        <div className="text-left space-y-1">
          <p className="font-medium text-foreground">Signed in</p>
          <p>• Personalized lineup</p>
          <p>• Custom channels</p>
          <p>• Cross-device sync</p>
        </div>
      </div>
    </div>
  );
}
