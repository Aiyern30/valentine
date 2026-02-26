"use client";

import { useRef, useEffect } from "react";
import { DogType } from "@/types/dog";
import { DOG_BREED_CONFIGS } from "@/game/dogBreeds";

interface DogFaceIconProps {
  type: DogType;
  size?: number;
}

function hexToCSS(hex: number): string {
  return "#" + hex.toString(16).padStart(6, "0");
}

export default function DogFaceIcon({ type, size = 26 }: DogFaceIconProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = size;
    canvas.width = s;
    canvas.height = s;
    ctx.clearRect(0, 0, s, s);

    const cfg = DOG_BREED_CONFIGS[type];
    const cx = s / 2;
    const cy = s / 2 + 2;
    const r = s * 0.34;

    // ── Ears (behind head) ──────────────────────────────────────────────────
    if (cfg.hasFlopEars) {
      ctx.fillStyle = hexToCSS(cfg.earColor);
      ctx.beginPath();
      ctx.ellipse(
        cx - r * 0.85,
        cy + r * 0.1,
        r * 0.3,
        r * 0.55,
        -0.2,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(
        cx + r * 0.85,
        cy + r * 0.1,
        r * 0.3,
        r * 0.55,
        0.2,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    } else if (cfg.hasPointedEars) {
      ctx.fillStyle = hexToCSS(cfg.earColor);
      // Left ear
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.65, cy - r * 0.3);
      ctx.lineTo(cx - r * 0.75, cy - r * 1.25);
      ctx.lineTo(cx - r * 0.05, cy - r * 0.65);
      ctx.closePath();
      ctx.fill();
      // Inner left ear
      ctx.fillStyle = "rgba(240,176,160,0.55)";
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.62, cy - r * 0.38);
      ctx.lineTo(cx - r * 0.7, cy - r * 1.05);
      ctx.lineTo(cx - r * 0.15, cy - r * 0.68);
      ctx.closePath();
      ctx.fill();
      // Right ear
      ctx.fillStyle = hexToCSS(cfg.earColor);
      ctx.beginPath();
      ctx.moveTo(cx + r * 0.65, cy - r * 0.3);
      ctx.lineTo(cx + r * 0.75, cy - r * 1.25);
      ctx.lineTo(cx + r * 0.05, cy - r * 0.65);
      ctx.closePath();
      ctx.fill();
      // Inner right ear
      ctx.fillStyle = "rgba(240,176,160,0.55)";
      ctx.beginPath();
      ctx.moveTo(cx + r * 0.62, cy - r * 0.38);
      ctx.lineTo(cx + r * 0.7, cy - r * 1.05);
      ctx.lineTo(cx + r * 0.15, cy - r * 0.68);
      ctx.closePath();
      ctx.fill();
    } else {
      // Round/semi-floppy (Bulldog, Boxer): small round ear nubs
      ctx.fillStyle = hexToCSS(cfg.earColor);
      ctx.beginPath();
      ctx.arc(cx - r * 0.8, cy - r * 0.5, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + r * 0.8, cy - r * 0.5, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Head ────────────────────────────────────────────────────────────────
    // Thick fur outer ring (Poodle, Samoyed, Pomeranian, etc.)
    if (cfg.hasThickFur) {
      ctx.fillStyle = hexToCSS(cfg.mainColor);
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = hexToCSS(cfg.mainColor);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // ── Breed-specific face markings ────────────────────────────────────────

    // Border Collie: white blaze
    if (type === "border_collie") {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(cx, cy - r * 0.15, r * 0.22, r * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Dalmatian: spots
    if (type === "dalmatian") {
      ctx.fillStyle = "#222222";
      const spots = [
        [cx - r * 0.45, cy - r * 0.55, r * 0.1],
        [cx + r * 0.5, cy - r * 0.35, r * 0.08],
        [cx - r * 0.2, cy + r * 0.3, r * 0.09],
        [cx + r * 0.3, cy + r * 0.4, r * 0.07],
        [cx - r * 0.55, cy + r * 0.1, r * 0.08],
      ] as [number, number, number][];
      spots.forEach(([sx, sy, sr]) => {
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Husky: face mask
    if (type === "husky") {
      ctx.fillStyle = hexToCSS(cfg.secondaryColor);
      ctx.beginPath();
      ctx.ellipse(cx, cy + r * 0.1, r * 0.62, r * 0.48, 0, 0, Math.PI * 2);
      ctx.fill();
      // Darker forehead
      ctx.fillStyle = hexToCSS(cfg.mainColor);
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.ellipse(cx, cy - r * 0.55, r * 0.55, r * 0.38, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // German Shepherd: black saddle on face top
    if (type === "german_shepherd") {
      ctx.fillStyle = hexToCSS(cfg.secondaryColor);
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.ellipse(cx, cy - r * 0.4, r * 0.7, r * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Australian Shepherd: white blaze + merle hint
    if (type === "australian_shepherd") {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(cx, cy - r * 0.2, r * 0.2, r * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();
      // Merle speckle
      ctx.fillStyle = hexToCSS(cfg.mainColor);
      ctx.globalAlpha = 0.5;
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(
          cx + Math.cos(angle) * r * 0.55,
          cy + Math.sin(angle) * r * 0.4,
          r * 0.09,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Bulldog: wrinkle lines on forehead
    if (type === "bulldog") {
      ctx.strokeStyle = "rgba(160,120,80,0.4)";
      ctx.lineWidth = r * 0.06;
      ctx.beginPath();
      ctx.arc(cx, cy - r * 0.6, r * 0.35, Math.PI * 0.2, Math.PI * 0.8, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(
        cx,
        cy - r * 0.45,
        r * 0.28,
        Math.PI * 0.25,
        Math.PI * 0.75,
        false,
      );
      ctx.stroke();
    }

    // Poodle: fluffy forehead puff
    if (type === "poodle") {
      ctx.fillStyle = hexToCSS(cfg.mainColor);
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.arc(cx + i * r * 0.28, cy - r * 0.85, r * 0.22, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Samoyed: happy cheeks
    if (type === "samoyed") {
      ctx.fillStyle = "rgba(255,220,200,0.4)";
      ctx.beginPath();
      ctx.arc(cx - r * 0.55, cy + r * 0.1, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + r * 0.55, cy + r * 0.1, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Muzzle ──────────────────────────────────────────────────────────────
    ctx.fillStyle = hexToCSS(cfg.secondaryColor);
    // Bulldog gets a wider, flatter muzzle
    const muzzleW = type === "bulldog" || type === "boxer" ? r * 0.7 : r * 0.55;
    const muzzleH = type === "bulldog" || type === "boxer" ? r * 0.35 : r * 0.4;
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.2, muzzleW, muzzleH, 0, 0, Math.PI * 2);
    ctx.fill();

    // Shiba / Corgi: colored muzzle cheek circles
    if (type === "shiba_inu" || type === "corgi") {
      ctx.fillStyle = hexToCSS(cfg.secondaryColor);
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(cx - r * 0.38, cy + r * 0.12, r * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + r * 0.38, cy + r * 0.12, r * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // ── Eyes ────────────────────────────────────────────────────────────────
    const eyeY = cy - r * 0.15;
    const eyeSpread = r * 0.3;
    const eyeR = r * 0.18;

    // Happy squint for Golden Retriever
    if (type === "golden_retriever") {
      ctx.strokeStyle = hexToCSS(cfg.eyeColor);
      ctx.lineWidth = r * 0.1;
      ctx.beginPath();
      ctx.arc(cx - eyeSpread, eyeY, eyeR, Math.PI, 0, true);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + eyeSpread, eyeY, eyeR, Math.PI, 0, true);
      ctx.stroke();
    } else {
      // White sclera
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx - eyeSpread, eyeY, eyeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + eyeSpread, eyeY, eyeR, 0, Math.PI * 2);
      ctx.fill();
      // Iris
      ctx.fillStyle = hexToCSS(cfg.eyeColor);
      ctx.beginPath();
      ctx.arc(cx - eyeSpread, eyeY, eyeR * 0.68, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + eyeSpread, eyeY, eyeR * 0.68, 0, Math.PI * 2);
      ctx.fill();
      // Pupil
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(cx - eyeSpread, eyeY, eyeR * 0.38, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + eyeSpread, eyeY, eyeR * 0.38, 0, Math.PI * 2);
      ctx.fill();
      // Highlight
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(
        cx - eyeSpread + eyeR * 0.3,
        eyeY - eyeR * 0.3,
        eyeR * 0.22,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.beginPath();
      ctx.arc(
        cx + eyeSpread + eyeR * 0.3,
        eyeY - eyeR * 0.3,
        eyeR * 0.22,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }

    // Shiba eyebrow dots
    if (type === "shiba_inu") {
      ctx.fillStyle = hexToCSS(cfg.secondaryColor);
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(cx - eyeSpread, eyeY - eyeR * 1.6, eyeR * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + eyeSpread, eyeY - eyeR * 1.6, eyeR * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Husky bright blue eye glint
    if (type === "husky") {
      ctx.fillStyle = "rgba(170,221,255,0.35)";
      ctx.beginPath();
      ctx.arc(cx - eyeSpread, eyeY, eyeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + eyeSpread, eyeY, eyeR, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Nose ────────────────────────────────────────────────────────────────
    ctx.fillStyle = hexToCSS(cfg.noseColor);
    // Bulldog: wider nose
    const noseW = type === "bulldog" || type === "boxer" ? r * 0.28 : r * 0.18;
    const noseH = type === "bulldog" || type === "boxer" ? r * 0.16 : r * 0.13;
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.15, noseW, noseH, 0, 0, Math.PI * 2);
    ctx.fill();
    // Nose highlight
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.beginPath();
    ctx.ellipse(
      cx - noseW * 0.2,
      cy + r * 0.12,
      noseW * 0.4,
      noseH * 0.4,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }, [type, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}
