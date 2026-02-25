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
  const catTypeRef = useRef<CatType>(catType);

  // Always keep the ref in sync with the latest catType
  catTypeRef.current = catType;

  // ✅ 1️⃣ Create Phaser game (RUNS ONLY ONCE)
  // ✅ 1️⃣ Create Phaser game (RUNS ONLY ONCE)
  useEffect(() => {
    let cancelled = false; // <-- KEY FIX: tracks if this effect was cleaned up

    console.log("[PhaserGame] Init effect running");
    if (!containerRef.current) {
      console.log("[PhaserGame] Skipping init - no container");
      return;
    }

    const init = async () => {
      console.log("[PhaserGame] Creating game...");
      const { createGame } = await import("@/game/gameConfig");

      // If cleanup ran while we were awaiting the import, abort
      if (cancelled) {
        console.log(
          "[PhaserGame] Init cancelled after import (StrictMode cleanup)",
        );
        return;
      }

      const game = createGame(containerRef.current!);
      gameRef.current = game;
      console.log("[PhaserGame] Game created");

      game.events.once("ready", () => {
        if (cancelled) {
          console.log(
            "[PhaserGame] Ready event fired but effect was cancelled, destroying game",
          );
          game.destroy(true);
          return;
        }

        console.log("[PhaserGame] Game ready event fired");
        const scene = game.scene.getScene("RoomScene") as RoomScene;
        sceneRef.current = scene;
        console.log("[PhaserGame] Scene reference set");

        scene.events.once("create", () => {
          if (cancelled) {
            console.log(
              "[PhaserGame] Scene create fired but effect was cancelled",
            );
            return;
          }
          console.log(
            "[PhaserGame] Scene create event fired, setting initial cat type:",
            catTypeRef.current,
          );
          scene.setCatType(catTypeRef.current);
        });
      });
    };

    init();

    return () => {
      console.log("[PhaserGame] Cleanup: destroying game");
      cancelled = true; // <-- Prevents the stale init from wiring up events
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
      sceneRef.current = null;
    };
  }, []);

  // ✅ 2️⃣ Sync catType changes
  useEffect(() => {
    console.log("\n========== CAT TYPE CHANGED ==========");
    console.log("[PhaserGame] catType prop changed to:", catType);
    console.log("[PhaserGame] sceneRef.current exists?", !!sceneRef.current);
    console.log("[PhaserGame] gameRef.current exists?", !!gameRef.current);

    if (sceneRef.current) {
      const isReady = sceneRef.current.isSceneReady();
      console.log("[PhaserGame] Scene isReady():", isReady);

      if (isReady) {
        console.log("[PhaserGame] ✅ Calling scene.setCatType(", catType, ")");
        sceneRef.current.setCatType(catType);
      } else {
        console.log("[PhaserGame] ❌ Scene not ready yet, cannot update");
      }
    } else {
      console.log("[PhaserGame] ❌ sceneRef.current is null!");
    }
    console.log("========== END CAT TYPE CHANGE ==========\n");
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
