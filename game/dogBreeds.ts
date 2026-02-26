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
  dalmatian: makeDogConfig({
    breedId: "dalmatian",
    mainColor: 0xffffff,
    secondaryColor: 0x222222,
    bellyColor: 0xf5f5f5,
    earColor: 0xdddddd,
    eyeColor: 0x332211,
    noseColor: 0x111111,
    hasFlopEars: true,
    hasFluffyTail: false,
  }),

  labrador: makeDogConfig({
    breedId: "labrador",
    mainColor: 0xd4a060,
    secondaryColor: 0xf0c888,
    bellyColor: 0xf5d8a8,
    earColor: 0xc08840,
    eyeColor: 0x443322,
    noseColor: 0x1a1a1a,
    hasFlopEars: true,
    hasFluffyTail: false,
  }),

  border_collie: makeDogConfig({
    breedId: "border_collie",
    mainColor: 0x222222,
    secondaryColor: 0xffffff,
    bellyColor: 0xffffff,
    earColor: 0x222222,
    eyeColor: 0x4488aa,
    noseColor: 0x111111,
    hasFlopEars: true,
    hasThickFur: true,
  }),

  beagle: makeDogConfig({
    breedId: "beagle",
    mainColor: 0xc8884a,
    secondaryColor: 0xffffff,
    bellyColor: 0xffffff,
    earColor: 0x885522,
    eyeColor: 0x553311,
    noseColor: 0x111111,
    hasFlopEars: true,
  }),

  bulldog: makeDogConfig({
    breedId: "bulldog",
    mainColor: 0xd4aa80,
    secondaryColor: 0xf0d0b0,
    bellyColor: 0xfff0e0,
    earColor: 0xc09060,
    eyeColor: 0x332211,
    noseColor: 0x111111,
    hasFlopEars: false,
    hasPointedEars: false,
  }),

  dachshund: makeDogConfig({
    breedId: "dachshund",
    mainColor: 0x8b4513,
    secondaryColor: 0xd2691e,
    bellyColor: 0xdeb887,
    earColor: 0x6b3410,
    eyeColor: 0x3b1a08,
    noseColor: 0x111111,
    hasFlopEars: true,
    hasShortLegs: true,
  }),

  german_shepherd: makeDogConfig({
    breedId: "german_shepherd",
    mainColor: 0x8b6914,
    secondaryColor: 0x222222,
    bellyColor: 0xd4aa60,
    earColor: 0x8b6914,
    eyeColor: 0x332200,
    noseColor: 0x111111,
    hasPointedEars: true,
    hasThickFur: true,
  }),

  poodle: makeDogConfig({
    breedId: "poodle",
    mainColor: 0xf0f0f0,
    secondaryColor: 0xffffff,
    bellyColor: 0xfafafa,
    earColor: 0xe0e0e0,
    eyeColor: 0x332211,
    noseColor: 0x111111,
    hasFlopEars: true,
    hasThickFur: true,
    hasFluffyTail: true,
  }),

  chihuahua: makeDogConfig({
    breedId: "chihuahua",
    mainColor: 0xd4a060,
    secondaryColor: 0xf5dca0,
    bellyColor: 0xfff0d0,
    earColor: 0xd4a060,
    eyeColor: 0x221100,
    noseColor: 0x1a1a1a,
    hasPointedEars: true,
  }),

  boxer: makeDogConfig({
    breedId: "boxer",
    mainColor: 0xd4884a,
    secondaryColor: 0xffffff,
    bellyColor: 0xfff0e0,
    earColor: 0xc07840,
    eyeColor: 0x332211,
    noseColor: 0x111111,
    hasFlopEars: true,
  }),

  great_dane: makeDogConfig({
    breedId: "great_dane",
    mainColor: 0x778899,
    secondaryColor: 0xffffff,
    bellyColor: 0xf0f0f0,
    earColor: 0x667788,
    eyeColor: 0x332211,
    noseColor: 0x111111,
    hasFlopEars: true,
    hasThickFur: false,
  }),

  samoyed: makeDogConfig({
    breedId: "samoyed",
    mainColor: 0xffffff,
    secondaryColor: 0xf8f8f8,
    bellyColor: 0xffffff,
    earColor: 0xeeeeee,
    eyeColor: 0x332211,
    noseColor: 0x111111,
    hasPointedEars: true,
    hasFluffyTail: true,
    hasThickFur: true,
    hasCurlyTail: true,
  }),

  australian_shepherd: makeDogConfig({
    breedId: "australian_shepherd",
    mainColor: 0x4466aa,
    secondaryColor: 0xffffff,
    bellyColor: 0xf0f4ff,
    earColor: 0x334488,
    eyeColor: 0x44aacc,
    noseColor: 0x111111,
    hasFlopEars: true,
    hasThickFur: true,
    hasFluffyTail: false,
  }),

  maltese: makeDogConfig({
    breedId: "maltese",
    mainColor: 0xffffff,
    secondaryColor: 0xf5f5f5,
    bellyColor: 0xffffff,
    earColor: 0xeeeeee,
    eyeColor: 0x221100,
    noseColor: 0x111111,
    hasFlopEars: true,
    hasThickFur: true,
    hasFluffyTail: true,
  }),

  basset_hound: makeDogConfig({
    breedId: "basset_hound",
    mainColor: 0xd4a050,
    secondaryColor: 0xffffff,
    bellyColor: 0xffffff,
    earColor: 0x885522,
    eyeColor: 0x553311,
    noseColor: 0x111111,
    hasFlopEars: true,
    hasShortLegs: true,
  }),
};

export const DOG_BREEDS: { value: DogType; label: string }[] = [
  { value: "shiba_inu", label: "Shiba Inu" },
  { value: "golden_retriever", label: "Golden Retriever" },
  { value: "corgi", label: "Corgi" },
  { value: "husky", label: "Husky" },
  { value: "pomeranian", label: "Pomeranian" },
  { value: "dalmatian", label: "Dalmatian" },
  { value: "labrador", label: "Labrador" },
  { value: "border_collie", label: "Border Collie" },
  { value: "beagle", label: "Beagle" },
  { value: "bulldog", label: "Bulldog" },
  { value: "dachshund", label: "Dachshund" },
  { value: "german_shepherd", label: "German Shepherd" },
  { value: "poodle", label: "Poodle" },
  { value: "chihuahua", label: "Chihuahua" },
  { value: "boxer", label: "Boxer" },
  { value: "great_dane", label: "Great Dane" },
  { value: "samoyed", label: "Samoyed" },
  { value: "australian_shepherd", label: "Australian Shepherd" },
  { value: "maltese", label: "Maltese" },
  { value: "basset_hound", label: "Basset Hound" },
];
