import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getProfile = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
});

export const getRelationship = cache(async (userId: string) => {
  const supabase = await createClient();
  // Find relationship where user is either partner1 or partner2
  const { data } = await supabase
    .from("relationships")
    .select(
      `
      *,
      partner1:profiles!relationships_partner1_id_fkey(*),
      partner2:profiles!relationships_partner2_id_fkey(*)
    `,
    )
    .or(`partner1_id.eq.${userId},partner2_id.eq.${userId}`)
    .eq("status", "active")
    .single();

  return data;
});

export const getMilestones = cache(async (relationshipId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("milestones")
    .select("*")
    .eq("relationship_id", relationshipId)
    .order("milestone_date", { ascending: true })
    .gte("milestone_date", new Date().toISOString())
    .limit(5);

  return data || [];
});

export const getRecentPhotos = cache(async (relationshipId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("photos")
    .select("*")
    .eq("relationship_id", relationshipId)
    .order("created_at", { ascending: false })
    .limit(4);

  return data || [];
});
