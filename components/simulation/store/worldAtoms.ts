import World from "@/simulation/world/World";
import { atom } from "jotai";

export const worldAtom = atom<World | null>(null);
export const restartAtom = atom(false);
export const isPausedAtom = atom(false);

// Dynamic values
export const stepsPerGenerationAtom = atom(300);
export const pauseBetweenStepsAtom = atom(0);
export const pauseBetweenGenerationsAtom = atom(0);
export const immediateStepsAtom = atom(1);

// Stats
export const currentStepAtom = atom(0);
export const currentGenerationAtom = atom(0);
export const lastGenerationDurationAtom = atom(0);
export const totalTimeAtom = atom(0);
export const lastSurvivorCountAtom = atom(0);
export const lastSurvivalRateAtom = atom(0);
export const newPopulationCountAtom = atom(0);
