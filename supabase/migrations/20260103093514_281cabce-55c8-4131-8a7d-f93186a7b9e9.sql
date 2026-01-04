-- Create leaderboard table for tracking player scores
CREATE TABLE public.leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  player_id TEXT NOT NULL UNIQUE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  levels_completed INTEGER NOT NULL DEFAULT 0,
  highest_score INTEGER NOT NULL DEFAULT 0,
  avatar_gender TEXT DEFAULT 'neutral',
  avatar_style INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the leaderboard (public)
CREATE POLICY "Anyone can view leaderboard"
ON public.leaderboard
FOR SELECT
USING (true);

-- Allow anyone to insert their score (for anonymous players)
CREATE POLICY "Anyone can insert their score"
ON public.leaderboard
FOR INSERT
WITH CHECK (true);

-- Allow players to update their own entry
CREATE POLICY "Players can update their own entry"
ON public.leaderboard
FOR UPDATE
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_leaderboard_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_leaderboard_updated_at
BEFORE UPDATE ON public.leaderboard
FOR EACH ROW
EXECUTE FUNCTION public.update_leaderboard_updated_at();

-- Create index for faster sorting
CREATE INDEX idx_leaderboard_total_xp ON public.leaderboard(total_xp DESC);
CREATE INDEX idx_leaderboard_levels_completed ON public.leaderboard(levels_completed DESC);