import { useState, useEffect, useCallback } from "react";
import {
  getAchievementDefinitions,
  getUnlockedAchievements,
} from "@/lib/pet-achievements";
import { AchievementDefinition } from "@/lib/pet-achievements";

interface AchievementsProps {
  petId: string;
}

export default function PetAchievements({ petId }: AchievementsProps) {
  const [achievements, setAchievements] = useState<AchievementDefinition[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const loadAchievements = useCallback(async () => {
    try {
      const [allResult, unlockedResult] = await Promise.all([
        getAchievementDefinitions(),
        getUnlockedAchievements(petId),
      ]);

      if ("achievements" in allResult && allResult.achievements) {
        console.log(`[PetAchievements] Loaded ${allResult.achievements.length} total achievements`);
        setAchievements(allResult.achievements || []);
      }

      if ("achievements" in unlockedResult && unlockedResult.achievements) {
        const ids = new Set(
          (unlockedResult.achievements || []).map((a) => a.achievement_id),
        );
        console.log(`[PetAchievements] Pet has ${ids.size} unlocked achievements:`, Array.from(ids));
        setUnlockedIds(ids);
      }
    } catch (error) {
      console.error("Error loading achievements:", error);
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  const unlockedCount = unlockedIds.size;
  const totalCount = achievements.length;

  if (loading) {
    return <div className="text-center py-8">Loading achievements...</div>;
  }

  const groupedAchievements = achievements.reduce(
    (acc, achievement) => {
      const category = achievement.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(achievement);
      return acc;
    },
    {} as Record<string, AchievementDefinition[]>,
  );

  const categoryLabels: Record<string, string> = {
    beginner: "🌟 Getting Started",
    interaction: "🎮 Interaction Master",
    stats: "📊 Stats Enthusiast",
    combo: "🏆 Ultimate Caretaker",
    streak: "🔥 Dedication",
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-2">Pet Achievements</h2>
      <p className="text-gray-600 mb-6">
        {unlockedCount} / {totalCount} achievements unlocked
      </p>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div
          className="bg-linear-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
        />
      </div>

      {Object.entries(groupedAchievements).map(
        ([category, categoryAchievements]) => (
          <div key={category} className="mb-8">
            <h3 className="text-xl font-bold mb-4">
              {categoryLabels[category] || category}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoryAchievements.map((achievement) => {
                const isUnlocked = unlockedIds.has(achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isUnlocked
                        ? "bg-linear-to-br from-yellow-50 to-orange-50 border-yellow-400"
                        : "bg-gray-100 border-gray-300 opacity-60"
                    }`}
                  >
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <h4 className="font-semibold text-sm mb-1">
                      {achievement.name}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          achievement.rarity === "legendary"
                            ? "bg-purple-200 text-purple-800"
                            : achievement.rarity === "epic"
                              ? "bg-orange-200 text-orange-800"
                              : achievement.rarity === "rare"
                                ? "bg-blue-200 text-blue-800"
                                : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {achievement.rarity}
                      </span>
                      {isUnlocked && <span className="text-lg">✅</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ),
      )}
    </div>
  );
}
