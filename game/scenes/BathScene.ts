import Phaser from "phaser";
import { CatType } from "@/types/cat";
import { DogType } from "@/types/dog";
import { PetKind, PetBreed } from "@/types/pet";
import { drawCatGraphics } from "../catRenderer";
import { drawDogGraphics } from "../dogRenderer";

export class BathScene extends Phaser.Scene {
  private currentPetKind: PetKind = "cat";
  private currentPetBreed: PetBreed = "siamese";
  private pet!: Phaser.GameObjects.Container;
  private petBody!: Phaser.GameObjects.Graphics;
  private petTail!: Phaser.GameObjects.Graphics;
  private isReady = false;
  private bubbleTimer?: Phaser.Time.TimerEvent;
  private splashTimer?: Phaser.Time.TimerEvent;
  private steamTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: "BathScene" });
  }

  init(data: { petKind?: PetKind; petBreed?: PetBreed }) {
    if (data.petKind) this.currentPetKind = data.petKind;
    if (data.petBreed) this.currentPetBreed = data.petBreed;
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    this.drawBathroom(W, H);
    this.drawBathtub(W, H);
    this.drawPetInTub(W, H);
    this.drawBathAccessories(W, H);
    this.startBubbleAnimation(W, H);
    this.startSteamAnimation(W, H);
    this.startSplashEffects();

    this.isReady = true;
  }

  // ─── Bathroom Background ───────────────────────────────────────────────────

  private drawBathroom(W: number, H: number) {
    const g = this.add.graphics();

    // Wall - light blue tiles
    g.fillStyle(0xd8eef8, 1);
    g.fillRect(0, 0, W, H * 0.63);

    // Floor - lighter tile
    g.fillStyle(0xe8e0d8, 1);
    g.fillRect(0, H * 0.62, W, H * 0.38);

    // Tile pattern on wall
    const tileSize = 40;
    g.lineStyle(1, 0xc0d8e8, 0.5);
    for (let x = 0; x < W; x += tileSize) {
      g.lineBetween(x, 0, x, H * 0.63);
    }
    for (let y = 0; y < H * 0.63; y += tileSize) {
      g.lineBetween(0, y, W, y);
    }

    // Floor tile pattern
    const floorTile = 50;
    g.lineStyle(1, 0xd0c8c0, 0.4);
    for (let x = 0; x < W; x += floorTile) {
      g.lineBetween(x, H * 0.62, x, H);
    }
    for (let y = H * 0.62; y < H; y += floorTile) {
      g.lineBetween(0, y, W, y);
    }

    // Wall/floor divider
    g.lineStyle(4, 0xb0c8d8, 1);
    g.lineBetween(0, H * 0.63, W, H * 0.63);

    // Decorative tile accent strip
    g.fillStyle(0x88bbdd, 0.6);
    g.fillRect(0, H * 0.3, W, 6);
    g.fillStyle(0xa8d0e8, 0.6);
    g.fillRect(0, H * 0.3 + 8, W, 4);

    // Mirror on wall
    this.drawMirror(g, W * 0.72, H * 0.12, 80, 100);

    // Towel rack
    this.drawTowelRack(g, W * 0.12, H * 0.25);
  }

  private drawMirror(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    // Mirror frame
    g.fillStyle(0xc0a070, 1);
    g.fillRoundedRect(x - 5, y - 5, w + 10, h + 10, 12);
    // Mirror surface
    g.fillStyle(0xe8f4ff, 0.9);
    g.fillRoundedRect(x, y, w, h, 8);
    // Reflection highlight
    g.fillStyle(0xffffff, 0.3);
    g.fillRoundedRect(x + 8, y + 8, 25, 60, 6);
    // Frame detail
    g.lineStyle(2, 0xb09060, 0.8);
    g.strokeRoundedRect(x - 5, y - 5, w + 10, h + 10, 12);
  }

  private drawTowelRack(g: Phaser.GameObjects.Graphics, x: number, y: number) {
    // Rack bar
    g.fillStyle(0xc0c0c0, 1);
    g.fillRoundedRect(x, y, 70, 5, 2);
    // Wall mounts
    g.fillStyle(0xa0a0a0, 1);
    g.fillCircle(x + 5, y + 2, 5);
    g.fillCircle(x + 65, y + 2, 5);

    // Towel 1 - pink
    g.fillStyle(0xffb0c0, 0.9);
    g.fillRoundedRect(x + 8, y + 5, 24, 55, 3);
    g.lineStyle(1, 0xee90a0, 0.5);
    g.lineBetween(x + 12, y + 25, x + 28, y + 25);
    g.lineBetween(x + 12, y + 35, x + 28, y + 35);

    // Towel 2 - blue
    g.fillStyle(0xa0c8e8, 0.9);
    g.fillRoundedRect(x + 36, y + 5, 24, 50, 3);
    g.lineStyle(1, 0x80a8c8, 0.5);
    g.lineBetween(x + 40, y + 22, x + 56, y + 22);
    g.lineBetween(x + 40, y + 32, x + 56, y + 32);
  }

  // ─── Bathtub ───────────────────────────────────────────────────────────────

  private drawBathtub(W: number, H: number) {
    const g = this.add.graphics();
    const cx = W * 0.46;
    const cy = H * 0.58;
    const tubW = 260;
    const tubH = 130;

    // Tub shadow
    g.fillStyle(0x000000, 0.08);
    g.fillEllipse(cx, cy + 40, tubW + 20, 30);

    // Tub body (outer)
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(cx - tubW / 2, cy - tubH / 2 + 10, tubW, tubH, 30);
    g.lineStyle(3, 0xd0d0d0, 1);
    g.strokeRoundedRect(cx - tubW / 2, cy - tubH / 2 + 10, tubW, tubH, 30);

    // Tub inner
    g.fillStyle(0xf0f5ff, 1);
    g.fillRoundedRect(
      cx - tubW / 2 + 10,
      cy - tubH / 2 + 18,
      tubW - 20,
      tubH - 22,
      24,
    );

    // Water
    g.fillStyle(0xa8d8f0, 0.7);
    g.fillRoundedRect(
      cx - tubW / 2 + 12,
      cy - tubH / 2 + 35,
      tubW - 24,
      tubH - 45,
      20,
    );

    // Water surface highlight
    g.fillStyle(0xc8e8ff, 0.5);
    g.fillEllipse(cx, cy - 8, tubW - 50, 20);

    // Water ripples
    g.lineStyle(1, 0x90c8e8, 0.4);
    g.beginPath();
    for (let x = cx - 80; x < cx + 80; x += 4) {
      const waveY = cy - 5 + Math.sin(x * 0.08) * 3;
      if (x === cx - 80) {
        g.moveTo(x, waveY);
      } else {
        g.lineTo(x, waveY);
      }
    }
    g.strokePath();

    // Tub feet (claw foot style)
    g.fillStyle(0xc0a070, 1);
    g.fillEllipse(cx - tubW / 2 + 25, cy + tubH / 2 + 8, 18, 12);
    g.fillEllipse(cx + tubW / 2 - 25, cy + tubH / 2 + 8, 18, 12);

    // Tub rim highlight
    g.lineStyle(2, 0xffffff, 0.6);
    g.lineBetween(
      cx - tubW / 2 + 20,
      cy - tubH / 2 + 12,
      cx + tubW / 2 - 20,
      cy - tubH / 2 + 12,
    );

    // Faucet
    this.drawFaucet(g, cx + tubW / 2 - 30, cy - tubH / 2);

    // Pre-drawn static bubbles in tub
    this.drawStaticBubbles(g, cx, cy);
  }

  private drawFaucet(g: Phaser.GameObjects.Graphics, x: number, y: number) {
    // Faucet pipe
    g.fillStyle(0xc0c0c0, 1);
    g.fillRoundedRect(x - 5, y - 35, 12, 38, 4);
    // Faucet head
    g.fillRoundedRect(x - 18, y - 40, 38, 10, 5);
    // Spout
    g.fillStyle(0xb0b0b0, 1);
    g.fillRoundedRect(x - 20, y - 38, 8, 16, 3);
    // Water drip
    g.fillStyle(0xa0d4f0, 0.6);
    g.fillCircle(x - 16, y - 18, 3);
    g.fillCircle(x - 16, y - 10, 2);
    // Handles
    g.fillStyle(0xdd5555, 1);
    g.fillCircle(x + 2, y - 45, 5);
    g.fillStyle(0x5555dd, 1);
    g.fillCircle(x + 18, y - 45, 5);
  }

  private drawStaticBubbles(
    g: Phaser.GameObjects.Graphics,
    cx: number,
    cy: number,
  ) {
    const bubblePositions = [
      { x: -60, y: -15, r: 10 },
      { x: -40, y: -20, r: 14 },
      { x: -15, y: -18, r: 12 },
      { x: 20, y: -22, r: 9 },
      { x: 50, y: -16, r: 13 },
      { x: 70, y: -20, r: 8 },
      { x: -80, y: -10, r: 7 },
      { x: 35, y: -12, r: 11 },
      { x: -30, y: -8, r: 8 },
      { x: 60, y: -8, r: 10 },
      // Foam cluster on top
      { x: -50, y: -25, r: 8 },
      { x: -35, y: -28, r: 10 },
      { x: -20, y: -26, r: 9 },
      { x: 0, y: -28, r: 11 },
      { x: 18, y: -27, r: 8 },
      { x: 35, y: -25, r: 9 },
      { x: 50, y: -28, r: 7 },
    ];

    bubblePositions.forEach((b) => {
      // Bubble body
      g.fillStyle(0xffffff, 0.7);
      g.fillCircle(cx + b.x, cy + b.y, b.r);
      // Bubble highlight
      g.fillStyle(0xffffff, 0.9);
      g.fillCircle(cx + b.x - b.r * 0.25, cy + b.y - b.r * 0.3, b.r * 0.35);
      // Rainbow sheen
      g.lineStyle(1, 0xddccff, 0.3);
      g.strokeCircle(cx + b.x, cy + b.y, b.r);
    });
  }

  // ─── Pet in Tub ────────────────────────────────────────────────────────────

  private drawPetInTub(W: number, H: number) {
    const cx = W * 0.46;
    const cy = H * 0.48;

    this.pet = this.add.container(cx - 10, cy - 10);

    this.petBody = this.add.graphics();
    this.petTail = this.add.graphics();

    this.drawPetGraphics();

    this.pet.add([this.petTail, this.petBody]);

    // Wet shine overlay
    const wetShine = this.add.graphics();
    wetShine.fillStyle(0xaaddff, 0.15);
    wetShine.fillEllipse(0, -20, 60, 50);
    wetShine.fillStyle(0xffffff, 0.12);
    wetShine.fillEllipse(-10, -30, 20, 15);
    this.pet.add(wetShine);

    // Bubble hat (foam on head)
    const foamHat = this.add.graphics();
    foamHat.fillStyle(0xffffff, 0.85);
    foamHat.fillCircle(-8, -60, 10);
    foamHat.fillCircle(5, -62, 12);
    foamHat.fillCircle(18, -58, 9);
    foamHat.fillCircle(-2, -68, 8);
    foamHat.fillCircle(10, -70, 7);
    // Highlights on foam
    foamHat.fillStyle(0xffffff, 0.95);
    foamHat.fillCircle(-5, -64, 4);
    foamHat.fillCircle(8, -66, 3);
    this.pet.add(foamHat);

    // Scale the pet slightly
    this.pet.setScale(0.9);

    // Slight bobbing in water
    this.tweens.add({
      targets: this.pet,
      y: this.pet.y + 4,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Interaction
    this.petBody.setInteractive(
      new Phaser.Geom.Circle(0, -15, 50),
      Phaser.Geom.Circle.Contains,
    );

    this.petBody.on("pointerdown", () => {
      this.splashEffect();
    });

    this.petBody.on("pointerover", () => {
      this.game.canvas.style.cursor = "pointer";
    });
    this.petBody.on("pointerout", () => {
      this.game.canvas.style.cursor = "default";
    });
  }

  private drawPetGraphics() {
    if (this.currentPetKind === "cat") {
      drawCatGraphics(
        this.petBody,
        this.petTail,
        this.currentPetBreed as CatType,
      );
    } else {
      drawDogGraphics(
        this.petBody,
        this.petTail,
        this.currentPetBreed as DogType,
      );
    }
  }

  // ─── Bath Accessories ──────────────────────────────────────────────────────

  private drawBathAccessories(W: number, H: number) {
    const g = this.add.graphics();

    // Rubber duck
    const dx = W * 0.56;
    const dy = H * 0.5;
    // Duck body
    g.fillStyle(0xffdd44, 1);
    g.fillEllipse(dx, dy, 24, 18);
    // Duck head
    g.fillStyle(0xffdd44, 1);
    g.fillCircle(dx + 10, dy - 10, 10);
    // Duck beak
    g.fillStyle(0xff8800, 1);
    g.fillTriangle(dx + 18, dy - 12, dx + 25, dy - 10, dx + 18, dy - 8);
    // Duck eye
    g.fillStyle(0x000000, 1);
    g.fillCircle(dx + 12, dy - 12, 2);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(dx + 13, dy - 13, 0.8);

    // Floating rubber duck bobbing animation
    const duckContainer = this.add.container(0, 0);
    this.tweens.add({
      targets: duckContainer,
      y: 3,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Shampoo bottle on tub edge
    const sx = W * 0.26;
    const sy = H * 0.42;
    g.fillStyle(0xff88aa, 1);
    g.fillRoundedRect(sx, sy, 18, 32, 5);
    g.fillStyle(0xff6688, 1);
    g.fillRoundedRect(sx + 2, sy - 6, 14, 10, 3);
    // Label
    g.fillStyle(0xffffff, 0.7);
    g.fillRoundedRect(sx + 3, sy + 10, 12, 14, 2);

    // Soap bar
    g.fillStyle(0xaaeedd, 1);
    g.fillRoundedRect(sx + 25, sy + 14, 22, 14, 4);
    g.fillStyle(0x88ccbb, 0.5);
    g.fillEllipse(sx + 36, sy + 19, 10, 6);

    // Loofah / scrub brush
    g.fillStyle(0xf0d8a0, 1);
    g.fillCircle(sx + 60, sy + 20, 12);
    g.fillStyle(0xe8c888, 0.6);
    g.fillCircle(sx + 60, sy + 20, 8);
    g.lineStyle(2, 0xc0a060, 0.8);
    g.lineBetween(sx + 60, sy + 32, sx + 60, sy + 48);
  }

  // ─── Bubble Animations ─────────────────────────────────────────────────────

  private startBubbleAnimation(W: number, H: number) {
    const cx = W * 0.46;

    this.bubbleTimer = this.time.addEvent({
      delay: 600,
      loop: true,
      callback: () => {
        const bx = cx + Phaser.Math.Between(-100, 100);
        const by = H * 0.52;
        const r = Phaser.Math.Between(4, 12);

        const bubble = this.add.graphics();
        bubble.fillStyle(0xffffff, 0.6);
        bubble.fillCircle(0, 0, r);
        bubble.fillStyle(0xffffff, 0.8);
        bubble.fillCircle(-r * 0.25, -r * 0.3, r * 0.3);
        bubble.lineStyle(1, 0xddddff, 0.3);
        bubble.strokeCircle(0, 0, r);

        bubble.setPosition(bx, by);
        bubble.setAlpha(0);

        this.tweens.add({
          targets: bubble,
          alpha: { from: 0, to: 0.8 },
          y: by - Phaser.Math.Between(60, 140),
          x: bx + Phaser.Math.Between(-20, 20),
          scale: { from: 0.5, to: 1 },
          duration: Phaser.Math.Between(1500, 3000),
          ease: "Sine.easeOut",
          onComplete: () => {
            // Pop effect
            this.tweens.add({
              targets: bubble,
              alpha: 0,
              scale: 1.4,
              duration: 150,
              onComplete: () => bubble.destroy(),
            });
          },
        });
      },
    });
  }

  // ─── Steam Animation ───────────────────────────────────────────────────────

  private startSteamAnimation(W: number, H: number) {
    const cx = W * 0.46;

    this.steamTimer = this.time.addEvent({
      delay: 1200,
      loop: true,
      callback: () => {
        const sx = cx + Phaser.Math.Between(-80, 80);
        const sy = H * 0.38;

        const steam = this.add.graphics();
        steam.fillStyle(0xffffff, 0.15);
        steam.fillEllipse(
          0,
          0,
          Phaser.Math.Between(15, 30),
          Phaser.Math.Between(10, 18),
        );
        steam.setPosition(sx, sy);
        steam.setAlpha(0);

        this.tweens.add({
          targets: steam,
          alpha: { from: 0, to: 0.25 },
          y: sy - Phaser.Math.Between(40, 80),
          x: sx + Phaser.Math.Between(-15, 15),
          scaleX: { from: 1, to: 1.8 },
          scaleY: { from: 1, to: 0.6 },
          duration: 2500,
          ease: "Sine.easeOut",
          onComplete: () => {
            this.tweens.add({
              targets: steam,
              alpha: 0,
              duration: 800,
              onComplete: () => steam.destroy(),
            });
          },
        });
      },
    });
  }

  // ─── Splash Effects ────────────────────────────────────────────────────────

  private startSplashEffects() {
    this.splashTimer = this.time.addEvent({
      delay: 4000,
      loop: true,
      callback: () => {
        if (!this.pet) return;
        // Small ambient splash near pet
        this.miniSplash(
          this.pet.x + Phaser.Math.Between(-40, 40),
          this.pet.y + Phaser.Math.Between(10, 30),
        );
      },
    });
  }

  private splashEffect() {
    if (!this.pet) return;

    // Big splash when clicking pet
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const dist = Phaser.Math.Between(20, 50);

      const droplet = this.add.graphics();
      droplet.fillStyle(0xa0d8f0, 0.7);
      droplet.fillCircle(0, 0, Phaser.Math.Between(3, 6));
      droplet.setPosition(this.pet.x, this.pet.y);

      this.tweens.add({
        targets: droplet,
        x: this.pet.x + Math.cos(angle) * dist,
        y: this.pet.y + Math.sin(angle) * dist - 20,
        alpha: 0,
        scale: { from: 1, to: 0.3 },
        duration: 600,
        ease: "Power2",
        onComplete: () => droplet.destroy(),
      });
    }

    // Pet reaction
    this.tweens.add({
      targets: this.pet,
      y: this.pet.y - 10,
      duration: 150,
      yoyo: true,
      ease: "Back.easeOut",
    });

    // Emit event for UI toast
    this.events.emit("petSplashed");
  }

  private miniSplash(x: number, y: number) {
    for (let i = 0; i < 3; i++) {
      const droplet = this.add.graphics();
      droplet.fillStyle(0xa0d8f0, 0.5);
      droplet.fillCircle(0, 0, Phaser.Math.Between(2, 4));
      droplet.setPosition(x, y);
      droplet.setAlpha(0);

      this.tweens.add({
        targets: droplet,
        alpha: { from: 0, to: 0.6 },
        y: y - Phaser.Math.Between(10, 25),
        x: x + Phaser.Math.Between(-10, 10),
        duration: 500,
        ease: "Power2",
        onComplete: () => {
          this.tweens.add({
            targets: droplet,
            alpha: 0,
            duration: 300,
            onComplete: () => droplet.destroy(),
          });
        },
      });
    }
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  public isSceneReady(): boolean {
    return this.isReady;
  }

  public setPetType(kind: PetKind, breed: PetBreed) {
    this.currentPetKind = kind;
    this.currentPetBreed = breed;
    this.scene.restart({ petKind: kind, petBreed: breed });
  }

  shutdown() {
    if (this.bubbleTimer) this.bubbleTimer.destroy();
    if (this.splashTimer) this.splashTimer.destroy();
    if (this.steamTimer) this.steamTimer.destroy();
  }
}
