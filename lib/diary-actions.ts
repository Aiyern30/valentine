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

export async function uploadDiaryPhoto(formData: FormData) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "You must be logged in to upload photos" };
    }

    const file = formData.get("file") as File;

    if (!file) {
      return { error: "No file provided" };
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `diary-photos/${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return { error: "Failed to upload photo. Please try again." };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("photos").getPublicUrl(fileName);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Unexpected error in uploadDiaryPhoto:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
