import Phaser from "phaser";
import { CatType } from "@/types/cat";
import { DogType } from "@/types/dog";
import { PetKind, PetBreed } from "@/types/pet";
import { drawCatGraphics } from "../catRenderer";
import { drawDogGraphics } from "../dogRenderer";

export class PlayScene extends Phaser.Scene {
  private currentPetKind: PetKind = "cat";
  private currentPetBreed: PetBreed = "siamese";
  private pet!: Phaser.GameObjects.Container;
  private petBody!: Phaser.GameObjects.Graphics;
  private petTail!: Phaser.GameObjects.Graphics;
  private isReady = false;
  private sparkleTimer?: Phaser.Time.TimerEvent;
  private isPlaying = false;
  private activeToy?: Phaser.GameObjects.Container;

  constructor() {
    super({ key: "PlayScene" });
  }

  init(data: { petKind?: PetKind; petBreed?: PetBreed }) {
    if (data.petKind) this.currentPetKind = data.petKind;
    if (data.petBreed) this.currentPetBreed = data.petBreed;
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    this.drawPlayroom(W, H);
    this.drawToys(W, H);
    this.drawPet(W, H);
    this.startAmbientEffects(W, H);

    this.isReady = true;
  }

  // ─── Playroom Background ──────────────────────────────────────────────────

  private drawPlayroom(W: number, H: number) {
    const g = this.add.graphics();

    // Wall - light green/teal
    g.fillStyle(0xe8f5e9, 1);
    g.fillRect(0, 0, W, H * 0.63);

    // Floor - soft carpet
    g.fillStyle(0xd4e8c8, 1);
    g.fillRect(0, H * 0.62, W, H * 0.38);

    // Carpet texture (soft dots)
    g.fillStyle(0xc8e0b8, 0.5);
    for (let x = 0; x < W; x += 20) {
      for (let y = H * 0.64; y < H; y += 20) {
        g.fillCircle(
          x + Phaser.Math.Between(-3, 3),
          y + Phaser.Math.Between(-3, 3),
          1.5,
        );
      }
    }

    // Wall/floor divider
    g.lineStyle(3, 0xaad4a0, 1);
    g.lineBetween(0, H * 0.63, W, H * 0.63);

    // Polka dot wallpaper pattern
    g.fillStyle(0xd8f0d8, 0.4);
    for (let x = 20; x < W; x += 50) {
      for (let y = 20; y < H * 0.62; y += 50) {
        g.fillCircle(x, y, 6);
      }
    }

    // Window with garden view
    this.drawPlayroomWindow(g, W * 0.68, H * 0.1, 100, 110);

    // Bunting / banner decoration
    this.drawBunting(g, W, H);

    // Cat/dog climbing tower on far left
    this.drawClimbingTower(g, W * 0.05, H * 0.3);

    // Skirting
    g.fillStyle(0xb8d8a8, 1);
    g.fillRect(0, H * 0.62, W, 6);
  }

  private drawPlayroomWindow(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    g.fillStyle(0xffffff, 0.95);
    g.fillRoundedRect(x, y, w, h, 8);
    g.lineStyle(3, 0xa0c890, 1);
    g.strokeRoundedRect(x, y, w, h, 8);

    // Garden view
    g.fillStyle(0x88ccff, 0.9);
    g.fillRoundedRect(x + 4, y + 4, w - 8, h - 8, 5);

    // Grass
    g.fillStyle(0x66bb66, 0.8);
    g.fillRect(x + 4, y + h - 30, w - 8, 26);

    // Flowers
    g.fillStyle(0xff6688, 0.8);
    g.fillCircle(x + 20, y + h - 30, 5);
    g.fillStyle(0xffaa33, 0.8);
    g.fillCircle(x + 40, y + h - 28, 4);
    g.fillStyle(0xdd55dd, 0.8);
    g.fillCircle(x + 70, y + h - 32, 5);

    // Stems
    g.lineStyle(1, 0x44aa44, 0.8);
    g.lineBetween(x + 20, y + h - 25, x + 20, y + h - 10);
    g.lineBetween(x + 40, y + h - 24, x + 40, y + h - 10);
    g.lineBetween(x + 70, y + h - 27, x + 70, y + h - 10);

    // Window dividers
    g.lineStyle(2, 0xa0c890, 1);
    g.lineBetween(x + w / 2, y, x + w / 2, y + h);
    g.lineBetween(x, y + h / 2, x + w, y + h / 2);
  }

  private drawBunting(g: Phaser.GameObjects.Graphics, W: number, H: number) {
    const colors = [0xff8888, 0x88ccff, 0xffdd66, 0x88dd88, 0xddaaff];
    const y = H * 0.08;
    const flagW = 18;
    const flagH = 22;

    // String
    g.lineStyle(1.5, 0xccaa88, 0.6);
    g.beginPath();
    g.moveTo(W * 0.1, y);
    for (let x = W * 0.1; x < W * 0.6; x += flagW + 8) {
      g.lineTo(x + flagW / 2, y + 4);
      g.lineTo(x + flagW, y);
    }
    g.strokePath();

    // Flags
    let i = 0;
    for (let x = W * 0.1; x < W * 0.6; x += flagW + 8) {
      g.fillStyle(colors[i % colors.length], 0.8);
      g.fillTriangle(x, y, x + flagW, y, x + flagW / 2, y + flagH);
      i++;
    }
  }

  private drawClimbingTower(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
  ) {
    // Base post
    g.fillStyle(0xc8a878, 1);
    g.fillRect(x + 10, y, 25, 200);

    // Rope texture
    g.lineStyle(1, 0xb89868, 0.5);
    for (let i = 0; i < 30; i++) {
      g.lineBetween(x + 10, y + i * 6.5, x + 35, y + i * 6.5 + 3);
    }

    // Platforms
    g.fillStyle(0xddc898, 1);
    g.fillRoundedRect(x - 8, y - 5, 60, 12, 4);
    g.fillRoundedRect(x - 5, y + 80, 55, 12, 4);
    g.fillRoundedRect(x - 3, y + 160, 50, 12, 4);

    // Toy hanging from top
    g.lineStyle(1, 0xccaa88, 0.7);
    g.lineBetween(x + 40, y, x + 50, y + 25);
    g.fillStyle(0xff8888, 1);
    g.fillCircle(x + 50, y + 30, 6);
  }

  // ─── Toys ──────────────────────────────────────────────────────────────────

  private drawToys(W: number, H: number) {
    const g = this.add.graphics();

    // Ball on floor
    g.fillStyle(0xff5555, 1);
    g.fillCircle(W * 0.25, H * 0.78, 14);
    g.fillStyle(0xffffff, 0.5);
    g.fillCircle(W * 0.25 - 3, H * 0.78 - 4, 5);
    // Ball stripe
    g.lineStyle(2, 0xcc3333, 0.6);
    g.beginPath();
    g.arc(W * 0.25, H * 0.78, 12, -0.8, 0.8, false);
    g.strokePath();

    // Yarn ball
    g.fillStyle(0xffaacc, 1);
    g.fillCircle(W * 0.82, H * 0.82, 11);
    g.lineStyle(1, 0xff88aa, 0.6);
    g.beginPath();
    g.arc(W * 0.82, H * 0.82, 8, 0, 2, false);
    g.strokePath();
    g.beginPath();
    g.arc(W * 0.82, H * 0.82, 5, 1, 4, false);
    g.strokePath();
    // Yarn trail
    g.lineStyle(1.5, 0xffaacc, 0.5);
    g.beginPath();
    g.moveTo(W * 0.82 + 11, H * 0.82);
    g.lineTo(W * 0.82 + 20, H * 0.84);
    g.lineTo(W * 0.82 + 15, H * 0.88);
    g.strokePath();

    // Mouse toy
    g.fillStyle(0xaaaaaa, 1);
    g.fillEllipse(W * 0.38, H * 0.85, 18, 10);
    g.fillStyle(0xff9999, 1);
    g.fillCircle(W * 0.38 - 8, H * 0.85 - 2, 4);
    g.fillCircle(W * 0.38 - 4, H * 0.85 - 5, 4);
    // Mouse tail
    g.lineStyle(1, 0xaaaaaa, 0.6);
    g.beginPath();
    g.moveTo(W * 0.38 + 9, H * 0.85);
    g.lineTo(W * 0.38 + 18, H * 0.83);
    g.lineTo(W * 0.38 + 22, H * 0.86);
    g.strokePath();

    // Bone toy (for dogs)
    g.fillStyle(0xf5e6d3, 1);
    g.fillRoundedRect(W * 0.15, H * 0.88, 30, 8, 3);
    g.fillCircle(W * 0.15, H * 0.892, 6);
    g.fillCircle(W * 0.15 + 30, H * 0.892, 6);

    // Feather wand leaning against wall
    g.lineStyle(2, 0xc8a060, 1);
    g.lineBetween(W * 0.9, H * 0.4, W * 0.88, H * 0.7);
    g.fillStyle(0xff6688, 0.8);
    g.fillTriangle(
      W * 0.9,
      H * 0.4,
      W * 0.9 - 6,
      H * 0.4 - 18,
      W * 0.9 + 6,
      H * 0.4 - 14,
    );
    g.fillStyle(0xffaacc, 0.6);
    g.fillTriangle(
      W * 0.9 - 3,
      H * 0.4 - 14,
      W * 0.9 - 10,
      H * 0.4 - 28,
      W * 0.9 + 2,
      H * 0.4 - 22,
    );
  }

  // ─── Pet ───────────────────────────────────────────────────────────────────

  private drawPet(W: number, H: number) {
    this.pet = this.add.container(W * 0.5, H * 0.56);

    this.petBody = this.add.graphics();
    this.petTail = this.add.graphics();

    this.drawPetGraphics();

    this.pet.add([this.petTail, this.petBody]);

    // Sparkle
    const sparkle = this.add.text(-5, -68, "\u2728", { fontSize: "14px" });
    this.pet.add(sparkle);

    // Active/bouncy idle
    this.tweens.add({
      targets: this.pet,
      y: this.pet.y + 6,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Slight rotation (playful energy)
    this.tweens.add({
      targets: this.pet,
      rotation: { from: -0.03, to: 0.03 },
      duration: 800,
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
      this.events.emit("petPlayed", "pat");
      this.tweens.add({
        targets: this.pet,
        y: this.pet.y - 25,
        duration: 200,
        yoyo: true,
        ease: "Back.easeOut",
      });
      // Excited emojis
      const emojis =
        this.currentPetKind === "cat"
          ? ["\uD83C\uDF1F", "\u2728", "\uD83D\uDC95", "\uD83C\uDF89"]
          : ["\uD83C\uDF1F", "\uD83D\uDC3E", "\uD83D\uDC95", "\uD83C\uDF89"];
      for (let i = 0; i < 4; i++) {
        this.time.delayedCall(i * 80, () => {
          const e = emojis[Math.floor(Math.random() * emojis.length)];
          const heart = this.add.text(
            this.pet.x + Phaser.Math.Between(-35, 35),
            this.pet.y - 55,
            e,
            { fontSize: "18px" },
          );
          this.tweens.add({
            targets: heart,
            y: heart.y - 60,
            alpha: 0,
            duration: 1000,
            ease: "Power2",
            onComplete: () => heart.destroy(),
          });
        });
      }
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

  // ─── Play With Toy (called from React) ────────────────────────────────────

  public playWith(toyId: string) {
    if (this.isPlaying) return;
    this.isPlaying = true;

    // Destroy previous toy if any
    if (this.activeToy) {
      this.activeToy.destroy();
      this.activeToy = undefined;
    }

    const W = this.scale.width;
    const H = this.scale.height;

    switch (toyId) {
      case "ball":
        this.playBall(W, H);
        break;
      case "yarn":
        this.playYarn(W, H);
        break;
      case "frisbee":
        this.playFrisbee(W, H);
        break;
      case "feather":
        this.playFeather(W, H);
        break;
      case "bone":
        this.playBone(W, H);
        break;
      default:
        this.isPlaying = false;
    }
  }

  private playBall(W: number, H: number) {
    // Ball bounces across the screen, pet chases it
    const ball = this.add.container(W * 0.2, H * 0.3);
    const ballG = this.add.graphics();
    ballG.fillStyle(0xff5555, 1);
    ballG.fillCircle(0, 0, 16);
    ballG.fillStyle(0xffffff, 0.5);
    ballG.fillCircle(-4, -5, 5);
    ballG.lineStyle(2, 0xcc3333, 0.6);
    ballG.beginPath();
    ballG.arc(0, 0, 13, -0.8, 0.8, false);
    ballG.strokePath();
    ball.add(ballG);
    this.activeToy = ball;

    // Ball bounces
    this.tweens.add({
      targets: ball,
      x: W * 0.75,
      duration: 1200,
      ease: "Linear",
    });
    this.tweens.add({
      targets: ball,
      y: { from: H * 0.3, to: H * 0.65 },
      duration: 400,
      yoyo: true,
      repeat: 1,
      ease: "Bounce.easeOut",
    });

    // Pet chases after delay
    this.time.delayedCall(300, () => {
      this.tweens.add({
        targets: this.pet,
        x: W * 0.72,
        duration: 900,
        ease: "Power2",
        onComplete: () => {
          // Pet catches ball
          this.tweens.add({
            targets: this.pet,
            y: this.pet.y - 25,
            duration: 200,
            yoyo: true,
            ease: "Back.easeOut",
          });
          this.showPlayReaction("Got it!");
          this.finishPlaying(ball, "ball");
        },
      });
    });
  }

  private playYarn(W: number, H: number) {
    // Yarn ball rolls and pet pounces
    const yarn = this.add.container(W * 0.5, H * 0.4);
    const yarnG = this.add.graphics();
    yarnG.fillStyle(0xffaacc, 1);
    yarnG.fillCircle(0, 0, 14);
    yarnG.lineStyle(1.5, 0xff88aa, 0.7);
    yarnG.beginPath();
    yarnG.arc(0, 0, 10, 0, 2.5, false);
    yarnG.strokePath();
    yarn.add(yarnG);
    this.activeToy = yarn;

    // Yarn rolls in circle
    let angle = 0;
    const cx = W * 0.5;
    const cy = H * 0.55;
    const radius = 60;

    const rollEvent = this.time.addEvent({
      delay: 30,
      loop: true,
      callback: () => {
        angle += 0.05;
        yarn.setPosition(
          cx + Math.cos(angle) * radius,
          cy + Math.sin(angle) * radius * 0.5,
        );
        yarnG.setRotation(angle * 3);
      },
    });

    // Pet watches then pounces
    this.time.delayedCall(800, () => {
      // Pet wiggles (pounce preparation)
      this.tweens.add({
        targets: this.pet,
        scaleX: { from: 1, to: 0.9 },
        scaleY: { from: 1, to: 1.1 },
        duration: 200,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          // Pounce!
          this.tweens.add({
            targets: this.pet,
            x: yarn.x,
            y: yarn.y - 20,
            duration: 250,
            ease: "Back.easeOut",
            onComplete: () => {
              rollEvent.destroy();
              this.showPlayReaction("Pounce!");
              this.finishPlaying(yarn, "yarn");
            },
          });
        },
      });
    });
  }

  private playFrisbee(W: number, H: number) {
    // Frisbee flies across, pet jumps to catch
    const frisbee = this.add.container(W * 0.1, H * 0.3);
    const frisbeeG = this.add.graphics();
    frisbeeG.fillStyle(0x44aaff, 1);
    frisbeeG.fillEllipse(0, 0, 30, 10);
    frisbeeG.fillStyle(0x66ccff, 0.8);
    frisbeeG.fillEllipse(0, -1, 20, 6);
    frisbeeG.fillStyle(0xffffff, 0.4);
    frisbeeG.fillEllipse(-5, -2, 8, 3);
    frisbee.add(frisbeeG);
    this.activeToy = frisbee;

    // Frisbee flies
    this.tweens.add({
      targets: frisbee,
      x: W * 0.7,
      y: H * 0.35,
      duration: 800,
      ease: "Sine.easeOut",
    });

    // Spin
    this.tweens.add({
      targets: frisbeeG,
      rotation: Math.PI * 6,
      duration: 800,
      ease: "Linear",
    });

    // Pet jumps to catch
    this.time.delayedCall(400, () => {
      this.tweens.add({
        targets: this.pet,
        x: W * 0.68,
        y: H * 0.3,
        duration: 500,
        ease: "Power2",
        onComplete: () => {
          this.showPlayReaction("Catch!");
          // Pet falls back down with frisbee
          this.tweens.add({
            targets: this.pet,
            y: H * 0.56,
            duration: 400,
            ease: "Bounce.easeOut",
            onComplete: () => {
              this.finishPlaying(frisbee, "frisbee");
            },
          });
        },
      });
    });
  }

  private playFeather(W: number, H: number) {
    // Feather dances, pet bats at it
    const feather = this.add.container(W * 0.5, H * 0.25);
    const featherG = this.add.graphics();
    featherG.fillStyle(0xff6688, 0.8);
    featherG.fillTriangle(0, 0, -5, -18, 5, -14);
    featherG.fillStyle(0xffaacc, 0.6);
    featherG.fillTriangle(-2, -14, -8, -26, 2, -20);
    featherG.lineStyle(1, 0xc8a060, 0.8);
    featherG.lineBetween(0, 0, 0, 20);
    feather.add(featherG);
    this.activeToy = feather;

    // Feather sways
    this.tweens.add({
      targets: feather,
      x: { from: W * 0.4, to: W * 0.6 },
      y: { from: H * 0.25, to: H * 0.35 },
      duration: 600,
      yoyo: true,
      repeat: 2,
      ease: "Sine.easeInOut",
      onComplete: () => {
        // Pet bats it
        this.tweens.add({
          targets: this.pet,
          x: feather.x,
          y: feather.y + 30,
          duration: 300,
          ease: "Power2",
          onComplete: () => {
            // Feather flies up
            this.tweens.add({
              targets: feather,
              y: feather.y - 60,
              rotation: Math.PI,
              alpha: 0,
              duration: 500,
              onComplete: () => {
                this.showPlayReaction("Swat!");
                this.finishPlaying(feather, "feather");
              },
            });
          },
        });
      },
    });
  }

  private playBone(W: number, H: number) {
    // Bone is thrown, pet fetches
    const bone = this.add.container(W * 0.2, H * 0.3);
    const boneG = this.add.graphics();
    boneG.fillStyle(0xf5e6d3, 1);
    boneG.fillRoundedRect(-15, -4, 30, 8, 3);
    boneG.fillCircle(-15, 0, 6);
    boneG.fillCircle(15, 0, 6);
    bone.add(boneG);
    this.activeToy = bone;

    // Bone arcs through air
    this.tweens.add({
      targets: bone,
      x: W * 0.8,
      duration: 900,
      ease: "Linear",
    });
    this.tweens.add({
      targets: bone,
      y: { from: H * 0.3, to: H * 0.7 },
      duration: 900,
      ease: "Bounce.easeOut",
    });
    this.tweens.add({
      targets: boneG,
      rotation: Math.PI * 3,
      duration: 900,
      ease: "Linear",
    });

    // Pet runs to fetch
    this.time.delayedCall(500, () => {
      this.tweens.add({
        targets: this.pet,
        x: W * 0.78,
        duration: 700,
        ease: "Power2",
        onComplete: () => {
          this.showPlayReaction("Fetch!");
          this.finishPlaying(bone, "bone");
        },
      });
    });
  }

  private showPlayReaction(text: string) {
    const reaction = this.add
      .text(this.pet.x, this.pet.y - 75, text, {
        fontSize: "18px",
        color: "#44aa44",
        fontFamily: "Nunito",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: reaction,
      alpha: 1,
      y: reaction.y - 30,
      duration: 500,
      onComplete: () => {
        this.tweens.add({
          targets: reaction,
          alpha: 0,
          duration: 400,
          delay: 400,
          onComplete: () => reaction.destroy(),
        });
      },
    });
  }

  private finishPlaying(toyObj: Phaser.GameObjects.Container, toyId: string) {
    // Destroy toy
    this.time.delayedCall(600, () => {
      toyObj.destroy();
      this.activeToy = undefined;

      // Happy emojis
      const emojis = ["\uD83C\uDF1F", "\uD83C\uDF89", "\uD83D\uDC95", "\u2728"];
      for (let i = 0; i < 4; i++) {
        this.time.delayedCall(i * 100, () => {
          const e = this.add
            .text(
              this.pet.x + Phaser.Math.Between(-30, 30),
              this.pet.y - 55,
              emojis[i % emojis.length],
              { fontSize: "18px" },
            )
            .setAlpha(0);

          this.tweens.add({
            targets: e,
            alpha: 1,
            y: e.y - 50,
            duration: 700,
            onComplete: () => {
              this.tweens.add({
                targets: e,
                alpha: 0,
                duration: 300,
                onComplete: () => e.destroy(),
              });
            },
          });
        });
      }

      // Return pet to center
      const W = this.scale.width;
      const H = this.scale.height;
      this.tweens.add({
        targets: this.pet,
        x: W * 0.5,
        y: H * 0.56,
        duration: 600,
        ease: "Power2",
        onComplete: () => {
          this.isPlaying = false;
        },
      });

      this.events.emit("petPlayed", toyId);
    });
  }

  // ─── Ambient Effects ───────────────────────────────────────────────────────

  private startAmbientEffects(W: number, H: number) {
    this.sparkleTimer = this.time.addEvent({
      delay: 2500,
      loop: true,
      callback: () => {
        const sparkles = ["\u2726", "\u00B7", "\u02DA", "\u2727", "\u22C6"];
        const s = this.add
          .text(
            Phaser.Math.Between(20, W - 20),
            Phaser.Math.Between(H * 0.1, H * 0.5),
            sparkles[Math.floor(Math.random() * sparkles.length)],
            {
              fontSize: Phaser.Math.Between(10, 16) + "px",
              color: "#88cc88",
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
