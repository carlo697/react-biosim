import Creature from "../../creature/Creature";
import WorldObject from "../WorldObject";

export default interface WorldArea extends WorldObject {
  areaType: number;
  computeStepOnCreature?(creature: Creature): void;
}
