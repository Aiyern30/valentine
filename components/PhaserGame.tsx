"use client";

import { useEffect, useRef } from "react";
import { PetKind, PetBreed, ActiveScene } from "@/types/pet";

const SCENE_KEYS: Record<ActiveScene, string> = {
  room: "RoomScene",
  sleep: "SleepScene",
  bath: "BathScene",
  feed: "FeedScene",
  play: "PlayScene",
};

export interface FoodItem {
  id: string;
  label: string;
  emoji: string;
}

interface PhaserGameProps {
  onPetPatted: () => void;
  onPetSplashed?: () => void;
  onPetFed?: (food: string) => void;
  onPetPlayed?: (toy: string) => void;
  petKind: PetKind;
  petBreed: PetBreed;
  activeScene: ActiveScene;
  selectedFood?: FoodItem | null;
  selectedToy?: string | null;
}

export default function PhaserGame({
  onPetPatted,
  onPetSplashed,
  onPetFed,
  onPetPlayed,
  petKind,
  petBreed,
  activeScene,
  selectedFood,
  selectedToy,
}: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const activeSceneRef = useRef(activeScene);
  const petKindRef = useRef(petKind);
  const petBreedRef = useRef(petBreed);

  // Keep refs in sync so callbacks & effects always read the latest value
  activeSceneRef.current = activeScene;
  petKindRef.current = petKind;
  petBreedRef.current = petBreed;

  // 1) Create Phaser game with all scenes (RUNS ONLY ONCE)
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    let destroyed = false;

    async function init() {
      const Phaser = (await import("phaser")).default;
      const { RoomScene } = await import("@/game/scenes/RoomScene");
      const { SleepScene } = await import("@/game/scenes/SleepScene");
      const { BathScene } = await import("@/game/scenes/BathScene");
      const { FeedScene } = await import("@/game/scenes/FeedScene");
      const { PlayScene } = await import("@/game/scenes/PlayScene");

      if (destroyed || !containerRef.current) return;

      const roomScene = new RoomScene();
      const sleepScene = new SleepScene();
      const bathScene = new BathScene();
      const feedScene = new FeedScene();
      const playScene = new PlayScene();

      const game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerRef.current,
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        transparent: true,
        scene: [roomScene, sleepScene, bathScene, feedScene, playScene],
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        physics: { default: "arcade", arcade: { debug: false } },
      });

      gameRef.current = game;

      // Listen for events on all scenes
      roomScene.events.on("petPatted", () => onPetPatted());
      bathScene.events.on("petSplashed", () => onPetSplashed?.());
      feedScene.events.on("petFed", (food: string) => onPetFed?.(food));
      playScene.events.on("petPlayed", (toy: string) => onPetPlayed?.(toy));

      // The first scene (RoomScene) starts automatically.
      // If activeScene is not "room", switch after creation.
      game.events.once("ready", () => {
        if (destroyed) return;
        const targetKey = SCENE_KEYS[activeSceneRef.current];
        if (targetKey !== "RoomScene") {
          game.scene.stop("RoomScene");
          game.scene.start(targetKey, {
            petKind: petKindRef.current,
            petBreed: petBreedRef.current,
          });
        }
      });
    }

    init();

    return () => {
      destroyed = true;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Handle scene switching -- always pass latest pet data when starting a scene
  useEffect(() => {
    const game = gameRef.current;
    if (!game) return;

    const targetKey = SCENE_KEYS[activeScene];

    // Stop all scenes except the target
    Object.values(SCENE_KEYS).forEach((key) => {
      if (key !== targetKey && game.scene.isActive(key)) {
        game.scene.stop(key);
      }
    });

    // Always (re)start the target scene with latest pet data so
    // breed changes made while in another scene are picked up.
    if (!game.scene.isActive(targetKey)) {
      game.scene.start(targetKey, {
        petKind: petKindRef.current,
        petBreed: petBreedRef.current,
      });
    }
  }, [activeScene]);

  // 3) Update pet when kind or breed changes within the current scene
  useEffect(() => {
    const game = gameRef.current;
    if (!game) return;

    const targetKey = SCENE_KEYS[activeSceneRef.current];

    function tryUpdate() {
      const scene = game!.scene.getScene(targetKey);
      if (scene && "setPetType" in scene) {
        const s = scene as {
          isSceneReady: () => boolean;
          setPetType: (k: PetKind, b: PetBreed) => void;
        };
        if (s.isSceneReady()) {
          s.setPetType(petKind, petBreed);
          return true;
        }
      }
      return false;
    }

    if (tryUpdate()) return;

    // Poll briefly if scene not ready
    const interval = setInterval(() => {
      if (tryUpdate()) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [petKind, petBreed]);

  // 4) Pass selected food to FeedScene
  useEffect(() => {
    const game = gameRef.current;
    if (!game || activeSceneRef.current !== "feed" || !selectedFood) return;

    const scene = game.scene.getScene("FeedScene");
    if (scene && "feedPet" in scene) {
      (scene as { feedPet: (food: FoodItem) => void }).feedPet(selectedFood);
    }
  }, [selectedFood]);

  // 5) Pass selected toy to PlayScene
  useEffect(() => {
    const game = gameRef.current;
    if (!game || activeSceneRef.current !== "play" || !selectedToy) return;

    const scene = game.scene.getScene("PlayScene");
    if (scene && "playWith" in scene) {
      // Extract toy ID from timestamped string (e.g. "ball_1234567890" -> "ball")
      const toyId = selectedToy.split("_")[0];
      (scene as { playWith: (toy: string) => void }).playWith(toyId);
    }
  }, [selectedToy]);

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
