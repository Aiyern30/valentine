import { CatType } from "@/types/cat";

// ─── Breed visual configuration ──────────────────────────────────────────────

export interface BreedConfig {
  mainColor: number;
  earInner: number;
  noseColor: number;
  eyeColor: number;
  patternColor: number;
  bellyColor: number; // -1 = no separate belly
  hasStripes: boolean;
  hasSpots: boolean;
  hasTicking: boolean;
  hasCurlyFur: boolean;
  isSphynx: boolean;
  isScottishFold: boolean;
  isMaineCoon: boolean;
  isPersian: boolean;
  isOriental: boolean;
  openEyes: boolean;
  hasFluffyTail: boolean;
  hasPointedPattern: boolean; // Siamese-style dark points
  hasWhiteGloves: boolean; // White paws (Birman)
}

function defaults(): BreedConfig {
  return {
    mainColor: 0xf5ebe0,
    earInner: 0xffb7c5,
    noseColor: 0xff9999,
    eyeColor: 0x554433,
    patternColor: 0xffffff,
    bellyColor: -1,
    hasStripes: false,
    hasSpots: false,
    hasTicking: false,
    hasCurlyFur: false,
    isSphynx: false,
    isScottishFold: false,
    isMaineCoon: false,
    isPersian: false,
    isOriental: false,
    openEyes: false,
    hasFluffyTail: false,
    hasPointedPattern: false,
    hasWhiteGloves: false,
  };
}

// ─── Each breed's unique visual config ───────────────────────────────────────

export const BREED_CONFIGS: Record<CatType, BreedConfig> = {
  siamese: {
    ...defaults(),
    mainColor: 0xf5e6c8,
    patternColor: 0x6b4f3b,
    noseColor: 0x884444,
    hasPointedPattern: true,
  },

  persian: {
    ...defaults(),
    mainColor: 0xf0e8e0,
    patternColor: 0xe8ddd0,
    noseColor: 0xffaaaa,
    isPersian: true,
  },

  maine_coon: {
    ...defaults(),
    mainColor: 0x8b6842,
    patternColor: 0x5c4030,
    bellyColor: 0xd4b896,
    noseColor: 0xcc7777,
    hasStripes: true,
    isMaineCoon: true,
  },

  british_shorthair: {
    ...defaults(),
    mainColor: 0x8899aa,
    patternColor: 0x7788a0,
    noseColor: 0xcc8888,
    eyeColor: 0xcc8822,
    openEyes: true,
  },

  ragdoll: {
    ...defaults(),
    mainColor: 0xf5f0e8,
    patternColor: 0x9baab8,
    noseColor: 0xddaaaa,
    bellyColor: 0xffffff,
    hasPointedPattern: true,
  },

  bengal: {
    ...defaults(),
    mainColor: 0xd4a44c,
    patternColor: 0x5c3a1a,
    noseColor: 0xcc6655,
    hasSpots: true,
    openEyes: true,
    eyeColor: 0x55aa44,
  },

  sphynx: {
    ...defaults(),
    mainColor: 0xe8c8b0,
    earInner: 0xddb8a0,
    noseColor: 0xddaaaa,
    eyeColor: 0x55aa88,
    isSphynx: true,
    openEyes: true,
  },

  scottish_fold: {
    ...defaults(),
    mainColor: 0xb0b8c0,
    patternColor: 0xa0a8b0,
    noseColor: 0xddaaaa,
    eyeColor: 0xdd8822,
    isScottishFold: true,
    openEyes: true,
  },

  abyssinian: {
    ...defaults(),
    mainColor: 0xc47a40,
    patternColor: 0xa86030,
    noseColor: 0xcc6655,
    hasTicking: true,
  },

  american_shorthair: {
    ...defaults(),
    mainColor: 0xc0c0c0,
    patternColor: 0x606060,
    noseColor: 0xdd8888,
    hasStripes: true,
  },

  gray: {
    ...defaults(),
    mainColor: 0xcfd2d6,
    patternColor: 0xb0b4ba,
    hasStripes: true,
  },

  calico: {
    ...defaults(),
    mainColor: 0xffffff,
  },

  // ─── NEW BREEDS ────────────────────────────────────────────────────────────

  norwegian_forest: {
    ...defaults(),
    mainColor: 0x7a5c3e,
    patternColor: 0x4e3a28,
    bellyColor: 0xe0d0c0,
    noseColor: 0xcc7777,
    hasStripes: true,
    isMaineCoon: true, // similar large build with tufted ears
    hasFluffyTail: true,
  },

  russian_blue: {
    ...defaults(),
    mainColor: 0x7088a0,
    patternColor: 0x607890,
    noseColor: 0x888888, // blue-gray nose leather
    eyeColor: 0x44bb55, // vivid green eyes
    openEyes: true,
  },

  oriental_shorthair: {
    ...defaults(),
    mainColor: 0x5c3a2a, // chocolate brown
    patternColor: 0x4a2e20,
    earInner: 0x8a6a5a,
    noseColor: 0x7a5a4a,
    eyeColor: 0x44aa44, // green eyes
    isOriental: true,
    openEyes: true,
  },

  turkish_angora: {
    ...defaults(),
    mainColor: 0xfaf8f5, // pure white
    patternColor: 0xf0ece8,
    earInner: 0xffbbcc,
    noseColor: 0xffaaaa,
    eyeColor: 0x3388cc, // blue eye
    openEyes: true,
    hasFluffyTail: true,
  },

  birman: {
    ...defaults(),
    mainColor: 0xf5ead8, // cream body
    patternColor: 0x5c4a3a, // dark seal points
    noseColor: 0x884455,
    eyeColor: 0x4488cc, // blue eyes
    hasPointedPattern: true,
    hasWhiteGloves: true,
    openEyes: true,
  },

  exotic_shorthair: {
    ...defaults(),
    mainColor: 0xeeb075, // orange-cream
    patternColor: 0xdd9955,
    noseColor: 0xff9999,
    eyeColor: 0xcc8833,
    isPersian: true, // same flat face as Persian
    hasStripes: true,
  },

  cornish_rex: {
    ...defaults(),
    mainColor: 0xf0e0d0, // cream/white
    patternColor: 0xe0d0c0,
    earInner: 0xffbbcc,
    noseColor: 0xffaaaa,
    eyeColor: 0x55aa88, // green
    hasCurlyFur: true,
    openEyes: true,
  },

  balinese: {
    ...defaults(),
    mainColor: 0xf5ead8, // cream like Siamese
    patternColor: 0x5c4030, // dark points
    noseColor: 0x884444,
    eyeColor: 0x4488cc, // blue
    hasPointedPattern: true,
    hasFluffyTail: true,
    openEyes: true,
  },

  himalayan: {
    ...defaults(),
    mainColor: 0xf0e8e0, // cream/white like Persian
    patternColor: 0x5c4a3a, // dark seal points
    noseColor: 0x884455,
    eyeColor: 0x4488cc, // blue
    isPersian: true, // flat face like Persian
    hasPointedPattern: true,
  },

  devon_rex: {
    ...defaults(),
    mainColor: 0xd0c0b0, // warm gray-beige
    patternColor: 0xc0b0a0,
    earInner: 0xddb8a0,
    noseColor: 0xddaaaa,
    eyeColor: 0x55aa55, // green
    hasCurlyFur: true,
    isOriental: true, // shares big-ear, slender look
    openEyes: true,
  },
};

// ─── UI dropdown data ────────────────────────────────────────────────────────

export const CAT_BREEDS: { value: CatType; label: string }[] = [
  { value: "siamese", label: "Siamese" },
  { value: "persian", label: "Persian" },
  { value: "maine_coon", label: "Maine Coon" },
  { value: "british_shorthair", label: "British Shorthair" },
  { value: "ragdoll", label: "Ragdoll" },
  { value: "bengal", label: "Bengal" },
  { value: "sphynx", label: "Sphynx" },
  { value: "scottish_fold", label: "Scottish Fold" },
  { value: "abyssinian", label: "Abyssinian" },
  { value: "american_shorthair", label: "American Shorthair" },
  { value: "gray", label: "Gray" },
  { value: "calico", label: "Calico" },
  { value: "norwegian_forest", label: "Norwegian Forest Cat" },
  { value: "russian_blue", label: "Russian Blue" },
  { value: "oriental_shorthair", label: "Oriental Shorthair" },
  { value: "turkish_angora", label: "Turkish Angora" },
  { value: "birman", label: "Birman" },
  { value: "exotic_shorthair", label: "Exotic Shorthair" },
  { value: "cornish_rex", label: "Cornish Rex" },
  { value: "balinese", label: "Balinese" },
  { value: "himalayan", label: "Himalayan" },
  { value: "devon_rex", label: "Devon Rex" },
];
