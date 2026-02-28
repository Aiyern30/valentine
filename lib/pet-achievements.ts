"use server";

import { createClient } from "@/lib/supabase/server";

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  unlock_condition: Record<string, unknown>;
  display_order: number;
}

export interface UnlockedAchievement {
  id: string;
  pet_id: string;
  achievement_id: string;
  achievement_type: string;
  achieved_at: string;
  achievement: AchievementDefinition;
}

// Get all achievement definitions
export async function getAchievementDefinitions() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("achievement_definitions")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching achievements:", error);
      return { error: "Failed to fetch achievements" };
    }

    return { success: true, achievements: data || [] };
  } catch (error) {
    console.error("Error in getAchievementDefinitions:", error);
    return { error: "An unexpected error occurred" };
  }
}

// Get unlocked achievements for a pet
export async function getUnlockedAchievements(petId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("pet_achievements")
      .select(
        `
        *,
        achievement:achievement_definitions(*)
      `,
      )
      .eq("pet_id", petId)
      .order("achieved_at", { ascending: false });

    if (error) {
      console.error("Error fetching unlocked achievements:", error);
      return { error: "Failed to fetch achievements" };
    }

    return { success: true, achievements: data || [] };
  } catch (error) {
    console.error("Error in getUnlockedAchievements:", error);
    return { error: "An unexpected error occurred" };
  }
}

// Check and unlock achievements based on pet stats
export async function checkAndUnlockAchievements(petId: string) {
  try {
    const supabase = await createClient();

    // Get current pet stats
    const { data: statsData, error: statsError } = await supabase
      .from("pet_stats")
      .select("*")
      .eq("pet_id", petId)
      .single();

    if (statsError || !statsData) {
      console.error("Error fetching pet stats:", statsError);
      return { error: "Pet not found" };
    }

    // Get all achievement definitions
    const { data: achievements, error: achievError } = await supabase
      .from("achievement_definitions")
      .select("*");

    if (achievError || !achievements) {
      console.error("Error fetching achievements:", achievError);
      return { error: "Failed to fetch achievements" };
    }

    // Get already unlocked achievements
    const { data: unlockedData } = await supabase
      .from("pet_achievements")
      .select("achievement_id")
      .eq("pet_id", petId);

    const unlockedIds = new Set(
      (unlockedData || []).map((a) => a.achievement_id),
    );

    const newlyUnlocked: AchievementDefinition[] = [];

    // Check each achievement
    for (const achievement of achievements) {
      if (unlockedIds.has(achievement.id)) continue; // Already unlocked

      const condition = achievement.unlock_condition as Record<string, unknown>;

      let isUnlocked = false;

      // Check by condition type
      if (condition.type === "counter") {
        const stat = condition.stat as string;
        const value = condition.value as number;
        const currentValue = statsData[stat as keyof typeof statsData] || 0;
        isUnlocked = currentValue >= value;
      } else if (condition.type === "stat") {
        const stat = condition.stat as string;
        const value = condition.value as number;
        const currentValue = statsData[stat as keyof typeof statsData] || 0;
        isUnlocked = currentValue >= value;
      } else if (condition.type === "all_stats") {
        const value = condition.value as number;
        isUnlocked =
          statsData.happiness >= value &&
          statsData.hunger <= 100 - value &&
          statsData.energy >= value &&
          statsData.cleanliness >= value &&
          statsData.health >= value &&
          statsData.affection_level >= value;
      } else if (condition.type === "first_pat") {
        isUnlocked = statsData.total_pats >= 1;
      } else if (condition.type === "first_feed") {
        isUnlocked = statsData.total_feeds >= 1;
      } else if (condition.type === "first_play") {
        isUnlocked = statsData.total_plays >= 1;
      } else if (condition.type === "first_bath") {
        isUnlocked = statsData.total_baths >= 1;
      }

      if (isUnlocked) {
        // Unlock the achievement
        const { error } = await supabase.from("pet_achievements").insert([
          {
            pet_id: petId,
            achievement_id: achievement.id,
            achievement_type: achievement.category,
          },
        ]);

        if (!error) {
          newlyUnlocked.push(achievement);
          console.log(
            `[checkAndUnlockAchievements] 🏆 Unlocked: ${achievement.name}`,
          );
        }
      }
    }

    return {
      success: true,
      newlyUnlocked,
      count: newlyUnlocked.length,
    };
  } catch (error) {
    console.error("Error in checkAndUnlockAchievements:", error);
    return { error: "An unexpected error occurred" };
  }
}
