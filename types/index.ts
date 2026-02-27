export type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Relationship = {
  id: string;
  partner1_id: string | null;
  partner2_id: string | null;
  relationship_start_date: string;
  status: string | null;
  created_at: string;
  updated_at: string | null;
};

export type Milestone = {
  id: string;
  relationship_id: string | null;
  title: string;
  description: string | null;
  milestone_date: string;
  milestone_type: string | null;
  created_by: string | null;
  created_at: string;
};

export type CalendarEvent = {
  id: string;
  relationship_id: string | null;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  reminder_enabled: boolean | null;
  created_by: string | null;
  created_at: string;
};

export type Note = {
  id: string;
  relationship_id: string | null;
  author_id: string | null;
  title: string | null;
  content: string;
  created_at: string;
  updated_at: string | null;
};

export type Photo = {
  id: string;
  relationship_id: string | null;
  uploaded_by: string | null;
  photo_url: string;
  caption: string | null;
  taken_date: string | null;
  created_at: string;
};

export type Confession = {
  id: string;
  sender_id: string | null;
  recipient_email: string | null;
  theme: string;
  message: string;
  custom_text: any | null;
  link_token: string;
  is_opened: boolean | null;
  opened_at: string | null;
  response: string | null;
  responded_at: string | null;
  created_at: string;
  expires_at: string | null;
};
export type Pet = {
  id: string;
  relationship_id: string;
  pet_name: string;
  pet_type: "cat" | "dog";
  pet_breed: string;
  created_at: string;
  created_by: string | null;
};