import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { User } from 'lucide-react';
import { useState, useEffect } from 'react';
import epishowLogo from '@/assets/epishow-logo.png';

export function WelcomeScreen() {
  const { signInWithGoogle, isLoading, user } = useAuth();
  const { continueAsGuest, setStep } = useOnboarding();
  const [animationPhase, setAnimationPhase] = useState<'power-on' | 'glow' | 'reveal' | 'complete'>('power-on');

  const handleGoogleSignIn = async () => {
    await signInWithGoogle(true);
  };

  // Sonic brand + animation sequence
  useEffect(() => {
    // If user is already signed in, skip to interests
    if (user) {
      setStep('interests');
      return;
    }
    
    // Play TV power-on sound
    const playStartupSound = () => {
      // Create audio context for sonic branding
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // TV power-on "thunk" sound
      const thunk = audioContext.createOscillator();
      const thunkGain = audioContext.createGain();
      thunk.connect(thunkGain);
      thunkGain.connect(audioContext.destination);
      thunk.frequency.setValueAtTime(80, audioContext.currentTime);
      thunk.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.1);
      thunkGain.gain.setValueAtTime(0.3, audioContext.currentTime);
      thunkGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      thunk.start(audioContext.currentTime);
      thunk.stop(audioContext.currentTime + 0.15);

      // Warm-up hum
      setTimeout(() => {
        const hum = audioContext.createOscillator();
        const humGain = audioContext.createGain();
        hum.connect(humGain);
        humGain.connect(audioContext.destination);
        hum.frequency.setValueAtTime(60, audioContext.currentTime);
        humGain.gain.setValueAtTime(0.05, audioContext.currentTime);
        humGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        hum.start(audioContext.currentTime);
        hum.stop(audioContext.currentTime + 0.8);
      }, 100);

      // Bright "ping" chime when logo fully reveals
      setTimeout(() => {
        const ping = audioContext.createOscillator();
        const pingGain = audioContext.createGain();
        ping.type = 'sine';
        ping.connect(pingGain);
        pingGain.connect(audioContext.destination);
        ping.frequency.setValueAtTime(880, audioContext.currentTime);
        ping.frequency.exponentialRampToValueAtTime(1320, audioContext.currentTime + 0.1);
        pingGain.gain.setValueAtTime(0.15, audioContext.currentTime);
        pingGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        ping.start(audioContext.currentTime);
        ping.stop(audioContext.currentTime + 0.5);
      }, 800);
    };

    // Animation sequence timing
    const sequence = async () => {
      playStartupSound();
      
      // Phase 1: Power on (dark -> scanlines)
      await new Promise(r => setTimeout(r, 300));
      setAnimationPhase('glow');
      
      // Phase 2: Screen glows
      await new Promise(r => setTimeout(r, 500));
      setAnimationPhase('reveal');
      
      // Phase 3: Logo reveals
      await new Promise(r => setTimeout(r, 600));
      setAnimationPhase('complete');
    };

    sequence();
  }, [user, setStep]);

  // If user already signed in, don't render the welcome screen
  if (user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-6 overflow-hidden">
      {/* Animated Logo Container */}
      <div className="relative mb-8">
        {/* Scanline overlay during power-on */}
        <div 
          className={`absolute inset-0 pointer-events-none z-10 transition-opacity duration-500 ${
            animationPhase === 'complete' ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            background: 'repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,0.3) 1px, transparent 2px)',
            backgroundSize: '100% 4px',
          }}
        />
        
        {/* Glow effect behind logo */}
        <div 
          className={`absolute inset-0 rounded-2xl transition-all duration-700 ${
            animationPhase === 'power-on' 
              ? 'opacity-0 scale-90' 
              : animationPhase === 'glow' 
                ? 'opacity-50 scale-100 blur-xl' 
                : 'opacity-30 scale-110 blur-2xl'
          }`}
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
          }}
        />
        
        {/* Main logo image */}
        <div 
          className={`relative transition-all duration-700 ease-out ${
            animationPhase === 'power-on' 
              ? 'opacity-0 scale-75 brightness-0' 
              : animationPhase === 'glow' 
                ? 'opacity-60 scale-95 brightness-50 saturate-0' 
                : animationPhase === 'reveal' 
                  ? 'opacity-90 scale-100 brightness-110 saturate-100' 
                  : 'opacity-100 scale-100 brightness-100 saturate-100'
          }`}
        >
          <img 
            src={epishowLogo} 
            alt="Epishow.TV" 
            className="w-64 h-40 object-contain drop-shadow-2xl"
          />
        </div>
        
        {/* CRT flicker effect on power-on */}
        {animationPhase === 'glow' && (
          <div 
            className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"
            style={{ animationDuration: '0.1s' }}
          />
        )}
      </div>

      {/* Headline - fades in after logo */}
      <div className={`transition-all duration-500 delay-300 ${
        animationPhase === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Welcome to <span className="text-primary">Epishow</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          TV for the streaming generation.<br />
          Lean back. We'll handle the remote.
        </p>
      </div>

      {/* CTA Buttons - fade in last */}
      <div className={`flex flex-col gap-4 w-full max-w-xs transition-all duration-500 delay-500 ${
        animationPhase === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
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

      {/* Feature comparison - fades in last */}
      <div className={`mt-8 grid grid-cols-2 gap-4 text-sm text-muted-foreground max-w-sm transition-all duration-500 delay-700 ${
        animationPhase === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
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
