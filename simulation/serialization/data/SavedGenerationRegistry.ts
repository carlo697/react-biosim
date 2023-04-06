export type SavedSingleGeneration = {
  /** Generation */
  g: number;
  /** Survivor Count */
  sC: number;
  /** Initial population */
  sP: number;
};

export default interface SavedGenerationRegistry {
  generations: SavedSingleGeneration[];
  minSurvivorCount: number;
  maxSurvivorCount: number;
}
