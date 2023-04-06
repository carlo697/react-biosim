import World from "./World";

export default interface WorldObject {
  world: World;
  pixels: [number, number][];
  color: string;

  computePixels(): void;
  draw(): void;
}
