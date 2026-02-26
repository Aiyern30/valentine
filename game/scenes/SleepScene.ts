import Phaser from "phaser";
import { CatType } from "@/types/cat";
import { DogType } from "@/types/dog";
import { PetKind, PetBreed } from "@/types/pet";
import { drawCatGraphics } from "../catRenderer";
import { drawDogGraphics } from "../dogRenderer";

export class SleepScene extends Phaser.Scene {
  private currentPetKind: PetKind = "cat";
  private currentPetBreed: PetBreed = "siamese";
  private pet!: Phaser.GameObjects.Container;
  private petBody!: Phaser.GameObjects.Graphics;
  private petTail!: Phaser.GameObjects.Graphics;
  private isReady = false;
  private zzzTimer?: Phaser.Time.TimerEvent;
  private sparkleTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: "SleepScene" });
  }

  init(data: { petKind?: PetKind; petBreed?: PetBreed }) {
    if (data.petKind) this.currentPetKind = data.petKind;
    if (data.petBreed) this.currentPetBreed = data.petBreed;
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    this.drawNightRoom(W, H);
    this.drawBed(W, H);
    this.drawSleepingPet(W, H);
    this.drawMoonAndStars(W, H);
    this.startZzzAnimation();
    this.startSparkles(W, H);
    this.addNightOverlay(W, H);

    this.isReady = true;
  }

  // ─── Night Room ────────────────────────────────────────────────────────────

  private drawNightRoom(W: number, H: number) {
    const g = this.add.graphics();

    // Dark wall
    g.fillStyle(0x1a1a3e, 1);
    g.fillRect(0, 0, W, H * 0.63);

    // Dark floor
    g.fillStyle(0x2a2040, 1);
    g.fillRect(0, H * 0.62, W, H * 0.38);

    // Subtle wall gradient overlay
    g.fillStyle(0x0a0a2a, 0.3);
    g.fillRect(0, 0, W, H * 0.3);

    // Floor/wall divider
    g.lineStyle(3, 0x3a3060, 1);
    g.lineBetween(0, H * 0.63, W, H * 0.63);

    // Wooden floor planks (dimmed)
    g.lineStyle(1, 0x3a3060, 0.3);
    for (let i = 0; i < 6; i++) {
      const y = H * 0.63 + ((H * 0.37) / 6) * i;
      g.lineBetween(0, y, W, y);
    }

    // Night window
    this.drawNightWindow(g, W * 0.15, H * 0.28, 110, 130);

    // Skirting board
    g.fillStyle(0x2a2550, 1);
    g.fillRect(0, H * 0.62, W, 8);
  }

  private drawNightWindow(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    // Curtain left (darker)
    g.fillStyle(0x4a2050, 0.85);
    g.fillRoundedRect(x - 18, y - 10, 22, h + 20, 8);
    // Curtain right
    g.fillRoundedRect(x + w - 4, y - 10, 22, h + 20, 8);

    // Window frame
    g.fillStyle(0x2a2a4a, 0.95);
    g.fillRoundedRect(x, y, w, h, 10);
    g.lineStyle(3, 0x4a4070, 1);
    g.strokeRoundedRect(x, y, w, h, 10);

    // Night sky
    g.fillStyle(0x0a0a30, 0.95);
    g.fillRoundedRect(x + 5, y + 5, w - 10, h - 10, 7);

    // Stars in window
    const starPositions = [
      { sx: 20, sy: 20 },
      { sx: 55, sy: 35 },
      { sx: 80, sy: 15 },
      { sx: 35, sy: 60 },
      { sx: 70, sy: 55 },
      { sx: 15, sy: 90 },
      { sx: 85, sy: 80 },
    ];
    starPositions.forEach((s) => {
      g.fillStyle(0xffffcc, 0.8);
      g.fillCircle(x + s.sx, y + s.sy, 2);
    });

    // Small moon in window
    g.fillStyle(0xffffd0, 0.9);
    g.fillCircle(x + 75, y + 30, 16);
    g.fillStyle(0x0a0a30, 0.95);
    g.fillCircle(x + 82, y + 26, 14);

    // Window dividers
    g.lineStyle(2, 0x4a4070, 1);
    g.lineBetween(x + w / 2, y, x + w / 2, y + h);
    g.lineBetween(x, y + h / 2, x + w, y + h / 2);

    // Curtain rod
    g.fillStyle(0x3a3060, 1);
    g.fillRoundedRect(x - 22, y - 14, w + 44, 6, 3);

    // Moonlight beam from window
    g.fillStyle(0xccccff, 0.04);
    g.fillTriangle(x, y + h, x + w, y + h, x + w / 2, y + h + 120);
  }

  // ─── Bed ───────────────────────────────────────────────────────────────────

  private drawBed(W: number, H: number) {
    const g = this.add.graphics();
    const bx = W * 0.32;
    const by = H * 0.46;
    const bw = 230;
    const bh = 130;

    // Bed frame (darker wood)
    g.fillStyle(0x5a4030, 1);
    g.fillRoundedRect(bx, by, bw, bh, 10);

    // Mattress
    g.fillStyle(0x3a3060, 1);
    g.fillRoundedRect(bx + 6, by + 8, bw - 12, bh - 16, 8);

    // Blanket (cozy, covers most of bed)
    g.fillStyle(0x6050a0, 0.9);
    g.fillRoundedRect(bx + 6, by + 30, bw - 12, bh - 38, 8);

    // Blanket pattern - subtle stripes
    g.lineStyle(1, 0x7060b0, 0.4);
    for (let i = 0; i < 5; i++) {
      const dy = by + 42 + i * 16;
      g.lineBetween(bx + 12, dy, bx + bw - 12, dy);
    }

    // Blanket fold highlight
    g.lineStyle(2, 0x8070c0, 0.5);
    g.lineBetween(bx + 8, by + 32, bx + bw - 8, by + 32);

    // Pillow
    g.fillStyle(0xd0c8e8, 0.9);
    g.fillRoundedRect(bx + 14, by + 10, 80, 40, 14);
    g.lineStyle(2, 0xa098c0, 0.5);
    g.strokeRoundedRect(bx + 14, by + 10, 80, 40, 14);

    // Second pillow
    g.fillStyle(0xe0d8f0, 0.85);
    g.fillRoundedRect(bx + 100, by + 10, 80, 40, 14);
    g.lineStyle(2, 0xa098c0, 0.4);
    g.strokeRoundedRect(bx + 100, by + 10, 80, 40, 14);

    // Headboard
    g.fillStyle(0x4a3528, 1);
    g.fillRoundedRect(bx - 5, by - 35, bw + 10, 42, 12);
    g.lineStyle(2, 0x3a2518, 1);
    g.strokeRoundedRect(bx - 5, by - 35, bw + 10, 42, 12);

    // Bed legs
    g.fillStyle(0x3a2518, 1);
    g.fillRoundedRect(bx + 10, by + bh, 16, 18, 4);
    g.fillRoundedRect(bx + bw - 26, by + bh, 16, 18, 4);

    // Nightlight (small warm glow on nightstand)
    this.drawNightLight(g, bx + bw + 20, by + 10);
  }

  private drawNightLight(g: Phaser.GameObjects.Graphics, x: number, y: number) {
    // Nightstand
    g.fillStyle(0x4a3528, 1);
    g.fillRoundedRect(x - 15, y + 20, 40, 50, 5);
    g.lineStyle(1, 0x3a2518, 1);
    g.strokeRoundedRect(x - 15, y + 20, 40, 50, 5);

    // Small lamp
    g.fillStyle(0xffddaa, 0.8);
    g.fillCircle(x + 5, y + 14, 12);

    // Warm glow
    g.fillStyle(0xffddaa, 0.08);
    g.fillCircle(x + 5, y + 14, 40);
    g.fillStyle(0xffddaa, 0.04);
    g.fillCircle(x + 5, y + 14, 65);

    // Lamp base
    g.fillStyle(0x6a5040, 1);
    g.fillRoundedRect(x, y + 22, 10, 6, 2);
    g.lineStyle(2, 0x6a5040, 1);
    g.lineBetween(x + 5, y + 26, x + 5, y + 18);
  }

  // ─── Sleeping Pet ──────────────────────────────────────────────────────────

  private drawSleepingPet(W: number, H: number) {
    const bx = W * 0.32;
    const by = H * 0.46;

    this.pet = this.add.container(bx + 120, by + 40);

    this.petBody = this.add.graphics();
    this.petTail = this.add.graphics();

    // Draw the pet in a curled/sleeping pose
    this.drawSleepingPetGraphics();

    this.pet.add([this.petTail, this.petBody]);

    // Sleep eyes overlay (closed eyes drawn on top)
    const sleepOverlay = this.add.graphics();
    this.drawSleepEyes(sleepOverlay);
    this.pet.add(sleepOverlay);

    // Blanket covering the pet partially
    const blanketOver = this.add.graphics();
    blanketOver.fillStyle(0x6050a0, 0.7);
    blanketOver.fillEllipse(0, 20, 90, 40);
    blanketOver.fillStyle(0x7060b0, 0.3);
    blanketOver.fillEllipse(0, 18, 70, 30);
    this.pet.add(blanketOver);

    // Pet scale down slightly and rotate for sleeping pose
    this.pet.setScale(0.85);
    this.pet.setRotation(-0.08);

    // Gentle breathing animation
    this.tweens.add({
      targets: this.pet,
      scaleX: { from: 0.85, to: 0.88 },
      scaleY: { from: 0.85, to: 0.82 },
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  private drawSleepingPetGraphics() {
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

  private drawSleepEyes(g: Phaser.GameObjects.Graphics) {
    // Closed eyes (overdrawn on top of the pet)
    g.lineStyle(2.5, 0x554444, 0.9);
    // Left eye closed
    g.beginPath();
    g.arc(-13, -34, 6, 0.1, Math.PI - 0.1, false);
    g.strokePath();
    // Right eye closed
    g.beginPath();
    g.arc(13, -34, 6, 0.1, Math.PI - 0.1, false);
    g.strokePath();

    // Tiny blush marks
    g.fillStyle(0xff8888, 0.35);
    g.fillEllipse(-22, -28, 10, 5);
    g.fillEllipse(22, -28, 10, 5);
  }

  // ─── Moon & Stars ──────────────────────────────────────────────────────────

  private drawMoonAndStars(W: number, H: number) {
    // Large decorative moon
    const g = this.add.graphics();
    const mx = W * 0.78;
    const my = H * 0.18;

    // Moon glow
    g.fillStyle(0xffffdd, 0.06);
    g.fillCircle(mx, my, 60);
    g.fillStyle(0xffffdd, 0.04);
    g.fillCircle(mx, my, 90);

    // Moon body
    g.fillStyle(0xffffd0, 0.85);
    g.fillCircle(mx, my, 32);
    // Crescent shadow
    g.fillStyle(0x1a1a3e, 0.9);
    g.fillCircle(mx + 12, my - 5, 28);

    // Twinkling stars around the room
    const stars = [
      { x: W * 0.1, y: H * 0.08, s: 3 },
      { x: W * 0.25, y: H * 0.12, s: 2.5 },
      { x: W * 0.45, y: H * 0.06, s: 2 },
      { x: W * 0.6, y: H * 0.1, s: 3 },
      { x: W * 0.9, y: H * 0.08, s: 2 },
      { x: W * 0.85, y: H * 0.35, s: 2.5 },
      { x: W * 0.55, y: H * 0.18, s: 1.8 },
      { x: W * 0.35, y: H * 0.22, s: 2 },
    ];

    stars.forEach((star, i) => {
      const s = this.add.graphics();
      s.fillStyle(0xffffcc, 0.7);
      // 4-pointed star shape
      s.fillRect(star.x - star.s / 2, star.y - 0.5, star.s, 1);
      s.fillRect(star.x - 0.5, star.y - star.s / 2, 1, star.s);
      s.fillStyle(0xffffff, 0.9);
      s.fillCircle(star.x, star.y, 1);

      // Twinkle animation
      this.tweens.add({
        targets: s,
        alpha: { from: 0.4, to: 1 },
        duration: 1200 + i * 200,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: i * 150,
      });
    });
  }

  // ─── Zzz Animation ─────────────────────────────────────────────────────────

  private startZzzAnimation() {
    this.zzzTimer = this.time.addEvent({
      delay: 2200,
      loop: true,
      callback: () => {
        if (!this.pet) return;

        const zTexts = ["z", "Z", "zZ"];
        const zText = zTexts[Math.floor(Math.random() * zTexts.length)];

        const z = this.add
          .text(
            this.pet.x + Phaser.Math.Between(10, 35),
            this.pet.y - 50,
            zText,
            {
              fontSize: Phaser.Math.Between(14, 22) + "px",
              color: "#aabbdd",
              fontFamily: "Nunito",
              fontStyle: "bold",
            },
          )
          .setAlpha(0);

        this.tweens.add({
          targets: z,
          alpha: { from: 0, to: 0.8 },
          y: z.y - 60,
          x: z.x + Phaser.Math.Between(-10, 15),
          scale: { from: 0.6, to: 1.2 },
          duration: 2000,
          ease: "Sine.easeOut",
          onComplete: () => {
            this.tweens.add({
              targets: z,
              alpha: 0,
              duration: 500,
              onComplete: () => z.destroy(),
            });
          },
        });
      },
    });
  }

  // ─── Ambient Sparkles ───────────────────────────────────────────────────────

  private startSparkles(W: number, H: number) {
    this.sparkleTimer = this.time.addEvent({
      delay: 3500,
      loop: true,
      callback: () => {
        const sparkles = ["\u2726", "\u00B7", "\u02DA", "\u2727"];
        const s = this.add
          .text(
            Phaser.Math.Between(20, W - 20),
            Phaser.Math.Between(H * 0.05, H * 0.5),
            sparkles[Math.floor(Math.random() * sparkles.length)],
            {
              fontSize: Phaser.Math.Between(8, 14) + "px",
              color: "#8899cc",
            },
          )
          .setAlpha(0);

        this.tweens.add({
          targets: s,
          alpha: { from: 0, to: 0.5 },
          y: s.y - 15,
          duration: 2000,
          yoyo: true,
          ease: "Sine.easeInOut",
          onComplete: () => s.destroy(),
        });
      },
    });
  }

  // ─── Night Overlay ─────────────────────────────────────────────────────────

  private addNightOverlay(W: number, H: number) {
    const overlay = this.add.graphics();
    overlay.fillStyle(0x0a0a2a, 0.2);
    overlay.fillRect(0, 0, W, H);
    overlay.setDepth(50);
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  public isSceneReady(): boolean {
    return this.isReady;
  }

  public setPetType(kind: PetKind, breed: PetBreed) {
    this.currentPetKind = kind;
    this.currentPetBreed = breed;
    // Restart scene with new pet type
    this.scene.restart({ petKind: kind, petBreed: breed });
  }

  shutdown() {
    if (this.zzzTimer) this.zzzTimer.destroy();
    if (this.sparkleTimer) this.sparkleTimer.destroy();
  }
}
