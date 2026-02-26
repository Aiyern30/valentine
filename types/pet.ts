import { CatType } from "./cat";
import { DogType } from "./dog";

export type PetKind = "cat" | "dog";

export type PetBreed = CatType | DogType;

export type ActiveScene = "room" | "sleep" | "bath" | "feed" | "play";

export interface PetSelection {
  kind: PetKind;
  breed: PetBreed;
}
