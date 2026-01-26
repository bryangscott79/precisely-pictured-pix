-- Create profiles table for user data (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create videos table for content library
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_id TEXT NOT NULL,
  title TEXT NOT NULL,
  duration INTEGER NOT NULL DEFAULT 0,
  channel_id TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on videos (public read)
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Videos are publicly viewable"
  ON public.videos FOR SELECT
  USING (true);

-- Create votes table for upvote/downvote
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  vote_type SMALLINT NOT NULL CHECK (vote_type IN (-1, 1)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Enable RLS on votes
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Votes policies
CREATE POLICY "Votes are publicly viewable for ranking"
  ON public.votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON public.votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
  ON public.votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON public.votes FOR DELETE
  USING (auth.uid() = user_id);

-- Create watch_history table
CREATE TABLE public.watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  channel_id TEXT NOT NULL,
  watch_duration INTEGER NOT NULL DEFAULT 0,
  watched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Enable RLS on watch_history
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

-- Watch history policies (private to user)
CREATE POLICY "Users can view their own watch history"
  ON public.watch_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own watch history"
  ON public.watch_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watch history"
  ON public.watch_history FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watch history"
  ON public.watch_history FOR DELETE
  USING (auth.uid() = user_id);

-- Create video_rankings view for hybrid scoring
CREATE VIEW public.video_rankings WITH (security_invoker=on) AS
SELECT 
  v.id,
  v.youtube_id,
  v.title,
  v.channel_id,
  v.duration,
  v.thumbnail_url,
  COALESCE(SUM(CASE WHEN vt.vote_type = 1 THEN 1 ELSE 0 END), 0) AS upvotes,
  COALESCE(SUM(CASE WHEN vt.vote_type = -1 THEN 1 ELSE 0 END), 0) AS downvotes,
  COALESCE(SUM(vt.vote_type), 0) AS net_score
FROM public.videos v
LEFT JOIN public.votes vt ON v.id = vt.video_id
GROUP BY v.id;

-- Function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_votes_video_id ON public.votes(video_id);
CREATE INDEX idx_votes_user_id ON public.votes(user_id);
CREATE INDEX idx_watch_history_user_id ON public.watch_history(user_id);
CREATE INDEX idx_watch_history_channel_id ON public.watch_history(channel_id);
CREATE INDEX idx_videos_channel_id ON public.videos(channel_id);