import { CatType } from "@/types/cat";
import { DogType } from "@/types/dog";
import { PetKind, PetBreed } from "@/types/pet";
import Phaser from "phaser";
import { drawCatGraphics } from "../catRenderer";
import { drawDogGraphics } from "../dogRenderer";

export class RoomScene extends Phaser.Scene {
  private currentPetKind: PetKind = "cat";
  private currentPetBreed: PetBreed = "siamese";
  private pet!: Phaser.GameObjects.Container;
  private petBody!: Phaser.GameObjects.Graphics;
  private petTail!: Phaser.GameObjects.Graphics;
  private idleTween!: Phaser.Tweens.Tween;
  private tooltipText!: Phaser.GameObjects.Container;
  private isReady = false;

  constructor() {
    super({ key: "RoomScene" });
  }

  preload() {
    // We draw everything procedurally - no external assets needed
  }

  create() {
    console.log("[RoomScene] 🎬 CREATE - Initializing scene");
    const W = this.scale.width;
    const H = this.scale.height;

    this.drawRoom(W, H);
    this.drawFurniture(W, H);
    this.drawPet(W, H);
    console.log("[RoomScene] ✅ Pet drawn, setting up interactions");
    this.setupInteractions();
    this.startIdleAnimations();
    this.spawnSparkles(W, H);

    this.isReady = true;
    console.log("[RoomScene] ✅ Scene ready!");
  }

  // ─── Room Background ───────────────────────────────────────────────────────

  private drawRoom(W: number, H: number) {
    const g = this.add.graphics();

    // Floor
    g.fillStyle(0xf5deb3, 1);
    g.fillRect(0, H * 0.62, W, H * 0.38);

    // Wall
    g.fillStyle(0xfef3e8, 1);
    g.fillRect(0, 0, W, H * 0.63);

    // Roof triangle
    g.fillStyle(0xf0c0a0, 1);
    g.fillTriangle(W * 0.5, 0, -W * 0.1, H * 0.22, W * 1.1, H * 0.22);
    g.lineStyle(3, 0xe0a080, 1);
    g.strokeTriangle(W * 0.5, 0, -W * 0.1, H * 0.22, W * 1.1, H * 0.22);

    // Floor/wall divider
    g.lineStyle(3, 0xd4a882, 1);
    g.lineBetween(0, H * 0.63, W, H * 0.63);

    // Wooden floor planks
    g.lineStyle(1, 0xe0c898, 0.5);
    for (let i = 0; i < 6; i++) {
      const y = H * 0.63 + ((H * 0.37) / 6) * i;
      g.lineBetween(0, y, W, y);
    }

    // Window
    this.drawWindow(g, W * 0.15, H * 0.28, 110, 130);

    // Air conditioner
    this.drawAC(g, W * 0.72, H * 0.3, 100, 45);

    // Wall hanging / macrame
    this.drawWallHanging(g, W * 0.82, H * 0.35);

    // Skirting board
    g.fillStyle(0xe8d5b0, 1);
    g.fillRect(0, H * 0.62, W, 8);

    // Shadow on floor
    g.fillStyle(0x000000, 0.04);
    g.fillRect(0, H * 0.62, W, 20);
  }

  private drawWindow(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    // Curtain left
    g.fillStyle(0xffd6e7, 0.85);
    g.fillRoundedRect(x - 18, y - 10, 22, h + 20, 8);
    // Curtain right
    g.fillRoundedRect(x + w - 4, y - 10, 22, h + 20, 8);

    // Window frame
    g.fillStyle(0xffffff, 0.95);
    g.fillRoundedRect(x, y, w, h, 10);
    g.lineStyle(3, 0xd0b090, 1);
    g.strokeRoundedRect(x, y, w, h, 10);

    // Sky
    g.fillStyle(0xc8e8ff, 0.9);
    g.fillRoundedRect(x + 5, y + 5, w - 10, h - 10, 7);

    // Tree outside
    g.fillStyle(0xff9933, 0.8);
    g.fillCircle(x + 30, y + 55, 22);
    g.fillCircle(x + 45, y + 45, 18);
    g.fillStyle(0x8b5e3c, 1);
    g.fillRect(x + 36, y + 70, 6, 30);

    // Pumpkin outside
    g.fillStyle(0xff6600, 1);
    g.fillEllipse(x + 18, y + 100, 24, 20);
    g.fillStyle(0x228822, 1);
    g.fillRect(x + 25, y + 90, 3, 8);

    // Window dividers
    g.lineStyle(2, 0xd0b090, 1);
    g.lineBetween(x + w / 2, y, x + w / 2, y + h);
    g.lineBetween(x, y + h / 2, x + w, y + h / 2);

    // Curtain rod
    g.fillStyle(0xc0a070, 1);
    g.fillRoundedRect(x - 22, y - 14, w + 44, 6, 3);
  }

  private drawAC(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    g.fillStyle(0xf0f0f0, 1);
    g.fillRoundedRect(x, y, w, h, 8);
    g.lineStyle(2, 0xd0d0d0, 1);
    g.strokeRoundedRect(x, y, w, h, 8);
    g.lineStyle(1, 0xc0c0c0, 1);
    for (let i = 0; i < 4; i++) {
      g.lineBetween(x + 10 + i * 12, y + h - 10, x + 10 + i * 12, y + h - 4);
    }
    g.fillStyle(0x00cc88, 1);
    g.fillCircle(x + w - 12, y + h / 2, 4);
    g.fillStyle(0xd0c0b0, 1);
    g.fillRect(x + 10, y - 6, w - 20, 8);
  }

  private drawWallHanging(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
  ) {
    g.fillStyle(0xc8a060, 1);
    g.fillRoundedRect(x - 30, y, 60, 6, 3);
    g.lineStyle(2, 0xe8d5b0, 1);
    const strings = [-20, -8, 4, 16];
    strings.forEach((sx, i) => {
      g.lineBetween(x + sx, y + 6, x + sx + (i % 2 === 0 ? -4 : 4), y + 50);
    });
    this.add.text(x - 8, y + 50, "\u2726", {
      fontSize: "16px",
      color: "#c8a060",
    });
  }

  // ─── Furniture ─────────────────────────────────────────────────────────────

  private drawFurniture(W: number, H: number) {
    this.drawBed(W, H);
    this.drawBookshelf(W, H);
    this.drawMobile(W, H);
    this.drawRug(W, H);
    this.drawPhotograph(W, H);
  }

  private drawRug(W: number, H: number) {
    const g = this.add.graphics();
    const cx = W * 0.5;
    const cy = H * 0.76;
    g.fillStyle(0xffffff, 0.95);
    g.fillEllipse(cx, cy, 300, 90);
    g.lineStyle(3, 0xf0d0d8, 1);
    g.strokeEllipse(cx, cy, 300, 90);
    g.lineStyle(2, 0xffb7c5, 0.5);
    g.strokeEllipse(cx, cy, 240, 70);
    g.fillStyle(0xffb7c5, 0.4);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      g.fillCircle(cx + Math.cos(angle) * 80, cy + Math.sin(angle) * 22, 4);
    }
  }

  private drawBed(W: number, H: number) {
    const g = this.add.graphics();
    const bx = W * 0.38;
    const by = H * 0.48;
    const bw = 200;
    const bh = 120;

    g.fillStyle(0xdeb887, 1);
    g.fillRoundedRect(bx, by, bw, bh, 10);
    g.fillStyle(0xfff8f0, 1);
    g.fillRoundedRect(bx + 6, by + 8, bw - 12, bh - 16, 8);
    g.fillStyle(0xffd6d6, 1);
    g.fillRoundedRect(bx + 6, by + 35, bw - 12, bh - 43, 8);
    g.lineStyle(1, 0xffc0c0, 0.5);
    for (let i = 0; i < 4; i++) {
      const dy = by + 45 + i * 14;
      g.lineBetween(bx + 10, dy, bx + bw - 10, dy);
    }
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(bx + 12, by + 12, 65, 40, 12);
    g.lineStyle(2, 0xf0d0d0, 1);
    g.strokeRoundedRect(bx + 12, by + 12, 65, 40, 12);
    g.fillStyle(0xffe0f0, 1);
    g.fillRoundedRect(bx + 88, by + 12, 65, 40, 12);
    g.lineStyle(2, 0xf0d0d0, 1);
    g.strokeRoundedRect(bx + 88, by + 12, 65, 40, 12);
    g.fillStyle(0xc8945a, 1);
    g.fillRoundedRect(bx - 5, by - 30, bw + 10, 38, 12);
    g.lineStyle(2, 0xb08040, 1);
    g.strokeRoundedRect(bx - 5, by - 30, bw + 10, 38, 12);
    g.fillStyle(0xb08040, 1);
    g.fillRoundedRect(bx + 10, by + bh, 16, 18, 4);
    g.fillRoundedRect(bx + bw - 26, by + bh, 16, 18, 4);
    this.drawLamp(g, bx + bw + 10, by - 40);
    g.fillStyle(0xd4a870, 1);
    g.fillRoundedRect(bx + 15, by - 22, 28, 22, 3);
    g.fillStyle(0xb0d4f0, 1);
    g.fillRect(bx + 18, by - 19, 22, 16);
  }

  private drawLamp(g: Phaser.GameObjects.Graphics, x: number, y: number) {
    g.fillStyle(0xffeedd, 1);
    g.fillTriangle(x - 18, y + 30, x + 18, y + 30, x, y);
    g.lineStyle(2, 0xd4a870, 1);
    g.strokeTriangle(x - 18, y + 30, x + 18, y + 30, x, y);
    g.lineStyle(3, 0xc8a060, 1);
    g.lineBetween(x, y + 30, x, y + 70);
    g.fillStyle(0xc8a060, 1);
    g.fillEllipse(x, y + 75, 28, 10);
    g.fillStyle(0xffffcc, 0.15);
    g.fillCircle(x, y + 20, 35);
  }

  private drawBookshelf(W: number, H: number) {
    const g = this.add.graphics();
    const sx = W * 0.72;
    const sy = H * 0.42;
    const sw = 80;
    const sh = 160;

    g.fillStyle(0xc8a060, 1);
    g.fillRoundedRect(sx, sy, sw, sh, 6);
    g.fillStyle(0xb08040, 1);
    g.fillRect(sx, sy + 55, sw, 6);
    g.fillRect(sx, sy + 110, sw, 6);

    const bookColors1 = [0xff9999, 0x99ccff, 0xffcc88, 0xcc99ff];
    bookColors1.forEach((c, i) => {
      g.fillStyle(c, 1);
      g.fillRoundedRect(sx + 5 + i * 17, sy + 12, 14, 40, 2);
    });

    const bookColors2 = [0x99ffcc, 0xffb7c5, 0xaaddff, 0xffdd88];
    bookColors2.forEach((c, i) => {
      g.fillStyle(c, 1);
      g.fillRoundedRect(sx + 5 + i * 17, sy + 65, 14, 40, 2);
    });

    g.fillStyle(0xd4a870, 1);
    g.fillEllipse(sx + sw / 2, sy - 5, 24, 16);
    g.fillStyle(0x66bb66, 1);
    g.fillEllipse(sx + sw / 2 - 8, sy - 18, 18, 22);
    g.fillEllipse(sx + sw / 2 + 8, sy - 20, 16, 20);
    g.fillEllipse(sx + sw / 2, sy - 24, 14, 18);

    this.add.text(sx + 14, sy + 120, "\uD83D\uDC31", { fontSize: "18px" });
    this.add.text(sx + 44, sy + 118, "\u2B50", { fontSize: "14px" });
  }

  private drawPhotograph(W: number, H: number) {
    const g = this.add.graphics();
    const px = W * 0.5;
    const py = H * 0.3;
    g.fillStyle(0xdeb887, 1);
    g.fillRoundedRect(px, py, 52, 44, 4);
    g.fillStyle(0xc8e8ff, 1);
    g.fillRect(px + 4, py + 4, 44, 36);
    g.fillStyle(0xffcc88, 0.6);
    g.fillRect(px + 12, py + 20, 24, 16);
    g.fillStyle(0xff9999, 0.7);
    g.fillTriangle(px + 10, py + 20, px + 36, py + 20, px + 24, py + 10);
  }

  private drawMobile(W: number, H: number) {
    const g = this.add.graphics();
    const mx = W * 0.28;
    const my = H * 0.22;

    g.fillStyle(0xc8a060, 1);
    g.fillRoundedRect(mx - 45, my, 90, 5, 2);

    const charms = ["\uD83C\uDF19", "\u2B50", "\uD83C\uDF38", "\u2601\uFE0F"];
    const offsets = [-32, -10, 12, 32];
    const lengths = [40, 55, 45, 35];
    offsets.forEach((ox, i) => {
      g.lineStyle(1, 0xc8a060, 0.6);
      g.lineBetween(mx + ox, my + 5, mx + ox, my + 5 + lengths[i]);
      this.add.text(mx + ox - 8, my + 5 + lengths[i], charms[i], {
        fontSize: "14px",
      });
    });

    g.lineStyle(2, 0xc8a060, 0.8);
    g.lineBetween(mx, 0, mx, my);
  }

  // ─── Pet Character ─────────────────────────────────────────────────────────

  private drawPet(W: number, H: number) {
    console.log("[RoomScene] 🐱 Drawing pet...");
    this.pet = this.add.container(W * 0.45, H * 0.55);

    this.petBody = this.add.graphics();
    this.petTail = this.add.graphics();

    this.drawPetGraphics();

    this.pet.add([this.petTail, this.petBody]);

    const sparkle = this.add.text(-5, -68, "\u2728", { fontSize: "14px" });
    this.pet.add(sparkle);

    console.log("[RoomScene] ✅ Pet graphics drawn, calling setupPetInteraction()");
    this.setupPetInteraction();
    console.log("[RoomScene] ✅ Pet interaction setup complete");
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

  private setupPetInteraction() {
    console.log("[RoomScene] 🎯 Setting up pet interaction - petBody:", !!this.petBody);
    
    this.petBody.setInteractive(
      new Phaser.Geom.Circle(0, -15, 50),
      Phaser.Geom.Circle.Contains,
    );
    
    console.log("[RoomScene] ✅ Pet body is now interactive");

    this.petBody.on("pointerover", () => {
      console.log("[RoomScene] 👆 Mouse over pet");
      const name = this.currentPetBreed.replace("_", " ");
      const kind = this.currentPetKind;
      this.showTooltip(`Pat the ${name} ${kind}!`);
      this.game.canvas.style.cursor = "pointer";
    });

    this.petBody.on("pointerout", () => {
      console.log("[RoomScene] 👋 Mouse left pet");
      this.hideTooltip();
      this.game.canvas.style.cursor = "default";
    });

    this.petBody.on("pointerdown", () => {
      console.log("[RoomScene] 🖱️ CLICKED! Calling patPet()");
      this.patPet();
    });
    
    console.log("[RoomScene] ✅ Pet interaction listeners attached");
  }

  public isSceneReady(): boolean {
    return this.isReady;
  }

  public setPetType(kind: PetKind, breed: PetBreed) {
    console.log("[RoomScene] setPetType called with:", kind, breed);
    console.log(
      "[RoomScene] Current pet:",
      this.currentPetKind,
      this.currentPetBreed,
    );
    console.log("[RoomScene] Pet container exists:", !!this.pet);

    this.currentPetKind = kind;
    this.currentPetBreed = breed;

    if (this.pet) {
      console.log("[RoomScene] Destroying old pet and creating new one");
      this.tweens.killTweensOf(this.pet);
      this.pet.destroy();

      const W = this.scale.width;
      const H = this.scale.height;

      this.pet = this.add.container(W * 0.45, H * 0.55);

      this.petBody = this.add.graphics();
      this.petTail = this.add.graphics();

      this.drawPetGraphics();

      this.pet.add([this.petTail, this.petBody]);

      const sparkle = this.add.text(-5, -68, "\u2728", { fontSize: "14px" });
      this.pet.add(sparkle);

      this.setupPetInteraction();

      this.idleTween = this.tweens.add({
        targets: this.pet,
        y: this.pet.y + 5,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      console.log("[RoomScene] New pet created successfully");
    } else {
      console.log("[RoomScene] No existing pet to replace");
    }
  }

  // ─── Interactions ───────────────────────────────────────────────────────────

  private patPet() {
    console.log("[RoomScene] 🎉 PAT PET CALLED! Emitting petPatted event...");
    
    this.tweens.add({
      targets: this.pet,
      y: this.pet.y - 20,
      duration: 150,
      yoyo: true,
      ease: "Back.easeOut",
    });

    const emojis =
      this.currentPetKind === "cat"
        ? [
            "\uD83D\uDC95",
            "\u2764\uFE0F",
            "\uD83D\uDC96",
            "\u2728",
            "\uD83C\uDF38",
          ]
        : [
            "\uD83D\uDC95",
            "\u2764\uFE0F",
            "\uD83D\uDC3E",
            "\u2728",
            "\uD83C\uDF1F",
          ];

    for (let i = 0; i < 5; i++) {
      this.time.delayedCall(i * 80, () => {
        const e = emojis[Math.floor(Math.random() * emojis.length)];
        const heart = this.add.text(
          this.pet.x + Phaser.Math.Between(-40, 40),
          this.pet.y - 60,
          e,
          { fontSize: "20px" },
        );
        this.tweens.add({
          targets: heart,
          y: heart.y - 80,
          alpha: 0,
          duration: 1200,
          ease: "Power2",
          onComplete: () => heart.destroy(),
        });
      });
    }

    console.log("[RoomScene] 📤 Emitting 'petPatted' event to listeners");
    this.events.emit("petPatted");
    console.log("[RoomScene] ✅ Event emitted");
  }

  private setupInteractions() {
    this.tooltipText = this.add.container(0, 0);
    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 0.92);
    bg.fillRoundedRect(0, 0, 160, 30, 15);
    bg.lineStyle(2, 0xffb7c5, 1);
    bg.strokeRoundedRect(0, 0, 160, 30, 15);
    const txt = this.add
      .text(80, 15, "", {
        fontSize: "12px",
        color: "#cc6688",
        fontFamily: "Nunito",
      })
      .setOrigin(0.5);
    this.tooltipText.add([bg, txt]);
    this.tooltipText.setAlpha(0);
    this.tooltipText.setDepth(100);
    this.tooltipText.setData("text", txt);
  }

  private showTooltip(msg: string) {
    const txt = this.tooltipText.getData("text") as Phaser.GameObjects.Text;
    txt.setText(msg);
    this.tooltipText.setPosition(this.pet.x - 80, this.pet.y - 120);
    this.tweens.add({ targets: this.tooltipText, alpha: 1, duration: 200 });
  }

  private hideTooltip() {
    this.tweens.add({ targets: this.tooltipText, alpha: 0, duration: 200 });
  }

  // ─── Ambient Sparkles ───────────────────────────────────────────────────────

  private spawnSparkles(W: number, H: number) {
    this.time.addEvent({
      delay: 2500,
      loop: true,
      callback: () => {
        const sparkles = ["\u2726", "\u00B7", "\u02DA", "\u2727", "\u22C6"];
        const s = this.add
          .text(
            Phaser.Math.Between(20, W - 20),
            Phaser.Math.Between(H * 0.1, H * 0.6),
            sparkles[Math.floor(Math.random() * sparkles.length)],
            {
              fontSize: Phaser.Math.Between(10, 18) + "px",
              color: "#ffb7c5",
            },
          )
          .setAlpha(0);
        this.tweens.add({
          targets: s,
          alpha: { from: 0, to: 0.7 },
          y: s.y - 20,
          duration: 1500,
          yoyo: true,
          ease: "Sine.easeInOut",
          onComplete: () => s.destroy(),
        });
      },
    });
  }

  // ─── Idle Animations ────────────────────────────────────────────────────────

  private startIdleAnimations() {
    this.idleTween = this.tweens.add({
      targets: this.pet,
      y: this.pet.y + 5,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: () => {
        this.cameras.main.pan(
          this.scale.width / 2 + Phaser.Math.Between(-3, 3),
          this.scale.height / 2 + Phaser.Math.Between(-2, 2),
          2000,
          "Sine.easeInOut",
        );
      },
    });
  }

  update() {
    const t = this.time.now / 1000;
    this.pet.rotation = Math.sin(t * 0.8) * 0.04;
  }
}
