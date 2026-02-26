"use client";

import { useState, useRef, useEffect } from "react";
import { CatType } from "@/types/cat";
import { DogType } from "@/types/dog";
import { PetKind, PetBreed } from "@/types/pet";
import { CAT_BREEDS } from "@/game/catBreeds";
import { DOG_BREEDS } from "@/game/dogBreeds";
import CatFaceIcon from "./CatFaceIcon";
import DogFaceIcon from "./DogFaceIcon";

interface HudBarProps {
  petName: string;
  daysTogther: number;
  patCount: number;
  petKind: PetKind;
  petBreed: PetBreed;
  onPetKindChange: (kind: PetKind) => void;
  onPetBreedChange: (breed: PetBreed) => void;
}

export default function HudBar({
  petName,
  daysTogther,
  patCount,
  petKind,
  petBreed,
  onPetKindChange,
  onPetBreedChange,
}: HudBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDropdownOpen(false);
    }
    if (dropdownOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [dropdownOpen]);

  const breeds = petKind === "cat" ? CAT_BREEDS : DOG_BREEDS;
  const currentBreed = breeds.find((b) => b.value === petBreed);
  const isCat = petKind === "cat";

  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 pointer-events-none">
      {/* Left: Pet name tag + breed picker */}
      <div className="pointer-events-auto relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl pl-1.5 pr-3 py-1.5 shadow-sm border border-pink-100 hover:bg-white/90 active:scale-[0.97] transition-all cursor-pointer"
          aria-expanded={dropdownOpen}
          aria-haspopup="listbox"
          aria-label={`Select pet breed, currently ${currentBreed?.label}`}
        >
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-pink-50 to-pink-100 flex items-center justify-center overflow-hidden">
            {isCat ? (
              <CatFaceIcon type={petBreed as CatType} size={26} />
            ) : (
              <DogFaceIcon type={petBreed as DogType} size={26} />
            )}
          </div>
          <span
            className="text-sm font-bold text-pink-500"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
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

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-pink-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Pet Kind Tabs */}
            <div className="flex border-b border-pink-100">
              <button
                onClick={() => {
                  onPetKindChange("cat");
                  onPetBreedChange("siamese");
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                  isCat
                    ? "bg-pink-50 text-pink-600 border-b-2 border-pink-400"
                    : "text-gray-500 hover:bg-pink-50/40"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.26 6.6-.8 2.22 2.06.93 5.53-.66 7.18C21.84 14.3 23 17.59 23 20c0 0-4 1-6.5 1S12 21 12 21s-1.5 0-4.5 0S1 20 1 20c0-2.41 1.16-5.7 3.06-8.36-1.59-1.65-2.88-5.12-.66-7.18 1.57-1.46 4.82-1.2 6.6.8.65-.17 1.33-.26 2-.26z" />
                </svg>
                Cat
              </button>
              <button
                onClick={() => {
                  onPetKindChange("dog");
                  onPetBreedChange("shiba_inu");
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                  !isCat
                    ? "bg-amber-50 text-amber-600 border-b-2 border-amber-400"
                    : "text-gray-500 hover:bg-amber-50/40"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .137 1.217 1.376 2.326 2.5 3C6 14 7.233 14.5 8 14.5c1 0 1.409-.5 2-1.5m4-6.828C14 3.782 15.577 2.679 17.5 3c2.823.47 4.113 6.006 4 7-.137 1.217-1.376 2.326-2.5 3-1 1-2.233 1.5-3 1.5-1 0-1.409-.5-2-1.5" />
                  <path d="M8 14.5c0 2.5 2 4.5 4 4.5s4-2 4-4.5" />
                  <path d="M12 19v2" />
                </svg>
                Dog
              </button>
            </div>

            {/* Selected breed name */}
            <div className="px-3 pt-2.5 pb-1">
              <p
                className={`text-xs font-semibold ${isCat ? "text-pink-400" : "text-amber-400"}`}
              >
                {currentBreed?.label ?? "—"}
              </p>
            </div>

            {/* Grid: 5 icons per row */}
            <div className="px-2.5 pb-3">
              <div className="grid grid-cols-5 gap-1.5">
                {breeds.map((breed) => {
                  const isSelected = breed.value === petBreed;
                  return (
                    <button
                      key={breed.value}
                      title={breed.label}
                      onClick={() => {
                        onPetBreedChange(breed.value);
                        setDropdownOpen(false);
                      }}
                      className={`
                        relative group flex items-center justify-center
                        w-10 h-10 rounded-xl transition-all cursor-pointer
                        ${
                          isSelected
                            ? isCat
                              ? "bg-pink-100 ring-2 ring-pink-400 scale-105"
                              : "bg-amber-100 ring-2 ring-amber-400 scale-105"
                            : "bg-gray-50 hover:bg-pink-50 hover:scale-110"
                        }
                      `}
                      aria-label={breed.label}
                      aria-pressed={isSelected}
                    >
                      {isCat ? (
                        <CatFaceIcon type={breed.value as CatType} size={28} />
                      ) : (
                        <DogFaceIcon type={breed.value as DogType} size={28} />
                      )}

                      {/* Selected checkmark badge */}
                      {isSelected && (
                        <span
                          className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white ${isCat ? "bg-pink-400" : "bg-amber-400"}`}
                        >
                          <svg
                            className="w-2.5 h-2.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        </span>
                      )}

                      {/* Tooltip on hover */}
                      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded-lg bg-gray-800/90 text-white text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                        {breed.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
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
          <span
            className="text-xs font-bold text-pink-500"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            {daysTogther} days
          </span>
        </div>

        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-sm border border-pink-100">
          <span className="text-sm" aria-hidden="true">
            🐾
          </span>
          <span
            className="text-xs font-bold text-pink-400"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
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
