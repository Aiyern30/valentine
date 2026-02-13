"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function completeProfile(formData: FormData) {
  const supabase = await createClient();

  const userId = formData.get("userId") as string;
  const displayName = formData.get("displayName") as string;
  const username = formData.get("username") as string | null;
  const avatarUrl = formData.get("avatarUrl") as string | null;

  if (!userId || !displayName) {
    return { error: "Missing required fields" };
  }

  // Use upsert to handle both insert and update cases
  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      display_name: displayName,
      username: username || null,
      avatar_url: avatarUrl || null,
    },
    {
      onConflict: "id",
    },
  );

  if (error) {
    console.error("Error completing profile:", error);
    return { error: "Failed to complete profile. Please try again." };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function createMilestone(formData: FormData) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in to create milestones" };
  }

  // Get user's relationship
  const { data: relationship, error: relError } = await supabase
    .from("relationships")
    .select("id")
    .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
    .single();

  if (relError || !relationship) {
    return { error: "You must be in a relationship to create milestones" };
  }

  const title = formData.get("title") as string;
  const date = formData.get("date") as string;
  const type = formData.get("type") as string;
  const description = formData.get("description") as string | null;

  if (!title || !date) {
    return { error: "Title and date are required" };
  }

  const { error } = await supabase.from("milestones").insert({
    relationship_id: relationship.id,
    title,
    milestone_date: date,
    milestone_type: type || "other",
    description: description || null,
  });

  if (error) {
    console.error("Error creating milestone:", error);
    return { error: "Failed to create milestone. Please try again." };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
