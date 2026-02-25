import Phaser from "phaser";
import { CatType } from "@/types/cat";
import { BreedConfig, BREED_CONFIGS } from "./catBreeds";

/**
 * Draws the cat body + tail onto Phaser Graphics objects
 * based on the breed config. All breed-specific visual logic lives here.
 */
export function drawCatGraphics(
  body: Phaser.GameObjects.Graphics,
  tail: Phaser.GameObjects.Graphics,
  type: CatType,
) {
  body.clear();
  tail.clear();

  const cfg = BREED_CONFIGS[type];

  drawTail(tail, cfg, type);
  drawBody(body, cfg, type);
  drawHead(body, cfg, type);
  drawEars(body, cfg);
  drawEyes(body, cfg);
  drawNose(body, cfg, type);
  drawWhiskers(body, cfg, type);
  drawPaws(body, cfg, type);
}

// ─── TAIL ────────────────────────────────────────────────────────────────────

function drawTail(
  tail: Phaser.GameObjects.Graphics,
  cfg: BreedConfig,
  type: CatType,
) {
  const tailCurve = new Phaser.Curves.CubicBezier(
    new Phaser.Math.Vector2(20, 20),
    new Phaser.Math.Vector2(60, 10),
    new Phaser.Math.Vector2(70, -20),
    new Phaser.Math.Vector2(50, -40),
  );

  if (cfg.isMaineCoon || cfg.hasFluffyTail) {
    // Bushy / fluffy tail
    tail.lineStyle(16, cfg.mainColor, 1);
    tail.strokePoints(tailCurve.getPoints(32), false, false);
    tail.lineStyle(10, cfg.patternColor, 0.5);
    tail.strokePoints(tailCurve.getPoints(32), false, false);
  } else if (cfg.isSphynx) {
    // Thin whip tail
    tail.lineStyle(5, cfg.mainColor, 1);
    tail.strokePoints(tailCurve.getPoints(32), false, false);
  } else if (cfg.hasCurlyFur) {
    // Slightly wavy-looking tail (thinner with texture)
    tail.lineStyle(8, cfg.mainColor, 1);
    tail.strokePoints(tailCurve.getPoints(32), false, false);
    // Wavy overlay
    tail.lineStyle(2, cfg.patternColor, 0.3);
    const pts = tailCurve.getPoints(32);
    for (let i = 0; i < pts.length - 1; i += 3) {
      tail.lineBetween(
        pts[i].x + (i % 2 === 0 ? 2 : -2),
        pts[i].y,
        pts[i + 1]?.x ?? pts[i].x,
        pts[i + 1]?.y ?? pts[i].y,
      );
    }
  } else {
    tail.lineStyle(10, cfg.mainColor, 1);
    tail.strokePoints(tailCurve.getPoints(32), false, false);
  }

  // Pointed breeds: darker tail tip
  if (cfg.hasPointedPattern) {
    tail.lineStyle(6, cfg.patternColor, 1);
    tail.strokePoints(tailCurve.getPoints(32), false, false);
  }
}

// ─── BODY ────────────────────────────────────────────────────────────────────

function drawBody(
  body: Phaser.GameObjects.Graphics,
  cfg: BreedConfig,
  type: CatType,
) {
  // Oriental / Devon Rex: slender body
  const isSlender = cfg.isOriental;
  const bodyW = cfg.isMaineCoon ? 90 : isSlender ? 70 : 80;
  const bodyH = cfg.isMaineCoon ? 82 : isSlender ? 68 : 75;

  body.fillStyle(cfg.mainColor, 1);
  body.fillEllipse(0, 10, bodyW, bodyH);

  // Belly
  if (cfg.bellyColor !== -1) {
    body.fillStyle(cfg.bellyColor, 0.8);
    body.fillEllipse(0, 18, bodyW * 0.55, bodyH * 0.55);
  }

  // Persian / Exotic Shorthair: extra fluffy outline
  if (cfg.isPersian) {
    body.lineStyle(4, cfg.patternColor, 0.3);
    body.strokeEllipse(0, 10, bodyW + 8, bodyH + 8);
    body.strokeEllipse(0, 10, bodyW + 14, bodyH + 12);
  }

  // Maine Coon / Norwegian Forest: chest ruff
  if (cfg.isMaineCoon) {
    body.fillStyle(cfg.bellyColor !== -1 ? cfg.bellyColor : cfg.mainColor, 0.7);
    body.fillEllipse(0, -8, 50, 35);
  }

  // Sphynx: wrinkle lines on body
  if (cfg.isSphynx) {
    body.lineStyle(1, 0xd0b098, 0.4);
    for (let i = -2; i <= 2; i++) {
      body.lineBetween(i * 10 - 5, -5, i * 10 + 5, 25);
    }
  }

  // Curly fur texture (Cornish Rex, Devon Rex)
  if (cfg.hasCurlyFur) {
    body.lineStyle(1, cfg.patternColor, 0.25);
    for (let row = -2; row <= 2; row++) {
      for (let col = -2; col <= 2; col++) {
        const cx = col * 12;
        const cy = row * 10 + 8;
        body.beginPath();
        body.arc(cx, cy, 5, 0, Math.PI, false);
        body.strokePath();
      }
    }
  }

  // Calico patches
  if (type === "calico") {
    body.fillStyle(0xff9933, 1);
    body.fillCircle(-20, 10, 20);
    body.fillStyle(0x333333, 1);
    body.fillCircle(25, 0, 18);
  }

  // Stripes
  if (cfg.hasStripes) {
    body.fillStyle(cfg.patternColor, 0.6);
    for (let i = -2; i <= 2; i++) {
      body.fillEllipse(i * 12, 5, 10, 30);
    }
  }

  // Spots (Bengal rosettes)
  if (cfg.hasSpots) {
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
      body.fillStyle(cfg.patternColor, 0.8);
      body.fillCircle(s.x, s.y, s.r);
      body.fillStyle(cfg.mainColor, 0.6);
      body.fillCircle(s.x, s.y, s.r * 0.5);
    });
  }

  // Ticking (Abyssinian)
  if (cfg.hasTicking) {
    body.fillStyle(cfg.patternColor, 0.35);
    for (let i = -3; i <= 3; i++) {
      for (let j = -1; j <= 2; j++) {
        body.fillCircle(i * 10, j * 12 + 5, 4);
      }
    }
  }
}

// ─── HEAD ────────────────────────────────────────────────────────────────────

function drawHead(
  body: Phaser.GameObjects.Graphics,
  cfg: BreedConfig,
  type: CatType,
) {
  const headR = cfg.isPersian
    ? 42
    : cfg.isMaineCoon
      ? 40
      : cfg.isOriental
        ? 35
        : 38;

  body.fillStyle(cfg.mainColor, 1);
  body.fillCircle(0, -32, headR);

  // Persian / Exotic Shorthair: flatter, rounder face
  if (cfg.isPersian) {
    body.fillStyle(cfg.mainColor, 1);
    body.fillEllipse(0, -28, headR * 2.2, headR * 1.8);
    // Fluffy cheeks
    body.fillStyle(cfg.patternColor, 0.3);
    body.fillCircle(-18, -22, 14);
    body.fillCircle(18, -22, 14);
  }

  // Oriental: slightly elongated head
  if (cfg.isOriental && !cfg.isPersian) {
    body.fillStyle(cfg.mainColor, 1);
    body.fillEllipse(0, -32, 64, 70);
  }

  // Pointed pattern face mask (Siamese, Ragdoll, Birman, Balinese, Himalayan)
  if (cfg.hasPointedPattern) {
    body.fillStyle(cfg.patternColor, cfg.isPersian ? 0.7 : 1);
    body.fillEllipse(0, -28, 55, 40);
  }

  // British Shorthair: round chubby cheeks
  if (type === "british_shorthair") {
    body.fillStyle(cfg.mainColor, 1);
    body.fillCircle(-18, -22, 16);
    body.fillCircle(18, -22, 16);
  }

  // Scottish Fold: round face
  if (cfg.isScottishFold) {
    body.fillStyle(cfg.mainColor, 1);
    body.fillCircle(-16, -24, 14);
    body.fillCircle(16, -24, 14);
  }

  // Russian Blue: slightly wedge-shaped, silver shimmer
  if (type === "russian_blue") {
    body.fillStyle(0x90a8c0, 0.15); // silver-tipped shimmer
    body.fillCircle(0, -32, 36);
  }
}

// ─── EARS ────────────────────────────────────────────────────────────────────

function drawEars(body: Phaser.GameObjects.Graphics, cfg: BreedConfig) {
  if (cfg.isScottishFold) {
    // Folded ears - smaller, bent forward
    body.fillStyle(cfg.mainColor, 1);
    body.fillTriangle(-24, -55, -12, -58, -20, -42);
    body.fillTriangle(24, -55, 12, -58, 20, -42);
    body.lineStyle(1.5, cfg.earInner, 0.5);
    body.lineBetween(-22, -52, -16, -46);
    body.lineBetween(22, -52, 16, -46);
  } else if (cfg.isSphynx) {
    // Very large ears
    body.fillStyle(cfg.mainColor, 1);
    body.fillTriangle(-32, -70, -6, -60, -22, -35);
    body.fillTriangle(32, -70, 6, -60, 22, -35);
    body.fillStyle(cfg.earInner, 0.6);
    body.fillTriangle(-28, -66, -10, -58, -20, -40);
    body.fillTriangle(28, -66, 10, -58, 20, -40);
  } else if (cfg.isOriental) {
    // Very large, wide-set ears (Oriental, Devon Rex)
    body.fillStyle(cfg.mainColor, 1);
    body.fillTriangle(-34, -68, -6, -58, -24, -32);
    body.fillTriangle(34, -68, 6, -58, 24, -32);
    body.fillStyle(cfg.earInner, 0.7);
    body.fillTriangle(-30, -64, -10, -56, -22, -38);
    body.fillTriangle(30, -64, 10, -56, 22, -38);
  } else if (cfg.isMaineCoon) {
    // Tufted ears (taller)
    body.fillStyle(cfg.mainColor, 1);
    body.fillTriangle(-30, -68, -8, -62, -20, -35);
    body.fillTriangle(30, -68, 8, -62, 20, -35);
    body.fillStyle(cfg.earInner, 1);
    body.fillTriangle(-26, -64, -12, -60, -18, -42);
    body.fillTriangle(26, -64, 12, -60, 18, -42);
    // Ear tufts
    body.lineStyle(2, cfg.patternColor, 0.7);
    body.lineBetween(-28, -68, -30, -76);
    body.lineBetween(-26, -68, -24, -76);
    body.lineBetween(28, -68, 30, -76);
    body.lineBetween(26, -68, 24, -76);
  } else {
    // Normal ears
    body.fillStyle(cfg.mainColor, 1);
    body.fillTriangle(-28, -60, -10, -62, -20, -35);
    body.fillTriangle(28, -60, 10, -62, 20, -35);
    body.fillStyle(cfg.earInner, 1);
    body.fillTriangle(-24, -58, -13, -58, -18, -40);
    body.fillTriangle(24, -58, 13, -58, 18, -40);
  }

  // Pointed breeds: dark ear tips
  if (cfg.hasPointedPattern && !cfg.isScottishFold) {
    body.fillStyle(cfg.patternColor, 0.7);
    // Adjust for large ear breeds
    if (cfg.isMaineCoon) {
      body.fillTriangle(-29, -68, -10, -62, -22, -52);
      body.fillTriangle(29, -68, 10, -62, 22, -52);
    } else {
      body.fillTriangle(-27, -60, -12, -60, -20, -48);
      body.fillTriangle(27, -60, 12, -60, 20, -48);
    }
  }
}

// ─── EYES ────────────────────────────────────────────────────────────────────

function drawEyes(body: Phaser.GameObjects.Graphics, cfg: BreedConfig) {
  body.lineStyle(3, cfg.eyeColor, 1);

  if (cfg.openEyes) {
    // Open round eyes
    body.fillStyle(0xffffff, 1);
    body.fillCircle(-13, -34, 7);
    body.fillCircle(13, -34, 7);
    body.fillStyle(cfg.eyeColor, 1);
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
  } else if (cfg.isPersian) {
    // Persian: big round sleepy eyes
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
  if (cfg.isSphynx) {
    body.lineStyle(1, 0xd0b098, 0.35);
    body.lineBetween(-15, -48, 15, -48);
    body.lineBetween(-12, -44, 12, -44);
  }

  // Curly fur breeds: subtle brow curl
  if (cfg.hasCurlyFur) {
    body.lineStyle(1, cfg.patternColor, 0.3);
    body.beginPath();
    body.arc(-13, -42, 6, 0.2, Math.PI - 0.2, false);
    body.strokePath();
    body.beginPath();
    body.arc(13, -42, 6, 0.2, Math.PI - 0.2, false);
    body.strokePath();
  }
}

// ─── NOSE ────────────────────────────────────────────────────────────────────

function drawNose(
  body: Phaser.GameObjects.Graphics,
  cfg: BreedConfig,
  type: CatType,
) {
  if (cfg.isPersian) {
    // Flat nose, higher up
    body.fillStyle(cfg.noseColor, 1);
    body.fillCircle(0, -24, 4);
  } else {
    body.fillStyle(cfg.noseColor, 1);
    body.fillTriangle(-4, -22, 4, -22, 0, -17);
  }

  // Pointed pattern breeds: darker nose area overlay
  if (cfg.hasPointedPattern && type === "siamese") {
    body.fillStyle(cfg.patternColor, 0.4);
    body.fillEllipse(0, -20, 20, 14);
    body.fillStyle(cfg.noseColor, 1);
    body.fillTriangle(-4, -22, 4, -22, 0, -17);
  }
}

// ─── WHISKERS ────────────────────────────────────────────────────────────────

function drawWhiskers(
  body: Phaser.GameObjects.Graphics,
  cfg: BreedConfig,
  type: CatType,
) {
  body.lineStyle(1.5, 0xaaaaaa, 0.8);
  body.lineBetween(-38, -22, -18, -20);
  body.lineBetween(38, -22, 18, -20);

  // Extra whiskers for fluffy / round-faced breeds
  if (
    cfg.isMaineCoon ||
    cfg.isPersian ||
    type === "british_shorthair" ||
    cfg.isOriental
  ) {
    body.lineBetween(-36, -18, -18, -17);
    body.lineBetween(36, -18, 18, -17);
  }

  // Cornish/Devon Rex: curly whiskers (wavy lines)
  if (cfg.hasCurlyFur) {
    body.lineStyle(1, 0xaaaaaa, 0.5);
    body.lineBetween(-40, -26, -20, -24);
    body.lineBetween(40, -26, 20, -24);
  }
}

// ─── PAWS ────────────────────────────────────────────────────────────────────

function drawPaws(
  body: Phaser.GameObjects.Graphics,
  cfg: BreedConfig,
  type: CatType,
) {
  if (cfg.hasWhiteGloves) {
    // Birman: white gloves on dark-pointed paws
    body.fillStyle(cfg.patternColor, 0.8);
    body.fillEllipse(-18, 42, 18, 10);
    body.fillEllipse(18, 42, 18, 10);
    // White tips
    body.fillStyle(0xffffff, 1);
    body.fillEllipse(-18, 45, 14, 7);
    body.fillEllipse(18, 45, 14, 7);
  } else if (cfg.hasPointedPattern) {
    // Siamese / Ragdoll / Balinese / Himalayan: dark paws
    body.fillStyle(cfg.patternColor, 0.8);
    body.fillEllipse(-18, 42, 18, 10);
    body.fillEllipse(18, 42, 18, 10);
  }

  // Calico: one dark paw
  if (type === "calico") {
    body.fillStyle(0x333333, 0.6);
    body.fillEllipse(18, 42, 16, 9);
  }
}
