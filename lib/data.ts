import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export async function getProfile(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

export async function isProfileComplete(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .maybeSingle(); // Use maybeSingle() instead of single()

  if (error) {
    console.error("Error fetching profile:", error);
    return false;
  }

  // If no profile exists or display_name is null/empty, profile is incomplete
  return !!(data && data.display_name);
}

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

export async function getUserMilestones(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("milestones")
    .select("*")
    .eq("created_by", userId)
    .order("milestone_date", { ascending: false });

  if (error) {
    console.error("Error fetching user milestones:", error);
    return [];
  }

  return data || [];
}

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
