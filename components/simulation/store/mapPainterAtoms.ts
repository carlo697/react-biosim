import WorldObject from "@/simulation/world/WorldObject";
import { atom } from "jotai";

export const painterWorldSizeAtom = atom<number>(0);
export const painterObjectsAtom = atom<WorldObject[]>([]);
export const painterSelectedObjectIndexAtom = atom<number | undefined>(undefined);
