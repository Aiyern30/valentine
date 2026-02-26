import { DogType } from "@/types/dog";

export interface DogBreedConfig {
  mainColor: number;
  secondaryColor: number;
  bellyColor: number;
  earColor: number;
  eyeColor: number;
  noseColor: number;
  tongueColor: number;
  hasFluffyTail: boolean;
  hasPointedEars: boolean;
  hasFlopEars: boolean;
  hasThickFur: boolean;
  hasShortLegs: boolean;
  hasCurlyTail: boolean;
  hasFaceMask: boolean;
  /** Breed-specific marker */
  breedId: DogType;
}

function makeDogConfig(
  overrides: Partial<DogBreedConfig> & { mainColor: number; breedId: DogType },
): DogBreedConfig {
  return {
    secondaryColor: 0xf5e6d0,
    bellyColor: 0xfff5e6,
    earColor: 0xc8884a,
    eyeColor: 0x332211,
    noseColor: 0x222222,
    tongueColor: 0xff7799,
    hasFluffyTail: false,
    hasPointedEars: false,
    hasFlopEars: false,
    hasThickFur: false,
    hasShortLegs: false,
    hasCurlyTail: false,
    hasFaceMask: false,
    ...overrides,
  };
}

export const DOG_BREED_CONFIGS: Record<DogType, DogBreedConfig> = {
  shiba_inu: makeDogConfig({
    breedId: "shiba_inu",
    mainColor: 0xd4884a,
    secondaryColor: 0xfff5e6,
    bellyColor: 0xfff5e6,
    earColor: 0xd4884a,
    eyeColor: 0x332211,
    noseColor: 0x1a1a1a,
    hasPointedEars: true,
    hasCurlyTail: true,
  }),
  golden_retriever: makeDogConfig({
    breedId: "golden_retriever",
    mainColor: 0xd4a040,
    secondaryColor: 0xf0d080,
    bellyColor: 0xf5dca0,
    earColor: 0xc89030,
    eyeColor: 0x443322,
    noseColor: 0x1a1a1a,
    hasFlopEars: true,
    hasFluffyTail: true,
    hasThickFur: true,
  }),
  corgi: makeDogConfig({
    breedId: "corgi",
    mainColor: 0xd49040,
    secondaryColor: 0xffffff,
    bellyColor: 0xffffff,
    earColor: 0xd49040,
    eyeColor: 0x332211,
    noseColor: 0x1a1a1a,
    hasPointedEars: true,
    hasShortLegs: true,
  }),
  husky: makeDogConfig({
    breedId: "husky",
    mainColor: 0x778899,
    secondaryColor: 0xffffff,
    bellyColor: 0xffffff,
    earColor: 0x778899,
    eyeColor: 0x5599dd,
    noseColor: 0x1a1a1a,
    hasPointedEars: true,
    hasFluffyTail: true,
    hasThickFur: true,
    hasFaceMask: true,
  }),
  pomeranian: makeDogConfig({
    breedId: "pomeranian",
    mainColor: 0xe8a050,
    secondaryColor: 0xf5d0a0,
    bellyColor: 0xfff0d8,
    earColor: 0xe8a050,
    eyeColor: 0x221100,
    noseColor: 0x1a1a1a,
    hasPointedEars: true,
    hasFluffyTail: true,
    hasThickFur: true,
    hasCurlyTail: true,
  }),
};

export const DOG_BREEDS: { value: DogType; label: string }[] = [
  { value: "shiba_inu", label: "Shiba Inu" },
  { value: "golden_retriever", label: "Golden Retriever" },
  { value: "corgi", label: "Corgi" },
  { value: "husky", label: "Husky" },
  { value: "pomeranian", label: "Pomeranian" },
];
