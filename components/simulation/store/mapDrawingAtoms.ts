import WorldObject from "@/simulation/world/WorldObject";
import { atom } from "jotai";

export const selectedMapObjectAtom = atom<WorldObject | undefined>(undefined);
