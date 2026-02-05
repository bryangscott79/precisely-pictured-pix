import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAlgorithmTuning } from '@/hooks/useAlgorithmTuning';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface VoteButtonsProps {
  videoId: string; // YouTube video ID
  youtubeId: string;
  visible: boolean;
  onAuthRequired: () => void;
  channelId?: string; // EpiShow channel ID for algorithm tuning
  videoTitle?: string; // Video title for keyword extraction
}

export function VoteButtons({ videoId, youtubeId, visible, onAuthRequired, channelId, videoTitle }: VoteButtonsProps) {
  const { user } = useAuth();
  const { recordPreference } = useAlgorithmTuning();
  const [userVote, setUserVote] = useState<1 | -1 | null>(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [dbVideoId, setDbVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch or create video record and get vote counts
  useEffect(() => {
    const fetchVideoData = async () => {
      // First, try to find existing video
      const { data: existingVideo, error: fetchError } = await supabase
        .from('videos')
        .select('id')
        .eq('youtube_id', youtubeId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching video:', fetchError);
        return;
      }

      if (existingVideo) {
        setDbVideoId(existingVideo.id);
        fetchVotes(existingVideo.id);
      }
    };

    fetchVideoData();
  }, [youtubeId]);

  // Fetch user's vote when user changes
  useEffect(() => {
    if (user && dbVideoId) {
      fetchUserVote(dbVideoId);
    } else {
      setUserVote(null);
    }
  }, [user, dbVideoId]);

  const fetchVotes = async (id: string) => {
    const { data, error } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('video_id', id);

    if (!error && data) {
      const ups = data.filter((v) => v.vote_type === 1).length;
      const downs = data.filter((v) => v.vote_type === -1).length;
      setUpvotes(ups);
      setDownvotes(downs);
    }
  };

  const fetchUserVote = async (id: string) => {
    const { data, error } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('video_id', id)
      .eq('user_id', user!.id)
      .maybeSingle();

    if (!error && data) {
      setUserVote(data.vote_type as 1 | -1);
    }
  };

  const ensureVideoExists = async (): Promise<string | null> => {
    if (dbVideoId) return dbVideoId;

    // Create the video record
    const { data: newVideo, error } = await supabase
      .from('videos')
      .insert({
        youtube_id: youtubeId,
        title: videoId, // We'll use the ID as title for now
        channel_id: 'unknown',
        duration: 0,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating video:', error);
      return null;
    }

    setDbVideoId(newVideo.id);
    return newVideo.id;
  };

  const handleVote = async (voteType: 1 | -1) => {
    if (!user) {
      onAuthRequired();
      return;
    }

    setIsLoading(true);

    try {
      const vid = await ensureVideoExists();
      if (!vid) {
        toast.error('Failed to record vote');
        return;
      }

      if (userVote === voteType) {
        // Remove vote
        const { error } = await supabase
          .from('votes')
          .delete()
          .eq('video_id', vid)
          .eq('user_id', user.id);

        if (error) throw error;

        setUserVote(null);
        if (voteType === 1) setUpvotes((p) => p - 1);
        else setDownvotes((p) => p - 1);
      } else {
        // Upsert vote
        const { error } = await supabase
          .from('votes')
          .upsert(
            { video_id: vid, user_id: user.id, vote_type: voteType },
            { onConflict: 'user_id,video_id' }
          );

        if (error) throw error;

        // Update counts
        if (userVote === 1) setUpvotes((p) => p - 1);
        else if (userVote === -1) setDownvotes((p) => p - 1);

        if (voteType === 1) setUpvotes((p) => p + 1);
        else setDownvotes((p) => p + 1);

        setUserVote(voteType);

        // Record preference for algorithm tuning
        // This works for both anonymous and signed-in users
        recordPreference(
          youtubeId,
          voteType === 1 ? 'up' : 'down',
          { channelId, title: videoTitle }
        );
      }
    } catch (error) {
      console.error('Vote error:', error);
      toast.error('Failed to save vote');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      <button
        onClick={() => handleVote(1)}
        disabled={isLoading}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel transition-colors',
          userVote === 1
            ? 'bg-green-500/30 text-green-400 border-green-500/50'
            : 'hover:bg-white/10'
        )}
      >
        <ThumbsUp className="w-4 h-4" />
        <span className="text-sm font-medium">{upvotes}</span>
      </button>

      <button
        onClick={() => handleVote(-1)}
        disabled={isLoading}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel transition-colors',
          userVote === -1
            ? 'bg-red-500/30 text-red-400 border-red-500/50'
            : 'hover:bg-white/10'
        )}
      >
        <ThumbsDown className="w-4 h-4" />
        <span className="text-sm font-medium">{downvotes}</span>
      </button>
    </div>
  );
}
