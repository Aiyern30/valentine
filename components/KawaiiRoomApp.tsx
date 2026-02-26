"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import HudBar from "./HudBar";
import BottomBar from "./BottomBar";
import Toast from "./Toast";
import { PetKind, PetBreed } from "@/types/pet";

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

export default function KawaiiRoomApp() {
  const [patCount, setPatCount] = useState(0);
  const [toastMsg, setToastMsg] = useState("");
  const [toastKey, setToastKey] = useState(0);
  const [daysTogether] = useState(1047);
  const [petKind, setPetKind] = useState<PetKind>("cat");
  const [petBreed, setPetBreed] = useState<PetBreed>("siamese");

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

  const handleAction = useCallback(
    (label: string) => {
      const msg = ACTION_MESSAGES[label] ?? `${label}!`;
      showToast(msg);
    },
    [showToast],
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
        background: "#fef3e8",
      }}
    >
      {/* Phaser canvas */}
      <PhaserGame
        onPetPatted={handlePetPatted}
        petKind={petKind}
        petBreed={petBreed}
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

      <BottomBar onAction={handleAction} />

      <Toast key={toastKey} message={toastMsg} visible={!!toastMsg} />
    </div>
  );
}
