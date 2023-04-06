import Creature from "../../../creature/Creature";
import { colors } from "../../World";
import WorldObject from "../../WorldObject";
import WorldArea from "./../WorldArea";

type WorldObjectType = new (...args: any[]) => WorldObject;

export default function HealthArea<TBase extends WorldObjectType>(Base: TBase) {
  return class HealthAreaMixin extends Base implements WorldArea {
    health: number = 0;
    areaType = 1;
    color = colors.healing;

    computeStepOnCreature(creature: Creature) {
      creature.health += this.health;
    }

    draw() {
      this.color = this.health >= 0 ? colors.healing : colors.danger;
      super.draw();
    }
  };
}
