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
  custom_text jsonb,
  link_token text NOT NULL UNIQUE,
  is_opened boolean DEFAULT false,
  opened_at timestamp with time zone,
  response text,
  responded_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone,
  CONSTRAINT confessions_pkey PRIMARY KEY (id),
  CONSTRAINT confessions_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id)
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
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
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