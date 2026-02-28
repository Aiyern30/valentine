"use server";

// Pet interaction database operations (server actions)
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import {
  calculateMood,
  updateStatsForInteraction,
} from "@/lib/pet-stats-calculator";

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

export interface PetInteractionPayload {
  petId: string;
  interactionType: "pat" | "feed" | "play" | "bath" | "sleep";
  performedById: string;
  happinessBefore: number;
  happinessAfter: number;
  moodBefore: string;
  moodAfter: string;
  detailsJSON?: Record<string, any>;
}

// Record interaction in database
export async function recordPetInteraction(payload: PetInteractionPayload) {
  try {
    console.log("[recordPetInteraction] 🚀 Recording interaction:", {
      petId: payload.petId,
      interactionType: payload.interactionType,
      performedById: payload.performedById,
      happinessBefore: payload.happinessBefore,
      happinessAfter: payload.happinessAfter,
      moodBefore: payload.moodBefore,
      moodAfter: payload.moodAfter,
    });
    const supabase = await createClient();
    console.log("[recordPetInteraction] ✅ Supabase client created");

    const { data, error } = await supabase
      .from("pet_interactions")
      .insert([
        {
          pet_id: payload.petId,
          interaction_type: payload.interactionType,
          performed_by: payload.performedById,
          happiness_before: payload.happinessBefore,
          happiness_after: payload.happinessAfter,
          mood_before: payload.moodBefore,
          mood_after: payload.moodAfter,
          interaction_details: payload.detailsJSON || {},
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("[recordPetInteraction] ❌ Database error:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return {
        error: "Failed to record interaction",
        details: `${error.code}: ${error.message}`,
      };
    }

    console.log(
      "[recordPetInteraction] ✅ Interaction recorded successfully:",
      data,
    );
    return { success: true, interaction: data };
  } catch (error) {
    console.error(
      "[recordPetInteraction] ❌ Catch error in recordPetInteraction:",
      error,
    );
    return {
      error: "An unexpected error occurred",
      details: String(error),
    };
  }
}

// Get current pet stats
export async function getPetStats(petId: string) {
  try {
    console.log("[getPetStats] 🔍 Fetching stats for pet:", petId);
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
      console.log("[getPetStats] 📋 Record not found, creating default...");

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
          console.log(
            "[getPetStats] 📋 Duplicate detected, fetching existing record...",
          );
          const { data: existingData, error: fetchError } = await supabase
            .from("pet_stats")
            .select("*")
            .eq("pet_id", petId)
            .single();

          if (!fetchError && existingData) {
            console.log(
              "[getPetStats] ✅ Found existing stats after retry:",
              existingData,
            );
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

      console.log("[getPetStats] ✅ Created default stats");
      return createdData;
    }

    console.log("[getPetStats] ✅ Found pet stats");
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
    console.log("[updatePetStatsInDB] 🔄 Updating pet stats for:", petId);
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

    console.log("[updatePetStatsInDB] ✅ Pet stats updated successfully");
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
  interactionType: PetInteractionPayload["interactionType"],
) {
  try {
    console.log("[handlePetInteraction] 🎬 Starting interaction:", {
      petId,
      performedById,
      interactionType,
    });

    // Get current stats
    const currentStats = await getPetStats(petId);
    if (!currentStats) {
      console.error("[handlePetInteraction] ❌ Pet not found:", petId);
      return { error: "Pet not found" };
    }

    console.log("[handlePetInteraction] ✅ Got current stats:", {
      happiness: currentStats.happiness,
      hunger: currentStats.hunger,
      energy: currentStats.energy,
    });

    // Calculate new stats and mood
    const { updated, moodBefore, moodAfter } = updateStatsForInteraction(
      {
        happiness: currentStats.happiness,
        hunger: currentStats.hunger,
        energy: currentStats.energy,
        cleanliness: currentStats.cleanliness,
        health: currentStats.health,
        affection_level: currentStats.affection_level,
      },
      interactionType,
    );

    console.log("[handlePetInteraction] 📊 Stats calculated:", {
      moodBefore,
      moodAfter,
      updated,
    });

    // Record the interaction
    const interactionResult = await recordPetInteraction({
      petId,
      interactionType,
      performedById,
      happinessBefore: currentStats.happiness,
      happinessAfter: updated.happiness ?? currentStats.happiness,
      moodBefore,
      moodAfter,
    });

    if ("error" in interactionResult) {
      console.error(
        "[handlePetInteraction] ❌ Failed to record interaction:",
        interactionResult.error,
      );
      return interactionResult;
    }

    console.log("[handlePetInteraction] ✅ Interaction recorded");

    // Update stats in database
    const statsResult = await updatePetStatsInDB(petId, updated);
    if ("error" in statsResult) {
      console.error(
        "[handlePetInteraction] ❌ Failed to update stats:",
        statsResult.error,
      );
      return statsResult;
    }

    console.log("[handlePetInteraction] ✅ Stats updated in database");

    // Record mood history
    await recordMoodHistory(petId, moodAfter, {
      happiness: updated.happiness ?? currentStats.happiness,
      hunger: updated.hunger ?? currentStats.hunger,
      energy: updated.energy ?? currentStats.energy,
      cleanliness: updated.cleanliness ?? currentStats.cleanliness,
    });

    console.log("[handlePetInteraction] ✅ Mood history recorded");

    console.log("[handlePetInteraction] ✅ All steps completed successfully");
    return {
      success: true,
      interaction: interactionResult.interaction,
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
