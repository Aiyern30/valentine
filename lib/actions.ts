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
  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        display_name: displayName,
        username: username || null,
        avatar_url: avatarUrl || null,
      },
      {
        onConflict: "id",
      }
    );

  if (error) {
    console.error("Error completing profile:", error);
    return { error: "Failed to complete profile. Please try again." };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function createMilestone(formData: FormData) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "You must be logged in to create a milestone" };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const type = formData.get("type") as string;

    if (!title || !date) {
      return { error: "Title and date are required" };
    }

    const { data: relationship } = await supabase
      .from("relationships")
      .select("id")
      .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
      .single();

    const { data, error } = await supabase
      .from("milestones")
      .insert({
        title,
        description: description || null,
        milestone_date: date,
        milestone_type: type,
        created_by: user.id,
        relationship_id: relationship?.id || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating milestone:", error);
      return { error: "Failed to create milestone. Please try again." };
    }

    revalidatePath("/milestones");

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
