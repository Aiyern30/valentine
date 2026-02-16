"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Upload avatar to Supabase Storage
export async function uploadAvatar(formData: FormData) {
  try {
    const supabase = await createClient();

    const userId = formData.get("userId") as string;
    const file = formData.get("avatar") as File;

    if (!userId || !file || file.size === 0) {
      return { error: "User ID and file are required" };
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { error: "File must be an image" };
    }

    // Validate file size (max 5MB for avatars)
    if (file.size > 5 * 1024 * 1024) {
      return { error: "File size must be less than 5MB" };
    }

    // Generate unique filename for avatar
    const fileExt = file.name.split(".").pop();
    const fileName = `avatars/${userId}/${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true, // Allow overwriting
      });

    if (uploadError) {
      console.error("Error uploading avatar:", uploadError);
      return { error: "Failed to upload avatar. Please try again." };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("photos").getPublicUrl(fileName);

    return { success: true, avatarUrl: publicUrl };
  } catch (error) {
    console.error("Unexpected error in uploadAvatar:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

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
  const endDate = formData.get("endDate") as string | null;
  const type = formData.get("milestone_type") as string;
  const description = formData.get("description") as string | null;
  const reminderType = formData.get("reminderType") as string;
  const reminderTime = formData.get("reminderTime") as string | null;
  const advanceDays = formData.get("advanceDays") as string | null;
  const advanceHours = formData.get("advanceHours") as string | null;
  const advanceMinutes = formData.get("advanceMinutes") as string | null;

  if (!title || !date) {
    return { error: "Title and date are required" };
  }

  const { data: newMilestone, error } = await supabase
    .from("milestones")
    .insert({
      created_by: user.id,
      title,
      milestone_date: date,
      end_date: endDate || null,
      milestone_type: type || "other",
      description: description || null,
      reminder_type: reminderType || "none",
      reminder_time: reminderType === "day_of" ? reminderTime : null,
      advance_days:
        reminderType === "in_advance" ? parseInt(advanceDays || "0") : null,
      advance_hours:
        reminderType === "in_advance" ? parseInt(advanceHours || "0") : null,
      advance_minutes:
        reminderType === "in_advance" ? parseInt(advanceMinutes || "0") : null,
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

export async function updateMilestone(formData: FormData) {
  const supabase = await createClient();
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const endDate = formData.get("endDate") as string | null;
    const type = formData.get("milestone_type") as string;
    const reminderType = formData.get("reminderType") as string;
    const reminderTime = formData.get("reminderTime") as string | null;
    const advanceDays = formData.get("advanceDays") as string | null;
    const advanceHours = formData.get("advanceHours") as string | null;
    const advanceMinutes = formData.get("advanceMinutes") as string | null;

    // Validate required fields
    if (!id || !title || !date) {
      return { error: "Missing required fields" };
    }

    const { error } = await supabase
      .from("milestones")
      .update({
        title,
        description: description || null,
        milestone_date: date,
        end_date: endDate || null,
        milestone_type: type,
        reminder_type: reminderType || "none",
        reminder_time: reminderType === "day_of" ? reminderTime : null,
        advance_days:
          reminderType === "in_advance" ? parseInt(advanceDays || "0") : null,
        advance_hours:
          reminderType === "in_advance" ? parseInt(advanceHours || "0") : null,
        advance_minutes:
          reminderType === "in_advance"
            ? parseInt(advanceMinutes || "0")
            : null,
      })
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    // Revalidate the page to show updated data
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error updating milestone:", error);
    return { error: "Failed to update milestone" };
  }
}

// Delete milestone
export async function deleteMilestone(id: string) {
  const supabase = await createClient();

  try {
    if (!id) {
      return { error: "Milestone ID is required" };
    }

    // Your database delete logic here
    // Example with Supabase:
    const { error } = await supabase.from("milestones").delete().eq("id", id);

    if (error) {
      return { error: error.message };
    }

    // Revalidate the page to show updated data
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error deleting milestone:", error);
    return { error: "Failed to delete milestone" };
  }
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

  // Check if user already has an active or pending relationship
  const { data: existingRel } = await supabase
    .from("relationships")
    .select("id")
    .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
    .in("status", ["active", "pending"])
    .maybeSingle();

  if (existingRel) {
    return { error: "You already have a relationship set up" };
  }

  const { error } = await supabase.from("relationships").insert({
    partner1_id: user.id,
    partner2_id: null, // No partner yet
    relationship_start_date: anniversaryDate,
    status: "pending",
  });

  if (error) {
    console.error("Error setting anniversary:", error);
    return { error: "Failed to set anniversary. Please try again." };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateAnniversaryDate(newDate: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in" };
  }

  if (!newDate) {
    return { error: "Anniversary date is required" };
  }

  try {
    // Get current active relationship
    const { data: relationship, error: fetchError } = await supabase
      .from("relationships")
      .select("id")
      .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
      .in("status", ["active", "pending"])
      .maybeSingle();

    if (fetchError || !relationship) {
      return { error: "No active relationship found" };
    }

    // Update the anniversary date
    const { error: updateError } = await supabase
      .from("relationships")
      .update({
        relationship_start_date: newDate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", relationship.id);

    if (updateError) {
      console.error("Error updating anniversary date:", updateError);
      return { error: "Failed to update anniversary date" };
    }

    console.log("✅ Anniversary date updated successfully");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("❌ Error updating anniversary date:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function removePartner() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in" };
  }

  try {
    // Get current relationship
    const { data: relationship, error: relationshipError } = await supabase
      .from("relationships")
      .select("*")
      .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
      .eq("status", "active")
      .maybeSingle();

    if (relationshipError) {
      console.error("Error fetching relationship:", relationshipError);
      return { error: "Failed to fetch relationship" };
    }

    if (!relationship) {
      return { error: "No active relationship found" };
    }

    // Update relationship status to 'ended'
    const { error: updateError } = await supabase
      .from("relationships")
      .update({
        status: "ended",
        updated_at: new Date().toISOString(),
      })
      .eq("id", relationship.id);

    if (updateError) {
      console.error("Error ending relationship:", updateError);
      return { error: "Failed to end relationship" };
    }

    // Cancel any pending invitations from this user
    await supabase
      .from("relationship_invitations")
      .update({ status: "cancelled" })
      .eq("inviter_id", user.id)
      .eq("status", "pending");

    console.log("✅ Relationship ended successfully");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("❌ Error removing relationship:", error);
    return { error: "An unexpected error occurred" };
  }
}

// Upload photo to Supabase Storage and create database record
export async function uploadPhoto(formData: FormData) {
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
    const caption = formData.get("caption") as string;
    const takenDate = formData.get("takenDate") as string;

    if (!file) {
      return { error: "No file provided" };
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { error: "File must be an image" };
    }

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      return { error: "File size must be less than 10MB" };
    }

    // Get user's relationship
    const { data: relationship } = await supabase
      .from("relationships")
      .select("id")
      .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
      .single();

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

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

    // Create database record
    const { data, error } = await supabase
      .from("photos")
      .insert({
        relationship_id: relationship?.id || null,
        uploaded_by: user.id,
        photo_url: publicUrl,
        caption: caption || null,
        taken_date: takenDate || null,
      })
      .select()
      .single();

    if (error) {
      // Clean up uploaded file if database insert fails
      await supabase.storage.from("photos").remove([fileName]);
      console.error("Error creating photo record:", error);
      return { error: "Failed to save photo. Please try again." };
    }

    revalidatePath("/gallery");

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

// Update photo details
export async function updatePhoto(formData: FormData) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "You must be logged in" };
    }

    const photoId = formData.get("photoId") as string;
    const caption = formData.get("caption") as string;
    const takenDate = formData.get("takenDate") as string;

    if (!photoId) {
      return { error: "Photo ID is required" };
    }

    // Update photo
    const { data, error } = await supabase
      .from("photos")
      .update({
        caption: caption || null,
        taken_date: takenDate || null,
      })
      .eq("id", photoId)
      .eq("uploaded_by", user.id) // Ensure user owns the photo
      .select()
      .single();

    if (error) {
      console.error("Error updating photo:", error);
      return { error: "Failed to update photo. Please try again." };
    }

    revalidatePath("/gallery");

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

// Delete photo
export async function deletePhoto(photoId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "You must be logged in" };
    }

    if (!photoId) {
      return { error: "Photo ID is required" };
    }

    // Get photo to extract file path
    const { data: photo, error: fetchError } = await supabase
      .from("photos")
      .select("photo_url, uploaded_by")
      .eq("id", photoId)
      .single();

    if (fetchError || !photo) {
      return { error: "Photo not found" };
    }

    // Verify user owns the photo
    if (photo.uploaded_by !== user.id) {
      return { error: "Unauthorized" };
    }

    // Extract file path from URL
    const urlParts = photo.photo_url.split("/photos/");
    const filePath = urlParts[1];

    // Delete from database
    const { error: deleteError } = await supabase
      .from("photos")
      .delete()
      .eq("id", photoId)
      .eq("uploaded_by", user.id);

    if (deleteError) {
      console.error("Error deleting photo record:", deleteError);
      return { error: "Failed to delete photo. Please try again." };
    }

    // Delete from storage
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from("photos")
        .remove([filePath]);

      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
        // Don't return error as database record is already deleted
      }
    }

    revalidatePath("/gallery");

    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
// Update just the photo's image file
export async function updatePhotoImage(photoId: string, blob: Blob) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "You must be logged in to edit photos" };
    }

    if (!photoId) {
      return { error: "Photo ID is required" };
    }

    // Get current photo to get the storage path and info
    const { data: photo, error: fetchError } = await supabase
      .from("photos")
      .select("photo_url, uploaded_by, relationship_id, caption, taken_date")
      .eq("id", photoId)
      .single();

    if (fetchError || !photo) {
      return { error: "Photo not found" };
    }

    if (photo.uploaded_by !== user.id) {
      return { error: "Unauthorized" };
    }

    // Extract storage path from URL (remove query params if any)
    const baseUrl = photo.photo_url.split("?")[0];
    const urlParts = baseUrl.split("/photos/");
    const oldPath = urlParts[1];

    if (!oldPath) {
      return { error: "Could not determine file path" };
    }

    // Convert Blob to File-like for upload
    const file = new File([blob], "edited-photo.jpg", { type: "image/jpeg" });

    // Upload with same path (overwrite)
    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(oldPath, file, {
        cacheControl: "0",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading edited file:", uploadError);
      return { error: "Failed to upload edited photo. Please try again." };
    }

    // Update the database record with a cache-busting timestamp
    const newUrl = `${baseUrl}?v=${Date.now()}`;
    await supabase
      .from("photos")
      .update({ photo_url: newUrl })
      .eq("id", photoId);

    // Refresh database record just in case
    revalidatePath("/gallery");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Unexpected error in updatePhotoImage:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
