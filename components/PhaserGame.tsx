"use client";

import { useEffect, useRef, useState } from "react";
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
  const [isGameReady, setIsGameReady] = useState(false);

  // 🔥 FIX: Store callbacks in refs to avoid stale closure issues
  const onPetPattedRef = useRef(onPetPatted);
  const onPetSplashedRef = useRef(onPetSplashed);
  const onPetFedRef = useRef(onPetFed);
  const onPetPlayedRef = useRef(onPetPlayed);

  // Keep refs in sync so callbacks & effects always read the latest value
  activeSceneRef.current = activeScene;
  petKindRef.current = petKind;
  petBreedRef.current = petBreed;

  // 🔥 FIX: Update callback refs whenever they change
  onPetPattedRef.current = onPetPatted;
  onPetSplashedRef.current = onPetSplashed;
  onPetFedRef.current = onPetFed;
  onPetPlayedRef.current = onPetPlayed;

  // 1) Create Phaser game with all scenes (RUNS ONLY ONCE)
  useEffect(() => {
    if (!containerRef.current || gameRef.current) {
      return;
    }

    let destroyed = false;

    async function init() {
      try {
        const Phaser = (await import("phaser")).default;

        const { RoomScene } = await import("@/game/scenes/RoomScene");
        const { SleepScene } = await import("@/game/scenes/SleepScene");
        const { BathScene } = await import("@/game/scenes/BathScene");
        const { FeedScene } = await import("@/game/scenes/FeedScene");
        const { PlayScene } = await import("@/game/scenes/PlayScene");

        if (destroyed || !containerRef.current) {
          return;
        }

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
        setIsGameReady(true);

        // 🔥 FIX: Attach listeners AFTER game is ready and scenes are initialized
        game.events.once("ready", () => {
          const roomSceneFromGame = game.scene.getScene("RoomScene");
          if (roomSceneFromGame) {
            roomSceneFromGame.events.on("petPatted", () => {
              onPetPattedRef.current?.();
            });
          }

          const bathSceneFromGame = game.scene.getScene("BathScene");
          if (bathSceneFromGame) {
            bathSceneFromGame.events.on("petSplashed", () => {
              onPetSplashedRef.current?.();
            });
          }

          const feedSceneFromGame = game.scene.getScene("FeedScene");
          if (feedSceneFromGame) {
            feedSceneFromGame.events.on("petFed", (food: string) => {
              onPetFedRef.current?.(food);
            });
          }

          const playSceneFromGame = game.scene.getScene("PlayScene");
          if (playSceneFromGame) {
            playSceneFromGame.events.on("petPlayed", (toy: string) => {
              onPetPlayedRef.current?.(toy);
            });
          }

          // Also set initial pet data in the same ready handler
          const setInitialPet = (scene: Phaser.Scene) => {
            if (scene && "setPetType" in scene) {
              (
                scene as { setPetType: (k: PetKind, b: PetBreed) => void }
              ).setPetType(petKindRef.current, petBreedRef.current);
            }
          };

          if (destroyed) return;

          // Set pet on room scene first
          const roomSceneForPet = game.scene.getScene("RoomScene");
          if (roomSceneForPet) {
            setInitialPet(roomSceneForPet);
          }

          const targetKey = SCENE_KEYS[activeSceneRef.current];
          if (targetKey !== "RoomScene") {
            game.scene.stop("RoomScene");
            game.scene.start(targetKey, {
              petKind: petKindRef.current,
              petBreed: petBreedRef.current,
            });
          }
        });
      } catch (error) {
        console.error("[PhaserGame] ❌ Error in init():", error);
      }
    }

    init();

    return () => {
      destroyed = true;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
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
    if (!game || !isGameReady) {
      return;
    }

    const targetKey = SCENE_KEYS[activeSceneRef.current];

    const scene = game.scene.getScene(targetKey);

    if (scene && "setPetType" in scene) {
      const s = scene as unknown as {
        isSceneReady?: () => boolean;
        setPetType: (k: PetKind, b: PetBreed) => void;
      };

      // If scene has isSceneReady check, wait for readiness
      if (s.isSceneReady) {
        let attempts = 0;
        const maxAttempts = 30; // 3 seconds at 100ms intervals

        const trySet = () => {
          if (s.isSceneReady?.()) {
            s.setPetType(petKind, petBreed);
          } else if (attempts < maxAttempts) {
            attempts++;

            setTimeout(trySet, 100);
          } else {
          }
        };

        trySet();
      } else {
        // Scene doesn't have isSceneReady, just set it directly

        s.setPetType(petKind, petBreed);
      }
    }
  }, [petKind, petBreed, isGameReady]);

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
