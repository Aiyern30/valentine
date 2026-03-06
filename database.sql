-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.achievement_definitions (
  id text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  icon text,
  category text NOT NULL,
  rarity text DEFAULT 'common'::text,
  unlock_condition jsonb NOT NULL,
  display_order integer DEFAULT 0,
  CONSTRAINT achievement_definitions_pkey PRIMARY KEY (id)
);
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
CREATE TABLE public.couple_challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  relationship_id uuid NOT NULL,
  created_by uuid NOT NULL,
  title text NOT NULL,
  description text,
  category text DEFAULT 'fun'::text,
  difficulty text DEFAULT 'easy'::text,
  duration_days integer DEFAULT 1,
  due_at timestamp with time zone,
  status text DEFAULT 'active'::text,
  partner1_completed boolean DEFAULT false,
  partner2_completed boolean DEFAULT false,
  proof_photos jsonb DEFAULT '[]'::jsonb,
  notes text,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  display_order integer NOT NULL DEFAULT 0,
  CONSTRAINT couple_challenges_pkey PRIMARY KEY (id),
  CONSTRAINT couple_challenges_relationship_id_fkey FOREIGN KEY (relationship_id) REFERENCES public.relationships(id),
  CONSTRAINT couple_challenges_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.couple_growth_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  relationship_id uuid NOT NULL UNIQUE,
  total_goals_completed integer DEFAULT 0,
  total_challenges_completed integer DEFAULT 0,
  current_streak_days integer DEFAULT 0,
  longest_streak_days integer DEFAULT 0,
  total_points integer DEFAULT 0,
  last_activity_date date,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT couple_growth_stats_pkey PRIMARY KEY (id),
  CONSTRAINT couple_growth_stats_relationship_id_fkey FOREIGN KEY (relationship_id) REFERENCES public.relationships(id)
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
CREATE TABLE public.goal_checkins (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL,
  user_id uuid NOT NULL,
  check_date date NOT NULL DEFAULT CURRENT_DATE,
  value numeric DEFAULT 1,
  note text,
  mood text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT goal_checkins_pkey PRIMARY KEY (id),
  CONSTRAINT goal_checkins_goal_id_fkey FOREIGN KEY (goal_id) REFERENCES public.shared_goals(id),
  CONSTRAINT goal_checkins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
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
CREATE TABLE public.pet_achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL,
  achievement_type text NOT NULL,
  achieved_at timestamp with time zone DEFAULT now(),
  achievement_id text,
  CONSTRAINT pet_achievements_pkey PRIMARY KEY (id),
  CONSTRAINT pet_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievement_definitions(id),
  CONSTRAINT pet_achievements_pet_id_fkey FOREIGN KEY (pet_id) REFERENCES public.pets(id)
);
CREATE TABLE public.pet_daily_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL,
  stat_date date NOT NULL,
  daily_pats integer DEFAULT 0,
  daily_feeds integer DEFAULT 0,
  daily_plays integer DEFAULT 0,
  daily_baths integer DEFAULT 0,
  sleep_hours numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pet_daily_stats_pkey PRIMARY KEY (id),
  CONSTRAINT pet_daily_stats_pet_id_fkey FOREIGN KEY (pet_id) REFERENCES public.pets(id)
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
CREATE TABLE public.qa_answers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL UNIQUE,
  answered_by uuid NOT NULL,
  answer_text text NOT NULL,
  is_revealed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT qa_answers_pkey PRIMARY KEY (id),
  CONSTRAINT qa_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.qa_questions(id),
  CONSTRAINT qa_answers_answered_by_fkey FOREIGN KEY (answered_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.qa_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  relationship_id uuid NOT NULL,
  created_by uuid NOT NULL,
  question_text text NOT NULL,
  category text,
  is_answered boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  display_order integer NOT NULL DEFAULT 0,
  CONSTRAINT qa_questions_pkey PRIMARY KEY (id),
  CONSTRAINT qa_questions_relationship_id_fkey FOREIGN KEY (relationship_id) REFERENCES public.relationships(id),
  CONSTRAINT qa_questions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.quiz_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  created_by uuid NOT NULL,
  question_text text NOT NULL,
  question_type text NOT NULL,
  options jsonb,
  correct_option text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quiz_questions_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_questions_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.quiz_sessions(id),
  CONSTRAINT quiz_questions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.quiz_responses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  question_id uuid NOT NULL,
  answered_by uuid NOT NULL,
  selected_option text NOT NULL,
  is_match boolean,
  answered_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quiz_responses_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_responses_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.quiz_sessions(id),
  CONSTRAINT quiz_responses_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.quiz_questions(id),
  CONSTRAINT quiz_responses_answered_by_fkey FOREIGN KEY (answered_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.quiz_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  relationship_id uuid NOT NULL,
  created_by uuid NOT NULL,
  title text,
  status text DEFAULT 'draft'::text,
  total_questions integer DEFAULT 0,
  match_score numeric,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quiz_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_sessions_relationship_id_fkey FOREIGN KEY (relationship_id) REFERENCES public.relationships(id),
  CONSTRAINT quiz_sessions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
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
CREATE TABLE public.shared_goals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  relationship_id uuid NOT NULL,
  created_by uuid NOT NULL,
  title text NOT NULL,
  description text,
  category text DEFAULT 'lifestyle'::text,
  goal_type text DEFAULT 'habit'::text,
  target_value numeric,
  unit text,
  frequency text,
  start_date date NOT NULL,
  end_date date,
  status text DEFAULT 'active'::text,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  display_order integer NOT NULL DEFAULT 0,
  CONSTRAINT shared_goals_pkey PRIMARY KEY (id),
  CONSTRAINT shared_goals_relationship_id_fkey FOREIGN KEY (relationship_id) REFERENCES public.relationships(id),
  CONSTRAINT shared_goals_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);