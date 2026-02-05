-- Add topic and search_query columns to custom_channels
-- These allow users to create topic-based channels that generate YouTube search queries

ALTER TABLE public.custom_channels
ADD COLUMN IF NOT EXISTS topic TEXT,
ADD COLUMN IF NOT EXISTS search_query TEXT;

-- Add a comment for documentation
COMMENT ON COLUMN public.custom_channels.topic IS 'User-provided topic for the channel (e.g., "Art History", "Pokemon")';
COMMENT ON COLUMN public.custom_channels.search_query IS 'Generated YouTube search query based on the topic';
