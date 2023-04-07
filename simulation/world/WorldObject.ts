export default interface WorldObject {
  pixels: [number, number][];
  color: string;

  computePixels(worldSize: number): void;
  draw(context: CanvasRenderingContext2D, worldSize: number): void;
}
