"use client";

import { useEffect, useRef } from "react";
import type Phaser from "phaser";
import type { RoomScene } from "@/game/scenes/RoomScene";
import { CatType } from "@/types/cat";

interface PhaserGameProps {
  onCatPatted?: () => void;
  catType: CatType;
}

export default function PhaserGame({ onCatPatted, catType }: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<RoomScene | null>(null);
  const initialCatTypeRef = useRef<CatType>(catType);

  // ✅ 1️⃣ Create Phaser game (RUNS ONLY ONCE)
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const init = async () => {
      const { createGame } = await import("@/game/gameConfig");
      const game = createGame(containerRef.current!);
      gameRef.current = game;

      // Wait for the game to be ready, THEN get the scene
      game.events.once("ready", () => {
        const scene = game.scene.getScene("RoomScene") as RoomScene;
        sceneRef.current = scene;

        // Wait for the scene to fully create before syncing catType
        scene.events.once("create", () => {
          scene.setCatType(initialCatTypeRef.current);
        });
      });
    };

    init();

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  // ✅ 2️⃣ Sync catType changes
  useEffect(() => {
    console.log("[PhaserGame] catType changed to:", catType);
    if (sceneRef.current && sceneRef.current.isSceneReady()) {
      console.log("[PhaserGame] Calling scene.setCatType...");
      sceneRef.current.setCatType(catType);
    } else {
      console.log("[PhaserGame] Scene not ready, catType:", catType);
    }
  }, [catType]);

  // ✅ 3️⃣ Sync onCatPatted safely (prevents stale closure)
  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;

    if (onCatPatted) {
      scene.events.on("catPatted", onCatPatted);
    }

    return () => {
      if (onCatPatted) {
        scene.events.off("catPatted", onCatPatted);
      }
    };
  }, [onCatPatted]);

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
