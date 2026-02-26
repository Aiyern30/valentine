"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import HudBar from "./HudBar";
import BottomBar from "./BottomBar";
import Toast from "./Toast";
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

const ACTION_MESSAGES: Record<string, string> = {
  "Dress Up": "Trying on outfits!",
  Feed: "Nom nom nom!",
  Play: "Yay, play time!",
  Bath: "Splish splash!",
  Sleep: "Sweet dreams...",
};

const SPLASH_MESSAGES = [
  "Splish splash!",
  "So bubbly!",
  "Squeaky clean!",
  "Bubble party!",
  "Water fight!",
];

export default function KawaiiRoomApp() {
  const [patCount, setPatCount] = useState(0);
  const [toastMsg, setToastMsg] = useState("");
  const [toastKey, setToastKey] = useState(0);
  const [daysTogether] = useState(1047);
  const [petKind, setPetKind] = useState<PetKind>("cat");
  const [petBreed, setPetBreed] = useState<PetBreed>("siamese");
  const [activeScene, setActiveScene] = useState<ActiveScene>("room");

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

  const handleAction = useCallback(
    (label: string) => {
      if (label === "Sleep") {
        // Toggle sleep scene
        setActiveScene((prev) => (prev === "sleep" ? "room" : "sleep"));
        if (activeScene !== "sleep") {
          showToast("Sweet dreams...");
        } else {
          showToast("Good morning!");
        }
        return;
      }

      if (label === "Bath") {
        // Toggle bath scene
        setActiveScene((prev) => (prev === "bath" ? "room" : "bath"));
        if (activeScene !== "bath") {
          showToast("Bath time!");
        } else {
          showToast("All clean!");
        }
        return;
      }

      // Other actions: toast only, return to room
      const msg = ACTION_MESSAGES[label] ?? `${label}!`;
      showToast(msg);
      if (activeScene !== "room") {
        setActiveScene("room");
      }
    },
    [showToast, activeScene],
  );

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
        background:
          activeScene === "sleep"
            ? "#0e0e2a"
            : activeScene === "bath"
              ? "#d8eef8"
              : "#fef3e8",
        transition: "background-color 0.5s ease",
      }}
    >
      {/* Phaser canvas */}
      <PhaserGame
        onPetPatted={handlePetPatted}
        onPetSplashed={handlePetSplashed}
        petKind={petKind}
        petBreed={petBreed}
        activeScene={activeScene}
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

      <BottomBar onAction={handleAction} activeScene={activeScene} />

      <Toast key={toastKey} message={toastMsg} visible={!!toastMsg} />
    </div>
  );
}
