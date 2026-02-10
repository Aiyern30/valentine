"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createMilestone(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const type = formData.get("type") as string;

  if (!title || !date || !type) {
    return { error: "Missing required fields" };
  }

  // Get relationship_id
  const { data: relationship } = await supabase
    .from("relationships")
    .select("id")
    .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
    .eq("status", "active")
    .single();

  if (!relationship) {
    return { error: "No active relationship found" };
  }

  const { error } = await supabase.from("milestones").insert({
    relationship_id: relationship.id,
    title,
    description,
    milestone_date: date,
    milestone_type: type,
    created_by: user.id,
  });

  if (error) {
    console.error("Error creating milestone:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
