-- Create user onboarding table
CREATE TABLE public.user_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  completed_at TIMESTAMP WITH TIME ZONE,
  selected_interests TEXT[] DEFAULT '{}',
  youtube_connected BOOLEAN DEFAULT false,
  preferences JSONB DEFAULT '{"autoplay": true, "defaultQuality": "1080p", "showCaptions": false, "language": "en"}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user channel lineup table
CREATE TABLE public.user_channel_lineup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  channel_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  is_custom BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, channel_id)
);

-- Create imported YouTube subscriptions table
CREATE TABLE public.imported_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  youtube_channel_id TEXT NOT NULL,
  channel_name TEXT NOT NULL,
  subscriber_count INTEGER,
  matched_epishow_channel TEXT,
  is_selected BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, youtube_channel_id)
);

-- Enable RLS
ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_channel_lineup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imported_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_onboarding
CREATE POLICY "Users can view their own onboarding" ON public.user_onboarding
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding" ON public.user_onboarding
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding" ON public.user_onboarding
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for user_channel_lineup
CREATE POLICY "Users can view their own lineup" ON public.user_channel_lineup
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lineup" ON public.user_channel_lineup
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lineup" ON public.user_channel_lineup
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lineup" ON public.user_channel_lineup
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for imported_subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.imported_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON public.imported_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON public.imported_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions" ON public.imported_subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_user_onboarding_updated_at
  BEFORE UPDATE ON public.user_onboarding
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_channel_lineup_updated_at
  BEFORE UPDATE ON public.user_channel_lineup
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();