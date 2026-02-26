"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import HudBar from "./HudBar";
import BottomBar from "./BottomBar";
import Toast from "./Toast";
import FoodSelector, { FoodItem } from "./FoodSelector";
import ToySelector, { ToyItem } from "./ToySelector";
import { PetKind, PetBreed, ActiveScene } from "@/types/pet";

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
  const [petKind, setPetKind] = useState<PetKind>("cat");
  const [petBreed, setPetBreed] = useState<PetBreed>("siamese");
  const [activeScene, setActiveScene] = useState<ActiveScene>("room");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [selectedToy, setSelectedToy] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastKey((k) => k + 1);
  }, []);

  const handlePetPatted = useCallback(() => {
    setPatCount((c) => c + 1);
    const msgs = petKind === "cat" ? PAT_MESSAGES_CAT : PAT_MESSAGES_DOG;
    const msg = msgs[Math.floor(Math.random() * msgs.length)];
    showToast(msg);
  }, [showToast, petKind]);

  const handlePetSplashed = useCallback(() => {
    const msg =
      SPLASH_MESSAGES[Math.floor(Math.random() * SPLASH_MESSAGES.length)];
    showToast(msg);
  }, [showToast]);

  const handlePetFed = useCallback(
    (food: string) => {
      showToast(`${petKind === "cat" ? "Mochi" : "Buddy"} loved the ${food}!`);
    },
    [showToast, petKind],
  );

  const handlePetPlayed = useCallback(() => {
    const msg = PLAY_MESSAGES[Math.floor(Math.random() * PLAY_MESSAGES.length)];
    showToast(msg);
  }, [showToast]);

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

  const handlePetKindChange = useCallback((kind: PetKind) => {
    setPetKind(kind);
  }, []);

  const handlePetBreedChange = useCallback((breed: PetBreed) => {
    setPetBreed(breed);
  }, []);

  const petName = petKind === "cat" ? "Mochi" : "Buddy";

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
      {/* Phaser canvas */}
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
      <HudBar
        petName={petName}
        daysTogther={daysTogether}
        patCount={patCount}
        petKind={petKind}
        petBreed={petBreed}
        onPetKindChange={handlePetKindChange}
        onPetBreedChange={handlePetBreedChange}
      />

      {/* Contextual selectors */}
      {activeScene === "feed" && (
        <FoodSelector petKind={petKind} onSelectFood={handleSelectFood} />
      )}
      {activeScene === "play" && (
        <ToySelector petKind={petKind} onSelectToy={handleSelectToy} />
      )}

      <BottomBar onAction={handleAction} activeScene={activeScene} />

      <Toast key={toastKey} message={toastMsg} visible={!!toastMsg} />
    </div>
  );
}
