"use client";

import { PetKind } from "@/types/pet";

export interface ToyItem {
  id: string;
  label: string;
  emoji: string;
}

const CAT_TOYS: ToyItem[] = [
  { id: "yarn", label: "Yarn Ball", emoji: "\uD83E\uDDF6" },
  { id: "feather", label: "Feather", emoji: "\uD83E\uDEB6" },
  { id: "ball", label: "Ball", emoji: "\uD83D\uDD34" },
  { id: "frisbee", label: "Frisbee", emoji: "\uD83E\uDD4F" },
  { id: "bone", label: "Toy Mouse", emoji: "\uD83D\uDC2D" },
];

const DOG_TOYS: ToyItem[] = [
  { id: "ball", label: "Tennis Ball", emoji: "\uD83C\uDFBE" },
  { id: "bone", label: "Bone", emoji: "\uD83E\uDDB4" },
  { id: "frisbee", label: "Frisbee", emoji: "\uD83E\uDD4F" },
  { id: "yarn", label: "Rope Toy", emoji: "\uD83E\uDE22" },
  { id: "feather", label: "Squeaky Toy", emoji: "\uD83D\uDC25" },
];

interface ToySelectorProps {
  petKind: PetKind;
  onSelectToy: (toy: ToyItem) => void;
}

export default function ToySelector({
  petKind,
  onSelectToy,
}: ToySelectorProps) {
  const toys = petKind === "cat" ? CAT_TOYS : DOG_TOYS;

  return (
    <div className="absolute bottom-16 left-0 right-0 z-10 flex items-center justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-md border border-emerald-100">
        <span
          className="text-[10px] font-bold text-emerald-600 mr-1"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          {"Toys:"}
        </span>
        {toys.map((toy) => (
          <button
            key={toy.id}
            onClick={() => onSelectToy(toy)}
            title={toy.label}
            className="flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-lg hover:bg-emerald-50 active:scale-90 transition-all cursor-pointer"
          >
            <span className="text-lg">{toy.emoji}</span>
            <span
              className="text-[9px] font-semibold text-emerald-500 max-w-12 truncate"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              {toy.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
