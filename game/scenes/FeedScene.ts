import Phaser from "phaser";
import { CatType } from "@/types/cat";
import { DogType } from "@/types/dog";
import { PetKind, PetBreed } from "@/types/pet";
import { drawCatGraphics } from "../catRenderer";
import { drawDogGraphics } from "../dogRenderer";

export interface FoodItemData {
  id: string;
  label: string;
  emoji: string;
}

export class FeedScene extends Phaser.Scene {
  private currentPetKind: PetKind = "cat";
  private currentPetBreed: PetBreed = "siamese";
  private pet!: Phaser.GameObjects.Container;
  private petBody!: Phaser.GameObjects.Graphics;
  private petTail!: Phaser.GameObjects.Graphics;
  private isReady = false;
  private sparkleTimer?: Phaser.Time.TimerEvent;
  private foodBowl!: Phaser.GameObjects.Container;
  private isEating = false;

  constructor() {
    super({ key: "FeedScene" });
  }

  init(data: { petKind?: PetKind; petBreed?: PetBreed }) {
    if (data.petKind) this.currentPetKind = data.petKind;
    if (data.petBreed) this.currentPetBreed = data.petBreed;
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    this.drawKitchen(W, H);
    this.drawDiningArea(W, H);
    this.drawFoodBowl(W, H);
    this.drawPet(W, H);
    this.startAmbientEffects(W, H);

    this.isReady = true;
  }

  // ─── Kitchen Background ────────────────────────────────────────────────────

  private drawKitchen(W: number, H: number) {
    const g = this.add.graphics();

    // Wall - warm cream
    g.fillStyle(0xfff5e6, 1);
    g.fillRect(0, 0, W, H * 0.63);

    // Floor - checkerboard tile
    g.fillStyle(0xf0e0d0, 1);
    g.fillRect(0, H * 0.62, W, H * 0.38);

    // Checkerboard pattern
    const tileSize = 35;
    for (let x = 0; x < W; x += tileSize) {
      for (let y = H * 0.62; y < H; y += tileSize) {
        const ix = Math.floor(x / tileSize);
        const iy = Math.floor((y - H * 0.62) / tileSize);
        if ((ix + iy) % 2 === 0) {
          g.fillStyle(0xffe8d4, 1);
          g.fillRect(x, y, tileSize, tileSize);
        }
      }
    }

    // Wall/floor divider
    g.lineStyle(3, 0xd4a882, 1);
    g.lineBetween(0, H * 0.63, W, H * 0.63);

    // Wall tiles (kitchen backsplash)
    g.lineStyle(1, 0xf0d8c0, 0.4);
    const wallTile = 30;
    for (let x = 0; x < W; x += wallTile) {
      g.lineBetween(x, H * 0.35, x, H * 0.63);
    }
    for (let y = H * 0.35; y < H * 0.63; y += wallTile) {
      g.lineBetween(0, y, W, y);
    }

    // Counter top
    this.drawCounter(g, W, H);

    // Window
    this.drawKitchenWindow(g, W * 0.65, H * 0.08, 100, 110);

    // Skirting board
    g.fillStyle(0xe8d5b0, 1);
    g.fillRect(0, H * 0.62, W, 6);
  }

  private drawCounter(g: Phaser.GameObjects.Graphics, W: number, H: number) {
    // Counter base
    g.fillStyle(0xc8a060, 1);
    g.fillRect(0, H * 0.35, W * 0.45, H * 0.28);
    g.fillStyle(0xb08040, 1);
    g.fillRect(0, H * 0.35, W * 0.45, 6);

    // Counter top surface
    g.fillStyle(0xf0e8d8, 1);
    g.fillRect(0, H * 0.34, W * 0.46, 10);

    // Cabinet doors
    g.lineStyle(1, 0xa07030, 0.5);
    g.strokeRect(W * 0.03, H * 0.4, W * 0.18, H * 0.2);
    g.strokeRect(W * 0.24, H * 0.4, W * 0.18, H * 0.2);

    // Cabinet handles
    g.fillStyle(0xc0a070, 1);
    g.fillCircle(W * 0.19, H * 0.5, 3);
    g.fillCircle(W * 0.26, H * 0.5, 3);

    // Items on counter
    // Coffee mug
    g.fillStyle(0xff8888, 1);
    g.fillRoundedRect(W * 0.06, H * 0.3, 16, 18, 3);
    g.fillStyle(0xff8888, 1);
    g.beginPath();
    g.arc(W * 0.06 + 16, H * 0.3 + 9, 6, -1.2, 1.2, false);
    g.strokePath();
    // Steam from mug
    g.lineStyle(1, 0xdddddd, 0.4);
    g.beginPath();
    g.moveTo(W * 0.06 + 5, H * 0.3 - 2);
    g.lineTo(W * 0.06 + 3, H * 0.3 - 10);
    g.moveTo(W * 0.06 + 10, H * 0.3 - 2);
    g.lineTo(W * 0.06 + 12, H * 0.3 - 10);
    g.strokePath();

    // Cookie jar
    g.fillStyle(0xddbb88, 1);
    g.fillRoundedRect(W * 0.28, H * 0.28, 22, 26, 6);
    g.fillStyle(0xcc9966, 1);
    g.fillEllipse(W * 0.28 + 11, H * 0.28, 14, 6);
    g.fillStyle(0xbb8855, 1);
    g.fillCircle(W * 0.28 + 11, H * 0.28 - 2, 5);

    // Fruit bowl
    g.fillStyle(0xf0e0c8, 1);
    g.fillEllipse(W * 0.38, H * 0.32, 30, 14);
    g.fillStyle(0xff4444, 1);
    g.fillCircle(W * 0.36, H * 0.29, 6);
    g.fillStyle(0xffcc00, 1);
    g.fillEllipse(W * 0.4, H * 0.29, 7, 5);
    g.fillStyle(0x44aa44, 1);
    g.fillCircle(W * 0.38, H * 0.27, 4);
  }

  private drawKitchenWindow(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    // Curtain
    g.fillStyle(0xffdd99, 0.7);
    g.fillRoundedRect(x - 12, y - 6, 18, h + 12, 6);
    g.fillRoundedRect(x + w - 6, y - 6, 18, h + 12, 6);

    // Window frame
    g.fillStyle(0xffffff, 0.95);
    g.fillRoundedRect(x, y, w, h, 8);
    g.lineStyle(3, 0xd0b090, 1);
    g.strokeRoundedRect(x, y, w, h, 8);

    // Blue sky
    g.fillStyle(0xb8e0ff, 0.9);
    g.fillRoundedRect(x + 4, y + 4, w - 8, h - 8, 5);

    // Sun
    g.fillStyle(0xffdd44, 0.8);
    g.fillCircle(x + 25, y + 25, 14);
    g.fillStyle(0xffee88, 0.3);
    g.fillCircle(x + 25, y + 25, 22);

    // Cloud
    g.fillStyle(0xffffff, 0.7);
    g.fillEllipse(x + 65, y + 30, 30, 14);
    g.fillEllipse(x + 55, y + 26, 18, 12);

    // Window dividers
    g.lineStyle(2, 0xd0b090, 1);
    g.lineBetween(x + w / 2, y, x + w / 2, y + h);
    g.lineBetween(x, y + h / 2, x + w, y + h / 2);

    // Curtain rod
    g.fillStyle(0xc0a070, 1);
    g.fillRoundedRect(x - 16, y - 10, w + 32, 5, 2);
  }

  // ─── Dining Area ───────────────────────────────────────────────────────────

  private drawDiningArea(W: number, H: number) {
    const g = this.add.graphics();

    // Place mat (oval)
    g.fillStyle(0xffcccc, 0.5);
    g.fillEllipse(W * 0.62, H * 0.72, 180, 60);
    g.lineStyle(2, 0xffaaaa, 0.4);
    g.strokeEllipse(W * 0.62, H * 0.72, 180, 60);

    // Water bowl (left of food bowl)
    const wbx = W * 0.48;
    const wby = H * 0.72;
    g.fillStyle(0x88bbdd, 1);
    g.fillEllipse(wbx, wby, 36, 16);
    g.fillStyle(0xaaddff, 0.8);
    g.fillEllipse(wbx, wby - 2, 28, 10);
    // Water surface
    g.fillStyle(0xcceeff, 0.6);
    g.fillEllipse(wbx, wby - 3, 22, 7);
    // Highlight
    g.fillStyle(0xffffff, 0.4);
    g.fillEllipse(wbx - 5, wby - 5, 6, 3);

    // Shelf with treats above
    this.drawTreatShelf(g, W * 0.82, H * 0.32);
  }

  private drawTreatShelf(g: Phaser.GameObjects.Graphics, x: number, y: number) {
    // Shelf
    g.fillStyle(0xc8a060, 1);
    g.fillRoundedRect(x - 40, y, 80, 6, 2);

    // Treat bag
    g.fillStyle(0xff9966, 1);
    g.fillRoundedRect(x - 30, y - 30, 22, 28, 4);
    g.fillStyle(0xffffff, 0.6);
    g.fillRoundedRect(x - 26, y - 20, 14, 10, 2);

    // Treat box
    g.fillStyle(0x88cc88, 1);
    g.fillRoundedRect(x, y - 26, 28, 24, 3);
    g.fillStyle(0x66aa66, 1);
    g.fillRect(x, y - 26, 28, 6);
    g.fillStyle(0xffffff, 0.5);
    g.fillRoundedRect(x + 5, y - 18, 18, 10, 2);
  }

  // ─── Food Bowl ─────────────────────────────────────────────────────────────

  private drawFoodBowl(W: number, H: number) {
    this.foodBowl = this.add.container(W * 0.65, H * 0.72);

    const g = this.add.graphics();

    // Bowl outer
    g.fillStyle(0xffaaaa, 1);
    g.fillEllipse(0, 0, 50, 22);
    // Bowl inner rim
    g.fillStyle(0xff8888, 1);
    g.fillEllipse(0, -1, 44, 18);
    // Bowl inside
    g.fillStyle(0xffe8e0, 1);
    g.fillEllipse(0, -2, 38, 14);

    // Paw print decoration on bowl
    g.fillStyle(0xff6666, 0.5);
    g.fillCircle(-12, 4, 3);
    g.fillCircle(12, 4, 3);
    g.fillCircle(0, 6, 2.5);

    // Bowl highlight
    g.fillStyle(0xffffff, 0.3);
    g.fillEllipse(-8, -4, 10, 4);

    this.foodBowl.add(g);
  }

  // ─── Pet ───────────────────────────────────────────────────────────────────

  private drawPet(W: number, H: number) {
    this.pet = this.add.container(W * 0.62, H * 0.54);

    this.petBody = this.add.graphics();
    this.petTail = this.add.graphics();

    this.drawPetGraphics();

    this.pet.add([this.petTail, this.petBody]);

    // Sparkle
    const sparkle = this.add.text(-5, -68, "\u2728", { fontSize: "14px" });
    this.pet.add(sparkle);

    // Idle bobbing
    this.tweens.add({
      targets: this.pet,
      y: this.pet.y + 4,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Interaction
    this.petBody.setInteractive(
      new Phaser.Geom.Circle(0, -15, 50),
      Phaser.Geom.Circle.Contains,
    );
    this.petBody.on("pointerover", () => {
      this.game.canvas.style.cursor = "pointer";
    });
    this.petBody.on("pointerout", () => {
      this.game.canvas.style.cursor = "default";
    });
    this.petBody.on("pointerdown", () => {
      this.events.emit("petPatted");
      this.tweens.add({
        targets: this.pet,
        y: this.pet.y - 15,
        duration: 150,
        yoyo: true,
        ease: "Back.easeOut",
      });
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

  // ─── Feed Pet (called from React) ─────────────────────────────────────────

  public feedPet(food: FoodItemData) {
    if (this.isEating) return;
    this.isEating = true;

    const W = this.scale.width;
    const H = this.scale.height;

    // Show the food emoji falling into the bowl
    const foodEmoji = this.add
      .text(W * 0.65, H * 0.2, food.emoji, { fontSize: "32px" })
      .setOrigin(0.5);

    this.tweens.add({
      targets: foodEmoji,
      y: H * 0.68,
      duration: 600,
      ease: "Bounce.easeOut",
      onComplete: () => {
        // Food lands in bowl -- shrink into bowl
        this.tweens.add({
          targets: foodEmoji,
          scale: 0.4,
          alpha: 0.6,
          y: H * 0.7,
          duration: 300,
          onComplete: () => {
            // Pet walks to bowl
            this.tweens.add({
              targets: this.pet,
              x: W * 0.6,
              y: H * 0.58,
              duration: 500,
              ease: "Power2",
              onComplete: () => {
                // Eating animation -- pet bobs head down repeatedly
                this.startEatingAnimation(foodEmoji, food);
              },
            });
          },
        });
      },
    });
  }

  private startEatingAnimation(
    foodEmoji: Phaser.GameObjects.Text,
    food: FoodItemData,
  ) {
    let bobs = 0;
    const maxBobs = 4;

    // Show "nom nom" text
    const nomText = this.add
      .text(this.pet.x + 30, this.pet.y - 70, "nom", {
        fontSize: "16px",
        color: "#ff8888",
        fontFamily: "Nunito",
        fontStyle: "bold",
      })
      .setAlpha(0);

    const bobEvent = this.time.addEvent({
      delay: 400,
      repeat: maxBobs - 1,
      callback: () => {
        bobs++;

        // Head bob down
        this.tweens.add({
          targets: this.pet,
          y: this.pet.y + 8,
          duration: 150,
          yoyo: true,
          ease: "Power2",
        });

        // Show nom nom
        const nomTexts = ["nom", "yum!", "nom nom", "so good!"];
        nomText.setText(nomTexts[bobs % nomTexts.length]);
        nomText.setPosition(
          this.pet.x + Phaser.Math.Between(20, 45),
          this.pet.y - Phaser.Math.Between(60, 80),
        );
        nomText.setAlpha(1);
        this.tweens.add({
          targets: nomText,
          alpha: 0,
          y: nomText.y - 20,
          duration: 500,
        });

        // Particles (food crumbs)
        for (let i = 0; i < 3; i++) {
          const crumb = this.add.graphics();
          crumb.fillStyle(0xffcc88, 0.7);
          crumb.fillCircle(0, 0, Phaser.Math.Between(2, 4));
          crumb.setPosition(
            this.pet.x + Phaser.Math.Between(-15, 15),
            this.pet.y + 10,
          );
          this.tweens.add({
            targets: crumb,
            y: crumb.y + Phaser.Math.Between(15, 30),
            x: crumb.x + Phaser.Math.Between(-20, 20),
            alpha: 0,
            duration: 500,
            onComplete: () => crumb.destroy(),
          });
        }

        if (bobs >= maxBobs) {
          // Done eating
          this.time.delayedCall(300, () => {
            foodEmoji.destroy();
            nomText.destroy();

            // Happy reaction
            const hearts = [
              "\u2764\uFE0F",
              "\uD83D\uDC95",
              "\u2728",
              "\uD83C\uDF1F",
            ];
            for (let i = 0; i < 4; i++) {
              this.time.delayedCall(i * 100, () => {
                const h = this.add
                  .text(
                    this.pet.x + Phaser.Math.Between(-30, 30),
                    this.pet.y - 60,
                    hearts[i % hearts.length],
                    { fontSize: "18px" },
                  )
                  .setAlpha(0);
                this.tweens.add({
                  targets: h,
                  alpha: 1,
                  y: h.y - 50,
                  duration: 800,
                  ease: "Power2",
                  onComplete: () => {
                    this.tweens.add({
                      targets: h,
                      alpha: 0,
                      duration: 400,
                      onComplete: () => h.destroy(),
                    });
                  },
                });
              });
            }

            // Pet satisfied bounce
            this.tweens.add({
              targets: this.pet,
              y: this.pet.y - 20,
              duration: 300,
              yoyo: true,
              ease: "Back.easeOut",
              onComplete: () => {
                // Return to idle position
                const W = this.scale.width;
                const H = this.scale.height;
                this.tweens.add({
                  targets: this.pet,
                  x: W * 0.62,
                  y: H * 0.54,
                  duration: 600,
                  ease: "Power2",
                  onComplete: () => {
                    this.isEating = false;
                  },
                });
              },
            });

            this.events.emit("petFed", food.label);
          });
        }
      },
    });
  }

  // ─── Ambient Effects ───────────────────────────────────────────────────────

  private startAmbientEffects(W: number, H: number) {
    // Floating food-related sparkles
    this.sparkleTimer = this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: () => {
        const sparkles = ["\u2726", "\u00B7", "\u02DA", "\u2727"];
        const s = this.add
          .text(
            Phaser.Math.Between(20, W - 20),
            Phaser.Math.Between(H * 0.1, H * 0.5),
            sparkles[Math.floor(Math.random() * sparkles.length)],
            {
              fontSize: Phaser.Math.Between(10, 16) + "px",
              color: "#ffcc88",
            },
          )
          .setAlpha(0);

        this.tweens.add({
          targets: s,
          alpha: { from: 0, to: 0.6 },
          y: s.y - 15,
          duration: 1800,
          yoyo: true,
          ease: "Sine.easeInOut",
          onComplete: () => s.destroy(),
        });
      },
    });

    // Aroma wisps from counter area
    this.time.addEvent({
      delay: 2500,
      loop: true,
      callback: () => {
        const wisp = this.add.graphics();
        wisp.fillStyle(0xffffff, 0.1);
        const wx = W * 0.1 + Phaser.Math.Between(0, W * 0.3);
        const wy = H * 0.3;
        wisp.fillEllipse(
          0,
          0,
          Phaser.Math.Between(10, 20),
          Phaser.Math.Between(6, 12),
        );
        wisp.setPosition(wx, wy);
        wisp.setAlpha(0);

        this.tweens.add({
          targets: wisp,
          alpha: { from: 0, to: 0.15 },
          y: wy - Phaser.Math.Between(30, 60),
          x: wx + Phaser.Math.Between(-10, 10),
          scaleX: { from: 1, to: 1.5 },
          duration: 2000,
          ease: "Sine.easeOut",
          onComplete: () => {
            this.tweens.add({
              targets: wisp,
              alpha: 0,
              duration: 600,
              onComplete: () => wisp.destroy(),
            });
          },
        });
      },
    });
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
    if (this.sparkleTimer) this.sparkleTimer.destroy();
  }
}
