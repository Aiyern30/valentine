import { CatType } from "./cat";
import { DogType } from "./dog";

export type PetKind = "cat" | "dog";

export type PetBreed = CatType | DogType;

export interface PetSelection {
  kind: PetKind;
  breed: PetBreed;
}
