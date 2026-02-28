-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.calendar_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  relationship_id uuid,
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  event_time time without time zone,
  reminder_enabled boolean DEFAULT false,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT calendar_events_pkey PRIMARY KEY (id),
  CONSTRAINT calendar_events_relationship_id_fkey FOREIGN KEY (relationship_id) REFERENCES public.relationships(id),
  CONSTRAINT calendar_events_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.confessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sender_id uuid,
  recipient_email text,
  theme text NOT NULL,
  message text NOT NULL,
  link_token text NOT NULL UNIQUE,
  is_opened boolean DEFAULT false,
  opened_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone,
  loved_one_name text,
  pet_name text,
  sender_name text,
  relationship_status text,
  music_url text,
  photos jsonb DEFAULT '[]'::jsonb,
  envelope_style text DEFAULT 'Romantic'::text,
  title text,
  categories jsonb DEFAULT '[]'::jsonb,
  CONSTRAINT confessions_pkey PRIMARY KEY (id),
  CONSTRAINT confessions_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.diaries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  relationship_id uuid,
  user_id uuid,
  title text NOT NULL,
  content text NOT NULL,
  diary_date date NOT NULL,
  photos jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT diaries_pkey PRIMARY KEY (id),
  CONSTRAINT diaries_relationship_id_fkey FOREIGN KEY (relationship_id) REFERENCES public.relationships(id),
  CONSTRAINT diaries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.milestones (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  relationship_id uuid,
  title text NOT NULL,
  description text,
  milestone_date date NOT NULL,
  milestone_type text,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  end_date date,
  reminder_type text DEFAULT 'none'::text CHECK (reminder_type = ANY (ARRAY['none'::text, 'day_of'::text, 'in_advance'::text])),
  reminder_time time without time zone,
  advance_days integer,
  advance_hours integer,
  advance_minutes integer,
  CONSTRAINT milestones_pkey PRIMARY KEY (id),
  CONSTRAINT milestones_relationship_id_fkey FOREIGN KEY (relationship_id) REFERENCES public.relationships(id),
  CONSTRAINT milestones_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.notes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  relationship_id uuid,
  author_id uuid,
  title text,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notes_pkey PRIMARY KEY (id),
  CONSTRAINT notes_relationship_id_fkey FOREIGN KEY (relationship_id) REFERENCES public.relationships(id),
  CONSTRAINT notes_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.achievement_definitions (
  id text NOT NULL PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  icon text,
  category text NOT NULL,
  rarity text DEFAULT 'common'::text,
  unlock_condition jsonb NOT NULL,
  display_order integer DEFAULT 0
);
CREATE TABLE public.pet_achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL,
  achievement_id text NOT NULL,
  achievement_type text NOT NULL,
  achieved_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pet_achievements_pkey PRIMARY KEY (id),
  CONSTRAINT pet_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievement_definitions(id),
  CONSTRAINT pet_achievements_pet_id_fkey FOREIGN KEY (pet_id) REFERENCES public.pets(id)
);
CREATE TABLE public.pet_care_streaks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL,
  streak_type text NOT NULL,
  current_streak integer DEFAULT 1,
  best_streak integer DEFAULT 1,
  last_done_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pet_care_streaks_pkey PRIMARY KEY (id),
  CONSTRAINT pet_care_streaks_pet_id_fkey FOREIGN KEY (pet_id) REFERENCES public.pets(id)
);
CREATE TABLE public.pet_interactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL,
  interaction_type text NOT NULL,
  interaction_details jsonb,
  performed_by uuid NOT NULL,
  happiness_before numeric,
  happiness_after numeric,
  mood_before text,
  mood_after text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pet_interactions_pkey PRIMARY KEY (id),
  CONSTRAINT pet_interactions_pet_id_fkey FOREIGN KEY (pet_id) REFERENCES public.pets(id),
  CONSTRAINT pet_interactions_performed_by_fkey FOREIGN KEY (performed_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.pet_mood_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL,
  mood text NOT NULL,
  happiness numeric,
  hunger numeric,
  energy numeric,
  cleanliness numeric,
  recorded_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pet_mood_history_pkey PRIMARY KEY (id),
  CONSTRAINT pet_mood_history_pet_id_fkey FOREIGN KEY (pet_id) REFERENCES public.pets(id)
);
CREATE TABLE public.pet_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL UNIQUE,
  favorite_food text,
  favorite_toy text,
  food_preferences jsonb DEFAULT '{}'::jsonb,
  toy_preferences jsonb DEFAULT '{}'::jsonb,
  least_favorite_food text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pet_preferences_pkey PRIMARY KEY (id),
  CONSTRAINT pet_preferences_pet_id_fkey FOREIGN KEY (pet_id) REFERENCES public.pets(id)
);
CREATE TABLE public.pet_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL UNIQUE,
  happiness numeric DEFAULT 75,
  hunger numeric DEFAULT 50,
  energy numeric DEFAULT 80,
  cleanliness numeric DEFAULT 70,
  health numeric DEFAULT 90,
  affection_level numeric DEFAULT 50,
  total_pats integer DEFAULT 0,
  total_feeds integer DEFAULT 0,
  total_plays integer DEFAULT 0,
  total_baths integer DEFAULT 0,
  current_mood text DEFAULT 'happy'::text,
  last_fed timestamp with time zone,
  last_played timestamp with time zone,
  last_bathed timestamp with time zone,
  last_slept timestamp with time zone,
  last_stat_update timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pet_stats_pkey PRIMARY KEY (id),
  CONSTRAINT pet_stats_pet_id_fkey FOREIGN KEY (pet_id) REFERENCES public.pets(id)
);
CREATE TABLE public.pets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  relationship_id uuid NOT NULL,
  pet_name text NOT NULL,
  pet_type text NOT NULL,
  pet_breed text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  CONSTRAINT pets_pkey PRIMARY KEY (id),
  CONSTRAINT pets_relationship_id_fkey FOREIGN KEY (relationship_id) REFERENCES public.relationships(id),
  CONSTRAINT pets_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.photos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  relationship_id uuid,
  uploaded_by uuid,
  photo_url text NOT NULL,
  caption text,
  taken_date date,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT photos_pkey PRIMARY KEY (id),
  CONSTRAINT photos_relationship_id_fkey FOREIGN KEY (relationship_id) REFERENCES public.relationships(id),
  CONSTRAINT photos_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  username text UNIQUE,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  email text,
  terms_accepted boolean DEFAULT false,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.relationship_invitations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  inviter_id uuid NOT NULL,
  invitee_email text NOT NULL,
  invitation_token text NOT NULL UNIQUE,
  status text DEFAULT 'pending'::text,
  relationship_id uuid,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  accepted_at timestamp with time zone,
  CONSTRAINT relationship_invitations_pkey PRIMARY KEY (id),
  CONSTRAINT relationship_invitations_inviter_id_fkey FOREIGN KEY (inviter_id) REFERENCES public.profiles(id),
  CONSTRAINT relationship_invitations_relationship_id_fkey FOREIGN KEY (relationship_id) REFERENCES public.relationships(id)
);

-- Achievement Definitions
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
('30day_streak', '30-Day Dedicated', 'Interact with your pet for 30 consecutive days', '💪', 'streak', 'epic', '{"type": "streak_days", "days": 30}', 24);

CREATE TABLE public.relationships (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  partner1_id uuid,
  partner2_id uuid,
  relationship_start_date date NOT NULL,
  status text DEFAULT 'active'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT relationships_pkey PRIMARY KEY (id),
  CONSTRAINT relationships_partner1_id_fkey FOREIGN KEY (partner1_id) REFERENCES public.profiles(id),
  CONSTRAINT relationships_partner2_id_fkey FOREIGN KEY (partner2_id) REFERENCES public.profiles(id)
);