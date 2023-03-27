import { ActionName } from "@/simulation/creature/actions/CreatureActions";
import { MutationMode } from "@/simulation/creature/genome/MutationMode";
import { SensorName } from "@/simulation/creature/sensors/CreatureSensors";
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

// Initial settings
export const worldSizeAtom = atom(100);
export const initialPopulationAtom = atom(1000);
export const initialGenomeSizeAtom = atom(4);
export const maxGenomeSizeAtom = atom(30);
export const maxNeuronsAtom = atom(15);
export const mutationModeAtom = atom<MutationMode>(MutationMode.wholeGene);
// Sensors
export const enabledSensorsAtom = atom<SensorName[]>([
  "HorizontalPosition",
  "VerticalPosition",
  "Age",
  "Oscillator",
  "Random",
  "HorizontalSpeed",
  "VerticalSpeed",
  "HorizontalBorderDistance",
  "VerticalBorderDistance",
  "BorderDistance",
]);
// Actions
export const enabledActionsAtom = atom<ActionName[]>([
  "MoveNorth",
  "MoveSouth",
  "MoveEast",
  "MoveWest",
  "RandomMove",
  "MoveForward",
]);
