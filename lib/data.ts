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

// lib/data.ts
export async function getRelationship(userId: string) {
  const supabase = await createClient();

  // ✅ Fix: First try to get ACTIVE relationships (prioritize these)
  const { data: activeRel, error: activeError } = await supabase
    .from("relationships")
    .select("*")
    .or(`partner1_id.eq.${userId},partner2_id.eq.${userId}`)
    .eq("status", "active")
    .maybeSingle();

  if (activeError) {
    console.error("❌ Error fetching active relationship:", activeError);
  }

  // If we found an active relationship, return it
  if (activeRel) {
    return activeRel;
  }

  // ✅ Fallback: If no active relationship, look for pending ones
  const { data: pendingRel, error: pendingError } = await supabase
    .from("relationships")
    .select("*")
    .or(`partner1_id.eq.${userId},partner2_id.eq.${userId}`)
    .eq("status", "pending")
    .maybeSingle();

  if (pendingError) {
    console.error("❌ Error fetching pending relationship:", pendingError);
    return null;
  }

  return pendingRel;
}

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
  const relationship = await getRelationship(userId);

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

export async function getDiaries(userId: string) {
  const supabase = await createClient();

  const relationship = await getRelationship(userId);

  if (!relationship) return [];

  const { data, error } = await supabase
    .from("diaries")
    .select(
      `
      *,
      author:user_id (
        id,
        display_name,
        avatar_url
      )
    `,
    )
    .eq("relationship_id", relationship.id)
    .order("diary_date", { ascending: false });

  if (error) {
    console.error("Error fetching diaries:", error);
    return [];
  }

  return data || [];
}

export async function getDiaryById(diaryId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("diaries")
    .select(
      `
      *,
      author:user_id (
        id,
        display_name,
        avatar_url
      )
    `,
    )
    .eq("id", diaryId)
    .single();

  if (error) {
    console.error("Error fetching diary:", error);
    return null;
  }

  return data;
}

export async function getPartnerProfile(userId: string) {
  const supabase = await createClient();

  // Get the relationship for the current user
  const { data: relationship, error: relationshipError } = await supabase
    .from("relationships")
    .select("partner1_id, partner2_id")
    .or(`partner1_id.eq.${userId},partner2_id.eq.${userId}`)
    .eq("status", "active")
    .maybeSingle();

  if (relationshipError || !relationship) {
    return null;
  }

  // Determine partner ID
  const partnerId =
    relationship.partner1_id === userId
      ? relationship.partner2_id
      : relationship.partner1_id;

  // Get partner's profile
  const { data: partnerProfile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", partnerId)
    .single();

  if (profileError) {
    console.error("Error fetching partner profile:", profileError);
    return null;
  }

  return partnerProfile;
}

export async function getRelationshipPulse(userId: string) {
  const supabase = await createClient();

  // 1. Get relationship
  const relationship = await getRelationship(userId);
  if (!relationship) return null;

  // 2. Get Goals Stats
  const { count: goalsCount } = await supabase
    .from("shared_goals")
    .select("*", { count: "exact", head: true })
    .eq("relationship_id", relationship.id);

  const { count: completedGoalsCount } = await supabase
    .from("shared_goals")
    .select("*", { count: "exact", head: true })
    .eq("relationship_id", relationship.id)
    .eq("status", "completed");

  // 3. Get Q&A Stats
  const { count: qaCount } = await supabase
    .from("qa_sessions")
    .select("*", { count: "exact", head: true })
    .eq("relationship_id", relationship.id)
    .eq("status", "completed");

  // 4. Get Latest Check-in (Heartbeat)
  const { data: latestCheckin } = await supabase
    .from("goal_checkins")
    .select("*, profiles(display_name), shared_goals(title)")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // 5. Get Pending Q&A for the user
  const { count: pendingQACount } = await supabase
    .from("qa_sessions")
    .select("*", { count: "exact", head: true })
    .eq("relationship_id", relationship.id)
    .neq("status", "completed")
    .neq("created_by", userId); // Sent by partner

  return {
    goalsCount: goalsCount || 0,
    completedGoalsCount: completedGoalsCount || 0,
    qaCount: qaCount || 0,
    latestCheckin: latestCheckin as any,
    pendingQACount: pendingQACount || 0,
  };
}
