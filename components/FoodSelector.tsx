"use client";

import { PetKind } from "@/types/pet";

export interface FoodItem {
  id: string;
  label: string;
  emoji: string;
}

const CAT_FOODS: FoodItem[] = [
  { id: "fish", label: "Grilled Fish", emoji: "\uD83D\uDC1F" },
  { id: "milk", label: "Warm Milk", emoji: "\uD83E\uDD5B" },
  { id: "tuna", label: "Tuna Can", emoji: "\uD83E\uDD6B" },
  { id: "treat", label: "Cat Treat", emoji: "\uD83C\uDF6A" },
  { id: "sashimi", label: "Sashimi", emoji: "\uD83C\uDF63" },
];

const DOG_FOODS: FoodItem[] = [
  { id: "steak", label: "Juicy Steak", emoji: "\uD83E\uDD69" },
  { id: "bone", label: "Meaty Bone", emoji: "\uD83C\uDF56" },
  { id: "biscuit", label: "Dog Biscuit", emoji: "\uD83C\uDF6A" },
  { id: "kibble", label: "Premium Kibble", emoji: "\uD83C\uDF5A" },
  { id: "chicken", label: "Chicken", emoji: "\uD83C\uDF57" },
];

interface FoodSelectorProps {
  petKind: PetKind;
  onSelectFood: (food: FoodItem) => void;
}

export default function FoodSelector({
  petKind,
  onSelectFood,
}: FoodSelectorProps) {
  const foods = petKind === "cat" ? CAT_FOODS : DOG_FOODS;

  return (
    <div className="absolute bottom-16 left-0 right-0 z-10 flex items-center justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-md border border-amber-100">
        <span
          className="text-[10px] font-bold text-amber-600 mr-1"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          {"Food:"}
        </span>
        {foods.map((food) => (
          <button
            key={food.id}
            onClick={() => onSelectFood(food)}
            title={food.label}
            className="flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-lg hover:bg-amber-50 active:scale-90 transition-all cursor-pointer"
          >
            <span className="text-lg">{food.emoji}</span>
            <span
              className="text-[9px] font-semibold text-amber-500 max-w-12 truncate"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              {food.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
