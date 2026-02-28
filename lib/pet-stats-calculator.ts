// Pure calculation utilities for pet stats (no server operations)
// This file does NOT have "use server" so functions can be synchronous

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

// Calculate mood based on stats
export function calculateMood(stats: {
  happiness: number;
  hunger: number;
  energy: number;
  cleanliness: number;
  health: number;
}): string {
  const avgStat = (stats.happiness + stats.energy + stats.health) / 3;
  const hungerPenalty = Math.max(0, 100 - stats.hunger) / 20; // Hunger penalty
  const cleanlinessBonus = stats.cleanliness / 20;

  const finalScore = avgStat - hungerPenalty + cleanlinessBonus;

  if (finalScore >= 85) return "ecstatic";
  if (finalScore >= 70) return "happy";
  if (finalScore >= 50) return "content";
  if (finalScore >= 30) return "sad";
  return "upset";
}

// Update stats based on interaction type
export function updateStatsForInteraction(
  currentStats: {
    happiness: number;
    hunger: number;
    energy: number;
    cleanliness: number;
    health: number;
    affection_level?: number;
  },
  interactionType: "pat" | "feed" | "play" | "bath" | "sleep",
): {
  updated: PetStatsUpdate;
  moodBefore: string;
  moodAfter: string;
} {
  const moodBefore = calculateMood(currentStats);
  const updates: PetStatsUpdate = {};

  switch (interactionType) {
    case "pat":
      updates.happiness = Math.min(100, currentStats.happiness + 15);
      updates.affection_level = Math.min(
        100,
        (currentStats.affection_level || 50) + 10,
      );
      updates.energy = Math.max(0, currentStats.energy - 5);
      updates.total_pats = (updates.total_pats || 0) + 1;
      break;

    case "feed":
      updates.hunger = Math.max(0, currentStats.hunger - 30);
      updates.health = Math.min(100, currentStats.health + 5);
      updates.energy = Math.max(0, currentStats.energy - 10);
      updates.happiness = Math.min(100, currentStats.happiness + 10);
      updates.total_feeds = (updates.total_feeds || 0) + 1;
      updates.last_fed = new Date();
      break;

    case "play":
      updates.happiness = Math.min(100, currentStats.happiness + 20);
      updates.energy = Math.max(0, currentStats.energy - 25);
      updates.hunger = Math.min(100, currentStats.hunger + 10);
      updates.affection_level = Math.min(
        100,
        (currentStats.affection_level || 50) + 15,
      );
      updates.total_plays = (updates.total_plays || 0) + 1;
      updates.last_played = new Date();
      break;

    case "bath":
      updates.cleanliness = Math.min(100, currentStats.cleanliness + 30);
      updates.health = Math.min(100, currentStats.health + 10);
      updates.happiness = Math.max(0, currentStats.happiness - 10); // Pets don't like baths
      updates.energy = Math.max(0, currentStats.energy - 15);
      updates.total_baths = (updates.total_baths || 0) + 1;
      updates.last_bathed = new Date();
      break;

    case "sleep":
      updates.energy = Math.min(100, currentStats.energy + 40);
      updates.health = Math.min(100, currentStats.health + 10);
      updates.hunger = Math.min(100, currentStats.hunger + 5);
      updates.last_slept = new Date();
      break;
  }

  // Calculate new stats for mood calculation
  const newStats = {
    happiness: updates.happiness ?? currentStats.happiness,
    hunger: updates.hunger ?? currentStats.hunger,
    energy: updates.energy ?? currentStats.energy,
    cleanliness: updates.cleanliness ?? currentStats.cleanliness,
    health: updates.health ?? currentStats.health,
    affection_level:
      updates.affection_level ?? currentStats.affection_level ?? 50,
  };

  const moodAfter = calculateMood(newStats);
  updates.current_mood = moodAfter;

  return { updated: updates, moodBefore, moodAfter };
}
