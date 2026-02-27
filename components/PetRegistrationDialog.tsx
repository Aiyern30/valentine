"use client";

import { useState } from "react";
import { createPet } from "@/lib/actions";
import { PetKind, PetBreed } from "@/types/pet";
import { CAT_BREEDS } from "@/game/catBreeds";
import { DOG_BREEDS } from "@/game/dogBreeds";
import CatFaceIcon from "./CatFaceIcon";
import DogFaceIcon from "./DogFaceIcon";
import { CatType } from "@/types/cat";
import { DogType } from "@/types/dog";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PetRegistrationDialogProps {
  onPetRegistered: (
    petName: string,
    petType: PetKind,
    petBreed: PetBreed,
  ) => void;
}

export default function PetRegistrationDialog({
  onPetRegistered,
}: PetRegistrationDialogProps) {
  const [step, setStep] = useState<"type" | "name" | "breed">("type");
  const [petType, setPetType] = useState<PetKind | null>(null);
  const [petName, setPetName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableBreeds =
    petType === "cat"
      ? (CAT_BREEDS as Array<{ value: PetBreed; label: string }>)
      : (DOG_BREEDS as Array<{ value: PetBreed; label: string }>);

  const handleSelectType = (type: PetKind) => {
    setPetType(type);
    setStep("name");
    setError("");
  };

  const handleNameSubmit = () => {
    if (!petName.trim()) {
      setError("Please enter your pet's name");
      return;
    }
    setStep("breed");
    setError("");
  };

  const handleSelectBreed = async (breed: PetBreed) => {
    if (!petType || !petName.trim()) return;

    setLoading(true);

    try {
      const result = await createPet(petName, petType, breed);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      onPetRegistered(petName, petType, breed);
    } catch (err) {
      console.error("Error registering pet:", err);
      setError("Failed to register pet. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-pink-300 via-purple-200 to-pink-200 -mx-6 -mt-6 px-6 py-8 mb-6">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Welcome to Your Pet Game!
          </h1>
          <p className="text-white/80 text-center">
            Let&apos;s register your virtual pet
          </p>
        </div>

        {/* Content */}
        <div className="">
          {step === "type" && (
            <div className="space-y-6">
              <p className="text-center text-gray-600 font-semibold">
                Choose your pet type:
              </p>
              <div className="grid grid-cols-2 gap-4">
                {/* Cat Option */}
                <button
                  onClick={() => handleSelectType("cat")}
                  className="group relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-transparent hover:border-pink-300 bg-linear-to-br from-pink-50 to-pink-100 hover:shadow-lg transition-all active:scale-95"
                >
                  <div className="w-16 h-16 flex items-center justify-center">
                    <CatFaceIcon type="siamese" size={56} />
                  </div>
                  <span className="font-bold text-pink-700">Cat</span>
                </button>

                {/* Dog Option */}
                <button
                  onClick={() => handleSelectType("dog")}
                  className="group relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-transparent hover:border-blue-300 bg-linear-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all active:scale-95"
                >
                  <div className="w-16 h-16 flex items-center justify-center">
                    <DogFaceIcon type="shiba_inu" size={56} />
                  </div>
                  <span className="font-bold text-blue-700">Dog</span>
                </button>
              </div>
            </div>
          )}

          {step === "name" && petType && (
            <div className="space-y-6">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 bg-white/50 rounded-2xl flex items-center justify-center">
                  {petType === "cat" ? (
                    <CatFaceIcon type="siamese" size={72} />
                  ) : (
                    <DogFaceIcon type="shiba_inu" size={72} />
                  )}
                </div>
              </div>

              <p className="text-center text-gray-600 font-semibold">
                What&apos;s your {petType}&apos;s name?
              </p>

              <input
                type="text"
                value={petName}
                onChange={(e) => {
                  setPetName(e.target.value);
                  setError("");
                }}
                placeholder={
                  petType === "cat"
                    ? "E.g., Mochi, Luna..."
                    : "E.g., Buddy, Max..."
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none font-semibold text-center placeholder-gray-400"
                onKeyPress={(e) => e.key === "Enter" && handleNameSubmit()}
                autoFocus
              />

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep("type");
                    setPetType(null);
                    setError("");
                  }}
                  className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all active:scale-95"
                >
                  Back
                </button>
                <button
                  onClick={handleNameSubmit}
                  className="flex-1 px-4 py-2 rounded-xl bg-linear-to-r from-pink-400 to-pink-500 text-white font-semibold hover:shadow-lg transition-all active:scale-95"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === "breed" && petType && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 font-semibold mb-1">
                  {petName}&apos;s breed:
                </p>
                <p className="text-sm text-gray-500">
                  Choose from {availableBreeds.length} {petType} breeds
                </p>
              </div>

              {/* Grid of breed icons - 6 per row for larger dialog */}
              <div
                className="max-h-96 overflow-y-auto px-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <style>{`.breed-grid::-webkit-scrollbar { display: none; }`}</style>
                <div className="breed-grid grid grid-cols-6 gap-3">
                  {availableBreeds.map((breed) => (
                    <button
                      key={breed.value}
                      onClick={() => handleSelectBreed(breed.value as PetBreed)}
                      disabled={loading}
                      title={breed.label}
                      className={`
                        relative group flex items-center justify-center
                        w-20 h-20 rounded-xl transition-all cursor-pointer
                        ${
                          petType === "cat"
                            ? "bg-pink-50 hover:bg-pink-100 active:bg-pink-200"
                            : "bg-blue-50 hover:bg-blue-100 active:bg-blue-200"
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                      aria-label={breed.label}
                    >
                      {petType === "cat" ? (
                        <CatFaceIcon type={breed.value as CatType} size={52} />
                      ) : (
                        <DogFaceIcon type={breed.value as DogType} size={52} />
                      )}

                      {/* Tooltip on hover */}
                      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-lg bg-gray-800/90 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                        {breed.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                onClick={() => {
                  setStep("name");
                  setError("");
                }}
                disabled={loading}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
