import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export type UserTier = 'free' | 'connected' | 'premium';

interface UserTierContextType {
  tier: UserTier;
  isLoading: boolean;
  isPremium: boolean;
  isConnected: boolean;
  customChannelLimit: number;
  subscriptionEnd: string | null;
  checkSubscription: () => Promise<void>;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
  isUpgradeModalOpen: boolean;
}

const UserTierContext = createContext<UserTierContextType | undefined>(undefined);

// Stripe product/price IDs
export const PREMIUM_CONFIG = {
  product_id: 'prod_TrxSJiSDJi1YT4',
  price_id: 'price_1SuDXEAn8oRG1jaDRsYKwcGz',
  price: 9.99,
};

export function UserTierProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [tier, setTier] = useState<UserTier>('free');
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setTier('free');
      setSubscriptionEnd(null);
      setIsLoading(false);
      return;
    }

    // User is signed in = at least 'connected'
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        setTier('connected');
        setIsLoading(false);
        return;
      }

      if (data?.subscribed && data?.product_id === PREMIUM_CONFIG.product_id) {
        setTier('premium');
        setSubscriptionEnd(data.subscription_end || null);
      } else {
        setTier('connected');
        setSubscriptionEnd(null);
      }
    } catch (err) {
      console.error('Subscription check failed:', err);
      setTier('connected');
    }
    
    setIsLoading(false);
  }, [user]);

  // Check subscription on mount and when user changes
  useEffect(() => {
    if (!authLoading) {
      checkSubscription();
    }
  }, [user, authLoading, checkSubscription]);

  // Periodic refresh every 60 seconds
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  const isPremium = tier === 'premium';
  const isConnected = tier === 'connected' || tier === 'premium';
  const customChannelLimit = isPremium ? Infinity : isConnected ? 3 : 0;

  const openUpgradeModal = () => setIsUpgradeModalOpen(true);
  const closeUpgradeModal = () => setIsUpgradeModalOpen(false);

  return (
    <UserTierContext.Provider
      value={{
        tier,
        isLoading,
        isPremium,
        isConnected,
        customChannelLimit,
        subscriptionEnd,
        checkSubscription,
        openUpgradeModal,
        closeUpgradeModal,
        isUpgradeModalOpen,
      }}
    >
      {children}
    </UserTierContext.Provider>
  );
}

export function useUserTier() {
  const context = useContext(UserTierContext);
  if (context === undefined) {
    throw new Error('useUserTier must be used within a UserTierProvider');
  }
  return context;
}
