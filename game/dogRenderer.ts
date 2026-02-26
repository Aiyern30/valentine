import Phaser from "phaser";
import { DogType } from "@/types/dog";
import { DogBreedConfig, DOG_BREED_CONFIGS } from "./dogBreeds";

/**
 * Draws the dog body + tail onto Phaser Graphics objects
 * based on the breed config. All breed-specific visual logic lives here.
 */
export function drawDogGraphics(
  body: Phaser.GameObjects.Graphics,
  tail: Phaser.GameObjects.Graphics,
  type: DogType,
) {
  body.clear();
  tail.clear();

  const cfg = DOG_BREED_CONFIGS[type];

  drawTail(tail, cfg);
  drawBody(body, cfg);
  drawHead(body, cfg);
  drawEars(body, cfg);
  drawEyes(body, cfg);
  drawNose(body, cfg);
  drawMouth(body, cfg);
  drawPaws(body, cfg);
}

// ─── TAIL ────────────────────────────────────────────────────────────────────

function drawTail(tail: Phaser.GameObjects.Graphics, cfg: DogBreedConfig) {
  if (cfg.hasCurlyTail) {
    // Curly tail (Shiba Inu, Pomeranian)
    const curlCurve = new Phaser.Curves.CubicBezier(
      new Phaser.Math.Vector2(20, 15),
      new Phaser.Math.Vector2(50, -10),
      new Phaser.Math.Vector2(55, -45),
      new Phaser.Math.Vector2(30, -50),
    );

    if (cfg.hasFluffyTail) {
      // Pomeranian: very fluffy curled tail
      tail.lineStyle(18, cfg.mainColor, 1);
      tail.strokePoints(curlCurve.getPoints(32), false, false);
      tail.lineStyle(12, cfg.secondaryColor, 0.4);
      tail.strokePoints(curlCurve.getPoints(32), false, false);
    } else {
      // Shiba: cleaner curl
      tail.lineStyle(12, cfg.mainColor, 1);
      tail.strokePoints(curlCurve.getPoints(32), false, false);
      tail.lineStyle(6, cfg.secondaryColor, 0.5);
      tail.strokePoints(curlCurve.getPoints(32), false, false);
    }
  } else if (cfg.hasFluffyTail) {
    // Fluffy wagging tail (Golden, Husky)
    const tailCurve = new Phaser.Curves.CubicBezier(
      new Phaser.Math.Vector2(20, 18),
      new Phaser.Math.Vector2(55, 5),
      new Phaser.Math.Vector2(65, -25),
      new Phaser.Math.Vector2(45, -45),
    );
    tail.lineStyle(14, cfg.mainColor, 1);
    tail.strokePoints(tailCurve.getPoints(32), false, false);
    tail.lineStyle(8, cfg.secondaryColor, 0.35);
    tail.strokePoints(tailCurve.getPoints(32), false, false);
  } else {
    // Short stub tail (Corgi)
    tail.fillStyle(cfg.mainColor, 1);
    tail.fillEllipse(22, 5, 16, 10);
    tail.fillStyle(cfg.secondaryColor, 0.4);
    tail.fillEllipse(24, 4, 10, 6);
  }
}

// ─── BODY ────────────────────────────────────────────────────────────────────

function drawBody(body: Phaser.GameObjects.Graphics, cfg: DogBreedConfig) {
  const isSmall = cfg.hasShortLegs || cfg.breedId === "pomeranian";
  const bodyW = isSmall ? 78 : cfg.hasThickFur ? 92 : 85;
  const bodyH = isSmall ? 65 : cfg.hasThickFur ? 80 : 72;

  // Main body
  body.fillStyle(cfg.mainColor, 1);
  body.fillEllipse(0, 10, bodyW, bodyH);

  // Belly / chest
  body.fillStyle(cfg.bellyColor, 0.85);
  body.fillEllipse(0, 18, bodyW * 0.6, bodyH * 0.55);

  // Thick fur outer glow
  if (cfg.hasThickFur) {
    body.lineStyle(3, cfg.secondaryColor, 0.25);
    body.strokeEllipse(0, 10, bodyW + 8, bodyH + 6);
    body.strokeEllipse(0, 10, bodyW + 14, bodyH + 10);
  }

  // Pomeranian: extra fluffy chest ruff
  if (cfg.breedId === "pomeranian") {
    body.fillStyle(cfg.secondaryColor, 0.7);
    body.fillEllipse(0, -4, 55, 38);
    body.fillStyle(cfg.mainColor, 0.3);
    // tiny fur tufts
    for (let i = -2; i <= 2; i++) {
      body.fillCircle(i * 10, -8 + Math.abs(i) * 3, 6);
    }
  }

  // Golden Retriever: feathered chest
  if (cfg.breedId === "golden_retriever") {
    body.fillStyle(cfg.secondaryColor, 0.5);
    body.fillEllipse(0, -2, 50, 32);
  }

  // Husky: body markings - darker back
  if (cfg.breedId === "husky") {
    body.fillStyle(cfg.mainColor, 0.8);
    body.fillEllipse(0, 2, bodyW * 0.85, bodyH * 0.5);
  }

  // Corgi: white collar band
  if (cfg.breedId === "corgi") {
    body.fillStyle(0xffffff, 0.9);
    body.fillEllipse(0, -6, 52, 22);
  }
}

// ─── HEAD ────────────────────────────────────────────────────────────────────

function drawHead(body: Phaser.GameObjects.Graphics, cfg: DogBreedConfig) {
  const isSmall = cfg.hasShortLegs || cfg.breedId === "pomeranian";
  const headR = isSmall ? 36 : cfg.hasThickFur ? 40 : 38;

  // Main head
  body.fillStyle(cfg.mainColor, 1);
  body.fillCircle(0, -32, headR);

  // Muzzle / snout area (lighter)
  if (cfg.breedId === "shiba_inu") {
    // Shiba: white cheeks and muzzle
    body.fillStyle(cfg.secondaryColor, 1);
    body.fillEllipse(0, -22, 42, 28);
    // White cheek marks
    body.fillStyle(cfg.secondaryColor, 0.9);
    body.fillCircle(-16, -24, 12);
    body.fillCircle(16, -24, 12);
  } else if (cfg.breedId === "husky") {
    // Husky: white face mask
    body.fillStyle(cfg.secondaryColor, 1);
    body.fillEllipse(0, -24, 44, 30);
    // Forehead mask (darker stays on top)
    body.fillStyle(cfg.mainColor, 0.9);
    body.fillEllipse(0, -42, 42, 22);
    // Mask lines down forehead
    body.fillStyle(cfg.mainColor, 0.7);
    body.fillTriangle(-4, -50, 4, -50, 0, -30);
  } else if (cfg.breedId === "golden_retriever") {
    // Golden: slightly lighter muzzle
    body.fillStyle(cfg.secondaryColor, 0.8);
    body.fillEllipse(0, -22, 38, 26);
    // Jowls / cheeks
    body.fillStyle(cfg.mainColor, 0.5);
    body.fillCircle(-14, -20, 10);
    body.fillCircle(14, -20, 10);
  } else if (cfg.breedId === "corgi") {
    // Corgi: white blaze and muzzle
    body.fillStyle(cfg.secondaryColor, 1);
    body.fillEllipse(0, -22, 36, 24);
    // White blaze up forehead
    body.fillStyle(cfg.secondaryColor, 0.9);
    body.fillEllipse(0, -38, 14, 18);
  } else if (cfg.breedId === "pomeranian") {
    // Pomeranian: fluffy round face with lighter muzzle
    body.fillStyle(cfg.mainColor, 1);
    body.fillCircle(0, -32, headR + 4);
    // Fluffy cheek ruff
    body.fillStyle(cfg.secondaryColor, 0.6);
    body.fillCircle(-18, -24, 14);
    body.fillCircle(18, -24, 14);
    // Lighter muzzle
    body.fillStyle(cfg.secondaryColor, 0.9);
    body.fillEllipse(0, -22, 28, 20);
  }
}

// ─── EARS ────────────────────────────────────────────────────────────────────

function drawEars(body: Phaser.GameObjects.Graphics, cfg: DogBreedConfig) {
  if (cfg.hasFlopEars) {
    // Floppy ears (Golden Retriever)
    body.fillStyle(cfg.earColor, 1);
    // Left ear - hangs down
    body.fillEllipse(-30, -30, 22, 36);
    body.fillStyle(cfg.mainColor, 0.3);
    body.fillEllipse(-30, -26, 16, 28);
    // Right ear
    body.fillStyle(cfg.earColor, 1);
    body.fillEllipse(30, -30, 22, 36);
    body.fillStyle(cfg.mainColor, 0.3);
    body.fillEllipse(30, -26, 16, 28);
  } else if (cfg.hasPointedEars) {
    // Pointed / erect ears
    const earH = cfg.breedId === "pomeranian" ? 16 : 22;
    const earW = cfg.breedId === "pomeranian" ? 14 : 18;

    // Left ear
    body.fillStyle(cfg.earColor, 1);
    body.fillTriangle(
      -24,
      -52 - earH,
      -24 + earW / 2,
      -52 - earH - 8,
      -24 - earW / 2 + 6,
      -38,
    );
    body.fillTriangle(
      -24,
      -52 - earH,
      -24 + earW / 2,
      -52 - earH - 8,
      -24 + earW,
      -38,
    );
    // Inner ear
    body.fillStyle(0xf0b0a0, 0.6);
    body.fillTriangle(
      -22,
      -52 - earH + 4,
      -22 + earW / 2 - 2,
      -52 - earH - 4,
      -22 + earW - 4,
      -42,
    );

    // Right ear
    body.fillStyle(cfg.earColor, 1);
    body.fillTriangle(
      24,
      -52 - earH,
      24 - earW / 2,
      -52 - earH - 8,
      24 + earW / 2 - 6,
      -38,
    );
    body.fillTriangle(
      24,
      -52 - earH,
      24 - earW / 2,
      -52 - earH - 8,
      24 - earW,
      -38,
    );
    // Inner ear
    body.fillStyle(0xf0b0a0, 0.6);
    body.fillTriangle(
      22,
      -52 - earH + 4,
      22 - earW / 2 + 2,
      -52 - earH - 4,
      22 - earW + 4,
      -42,
    );

    // Husky: darker ear tips
    if (cfg.breedId === "husky") {
      body.fillStyle(cfg.mainColor, 0.8);
      body.fillTriangle(-24, -74, -15, -82, -6, -68);
      body.fillTriangle(24, -74, 15, -82, 6, -68);
    }
  }
}

// ─── EYES ────────────────────────────────────────────────────────────────────

function drawEyes(body: Phaser.GameObjects.Graphics, cfg: DogBreedConfig) {
  const eyeY = -34;
  const eyeSpread = 13;

  // Shiba, Husky, Pomeranian: open round eyes
  // Golden, Corgi: happy squinting eyes (sometimes open)
  const openEyes = cfg.breedId !== "golden_retriever";

  if (openEyes) {
    // White of eye
    body.fillStyle(0xffffff, 1);
    body.fillCircle(-eyeSpread, eyeY, 7);
    body.fillCircle(eyeSpread, eyeY, 7);
    // Iris
    body.fillStyle(cfg.eyeColor, 1);
    body.fillCircle(-eyeSpread, eyeY, 4.5);
    body.fillCircle(eyeSpread, eyeY, 4.5);
    // Pupil
    body.fillStyle(0x000000, 1);
    body.fillCircle(-eyeSpread, eyeY, 2.5);
    body.fillCircle(eyeSpread, eyeY, 2.5);
    // Highlight
    body.fillStyle(0xffffff, 1);
    body.fillCircle(-eyeSpread + 2, eyeY - 2, 1.5);
    body.fillCircle(eyeSpread + 2, eyeY - 2, 1.5);

    // Husky: extra bright blue eyes highlight
    if (cfg.breedId === "husky") {
      body.fillStyle(0xaaddff, 0.3);
      body.fillCircle(-eyeSpread, eyeY, 6);
      body.fillCircle(eyeSpread, eyeY, 6);
    }
  } else {
    // Happy squinting eyes
    body.lineStyle(3, cfg.eyeColor, 1);
    body.beginPath();
    body.arc(-eyeSpread, eyeY, 7, 0, Math.PI, true);
    body.strokePath();
    body.beginPath();
    body.arc(eyeSpread, eyeY, 7, 0, Math.PI, true);
    body.strokePath();
  }

  // Eyebrows for expressive breeds
  if (cfg.breedId === "shiba_inu") {
    // Shiba: tan eyebrow dots
    body.fillStyle(cfg.secondaryColor, 0.8);
    body.fillCircle(-eyeSpread, eyeY - 10, 4);
    body.fillCircle(eyeSpread, eyeY - 10, 4);
  }

  if (cfg.breedId === "husky") {
    // Husky: mask eyebrow markings
    body.lineStyle(2, cfg.mainColor, 0.6);
    body.lineBetween(-eyeSpread - 6, eyeY - 8, -eyeSpread + 6, eyeY - 10);
    body.lineBetween(eyeSpread - 6, eyeY - 10, eyeSpread + 6, eyeY - 8);
  }
}

// ─── NOSE ────────────────────────────────────────────────────────────────────

function drawNose(body: Phaser.GameObjects.Graphics, cfg: DogBreedConfig) {
  const noseY = -20;

  // Dog nose: wider, rounder
  body.fillStyle(cfg.noseColor, 1);
  body.fillEllipse(0, noseY, 14, 10);
  // Nostrils
  body.fillStyle(0x111111, 0.6);
  body.fillCircle(-3, noseY + 1, 2);
  body.fillCircle(3, noseY + 1, 2);
  // Nose highlight
  body.fillStyle(0xffffff, 0.25);
  body.fillEllipse(0, noseY - 2, 6, 3);

  // Pomeranian: smaller, cuter nose
  if (cfg.breedId === "pomeranian") {
    body.fillStyle(cfg.noseColor, 1);
    body.fillEllipse(0, noseY, 10, 8);
    body.fillStyle(0x111111, 0.6);
    body.fillCircle(-2, noseY + 1, 1.5);
    body.fillCircle(2, noseY + 1, 1.5);
  }
}

// ─── MOUTH ───────────────────────────────────────────────────────────────────

function drawMouth(body: Phaser.GameObjects.Graphics, cfg: DogBreedConfig) {
  const mouthY = -14;

  // Smile line
  body.lineStyle(2, 0x885544, 0.6);
  body.beginPath();
  body.arc(-4, mouthY, 5, 0.2, Math.PI - 0.2, false);
  body.strokePath();
  body.beginPath();
  body.arc(4, mouthY, 5, 0.2, Math.PI - 0.2, false);
  body.strokePath();

  // Tongue (panting - especially for Golden and Corgi)
  if (
    cfg.breedId === "golden_retriever" ||
    cfg.breedId === "corgi" ||
    cfg.breedId === "pomeranian"
  ) {
    body.fillStyle(cfg.tongueColor, 1);
    body.fillEllipse(0, mouthY + 6, 10, 8);
    body.fillStyle(0xff6688, 0.4);
    body.lineBetween(0, mouthY + 2, 0, mouthY + 9);
  }

  // Shiba: characteristic "smile"
  if (cfg.breedId === "shiba_inu") {
    body.lineStyle(2, 0x885544, 0.8);
    body.beginPath();
    body.arc(0, mouthY - 2, 8, 0.3, Math.PI - 0.3, false);
    body.strokePath();
  }
}

// ─── PAWS ────────────────────────────────────────────────────────────────────

function drawPaws(body: Phaser.GameObjects.Graphics, cfg: DogBreedConfig) {
  const pawY = cfg.hasShortLegs ? 36 : 42;
  const pawSpread = 18;

  // Front paws
  body.fillStyle(cfg.mainColor, 1);
  body.fillEllipse(-pawSpread, pawY, 20, 12);
  body.fillEllipse(pawSpread, pawY, 20, 12);

  // Paw pads (lighter/white)
  if (cfg.breedId === "corgi" || cfg.breedId === "husky") {
    body.fillStyle(cfg.secondaryColor, 0.9);
    body.fillEllipse(-pawSpread, pawY + 2, 16, 8);
    body.fillEllipse(pawSpread, pawY + 2, 16, 8);
  }

  // Corgi: show tiny stumpy legs
  if (cfg.hasShortLegs) {
    body.fillStyle(cfg.mainColor, 1);
    body.fillRoundedRect(-pawSpread - 6, pawY - 10, 12, 14, 4);
    body.fillRoundedRect(pawSpread - 6, pawY - 10, 12, 14, 4);
    body.fillStyle(cfg.secondaryColor, 0.7);
    body.fillEllipse(-pawSpread, pawY + 2, 14, 8);
    body.fillEllipse(pawSpread, pawY + 2, 14, 8);
  }

  // Golden: feathered paws
  if (cfg.breedId === "golden_retriever") {
    body.fillStyle(cfg.secondaryColor, 0.4);
    body.fillEllipse(-pawSpread, pawY - 2, 24, 14);
    body.fillEllipse(pawSpread, pawY - 2, 24, 14);
  }

  // Pomeranian: tiny round paws
  if (cfg.breedId === "pomeranian") {
    body.fillStyle(cfg.mainColor, 1);
    body.fillCircle(-14, pawY, 8);
    body.fillCircle(14, pawY, 8);
    body.fillStyle(cfg.secondaryColor, 0.5);
    body.fillCircle(-14, pawY + 2, 5);
    body.fillCircle(14, pawY + 2, 5);
  }
}
