"use server";

// Pet interaction database operations (server actions)
import { createClient } from "@/lib/supabase/server";
import { updateStatsForInteraction } from "@/lib/pet-stats-calculator";

// Re-define the type here so it's available in this "use server" context
export interface PetStatsUpdate {
  happiness?: number;
  hunger?: number;
  energy?: number;
  cleanliness?: number;
  health?: number;
  affection_level?: number;
  current_mood?: string;
  total_pats?: number;
  total_feeds?: number;
  total_plays?: number;
  total_baths?: number;
  last_fed?: Date;
  last_played?: Date;
  last_bathed?: Date;
  last_slept?: Date;
}

// Get current pet stats
export async function getPetStats(petId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("pet_stats")
      .select("*")
      .eq("pet_id", petId)
      .single();

    if (error) {
      console.warn("[getPetStats] ⚠️ Error fetching pet stats:", {
        code: error.code,
        message: error.message,
      });

      // Try to create a default stats record
      const { data: createdData, error: createError } = await supabase
        .from("pet_stats")
        .insert({
          pet_id: petId,
          happiness: 75,
          hunger: 50,
          energy: 80,
          cleanliness: 70,
          health: 90,
          affection_level: 50,
          current_mood: "happy",
          total_pats: 0,
          total_feeds: 0,
          total_plays: 0,
          total_baths: 0,
        })
        .select()
        .single();

      if (createError) {
        // If creation fails due to duplicate, it means the record was created by another request
        // Try to fetch it again
        if (createError.code === "23505") {
          const { data: existingData, error: fetchError } = await supabase
            .from("pet_stats")
            .select("*")
            .eq("pet_id", petId)
            .single();

          if (!fetchError && existingData) {
            return existingData;
          }
        }

        console.warn("[getPetStats] ⚠️ Could not create stats record:", {
          code: createError.code,
          message: createError.message,
        });
        // Return defaults as fallback
        return {
          pet_id: petId,
          happiness: 75,
          hunger: 50,
          energy: 80,
          cleanliness: 70,
          health: 90,
          affection_level: 50,
          current_mood: "happy",
          total_pats: 0,
          total_feeds: 0,
          total_plays: 0,
          total_baths: 0,
        };
      }

      return createdData;
    }

    return data;
  } catch (error) {
    console.error("[getPetStats] ❌ Error in getPetStats:", error);
    return null;
  }
}

// Update pet stats
export async function updatePetStatsInDB(
  petId: string,
  updates: PetStatsUpdate,
) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("pet_stats")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("pet_id", petId)
      .select()
      .single();

    if (error) {
      console.error("[updatePetStatsInDB] ❌ Database error:", {
        code: error.code,
        message: error.message,
        details: error.details,
      });
      return {
        error: "Failed to update pet stats",
        details: `${error.code}: ${error.message}`,
      };
    }

    return { success: true, stats: data };
  } catch (error) {
    console.error("[updatePetStatsInDB] ❌ Catch error:", error);
    return {
      error: "An unexpected error occurred",
      details: String(error),
    };
  }
}

// Record mood history entry
export async function recordMoodHistory(
  petId: string,
  mood: string,
  stats: {
    happiness: number;
    hunger: number;
    energy: number;
    cleanliness: number;
  },
) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("pet_mood_history")
      .insert([
        {
          pet_id: petId,
          mood,
          happiness: stats.happiness,
          hunger: stats.hunger,
          energy: stats.energy,
          cleanliness: stats.cleanliness,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error recording mood history:", error);
      return { error: "Failed to record mood history" };
    }

    return { success: true, history: data };
  } catch (error) {
    console.error("Error in recordMoodHistory:", error);
    return { error: "An unexpected error occurred" };
  }
}

// Get pet mood history (last 30 entries)
export async function getPetMoodHistory(petId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("pet_mood_history")
      .select("*")
      .eq("pet_id", petId)
      .order("recorded_at", { ascending: false })
      .limit(30);

    if (error) {
      console.error("Error fetching mood history:", error);
      return { error: "Failed to fetch mood history" };
    }

    return { success: true, history: data || [] };
  } catch (error) {
    console.error("Error in getPetMoodHistory:", error);
    return { error: "An unexpected error occurred" };
  }
}

// Handle pet interaction - orchestrated function
export async function handlePetInteraction(
  petId: string,
  performedById: string,
  interactionType: "pat" | "feed" | "play" | "bath" | "sleep",
) {
  try {
    // Get current stats
    const currentStats = await getPetStats(petId);
    if (!currentStats) {
      console.error("[handlePetInteraction] ❌ Pet not found:", petId);
      return { error: "Pet not found" };
    }

    // Calculate new stats and mood
    const { updated, moodBefore, moodAfter } = updateStatsForInteraction(
      {
        happiness: currentStats.happiness,
        hunger: currentStats.hunger,
        energy: currentStats.energy,
        cleanliness: currentStats.cleanliness,
        health: currentStats.health,
        affection_level: currentStats.affection_level,
        total_pats: currentStats.total_pats,
        total_feeds: currentStats.total_feeds,
        total_plays: currentStats.total_plays,
        total_baths: currentStats.total_baths,
      },
      interactionType,
    );

    // 🔥 CHANGED: Skip recording individual interactions
    // Instead, just update the counters in pet_stats
    // This way 100 pats = 1 row with total_pats incremented by 100
    // Instead of 100 rows in pet_interactions table

    // Update stats in database (includes incrementing total_pats, total_feeds, etc.)
    const statsResult = await updatePetStatsInDB(petId, updated);
    if ("error" in statsResult) {
      console.error(
        "[handlePetInteraction] ❌ Failed to update stats:",
        statsResult.error,
      );
      return statsResult;
    }

    // Record mood history ONLY when mood actually changes (not every interaction)
    // This prevents 100 pats from creating 100 rows - only records significant mood transitions
    if (moodBefore !== moodAfter) {
      await recordMoodHistory(petId, moodAfter, {
        happiness: updated.happiness ?? currentStats.happiness,
        hunger: updated.hunger ?? currentStats.hunger,
        energy: updated.energy ?? currentStats.energy,
        cleanliness: updated.cleanliness ?? currentStats.cleanliness,
      });
    } else {
    }

    return {
      success: true,
      stats: statsResult.stats,
      moodBefore,
      moodAfter,
    };
  } catch (error) {
    console.error(
      "[handlePetInteraction] ❌ Error in handlePetInteraction:",
      error,
    );
    return {
      error: "An unexpected error occurred",
      details: String(error),
    };
  }
}
