import { createClient } from "@/lib/supabase/server";
import { Milestone } from "@/types";
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
  const { data, error } = await supabase
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
    .maybeSingle(); // Changed from .single() to .maybeSingle()

  if (error) {
    console.error("Error fetching relationship:", error);
    return null;
  }

  return data;
});

export async function getMilestones(
  relationshipId: string,
  limit?: number,
): Promise<Milestone[]> {
  const supabase = await createClient();

  const today = new Date().toISOString().split("T")[0];

  let query = supabase
    .from("milestones")
    .select("*")
    .eq("relationship_id", relationshipId)
    .gte("milestone_date", today)
    .order("milestone_date", { ascending: true });
  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching milestones:", error);
    return [];
  }

  return (data as Milestone[]) || [];
}

export async function getMilestonesByUser(
  userId: string,
  limit?: number,
): Promise<Milestone[]> {
  const supabase = await createClient();

  const today = new Date().toISOString().split("T")[0];

  let query = supabase
    .from("milestones")
    .select("*")
    .eq("created_by", userId)
    .gte("milestone_date", today)
    .order("milestone_date", { ascending: true });
  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching milestones by user:", error);
    return [];
  }

  return (data as Milestone[]) || [];
}

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

// Add these to your /lib/data.ts file

export async function getPhotos(userId: string) {
  const supabase = await createClient();

  // Get user's relationship
  const { data: relationship } = await supabase
    .from("relationships")
    .select("id")
    .or(`partner1_id.eq.${userId},partner2_id.eq.${userId}`)
    .single();

  if (!relationship) {
    return [];
  }

  // Get all photos for the relationship
  const { data, error } = await supabase
    .from("photos")
    .select(
      `
      *,
      uploader:uploaded_by (
        id,
        display_name,
        avatar_url
      )
    `,
    )
    .eq("relationship_id", relationship.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching photos:", error);
    return [];
  }

  return data || [];
}

export async function getPhoto(photoId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("photos")
    .select(
      `
      *,
      uploader:uploaded_by (
        id,
        display_name,
        avatar_url
      )
    `,
    )
    .eq("id", photoId)
    .single();

  if (error) {
    console.error("Error fetching photo:", error);
    return null;
  }

  return data;
}
