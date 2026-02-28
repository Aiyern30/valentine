"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import HudBar from "./HudBar";
import BottomBar from "./BottomBar";
import Toast from "./Toast";
import FoodSelector, { FoodItem } from "./FoodSelector";
import ToySelector, { ToyItem } from "./ToySelector";
import PetRegistrationDialog from "./PetRegistrationDialog";
import { PetKind, PetBreed, ActiveScene } from "@/types/pet";
import { getPetsForCurrentUser } from "@/lib/actions";
import { handlePetInteraction } from "@/lib/pet-interactions";
import { Pet } from "@/types";
import AchievementUnlockDialog from "./AchievementUnlockDialog";
import { AchievementDefinition } from "@/lib/pet-achievements";

// Dynamically import PhaserGame with no SSR
const PhaserGame = dynamic(() => import("./PhaserGame"), { ssr: false });

const PAT_MESSAGES_CAT = [
  "So fluffy!",
  "Purr purr...",
  "Mochi loves you!",
  "Mochi is happy!",
  "Head bumps!",
];

const PAT_MESSAGES_DOG = [
  "Tail wagging!",
  "Woof woof!",
  "So happy!",
  "Good boy!",
  "Belly rubs!",
];

const SPLASH_MESSAGES = [
  "Splish splash!",
  "So bubbly!",
  "Squeaky clean!",
  "Bubble party!",
  "Water fight!",
];

const PLAY_MESSAGES = [
  "So much fun!",
  "Play time!",
  "Yay!",
  "Again again!",
  "Good catch!",
];

const SCENE_BG: Record<ActiveScene, string> = {
  room: "#fef3e8",
  sleep: "#0e0e2a",
  bath: "#d8eef8",
  feed: "#fff5e6",
  play: "#e8f5e9",
};

export default function KawaiiRoomApp() {
  const [patCount, setPatCount] = useState(0);
  const [toastMsg, setToastMsg] = useState("");
  const [toastKey, setToastKey] = useState(0);
  const [daysTogether] = useState(1047);
  const [petKind, setPetKind] = useState<PetKind | null>(null);
  const [petBreed, setPetBreed] = useState<PetBreed | null>(null);
  const [petName, setPetName] = useState("");
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [activeScene, setActiveScene] = useState<ActiveScene>("room");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [selectedToy, setSelectedToy] = useState<string | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPetDataReady, setIsPetDataReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const userIdRef = useRef<string | null>(null);
  const [unlockedAchievement, setUnlockedAchievement] =
    useState<AchievementDefinition | null>(null);
  const [achievementQueue, setAchievementQueue] = useState<
    AchievementDefinition[]
  >([]);

  // Get current user ID
  useEffect(() => {
    const getUserId = async () => {
      // Import client-side supabase
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = await createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        console.log("[KawaiiRoomApp] User ID set:", user.id);
        setUserId(user.id);
        userIdRef.current = user.id;
      } else {
        console.warn("[KawaiiRoomApp] No user found");
      }
    };

    getUserId();
  }, []);

  // Fetch all registered pets on mount
  useEffect(() => {
    const fetchPets = async () => {
      setIsLoading(true);
      const result = await getPetsForCurrentUser();

      if (result.error) {
        console.warn("Could not fetch pets:", result.error);
        setShowRegistration(true);
      } else if (result.pets && result.pets.length > 0) {
        // Pets exist, use the first one
        setAllPets(result.pets);
        const firstPet = result.pets[0];
        setPetName(firstPet.pet_name);
        setPetKind(firstPet.pet_type as PetKind);
        setPetBreed(firstPet.pet_breed as PetBreed);
        setSelectedPetId(firstPet.id);
        setIsPetDataReady(true);
      } else {
        // No pets found, show registration
        setShowRegistration(true);
      }

      setIsLoading(false);
    };

    fetchPets();
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastKey((k) => k + 1);
  }, []);

  const handlePetPatted = useCallback(() => {
    setPatCount((c) => c + 1);
    console.log("[handlePetPatted] 🐾 Tapped pet!", {
      petKind,
      selectedPetId,
      userId: userIdRef.current,
    });

    if (!petKind || !selectedPetId || !userIdRef.current) {
      console.warn("[handlePetPatted] ❌ Missing required data:", {
        petKind: !!petKind,
        selectedPetId: !!selectedPetId,
        userId: !!userIdRef.current,
      });
      showToast("Error: Missing pet data!");
      return;
    }

    const msgs = petKind === "cat" ? PAT_MESSAGES_CAT : PAT_MESSAGES_DOG;
    const msg = msgs[Math.floor(Math.random() * msgs.length)];
    showToast(msg);

    // Record interaction in database
    (async () => {
      console.log("[handlePetPatted] 📤 Recording interaction...");
      const result = await handlePetInteraction(
        selectedPetId,
        userIdRef.current!,
        "pat",
      );

      console.log("[handlePetPatted] 📥 Interaction result:", result);

      if ("error" in result && result.error) {
        console.error(
          "[handlePetPatted] ❌ Failed to record pat interaction:",
          {
            error: result.error,
            details: "details" in result ? result.details : "N/A",
          },
        );
        showToast(`Error: ${result.error}`);
      } else if (
        "success" in result &&
        result.success &&
        "moodBefore" in result
      ) {
        console.log(
          "[handlePetPatted] ✅ Pat interaction recorded successfully!",
          {
            before: result.moodBefore,
            after: result.moodAfter,
            statsUpdated: !!result.stats,
          },
        );

        // Check for newly unlocked achievements
        if (
          result.achievements?.success &&
          result.achievements.newlyUnlocked.length > 0
        ) {
          console.log(
            "[handlePetPatted] 🏆 New achievements unlocked:",
            result.achievements.newlyUnlocked,
          );
          // Add to queue to show one by one
          setAchievementQueue((prev) => [
            ...prev,
            ...(result.achievements?.newlyUnlocked || []),
          ]);
        }
      }
    })();
  }, [showToast, petKind, selectedPetId]);

  const handlePetSplashed = useCallback(() => {
    if (!selectedPetId || !userIdRef.current) return;

    const msg =
      SPLASH_MESSAGES[Math.floor(Math.random() * SPLASH_MESSAGES.length)];
    showToast(msg);

    // Record interaction in database
    (async () => {
      const result = await handlePetInteraction(
        selectedPetId,
        userIdRef.current!,
        "bath",
      );

      if ("error" in result && result.error) {
        console.warn("Failed to record bath interaction:", result.error);
      } else if (
        "success" in result &&
        result.success &&
        "moodBefore" in result
      ) {
        console.log("Bath interaction recorded:", {
          before: result.moodBefore,
          after: result.moodAfter,
        });

        // Check for newly unlocked achievements
        if (
          result.achievements?.success &&
          result.achievements.newlyUnlocked.length > 0
        ) {
          setAchievementQueue((prev) => [
            ...prev,
            ...(result.achievements?.newlyUnlocked || []),
          ]);
        }
      }
    })();
  }, [showToast, selectedPetId]);

  const handlePetFed = useCallback(
    (food: string) => {
      if (!selectedPetId || !userIdRef.current) return;

      showToast(`${petName} loved the ${food}!`);

      // Record interaction in database
      (async () => {
        const result = await handlePetInteraction(
          selectedPetId,
          userIdRef.current!,
          "feed",
        );

        if ("error" in result && result.error) {
          console.warn("Failed to record feed interaction:", result.error);
        } else if (
          "success" in result &&
          result.success &&
          "moodBefore" in result
        ) {
          console.log("Feed interaction recorded:", {
            before: result.moodBefore,
            after: result.moodAfter,
            food,
          });

          // Check for newly unlocked achievements
          if (
            result.achievements?.success &&
            result.achievements.newlyUnlocked.length > 0
          ) {
            setAchievementQueue((prev) => [
              ...prev,
              ...(result.achievements?.newlyUnlocked || []),
            ]);
          }
        }
      })();
    },
    [showToast, petName, selectedPetId],
  );

  const handlePetPlayed = useCallback(() => {
    if (!selectedPetId || !userIdRef.current) return;

    const msg = PLAY_MESSAGES[Math.floor(Math.random() * PLAY_MESSAGES.length)];
    showToast(msg);

    // Record interaction in database
    (async () => {
      const result = await handlePetInteraction(
        selectedPetId,
        userIdRef.current!,
        "play",
      );

      if ("error" in result && result.error) {
        console.warn("Failed to record play interaction:", result.error);
      } else if (
        "success" in result &&
        result.success &&
        "moodBefore" in result
      ) {
        console.log("Play interaction recorded:", {
          before: result.moodBefore,
          after: result.moodAfter,
        });

        // Check for newly unlocked achievements
        if (
          result.achievements?.success &&
          result.achievements.newlyUnlocked.length > 0
        ) {
          setAchievementQueue((prev) => [
            ...prev,
            ...(result.achievements?.newlyUnlocked || []),
          ]);
        }
      }
    })();
  }, [showToast, selectedPetId]);

  const handleAction = useCallback(
    (label: string) => {
      const sceneMap: Record<string, ActiveScene> = {
        Feed: "feed",
        Play: "play",
        Bath: "bath",
        Sleep: "sleep",
      };

      const targetScene = sceneMap[label];

      if (targetScene) {
        // Toggle: if already on this scene, go back to room
        if (activeScene === targetScene) {
          setActiveScene("room");
          const returnMessages: Record<string, string> = {
            feed: "Back home!",
            play: "That was fun!",
            bath: "All clean!",
            sleep: "Good morning!",
          };
          showToast(returnMessages[targetScene] || "Back home!");
        } else {
          setActiveScene(targetScene);
          const enterMessages: Record<string, string> = {
            feed: "Feeding time!",
            play: "Play time!",
            bath: "Bath time!",
            sleep: "Sweet dreams...",
          };
          showToast(enterMessages[targetScene] || `${label}!`);
        }
        return;
      }

      // Fallback: toast only, return to room
      showToast(`${label}!`);
      if (activeScene !== "room") {
        setActiveScene("room");
      }
    },
    [showToast, activeScene],
  );

  const handleSelectFood = useCallback((food: FoodItem) => {
    // Each click sends a new food item to the scene (use a new ref each time)
    setSelectedFood({ ...food });
  }, []);

  const handleSelectToy = useCallback((toy: ToyItem) => {
    setSelectedToy(toy.id + "_" + Date.now());
  }, []);

  const handlePetChange = useCallback(
    (petId: string) => {
      console.log("[KawaiiRoomApp] handlePetChange called with petId:", petId);
      const selectedPet = allPets.find((p) => p.id === petId);
      console.log("[KawaiiRoomApp] Found pet:", selectedPet);
      if (selectedPet) {
        setSelectedPetId(petId);
        setPetName(selectedPet.pet_name);
        console.log(
          "[KawaiiRoomApp] Setting petKind to:",
          selectedPet.pet_type,
        );
        setPetKind(selectedPet.pet_type as PetKind);
        console.log(
          "[KawaiiRoomApp] Setting petBreed to:",
          selectedPet.pet_breed,
        );
        setPetBreed(selectedPet.pet_breed as PetBreed);
        showToast(`Switched to ${selectedPet.pet_name}!`);
      }
    },
    [allPets, showToast],
  );

  const handleAddPet = useCallback(() => {
    setShowRegistration(true);
  }, []);

  const handleCancelRegistration = useCallback(() => {
    setShowRegistration(false);
  }, []);

  const handlePetRegistered = useCallback(
    async (name: string, kind: PetKind, breed: PetBreed) => {
      setPetName(name);
      setPetKind(kind);
      setPetBreed(breed);
      setShowRegistration(false);
      setIsPetDataReady(true);
      showToast(`Welcome ${name}! 🎉`);

      // Fetch updated pet list
      const result = await getPetsForCurrentUser();
      if (result.pets) {
        setAllPets(result.pets);
        const newPet = result.pets.find((p) => p.pet_name === name);
        if (newPet) {
          setSelectedPetId(newPet.id);
        }
      }
    },
    [showToast],
  );

  // Handle achievement queue - show one achievement at a time
  useEffect(() => {
    if (achievementQueue.length > 0 && !unlockedAchievement) {
      // Show the first achievement in queue
      setUnlockedAchievement(achievementQueue[0]);
      // Remove it from queue
      setAchievementQueue((prev) => prev.slice(1));
    }
  }, [achievementQueue, unlockedAchievement]);

  const handleCloseAchievement = () => {
    setUnlockedAchievement(null);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100svh",
        overflow: "hidden",
        background: SCENE_BG[activeScene],
        transition: "background-color 0.5s ease",
      }}
    >
      {/* Loading state */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl px-8 py-6">
            <p className="text-pink-500 font-bold">Loading your pet...</p>
          </div>
        </div>
      )}

      {/* Pet Registration Dialog */}
      {showRegistration && (
        <PetRegistrationDialog
          onPetRegistered={handlePetRegistered}
          onCancel={allPets.length > 0 ? handleCancelRegistration : undefined}
        />
      )}

      {/* Phaser canvas - only render when pet data is confirmed */}
      {isPetDataReady && petKind && petBreed && (
        <>
          <PhaserGame
            onPetPatted={handlePetPatted}
            onPetSplashed={handlePetSplashed}
            onPetFed={handlePetFed}
            onPetPlayed={handlePetPlayed}
            petKind={petKind}
            petBreed={petBreed}
            activeScene={activeScene}
            selectedFood={selectedFood}
            selectedToy={selectedToy}
          />

          {/* React UI overlays */}
          {isPetDataReady && petKind && petBreed && (
            <HudBar
              petName={petName}
              daysTogther={daysTogether}
              patCount={patCount}
              petKind={petKind}
              petBreed={petBreed}
              allPets={allPets}
              selectedPetId={selectedPetId}
              onPetChange={handlePetChange}
              onAddPet={handleAddPet}
            />
          )}

          {/* Contextual selectors */}
          {activeScene === "feed" && petKind && (
            <FoodSelector petKind={petKind} onSelectFood={handleSelectFood} />
          )}
          {activeScene === "play" && petKind && (
            <ToySelector petKind={petKind} onSelectToy={handleSelectToy} />
          )}

          <BottomBar onAction={handleAction} activeScene={activeScene} />

          <Toast key={toastKey} message={toastMsg} visible={!!toastMsg} />
        </>
      )}

      {/* Achievement Unlock Dialog */}
      <AchievementUnlockDialog
        achievement={unlockedAchievement}
        onClose={handleCloseAchievement}
      />
    </div>
  );
}
