"use client";

import { useEffect, useRef } from "react";
import { PetKind, PetBreed } from "@/types/pet";

interface PhaserGameProps {
  onPetPatted: () => void;
  petKind: PetKind;
  petBreed: PetBreed;
}

export default function PhaserGame({
  onPetPatted,
  petKind,
  petBreed,
}: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<import("@/game/scenes/RoomScene").RoomScene | null>(
    null,
  );
  const petKindRef = useRef(petKind);
  const petBreedRef = useRef(petBreed);

  // Keep refs in sync
  petKindRef.current = petKind;
  petBreedRef.current = petBreed;

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    let destroyed = false;

    async function init() {
      const Phaser = (await import("phaser")).default;
      const { RoomScene } = await import("@/game/scenes/RoomScene");

      if (destroyed || !containerRef.current) return;

      const scene = new RoomScene();
      sceneRef.current = scene;

      const game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerRef.current,
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        transparent: true,
        scene: scene,
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        physics: { default: "arcade", arcade: { debug: false } },
      });

      gameRef.current = game;

      // Listen for pat events
      scene.events.on("petPatted", () => {
        onPetPatted();
      });
    }

    init();

    return () => {
      destroyed = true;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        sceneRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update pet when kind or breed changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (scene && scene.isSceneReady()) {
      scene.setPetType(petKind, petBreed);
    } else {
      // Scene might not be ready yet, poll briefly
      const interval = setInterval(() => {
        const s = sceneRef.current;
        if (s && s.isSceneReady()) {
          s.setPetType(petKindRef.current, petBreedRef.current);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [petKind, petBreed]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    />
  );
}
