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

    // Head
    ctx.fillStyle = hexToCSS(cfg.mainColor);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Muzzle (lighter area)
    ctx.fillStyle = hexToCSS(cfg.secondaryColor);
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.2, r * 0.55, r * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    if (cfg.hasFlopEars) {
      // Floppy ears
      ctx.fillStyle = hexToCSS(cfg.earColor);
      ctx.beginPath();
      ctx.ellipse(cx - r * 0.85, cy, r * 0.3, r * 0.55, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + r * 0.85, cy, r * 0.3, r * 0.55, 0.2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Pointed ears
      ctx.fillStyle = hexToCSS(cfg.earColor);
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.65, cy - r * 0.3);
      ctx.lineTo(cx - r * 0.75, cy - r * 1.2);
      ctx.lineTo(cx - r * 0.1, cy - r * 0.7);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + r * 0.65, cy - r * 0.3);
      ctx.lineTo(cx + r * 0.75, cy - r * 1.2);
      ctx.lineTo(cx + r * 0.1, cy - r * 0.7);
      ctx.fill();
    }

    // Eyes
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx - r * 0.3, cy - r * 0.15, r * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + r * 0.3, cy - r * 0.15, r * 0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = hexToCSS(cfg.eyeColor);
    ctx.beginPath();
    ctx.arc(cx - r * 0.3, cy - r * 0.15, r * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + r * 0.3, cy - r * 0.15, r * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = hexToCSS(cfg.noseColor);
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.15, r * 0.18, r * 0.13, 0, 0, Math.PI * 2);
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
