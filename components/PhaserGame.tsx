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

    const container = containerRef.current;

    // Small delay so the DOM has painted and clientWidth/Height are real
    const timer = setTimeout(async () => {
      const { createGame } = await import("@/game/gameConfig");
      const game = createGame(container);
      gameRef.current = game;

      // Hook up cat pat event after scene boots
      game.events.once("ready", () => {
        const scene = game.scene.getScene("RoomScene");
        if (scene && onCatPatted) {
          scene.events.on("catPatted", onCatPatted);
        }
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
