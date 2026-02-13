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
    console.error("User error:", userError);
    return { error: "You must be logged in to create milestones" };
  }

  const title = formData.get("title") as string;
  const date = formData.get("date") as string;
  const type = formData.get("type") as string;
  const description = formData.get("description") as string | null;

  if (!title || !date) {
    return { error: "Title and date are required" };
  }

  const { data: newMilestone, error } = await supabase
    .from("milestones")
    .insert({
      created_by: user.id,
      title,
      milestone_date: date,
      milestone_type: type || "other",
      description: description || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating milestone:", error);
    return { error: "Failed to create milestone. Please try again." };
  }

  console.log("Milestone created successfully:", newMilestone);

  revalidatePath("/dashboard");
  revalidatePath("/milestones");
  return { success: true };
}

export async function setAnniversary(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in" };
  }

  const anniversaryDate = formData.get("anniversaryDate") as string;

  if (!anniversaryDate) {
    return { error: "Anniversary date is required" };
  }

  // Check if user already has a relationship
  const { data: existingRel } = await supabase
    .from("relationships")
    .select("id")
    .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
    .maybeSingle();

  if (existingRel) {
    return { error: "You already have a relationship set up" };
  }

  // Create a new relationship with only the current user (partner2_id will be null)
  const { error } = await supabase.from("relationships").insert({
    partner1_id: user.id,
    partner2_id: null, // No partner yet
    relationship_start_date: anniversaryDate,
    status: "active",
  });

  if (error) {
    console.error("Error setting anniversary:", error);
    return { error: "Failed to set anniversary. Please try again." };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
