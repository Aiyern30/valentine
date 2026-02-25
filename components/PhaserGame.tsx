"use client";

import { useEffect, useRef } from "react";
import type Phaser from "phaser";

interface PhaserGameProps {
  onCatPatted?: () => void;
}

export default function PhaserGame({ onCatPatted }: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    // Dynamic import to avoid SSR issues
    (async () => {
      const { createGame } = await import("@/game/gameConfig");
      const game = createGame(containerRef.current!);
      gameRef.current = game;

      // Wait for scene to be ready then hook up events
      game.events.once("ready", () => {
        const scene = game.scene.getScene("RoomScene");
        if (scene && onCatPatted) {
          scene.events.on("catPatted", onCatPatted);
        }
      });
    })();

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ touchAction: "none" }}
    />
  );
}
