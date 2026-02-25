"use client";

import { CatType } from "@/types/cat";
import { useState } from "react";

interface HudBarProps {
  petName: string;
  daysTogther: number;
  patCount: number;
}

export default function HudBar({
  petName,
  daysTogther,
  patCount,
}: HudBarProps) {
  const [catType, setCatType] = useState<CatType>("siamese");

  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 pointer-events-none">
      {/* Left: Pet name tag */}
      <div className="pointer-events-auto flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-sm border border-pink-100">
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-pink-200 to-pink-300 flex items-center justify-center text-sm">
          🐱
        </div>
        <select
          value={catType}
          onChange={(e) => setCatType(e.target.value as CatType)}
          className="absolute top-16 left-4 z-20 bg-white rounded-lg px-2 py-1 shadow"
        >
          <option value="siamese">Siamese</option>
          <option value="orange">Orange</option>
          <option value="black">Black</option>
          <option value="gray">Gray</option>
          <option value="calico">Calico</option>
        </select>
        <span className="text-sm font-bold text-pink-500 font-kawaii">
          {petName}
        </span>
      </div>

      {/* Center: Action icons */}
      <div className="pointer-events-auto flex items-center gap-2">
        {[
          { icon: "🏠", label: "Room" },
          { icon: "🧺", label: "Items" },
          { icon: "📋", label: "Tasks" },
        ].map((btn) => (
          <button
            key={btn.label}
            title={btn.label}
            className="w-9 h-9 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm border border-pink-100 flex items-center justify-center text-base hover:scale-110 active:scale-95 transition-transform"
          >
            {btn.icon}
          </button>
        ))}
      </div>

      {/* Right: Days + icons */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Days together heart badge */}
        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-sm border border-pink-100">
          <span className="text-red-400 text-sm">❤️</span>
          <span className="text-xs font-bold text-pink-500 font-kawaii">
            {daysTogther} days
          </span>
        </div>

        {/* Pats badge */}
        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-sm border border-pink-100">
          <span className="text-sm">🐾</span>
          <span className="text-xs font-bold text-pink-400 font-kawaii">
            {patCount}
          </span>
        </div>

        {/* Icon buttons */}
        {["⭐", "🔔", "⚙️"].map((icon, i) => (
          <button
            key={i}
            className="w-9 h-9 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm border border-pink-100 flex items-center justify-center text-base hover:scale-110 active:scale-95 transition-transform"
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}
