-- Migration: Add Achievement System
-- Run this in your Supabase SQL editor

-- 1. Create achievement definitions table
CREATE TABLE IF NOT EXISTS public.achievement_definitions (
  id text NOT NULL PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  icon text,
  category text NOT NULL,
  rarity text DEFAULT 'common'::text,
  unlock_condition jsonb NOT NULL,
  display_order integer DEFAULT 0
);

-- 2. Update pet_achievements table to reference achievement_definitions
ALTER TABLE public.pet_achievements 
ADD COLUMN IF NOT EXISTS achievement_id text;

-- Add foreign key constraint
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'pet_achievements_achievement_id_fkey'
  ) THEN
    ALTER TABLE public.pet_achievements 
    ADD CONSTRAINT pet_achievements_achievement_id_fkey 
    FOREIGN KEY (achievement_id) 
    REFERENCES public.achievement_definitions(id);
  END IF;
END $$;

-- 3. Insert achievement definitions
INSERT INTO achievement_definitions (id, name, description, icon, category, rarity, unlock_condition, display_order) VALUES
-- First Time Achievements
('first_pat', 'First Love', 'Pat your pet for the first time', '💕', 'beginner', 'common', '{"type": "interaction", "requirement": "first_pat"}', 1),
('first_feed', 'First Meal', 'Feed your pet for the first time', '🍽️', 'beginner', 'common', '{"type": "interaction", "requirement": "first_feed"}', 2),
('first_play', 'Playtime Buddy', 'Play with your pet for the first time', '🎮', 'beginner', 'common', '{"type": "interaction", "requirement": "first_play"}', 3),
('first_bath', 'Bath Time', 'Give your pet a bath for the first time', '🛁', 'beginner', 'common', '{"type": "interaction", "requirement": "first_bath"}', 4),

-- Interaction Count Achievements
('pat_10', 'Pat Master', 'Pat your pet 10 times', '🐾', 'interaction', 'common', '{"type": "counter", "stat": "total_pats", "value": 10}', 5),
('pat_100', 'Century Petter', 'Pat your pet 100 times', '🎉', 'interaction', 'rare', '{"type": "counter", "stat": "total_pats", "value": 100}', 6),
('feed_10', 'Foodie Master', 'Feed your pet 10 times', '🍖', 'interaction', 'common', '{"type": "counter", "stat": "total_feeds", "value": 10}', 7),
('feed_50', 'Gourmet Chef', 'Feed your pet 50 times', '👨‍🍳', 'interaction', 'rare', '{"type": "counter", "stat": "total_feeds", "value": 50}', 8),
('play_10', 'Playground Star', 'Play with your pet 10 times', '⭐', 'interaction', 'common', '{"type": "counter", "stat": "total_plays", "value": 10}', 9),
('play_50', 'Fun Champion', 'Play with your pet 50 times', '🏆', 'interaction', 'rare', '{"type": "counter", "stat": "total_plays", "value": 50}', 10),
('bath_5', 'Clean Machine', 'Bath your pet 5 times', '✨', 'interaction', 'common', '{"type": "counter", "stat": "total_baths", "value": 5}', 11),
('bath_25', 'Squeaky Clean', 'Bath your pet 25 times', '🧼', 'interaction', 'rare', '{"type": "counter", "stat": "total_baths", "value": 25}', 12),

-- Stat Achievements
('happy_pet', 'Happy Pet', 'Reach happiness level 85+', '😊', 'stats', 'common', '{"type": "stat", "stat": "happiness", "value": 85}', 13),
('very_happy', 'Overjoyed', 'Reach happiness level 95+', '🤩', 'stats', 'rare', '{"type": "stat", "stat": "happiness", "value": 95}', 14),
('healthy_buddy', 'Healthy Buddy', 'Reach health level 85+', '💚', 'stats', 'common', '{"type": "stat", "stat": "health", "value": 85}', 15),
('peak_health', 'Peak Condition', 'Reach health level 95+', '🩺', 'stats', 'rare', '{"type": "stat", "stat": "health", "value": 95}', 16),
('clean_pup', 'Squeaky Clean Pup', 'Reach cleanliness level 85+', '🌟', 'stats', 'common', '{"type": "stat", "stat": "cleanliness", "value": 85}', 17),
('energizer', 'Energizer', 'Reach energy level 90+', '⚡', 'stats', 'common', '{"type": "stat", "stat": "energy", "value": 90}', 18),
('affectionate', 'Affectionate Bond', 'Reach affection level 80+', '💞', 'stats', 'common', '{"type": "stat", "stat": "affection_level", "value": 80}', 19),
('devoted', 'Devoted Companion', 'Reach affection level 95+', '👑', 'stats', 'rare', '{"type": "stat", "stat": "affection_level", "value": 95}', 20),

-- Combo Achievements
('all_star', 'All Star Caretaker', 'Get all stats above 75', '⭐⭐⭐', 'combo', 'epic', '{"type": "all_stats", "value": 75}', 21),
('perfect_pet', 'Perfect Pet Owner', 'Get all stats above 90', '👑✨', 'combo', 'legendary', '{"type": "all_stats", "value": 90}', 22),

-- Consecutive Days
('7day_streak', '7-Day Companion', 'Interact with your pet for 7 consecutive days', '🔥', 'streak', 'rare', '{"type": "streak_days", "days": 7}', 23),
('30day_streak', '30-Day Dedicated', 'Interact with your pet for 30 consecutive days', '💪', 'streak', 'epic', '{"type": "streak_days", "days": 30}', 24)
ON CONFLICT (id) DO NOTHING;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_achievements ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for achievement_definitions (public read)
CREATE POLICY "Anyone can view achievement definitions"
  ON public.achievement_definitions
  FOR SELECT
  USING (true);

-- 6. Create RLS policies for pet_achievements
CREATE POLICY "Users can view pet achievements"
  ON public.pet_achievements
  FOR SELECT
  USING (true);

CREATE POLICY "System can insert pet achievements"
  ON public.pet_achievements
  FOR INSERT
  WITH CHECK (true);

-- 7. (OPTIONAL) Drop pet_interactions table if you don't need it anymore
-- Uncomment the lines below if you want to remove the unused table:

-- DROP TABLE IF EXISTS public.pet_interactions CASCADE;

-- Migration complete!
