"use client";

import { useState, useRef, useEffect } from "react";
import { CatType } from "@/types/cat";
import { CAT_BREEDS } from "@/game/catBreeds";
import CatFaceIcon from "./CatFaceIcon";

interface HudBarProps {
  petName: string;
  daysTogther: number;
  patCount: number;
  catType: CatType;
  onCatTypeChange: (type: CatType) => void;
}

export default function HudBar({
  petName,
  daysTogther,
  patCount,
  catType,
  onCatTypeChange,
}: HudBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDropdownOpen(false);
    }
    if (dropdownOpen) {
      document.addEventListener("keydown", handleKey);
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [dropdownOpen]);

  const currentBreed = CAT_BREEDS.find((b) => b.value === catType);

  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 pointer-events-none">
      {/* Left: Pet name tag with breed dropdown */}
      <div className="pointer-events-auto relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl pl-1.5 pr-3 py-1.5 shadow-sm border border-pink-100 hover:bg-white/90 active:scale-[0.97] transition-all cursor-pointer"
          aria-expanded={dropdownOpen}
          aria-haspopup="listbox"
          aria-label={`Select cat breed, currently ${currentBreed?.label}`}
        >
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-pink-50 to-pink-100 flex items-center justify-center overflow-hidden">
            <CatFaceIcon type={catType} size={26} />
          </div>
          <span className="text-sm font-bold text-pink-500 font-kawaii">
            {petName}
          </span>
          <svg
            className={`w-3.5 h-3.5 text-pink-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>

        {/* Dropdown list */}
        {dropdownOpen && (
          <div
            role="listbox"
            aria-label="Select cat breed"
            className="absolute top-full left-0 mt-2 w-64 max-h-72 overflow-y-auto rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-pink-100 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150"
          >
            {CAT_BREEDS.map((breed) => {
              const isSelected = breed.value === catType;
              return (
                <button
                  key={breed.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onCatTypeChange(breed.value);
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-pink-50 text-pink-600"
                      : "text-gray-700 hover:bg-pink-50/60"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-pink-50 to-orange-50 flex items-center justify-center shrink-0 overflow-hidden">
                    <CatFaceIcon type={breed.value} size={26} />
                  </div>
                  <span className="text-sm font-medium truncate">
                    {breed.label}
                  </span>
                  {isSelected && (
                    <svg
                      className="w-4 h-4 text-pink-500 ml-auto shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
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
        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-sm border border-pink-100">
          <span className="text-red-400 text-sm" aria-hidden="true">
            ❤️
          </span>
          <span className="text-xs font-bold text-pink-500 font-kawaii">
            {daysTogther} days
          </span>
        </div>

        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-sm border border-pink-100">
          <span className="text-sm" aria-hidden="true">
            🐾
          </span>
          <span className="text-xs font-bold text-pink-400 font-kawaii">
            {patCount}
          </span>
        </div>

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
