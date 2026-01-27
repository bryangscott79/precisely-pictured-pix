import { useState } from 'react';
import { Crown, Check, Loader2, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUserTier, PREMIUM_CONFIG } from '@/contexts/UserTierContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function UpgradeModal() {
  const { isUpgradeModalOpen, closeUpgradeModal, tier, checkSubscription } = useUserTier();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      toast.error('Please sign in first');
      closeUpgradeModal();
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success('Checkout opened in new tab');
        closeUpgradeModal();
        
        // Check subscription status after a delay
        setTimeout(() => {
          checkSubscription();
        }, 5000);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
        closeUpgradeModal();
      }
    } catch (error) {
      console.error('Portal error:', error);
      toast.error('Failed to open subscription management');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    'Unlimited custom channels',
    'Premium-only channels (Movies, NFL, 80s Cinema)',
    'Priority content recommendations',
    'Premium badge on profile',
    'Early access to new features',
  ];

  return (
    <Dialog open={isUpgradeModalOpen} onOpenChange={(open) => !open && closeUpgradeModal()}>
      <DialogContent className="sm:max-w-md glass-panel border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-display">
            <Crown className="w-6 h-6 text-amber-400" />
            {tier === 'premium' ? 'Premium Member' : 'Upgrade to Premium'}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {tier === 'premium' ? (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
                <Crown className="w-8 h-8 text-amber-400" />
              </div>
              <p className="text-muted-foreground">
                You're enjoying all premium features!
              </p>
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleManageSubscription}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
                Manage Subscription
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center">
                <div className="text-4xl font-bold font-display">
                  ${PREMIUM_CONFIG.price}
                  <span className="text-lg text-muted-foreground font-normal">/month</span>
                </div>
              </div>

              <ul className="space-y-3">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold"
                onClick={handleUpgrade}
                disabled={isLoading || !user}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Crown className="w-4 h-4" />
                )}
                {!user ? 'Sign in to upgrade' : 'Upgrade Now'}
              </Button>

              {!user && (
                <p className="text-center text-xs text-muted-foreground">
                  You need to sign in before upgrading to Premium
                </p>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
