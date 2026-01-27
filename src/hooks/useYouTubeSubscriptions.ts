import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface YouTubeSubscription {
  channelId: string;
  channelName: string;
}

export interface ImportedSubscription {
  id: string;
  youtube_channel_id: string;
  channel_name: string;
  is_selected: boolean;
  matched_epishow_channel: string | null;
}

export function useYouTubeSubscriptions() {
  const { user, session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<ImportedSubscription[]>([]);
  const [requiresReauth, setRequiresReauth] = useState(false);

  const fetchSubscriptions = useCallback(async () => {
    if (!user || !session) {
      toast.error('Please sign in to import YouTube subscriptions');
      return [];
    }

    setIsLoading(true);
    setRequiresReauth(false);

    try {
      const { data, error } = await supabase.functions.invoke('fetch-youtube-subscriptions', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error fetching subscriptions:', error);
        toast.error('Failed to fetch YouTube subscriptions');
        return [];
      }

      if (data.requiresReauth) {
        setRequiresReauth(true);
        toast.error('Please sign in again to grant YouTube access');
        return [];
      }

      if (data.error) {
        toast.error(data.error);
        return [];
      }

      toast.success(`Found ${data.count} YouTube subscriptions!`);
      
      // Fetch the stored subscriptions
      await loadStoredSubscriptions();
      
      return data.subscriptions as YouTubeSubscription[];
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to import subscriptions');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user, session]);

  const loadStoredSubscriptions = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('imported_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('channel_name');

      if (error) {
        console.error('Error loading subscriptions:', error);
        return;
      }

      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  }, [user]);

  const toggleSubscriptionSelection = useCallback(async (subscriptionId: string, isSelected: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('imported_subscriptions')
        .update({ is_selected: isSelected })
        .eq('id', subscriptionId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating subscription:', error);
        return;
      }

      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === subscriptionId ? { ...sub, is_selected: isSelected } : sub
        )
      );
    } catch (error) {
      console.error('Error:', error);
    }
  }, [user]);

  const signInWithYouTubeAccess = useCallback(async () => {
    // Re-authenticate with YouTube scopes
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        scopes: 'https://www.googleapis.com/auth/youtube.readonly',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Error signing in with YouTube access:', error);
      toast.error('Failed to connect YouTube account');
    }
  }, []);

  return {
    subscriptions,
    isLoading,
    requiresReauth,
    fetchSubscriptions,
    loadStoredSubscriptions,
    toggleSubscriptionSelection,
    signInWithYouTubeAccess,
  };
}
