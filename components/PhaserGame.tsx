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
    console.log("[PhaserGame] 🚀 useEffect 1 triggered - creating game");
    if (!containerRef.current || gameRef.current) {
      console.log(
        "[PhaserGame] ⚠️ Skipping init - containerRef:",
        !!containerRef.current,
        "gameRef:', !!gameRef.current)",
      );
      return;
    }

    let destroyed = false;

    async function init() {
      try {
        console.log("[PhaserGame] 🎮 init() starting - importing Phaser...");
        const Phaser = (await import("phaser")).default;
        console.log("[PhaserGame] ✅ Phaser imported");

        const { RoomScene } = await import("@/game/scenes/RoomScene");
        const { SleepScene } = await import("@/game/scenes/SleepScene");
        const { BathScene } = await import("@/game/scenes/BathScene");
        const { FeedScene } = await import("@/game/scenes/FeedScene");
        const { PlayScene } = await import("@/game/scenes/PlayScene");

        if (destroyed || !containerRef.current) {
          console.log("[PhaserGame] ⚠️ Destroyed or no container");
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
        console.log("[PhaserGame] ✅ Game created and ready!");

        // 🔥 FIX: Attach listeners AFTER game is ready and scenes are initialized
        game.events.once("ready", () => {
          console.log(
            "[PhaserGame] 📡 Game ready event fired, attaching listeners to initialized scenes...",
          );

          const roomSceneFromGame = game.scene.getScene("RoomScene");
          if (roomSceneFromGame) {
            console.log(
              "[PhaserGame] ✅ Got RoomScene, attaching petPatted listener",
            );
            roomSceneFromGame.events.on("petPatted", () => {
              console.log(
                "[PhaserGame] 📥 RECEIVED petPatted event! Calling onPetPatted()",
              );
              onPetPattedRef.current?.();
            });
          }

          const bathSceneFromGame = game.scene.getScene("BathScene");
          if (bathSceneFromGame) {
            console.log(
              "[PhaserGame] ✅ Got BathScene, attaching petSplashed listener",
            );
            bathSceneFromGame.events.on("petSplashed", () => {
              console.log("[PhaserGame] 📥 RECEIVED petSplashed event!");
              onPetSplashedRef.current?.();
            });
          }

          const feedSceneFromGame = game.scene.getScene("FeedScene");
          if (feedSceneFromGame) {
            console.log(
              "[PhaserGame] ✅ Got FeedScene, attaching petFed listener",
            );
            feedSceneFromGame.events.on("petFed", (food: string) => {
              console.log(
                "[PhaserGame] 📥 RECEIVED petFed event with food:",
                food,
              );
              onPetFedRef.current?.(food);
            });
          }

          const playSceneFromGame = game.scene.getScene("PlayScene");
          if (playSceneFromGame) {
            console.log(
              "[PhaserGame] ✅ Got PlayScene, attaching petPlayed listener",
            );
            playSceneFromGame.events.on("petPlayed", (toy: string) => {
              console.log(
                "[PhaserGame] 📥 RECEIVED petPlayed event with toy:",
                toy,
              );
              onPetPlayedRef.current?.(toy);
            });
          }

          console.log("[PhaserGame] ✅ All event listeners attached!");

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

    console.log("[PhaserGame] 📞 Calling init()...");
    init();
    console.log("[PhaserGame] ✅ init() called (async)");

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
    console.log(
      "[PhaserGame Effect3] Triggered! petKind:",
      petKind,
      "petBreed:",
      petBreed,
      "isGameReady:",
      isGameReady,
    );

    const game = gameRef.current;
    if (!game || !isGameReady) {
      console.log("[PhaserGame Effect3] Game not ready yet:", {
        gameExists: !!game,
        isGameReady,
      });
      return;
    }

    const targetKey = SCENE_KEYS[activeSceneRef.current];
    console.log(
      "[PhaserGame Effect3] activeSceneRef.current:",
      activeSceneRef.current,
      "targetKey:",
      targetKey,
    );

    const scene = game.scene.getScene(targetKey);
    console.log(
      "[PhaserGame Effect3] scene exists:",
      !!scene,
      "has setPetType:",
      scene && "setPetType" in scene,
    );

    if (scene && "setPetType" in scene) {
      const s = scene as unknown as {
        isSceneReady?: () => boolean;
        setPetType: (k: PetKind, b: PetBreed) => void;
      };

      // If scene has isSceneReady check, wait for readiness
      if (s.isSceneReady) {
        console.log(
          "[PhaserGame Effect3] Scene has isSceneReady, checking readiness...",
        );
        let attempts = 0;
        const maxAttempts = 30; // 3 seconds at 100ms intervals

        const trySet = () => {
          if (s.isSceneReady?.()) {
            console.log(
              "[PhaserGame Effect3] Scene ready! Calling setPetType with:",
              petKind,
              petBreed,
            );
            s.setPetType(petKind, petBreed);
          } else if (attempts < maxAttempts) {
            attempts++;
            console.log(
              "[PhaserGame Effect3] Scene not ready, attempt:",
              attempts,
            );
            setTimeout(trySet, 100);
          } else {
            console.log(
              "[PhaserGame Effect3] Scene not ready after 30 attempts, giving up",
            );
          }
        };

        trySet();
      } else {
        // Scene doesn't have isSceneReady, just set it directly
        console.log(
          "[PhaserGame Effect3] No isSceneReady, calling setPetType directly with:",
          petKind,
          petBreed,
        );
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
