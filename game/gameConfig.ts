import Phaser from "phaser";
import { RoomScene } from "./scenes/RoomScene";

export function createGame(parent: HTMLElement): Phaser.Game {
  // Use window dimensions as fallback if container has no size yet
  const width = parent.clientWidth || window.innerWidth;
  const height = parent.clientHeight || window.innerHeight;

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent,
    width,
    height,
    backgroundColor: "#fef3e8",
    scene: [RoomScene],
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: "100%",
      height: "100%",
    },
    render: {
      antialias: true,
      pixelArt: false,
    },
  };

  return new Phaser.Game(config);
}
