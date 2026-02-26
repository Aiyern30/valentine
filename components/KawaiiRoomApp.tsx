"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import HudBar from "./HudBar";
import BottomBar from "./BottomBar";
import Toast from "./Toast";
import { CatType } from "@/types/cat";

// Dynamically import PhaserGame with no SSR
const PhaserGame = dynamic(() => import("./PhaserGame"), { ssr: false });

const PAT_MESSAGES = [
  "So fluffy!",
  "Purr purr...",
  "Mochi loves you!",
  "Mochi is happy!",
  "Head bumps!",
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
  const [catType, setCatType] = useState<CatType>("siamese");

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastKey((k) => k + 1);
  }, []);

  const handleCatPatted = useCallback(() => {
    setPatCount((c) => c + 1);
    const msg = PAT_MESSAGES[Math.floor(Math.random() * PAT_MESSAGES.length)];
    showToast(msg);
  }, [showToast]);

  const handleAction = useCallback(
    (label: string) => {
      const msg = ACTION_MESSAGES[label] ?? `${label}!`;
      showToast(msg);
    },
    [showToast],
  );

  return (
    // Must have explicit height - 100svh works on mobile too
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100svh",
        overflow: "hidden",
        background: "#fef3e8",
      }}
    >
      {/* Phaser canvas - absolutely fills the whole background */}
      <PhaserGame onCatPatted={handleCatPatted} catType={catType} />

      {/* React UI overlays */}
      <HudBar
        petName="Mochi"
        daysTogther={daysTogether}
        patCount={patCount}
        catType={catType}
        onCatTypeChange={setCatType}
      />

      <BottomBar onAction={handleAction} />

      <Toast key={toastKey} message={toastMsg} visible={!!toastMsg} />
    </div>
  );
}
