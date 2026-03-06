"use client";

import { useState, useRef, useEffect } from "react";
import { PetKind, PetBreed } from "@/types/pet";
import { CatType } from "@/types/cat";
import { DogType } from "@/types/dog";
import CatFaceIcon from "./CatFaceIcon";
import DogFaceIcon from "./DogFaceIcon";
import { Pet } from "@/types";

interface HudBarProps {
  petName: string;
  daysTogether: number;
  totalPats: number;
  petMood: string;
  petKind: PetKind;
  petBreed: PetBreed;
  allPets: Pet[];
  selectedPetId: string | null;
  onPetChange: (petId: string) => void;
  onAddPet: () => void;
}

export default function HudBar({
  petName,
  daysTogether,
  totalPats,
  petMood,
  petKind,
  petBreed,
  allPets,
  selectedPetId,
  onPetChange,
  onAddPet,
}: HudBarProps) {
  // Deduplicate pets by id
  const uniquePets = Array.from(
    new Map(allPets.map((pet) => [pet.id, pet])).values(),
  );
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

  const isCat = petKind === "cat";
  const moodLabel = petMood
    .replace(/_/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
  const moodEmoji =
    {
      ecstatic: "🤩",
      happy: "😊",
      content: "🙂",
      neutral: "😐",
      tired: "🥱",
      hungry: "😿",
      grumpy: "😾",
      sad: "🥺",
    }[petMood.toLowerCase()] ?? "💖";

  return (
    <div
      style={{
        position: "absolute",
        top: "12px",
        left: "12px",
        right: "12px",
        zIndex: 30,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px",
        pointerEvents: "none",
      }}
    >
      {/* Pet Selector Dropdown */}
      <div
        ref={dropdownRef}
        style={{ position: "relative", pointerEvents: "auto" }}
      >
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 12px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "2px solid rgb(101, 50, 15)",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "rgba(255, 255, 255, 1)";
            (e.currentTarget as HTMLButtonElement).style.transform =
              "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "rgba(255, 255, 255, 0.9)";
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
        >
          {isCat ? (
            <CatFaceIcon type={petBreed as CatType} size={20} />
          ) : (
            <DogFaceIcon type={petBreed as DogType} size={20} />
          )}
          <span>{petName}</span>
          <span style={{ fontSize: "12px" }}>▼</span>
        </button>

        {dropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "0",
              marginTop: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "2px solid rgb(101, 50, 15)",
              borderRadius: "6px",
              minWidth: "200px",
              maxHeight: "300px",
              overflowY: "auto",
              zIndex: 1000,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          >
            {uniquePets.map((pet) => (
              <button
                key={pet.id}
                onClick={() => {
                  onPetChange(pet.id);
                  setDropdownOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "10px 12px",
                  backgroundColor:
                    selectedPetId === pet.id
                      ? "rgba(200, 180, 140, 0.3)"
                      : "transparent",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "background-color 0.2s ease",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                }}
                onMouseEnter={(e) => {
                  if (selectedPetId !== pet.id) {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "rgba(200, 180, 140, 0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedPetId !== pet.id) {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "transparent";
                  }
                }}
              >
                {pet.pet_type === "cat" ? (
                  <CatFaceIcon type={pet.pet_breed as CatType} size={18} />
                ) : (
                  <DogFaceIcon type={pet.pet_breed as DogType} size={18} />
                )}
                <span>{pet.pet_name}</span>
              </button>
            ))}

            {/* Add Pet Button */}
            <button
              onClick={() => {
                onAddPet();
                setDropdownOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
                padding: "12px",
                backgroundColor: "rgba(101, 50, 15, 0.1)",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                color: "rgb(101, 50, 15)",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "rgba(101, 50, 15, 0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "rgba(101, 50, 15, 0.1)";
              }}
            >
              <span style={{ fontSize: "18px" }}>+</span>
              <span>Add Pet</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats Display */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          fontSize: "13px",
          fontWeight: "600",
          color: "#5a3a1c",
          pointerEvents: "auto",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.92)",
            border: "2px solid rgba(101, 50, 15, 0.22)",
            borderRadius: "10px",
            padding: "8px 10px",
            minWidth: "84px",
            textAlign: "right",
          }}
        >
          <span style={{ fontSize: "11px", opacity: 0.75, display: "block" }}>
            Days Together
          </span>
          <span style={{ fontSize: "16px", fontWeight: 700 }}>
            {daysTogether}
          </span>
        </div>

        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.92)",
            border: "2px solid rgba(101, 50, 15, 0.22)",
            borderRadius: "10px",
            padding: "8px 10px",
            minWidth: "84px",
            textAlign: "right",
          }}
        >
          <span style={{ fontSize: "11px", opacity: 0.75, display: "block" }}>
            Total Pats
          </span>
          <span style={{ fontSize: "16px", fontWeight: 700 }}>{totalPats}</span>
        </div>

        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.92)",
            border: "2px solid rgba(101, 50, 15, 0.22)",
            borderRadius: "10px",
            padding: "8px 10px",
            minWidth: "110px",
            textAlign: "right",
          }}
        >
          <span style={{ fontSize: "11px", opacity: 0.75, display: "block" }}>
            Pet Mood
          </span>
          <span style={{ fontSize: "15px", fontWeight: 700 }}>
            {moodEmoji} {moodLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
