"use client";
import type { RoomScene } from "@/game/scenes/RoomScene";
import { useEffect, useRef } from "react";
import type Phaser from "phaser";
import { CatType } from "@/types/cat";

interface PhaserGameProps {
  onCatPatted?: () => void;
  catType: CatType;
}

export default function PhaserGame({ onCatPatted, catType }: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<RoomScene | null>(null);
  // 🎮 Create game once
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const container = containerRef.current;

    const init = async () => {
      const { createGame } = await import("@/game/gameConfig");
      const game = createGame(container);
      gameRef.current = game;

      game.events.once("ready", () => {
        const scene = game.scene.getScene("RoomScene") as RoomScene;
        sceneRef.current = scene;

        // connect pat event
        if (scene && onCatPatted) {
          scene.events.on("catPatted", onCatPatted);
        }

        // 👇 set initial cat type
        if (scene) {
          scene.setCatType(catType);
        }
      });
    };

    init();

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [catType, onCatPatted]);

  // 🐱 React → Phaser sync
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setCatType(catType);
    }
  }, [catType]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
}
