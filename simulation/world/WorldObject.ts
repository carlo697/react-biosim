export default interface WorldObject {
  pixels: [number, number][];

  computePixels(): void;
  onDrawBeforeCreatures?(): void;
  onDrawAfterCreatures?(): void;
}
