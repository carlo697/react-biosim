import Creature from "../creature/Creature";

export default interface WorldObject {
  x: number;
  y: number;
  width: number;
  height: number;

  pixels: [number, number][];
  color: string;

  computePixels(worldSize: number): void;
  draw(context: CanvasRenderingContext2D, worldSize: number): void;
  clone(): WorldObject;

  areaType?: number;
  areaEffectOnCreature?(creature: Creature): void;
}
