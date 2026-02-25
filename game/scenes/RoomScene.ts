import { CatType } from "@/types/cat";
import Phaser from "phaser";

export class RoomScene extends Phaser.Scene {
  private currentCatType: CatType = "black";
  private cat!: Phaser.GameObjects.Container;
  private catBody!: Phaser.GameObjects.Graphics;
  private catTail!: Phaser.GameObjects.Graphics;
  private furnitureItems: Phaser.GameObjects.Container[] = [];
  private floatingHearts: Phaser.GameObjects.Text[] = [];
  private idleTween!: Phaser.Tweens.Tween;
  private tailTween!: Phaser.Tweens.Tween;
  private particles!: Phaser.GameObjects.Group;
  private tooltipText!: Phaser.GameObjects.Container;
  private isReady = false;

  constructor() {
    super({ key: "RoomScene" });
  }

  preload() {
    // We'll draw everything procedurally — no external assets needed!
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    this.drawRoom(W, H);
    this.drawFurniture(W, H);
    this.drawCat(W, H);
    this.setupParticles();
    this.setupInteractions();
    this.startIdleAnimations();
    this.spawnSparkles(W, H);

    this.isReady = true;
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

    // Roof ridge line
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

    // Sky / outside scene
    g.fillStyle(0xc8e8ff, 0.9);
    g.fillRoundedRect(x + 5, y + 5, w - 10, h - 10, 7);

    // Little tree outside
    g.fillStyle(0xff9933, 0.8); // autumn tree
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
    // Vents
    g.lineStyle(1, 0xc0c0c0, 1);
    for (let i = 0; i < 4; i++) {
      g.lineBetween(x + 10 + i * 12, y + h - 10, x + 10 + i * 12, y + h - 4);
    }
    // Indicator light
    g.fillStyle(0x00cc88, 1);
    g.fillCircle(x + w - 12, y + h / 2, 4);
    // Mount bracket
    g.fillStyle(0xd0c0b0, 1);
    g.fillRect(x + 10, y - 6, w - 20, 8);
  }

  private drawWallHanging(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
  ) {
    // Wooden dowel
    g.fillStyle(0xc8a060, 1);
    g.fillRoundedRect(x - 30, y, 60, 6, 3);
    // Macrame strings
    g.lineStyle(2, 0xe8d5b0, 1);
    const strings = [-20, -8, 4, 16];
    strings.forEach((sx, i) => {
      g.lineBetween(x + sx, y + 6, x + sx + (i % 2 === 0 ? -4 : 4), y + 50);
    });
    // Star shape
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
    // Outer rug
    g.fillStyle(0xffffff, 0.95);
    g.fillEllipse(cx, cy, 300, 90);
    g.lineStyle(3, 0xf0d0d8, 1);
    g.strokeEllipse(cx, cy, 300, 90);
    // Inner pattern ring
    g.lineStyle(2, 0xffb7c5, 0.5);
    g.strokeEllipse(cx, cy, 240, 70);
    // Tiny dots
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

    // Bed frame
    g.fillStyle(0xdeb887, 1);
    g.fillRoundedRect(bx, by, bw, bh, 10);

    // Mattress
    g.fillStyle(0xfff8f0, 1);
    g.fillRoundedRect(bx + 6, by + 8, bw - 12, bh - 16, 8);

    // Blanket / duvet
    g.fillStyle(0xffd6d6, 1);
    g.fillRoundedRect(bx + 6, by + 35, bw - 12, bh - 43, 8);

    // Duvet pattern lines
    g.lineStyle(1, 0xffc0c0, 0.5);
    for (let i = 0; i < 4; i++) {
      const dy = by + 45 + i * 14;
      g.lineBetween(bx + 10, dy, bx + bw - 10, dy);
    }

    // Pillow
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(bx + 12, by + 12, 65, 40, 12);
    g.lineStyle(2, 0xf0d0d0, 1);
    g.strokeRoundedRect(bx + 12, by + 12, 65, 40, 12);

    // Second pillow
    g.fillStyle(0xffe0f0, 1);
    g.fillRoundedRect(bx + 88, by + 12, 65, 40, 12);
    g.lineStyle(2, 0xf0d0d0, 1);
    g.strokeRoundedRect(bx + 88, by + 12, 65, 40, 12);

    // Headboard
    g.fillStyle(0xc8945a, 1);
    g.fillRoundedRect(bx - 5, by - 30, bw + 10, 38, 12);
    g.lineStyle(2, 0xb08040, 1);
    g.strokeRoundedRect(bx - 5, by - 30, bw + 10, 38, 12);

    // Bed legs
    g.fillStyle(0xb08040, 1);
    g.fillRoundedRect(bx + 10, by + bh, 16, 18, 4);
    g.fillRoundedRect(bx + bw - 26, by + bh, 16, 18, 4);

    // Lamp on headboard
    this.drawLamp(g, bx + bw + 10, by - 40);

    // Small photo frame on headboard
    g.fillStyle(0xd4a870, 1);
    g.fillRoundedRect(bx + 15, by - 22, 28, 22, 3);
    g.fillStyle(0xb0d4f0, 1);
    g.fillRect(bx + 18, by - 19, 22, 16);
  }

  private drawLamp(g: Phaser.GameObjects.Graphics, x: number, y: number) {
    // Lamp shade
    g.fillStyle(0xffeedd, 1);
    g.fillTriangle(x - 18, y + 30, x + 18, y + 30, x, y);
    g.lineStyle(2, 0xd4a870, 1);
    g.strokeTriangle(x - 18, y + 30, x + 18, y + 30, x, y);
    // Pole
    g.lineStyle(3, 0xc8a060, 1);
    g.lineBetween(x, y + 30, x, y + 70);
    // Base
    g.fillStyle(0xc8a060, 1);
    g.fillEllipse(x, y + 75, 28, 10);
    // Glow
    g.fillStyle(0xffffcc, 0.15);
    g.fillCircle(x, y + 20, 35);
  }

  private drawBookshelf(W: number, H: number) {
    const g = this.add.graphics();
    const sx = W * 0.72;
    const sy = H * 0.42;
    const sw = 80;
    const sh = 160;

    // Shelf body
    g.fillStyle(0xc8a060, 1);
    g.fillRoundedRect(sx, sy, sw, sh, 6);

    // Shelves
    g.fillStyle(0xb08040, 1);
    g.fillRect(sx, sy + 55, sw, 6);
    g.fillRect(sx, sy + 110, sw, 6);

    // Books row 1
    const bookColors1 = [0xff9999, 0x99ccff, 0xffcc88, 0xcc99ff];
    bookColors1.forEach((c, i) => {
      g.fillStyle(c, 1);
      g.fillRoundedRect(sx + 5 + i * 17, sy + 12, 14, 40, 2);
    });

    // Books row 2
    const bookColors2 = [0x99ffcc, 0xffb7c5, 0xaaddff, 0xffdd88];
    bookColors2.forEach((c, i) => {
      g.fillStyle(c, 1);
      g.fillRoundedRect(sx + 5 + i * 17, sy + 65, 14, 40, 2);
    });

    // Small plant on top
    g.fillStyle(0xd4a870, 1);
    g.fillEllipse(sx + sw / 2, sy - 5, 24, 16);
    g.fillStyle(0x66bb66, 1);
    g.fillEllipse(sx + sw / 2 - 8, sy - 18, 18, 22);
    g.fillEllipse(sx + sw / 2 + 8, sy - 20, 16, 20);
    g.fillEllipse(sx + sw / 2, sy - 24, 14, 18);

    // Cat figurine row 3
    this.add.text(sx + 14, sy + 120, "\uD83D\uDC31", { fontSize: "18px" });
    this.add.text(sx + 44, sy + 118, "\u2B50", { fontSize: "14px" });
  }

  private drawPhotograph(W: number, H: number) {
    const g = this.add.graphics();
    const px = W * 0.5;
    const py = H * 0.3;
    // Frame
    g.fillStyle(0xdeb887, 1);
    g.fillRoundedRect(px, py, 52, 44, 4);
    g.fillStyle(0xc8e8ff, 1);
    g.fillRect(px + 4, py + 4, 44, 36);
    // Simple house drawing inside
    g.fillStyle(0xffcc88, 0.6);
    g.fillRect(px + 12, py + 20, 24, 16);
    g.fillStyle(0xff9999, 0.7);
    g.fillTriangle(px + 10, py + 20, px + 36, py + 20, px + 24, py + 10);
  }

  private drawMobile(W: number, H: number) {
    const g = this.add.graphics();
    const mx = W * 0.28;
    const my = H * 0.22;

    // Horizontal bar
    g.fillStyle(0xc8a060, 1);
    g.fillRoundedRect(mx - 45, my, 90, 5, 2);

    // Strings and charms
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

    // Attach cord to ceiling
    g.lineStyle(2, 0xc8a060, 0.8);
    g.lineBetween(mx, 0, mx, my);
  }

  // ─── Cat Character ─────────────────────────────────────────────────────────

  private drawCat(W: number, H: number) {
    this.cat = this.add.container(W * 0.45, H * 0.55);

    this.catBody = this.add.graphics();
    this.catTail = this.add.graphics();

    this.drawCatGraphics(this.catBody, this.catTail, this.currentCatType);

    this.cat.add([this.catTail, this.catBody]);

    const sparkle = this.add.text(-5, -68, "\u2728", { fontSize: "14px" });
    this.cat.add(sparkle);

    this.setupCatInteraction();
  }

  private setupCatInteraction() {
    this.catBody.setInteractive(
      new Phaser.Geom.Circle(0, -15, 50),
      Phaser.Geom.Circle.Contains,
    );

    this.catBody.on("pointerover", () => {
      const name = this.currentCatType.replace("_", " ");
      this.showTooltip(`Pat the ${name} cat!`);
      this.game.canvas.style.cursor = "pointer";
    });

    this.catBody.on("pointerout", () => {
      this.hideTooltip();
      this.game.canvas.style.cursor = "default";
    });

    this.catBody.on("pointerdown", () => {
      this.patCat();
    });
  }

  private drawCatGraphics(
    body: Phaser.GameObjects.Graphics,
    tail: Phaser.GameObjects.Graphics,
    type: CatType,
  ) {
    body.clear();
    tail.clear();

    // ───── COLOR PRESETS ─────
    let mainColor = 0xf5ebe0;
    let earInner = 0xffb7c5;
    let noseColor = 0xff9999;
    let eyeColor = 0x554433;
    let patternColor = 0xffffff;
    let bellyColor = -1; // -1 means no separate belly
    let hasStripes = false;
    let hasSpots = false;
    let hasTicking = false;
    let isSphynx = false;
    let isScottishFold = false;
    let isMaineCoon = false;
    let isPersian = false;
    let openEyes = false;

    switch (type) {
      case "siamese":
        mainColor = 0xf5e6c8;
        patternColor = 0x6b4f3b;
        noseColor = 0x884444;
        break;

      case "persian":
        mainColor = 0xf0e8e0;
        patternColor = 0xe8ddd0;
        noseColor = 0xffaaaa;
        isPersian = true;
        break;

      case "maine_coon":
        mainColor = 0x8b6842;
        patternColor = 0x5c4030;
        bellyColor = 0xd4b896;
        noseColor = 0xcc7777;
        hasStripes = true;
        isMaineCoon = true;
        break;

      case "british_shorthair":
        mainColor = 0x8899aa;
        patternColor = 0x7788a0;
        noseColor = 0xcc8888;
        eyeColor = 0xcc8822; // copper eyes
        openEyes = true;
        break;

      case "ragdoll":
        mainColor = 0xf5f0e8;
        patternColor = 0x9baab8; // blue-gray points
        noseColor = 0xddaaaa;
        bellyColor = 0xffffff;
        break;

      case "bengal":
        mainColor = 0xd4a44c;
        patternColor = 0x5c3a1a;
        noseColor = 0xcc6655;
        hasSpots = true;
        openEyes = true;
        eyeColor = 0x55aa44; // green eyes
        break;

      case "sphynx":
        mainColor = 0xe8c8b0;
        earInner = 0xddb8a0;
        noseColor = 0xddaaaa;
        eyeColor = 0x55aa88; // green eyes
        isSphynx = true;
        openEyes = true;
        break;

      case "scottish_fold":
        mainColor = 0xb0b8c0;
        patternColor = 0xa0a8b0;
        noseColor = 0xddaaaa;
        eyeColor = 0xdd8822; // amber eyes
        isScottishFold = true;
        openEyes = true;
        break;

      case "abyssinian":
        mainColor = 0xc47a40;
        patternColor = 0xa86030;
        noseColor = 0xcc6655;
        hasTicking = true;
        break;

      case "american_shorthair":
        mainColor = 0xc0c0c0;
        patternColor = 0x606060;
        noseColor = 0xdd8888;
        hasStripes = true;
        break;

      case "orange":
        mainColor = 0xffb347;
        patternColor = 0xff9933;
        hasStripes = true;
        break;

      case "black":
        mainColor = 0x222222;
        earInner = 0x444444;
        noseColor = 0xff77aa;
        eyeColor = 0xffffff;
        openEyes = true;
        break;

      case "gray":
        mainColor = 0xcfd2d6;
        patternColor = 0xb0b4ba;
        hasStripes = true;
        break;

      case "calico":
        mainColor = 0xffffff;
        break;
    }

    // ───── TAIL ─────
    const tailCurve = new Phaser.Curves.CubicBezier(
      new Phaser.Math.Vector2(20, 20),
      new Phaser.Math.Vector2(60, 10),
      new Phaser.Math.Vector2(70, -20),
      new Phaser.Math.Vector2(50, -40),
    );

    // Maine Coon: bushy tail
    if (isMaineCoon) {
      tail.lineStyle(16, mainColor, 1);
      tail.strokePoints(tailCurve.getPoints(32), false, false);
      tail.lineStyle(10, patternColor, 0.5);
      tail.strokePoints(tailCurve.getPoints(32), false, false);
    } else if (isSphynx) {
      // Sphynx: thin whip tail
      tail.lineStyle(5, mainColor, 1);
      tail.strokePoints(tailCurve.getPoints(32), false, false);
    } else {
      tail.lineStyle(10, mainColor, 1);
      tail.strokePoints(tailCurve.getPoints(32), false, false);
    }

    // Siamese / Ragdoll darker tail tip
    if (type === "siamese" || type === "ragdoll") {
      tail.lineStyle(6, patternColor, 1);
      tail.strokePoints(tailCurve.getPoints(32), false, false);
    }

    // ───── BODY ─────
    // Maine Coon: slightly bigger body
    const bodyW = isMaineCoon ? 90 : 80;
    const bodyH = isMaineCoon ? 82 : 75;

    body.fillStyle(mainColor, 1);
    body.fillEllipse(0, 10, bodyW, bodyH);

    // Belly for breeds that have it
    if (bellyColor !== -1) {
      body.fillStyle(bellyColor, 0.8);
      body.fillEllipse(0, 18, bodyW * 0.55, bodyH * 0.55);
    }

    // Persian: extra fluffy outline
    if (isPersian) {
      body.lineStyle(4, patternColor, 0.3);
      body.strokeEllipse(0, 10, bodyW + 8, bodyH + 8);
      body.strokeEllipse(0, 10, bodyW + 14, bodyH + 12);
    }

    // Maine Coon: chest ruff
    if (isMaineCoon) {
      body.fillStyle(bellyColor !== -1 ? bellyColor : mainColor, 0.7);
      body.fillEllipse(0, -8, 50, 35);
    }

    // Sphynx: wrinkle lines on body
    if (isSphynx) {
      body.lineStyle(1, 0xd0b098, 0.4);
      for (let i = -2; i <= 2; i++) {
        body.lineBetween(i * 10 - 5, -5, i * 10 + 5, 25);
      }
    }

    // Pattern patches (calico)
    if (type === "calico") {
      body.fillStyle(0xff9933, 1);
      body.fillCircle(-20, 10, 20);
      body.fillStyle(0x333333, 1);
      body.fillCircle(25, 0, 18);
    }

    // Stripes
    if (hasStripes) {
      body.fillStyle(patternColor, 0.6);
      for (let i = -2; i <= 2; i++) {
        body.fillEllipse(i * 12, 5, 10, 30);
      }
    }

    // Spots (Bengal)
    if (hasSpots) {
      body.fillStyle(patternColor, 0.8);
      const spotPositions = [
        { x: -22, y: 0, r: 8 },
        { x: 8, y: -5, r: 7 },
        { x: 22, y: 8, r: 9 },
        { x: -8, y: 18, r: 7 },
        { x: 18, y: 22, r: 6 },
        { x: -18, y: 22, r: 5 },
        { x: 0, y: 10, r: 8 },
      ];
      spotPositions.forEach((s) => {
        // Rosette: darker ring with lighter center
        body.fillStyle(patternColor, 0.8);
        body.fillCircle(s.x, s.y, s.r);
        body.fillStyle(mainColor, 0.6);
        body.fillCircle(s.x, s.y, s.r * 0.5);
      });
    }

    // Ticking (Abyssinian) - alternating light/dark fur look
    if (hasTicking) {
      body.fillStyle(patternColor, 0.35);
      for (let i = -3; i <= 3; i++) {
        for (let j = -1; j <= 2; j++) {
          body.fillCircle(i * 10, j * 12 + 5, 4);
        }
      }
    }

    // ───── HEAD ─────
    const headR = isPersian ? 42 : isMaineCoon ? 40 : 38;
    body.fillStyle(mainColor, 1);
    body.fillCircle(0, -32, headR);

    // Persian: flatter, rounder face overlay
    if (isPersian) {
      body.fillStyle(mainColor, 1);
      body.fillEllipse(0, -28, headR * 2.2, headR * 1.8);
      // Fluffy cheeks
      body.fillStyle(patternColor, 0.3);
      body.fillCircle(-18, -22, 14);
      body.fillCircle(18, -22, 14);
    }

    // Siamese / Ragdoll face mask
    if (type === "siamese" || type === "ragdoll") {
      body.fillStyle(patternColor, 1);
      body.fillEllipse(0, -28, 55, 40);
    }

    // British Shorthair: round chubby cheeks
    if (type === "british_shorthair") {
      body.fillStyle(mainColor, 1);
      body.fillCircle(-18, -22, 16);
      body.fillCircle(18, -22, 16);
    }

    // Scottish Fold: round face
    if (isScottishFold) {
      body.fillStyle(mainColor, 1);
      body.fillCircle(-16, -24, 14);
      body.fillCircle(16, -24, 14);
    }

    // ───── EARS ─────
    if (isScottishFold) {
      // Folded ears - smaller, bent forward
      body.fillStyle(mainColor, 1);
      body.fillTriangle(-24, -55, -12, -58, -20, -42);
      body.fillTriangle(24, -55, 12, -58, 20, -42);
      // Fold crease
      body.lineStyle(1.5, earInner, 0.5);
      body.lineBetween(-22, -52, -16, -46);
      body.lineBetween(22, -52, 16, -46);
    } else if (isSphynx) {
      // Sphynx: very large ears
      body.fillStyle(mainColor, 1);
      body.fillTriangle(-32, -70, -6, -60, -22, -35);
      body.fillTriangle(32, -70, 6, -60, 22, -35);
      body.fillStyle(earInner, 0.6);
      body.fillTriangle(-28, -66, -10, -58, -20, -40);
      body.fillTriangle(28, -66, 10, -58, 20, -40);
    } else if (isMaineCoon) {
      // Maine Coon: tufted ears (taller)
      body.fillStyle(mainColor, 1);
      body.fillTriangle(-30, -68, -8, -62, -20, -35);
      body.fillTriangle(30, -68, 8, -62, 20, -35);
      body.fillStyle(earInner, 1);
      body.fillTriangle(-26, -64, -12, -60, -18, -42);
      body.fillTriangle(26, -64, 12, -60, 18, -42);
      // Ear tufts
      body.lineStyle(2, patternColor, 0.7);
      body.lineBetween(-28, -68, -30, -76);
      body.lineBetween(-26, -68, -24, -76);
      body.lineBetween(28, -68, 30, -76);
      body.lineBetween(26, -68, 24, -76);
    } else {
      // Normal ears
      body.fillStyle(mainColor, 1);
      body.fillTriangle(-28, -60, -10, -62, -20, -35);
      body.fillTriangle(28, -60, 10, -62, 20, -35);

      body.fillStyle(earInner, 1);
      body.fillTriangle(-24, -58, -13, -58, -18, -40);
      body.fillTriangle(24, -58, 13, -58, 18, -40);
    }

    // Siamese / Ragdoll dark ear tips
    if (type === "siamese" || type === "ragdoll") {
      body.fillStyle(patternColor, 0.7);
      body.fillTriangle(-27, -60, -12, -60, -20, -48);
      body.fillTriangle(27, -60, 12, -60, 20, -48);
    }

    // ───── EYES ─────
    body.lineStyle(3, eyeColor, 1);

    if (openEyes || type === "black") {
      // Open round eyes
      body.fillStyle(0xffffff, 1);
      body.fillCircle(-13, -34, 7);
      body.fillCircle(13, -34, 7);
      body.fillStyle(eyeColor, 1);
      body.fillCircle(-13, -34, 4);
      body.fillCircle(13, -34, 4);
      // Pupil
      body.fillStyle(0x000000, 1);
      body.fillCircle(-13, -34, 2);
      body.fillCircle(13, -34, 2);
      // Eye shine
      body.fillStyle(0xffffff, 1);
      body.fillCircle(-11, -36, 1.5);
      body.fillCircle(15, -36, 1.5);
    } else if (isPersian) {
      // Persian: big round sleepy eyes (slightly open)
      body.fillStyle(0xffffff, 1);
      body.fillEllipse(-13, -30, 14, 10);
      body.fillEllipse(13, -30, 14, 10);
      body.fillStyle(0xcc8833, 1);
      body.fillEllipse(-13, -30, 8, 8);
      body.fillEllipse(13, -30, 8, 8);
      body.fillStyle(0x000000, 1);
      body.fillCircle(-13, -30, 3);
      body.fillCircle(13, -30, 3);
      body.fillStyle(0xffffff, 1);
      body.fillCircle(-11, -32, 1.5);
      body.fillCircle(15, -32, 1.5);
    } else {
      // Closed/squinting eyes (happy look)
      body.beginPath();
      body.arc(-13, -34, 8, 0, Math.PI, true);
      body.strokePath();
      body.beginPath();
      body.arc(13, -34, 8, 0, Math.PI, true);
      body.strokePath();
    }

    // Sphynx: wrinkle lines on forehead
    if (isSphynx) {
      body.lineStyle(1, 0xd0b098, 0.35);
      body.lineBetween(-15, -48, 15, -48);
      body.lineBetween(-12, -44, 12, -44);
    }

    // ───── NOSE ─────
    if (isPersian) {
      // Persian: tiny flat nose higher up
      body.fillStyle(noseColor, 1);
      body.fillCircle(0, -24, 4);
    } else {
      body.fillStyle(noseColor, 1);
      body.fillTriangle(-4, -22, 4, -22, 0, -17);
    }

    // Siamese / Ragdoll darker nose area
    if (type === "siamese") {
      body.fillStyle(patternColor, 0.4);
      body.fillEllipse(0, -20, 20, 14);
      body.fillStyle(noseColor, 1);
      body.fillTriangle(-4, -22, 4, -22, 0, -17);
    }

    // ───── WHISKERS ─────
    body.lineStyle(1.5, 0xaaaaaa, 0.8);
    body.lineBetween(-38, -22, -18, -20);
    body.lineBetween(38, -22, 18, -20);
    // Extra whiskers for some breeds
    if (isMaineCoon || isPersian || type === "british_shorthair") {
      body.lineBetween(-36, -18, -18, -17);
      body.lineBetween(36, -18, 18, -17);
    }

    // ───── PAWS (Siamese/Ragdoll dark paws) ─────
    if (type === "siamese" || type === "ragdoll") {
      body.fillStyle(patternColor, 0.8);
      body.fillEllipse(-18, 42, 18, 10);
      body.fillEllipse(18, 42, 18, 10);
    }
  }

  public isSceneReady(): boolean {
    return this.isReady;
  }

  public setCatType(type: CatType) {
    this.currentCatType = type;

    if (this.cat) {
      // Stop all tweens on the old cat first
      this.tweens.killTweensOf(this.cat);

      // Destroy the entire container and all its children
      this.cat.destroy();

      // Get the original position
      const W = this.scale.width;
      const H = this.scale.height;

      // Recreate everything from scratch
      this.cat = this.add.container(W * 0.45, H * 0.55);

      this.catBody = this.add.graphics();
      this.catTail = this.add.graphics();

      // Draw the new cat
      this.drawCatGraphics(this.catBody, this.catTail, type);

      // Add graphics to container
      this.cat.add([this.catTail, this.catBody]);

      // Add sparkle
      const sparkle = this.add.text(-5, -68, "\u2728", { fontSize: "14px" });
      this.cat.add(sparkle);

      // Re-setup interactive events
      this.setupCatInteraction();

      // Restart idle animations on the NEW cat
      this.idleTween = this.tweens.add({
        targets: this.cat,
        y: this.cat.y + 5,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }
  }

  // ─── Particles & Interactions ───────────────────────────────────────────────

  private setupParticles() {
    this.particles = this.add.group();
  }

  private patCat() {
    // Bounce animation
    this.tweens.add({
      targets: this.cat,
      y: this.cat.y - 20,
      duration: 150,
      yoyo: true,
      ease: "Back.easeOut",
    });

    // Spawn hearts
    const emojis = [
      "\uD83D\uDC95",
      "\u2764\uFE0F",
      "\uD83D\uDC96",
      "\u2728",
      "\uD83C\uDF38",
    ];
    for (let i = 0; i < 5; i++) {
      this.time.delayedCall(i * 80, () => {
        const e = emojis[Math.floor(Math.random() * emojis.length)];
        const heart = this.add.text(
          this.cat.x + Phaser.Math.Between(-40, 40),
          this.cat.y - 60,
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

    // Notify React UI
    this.events.emit("catPatted");
  }

  private setupInteractions() {
    // Tooltip container
    this.tooltipText = this.add.container(0, 0);
    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 0.92);
    bg.fillRoundedRect(0, 0, 140, 30, 15);
    bg.lineStyle(2, 0xffb7c5, 1);
    bg.strokeRoundedRect(0, 0, 140, 30, 15);
    const txt = this.add
      .text(70, 15, "", {
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
    this.tooltipText.setPosition(this.cat.x - 70, this.cat.y - 120);
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
    // Cat breathing bob
    this.idleTween = this.tweens.add({
      targets: this.cat,
      y: this.cat.y + 5,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Mobile charm sway
    this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: () => {
        // subtle scene camera shift
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
    // Tail wag - slow sine motion
    const t = this.time.now / 1000;
    this.cat.rotation = Math.sin(t * 0.8) * 0.04;
  }
}
