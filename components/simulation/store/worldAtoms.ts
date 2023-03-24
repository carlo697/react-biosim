import World from "@/simulation/world/World";
import { atom } from "jotai";

export const worldAtom = atom<World | null>(null);
export const restartAtom = atom(false);
export const isPausedAtom = atom(false);
