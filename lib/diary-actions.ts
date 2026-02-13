"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createDiaryEntry(formData: {
  title: string;
  content: string;
  diary_date: string;
  photos?: string[];
}) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "You must be logged in to create diary entries" };
    }

    // Get relationship ID
    const { data: relationship, error: relError } = await supabase
      .from("relationships")
      .select("id")
      .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
      .single();

    if (relError || !relationship) {
      return {
        error: "Relationship not found. Please set up your relationship first.",
      };
    }

    const { error: insertError } = await supabase.from("diaries").insert({
      relationship_id: relationship.id,
      user_id: user.id,
      title: formData.title,
      content: formData.content,
      diary_date: formData.diary_date,
      photos: formData.photos || [],
    });

    if (insertError) {
      console.error("Error inserting diary:", insertError);
      return { error: "Failed to save diary entry. Please try again." };
    }

    revalidatePath("/dashboard");
    revalidatePath("/diaries");

    return { success: true };
  } catch (error) {
    console.error("Unexpected error in createDiaryEntry:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
