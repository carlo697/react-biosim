import Creature from "../../../creature/Creature";
import { colors } from "../../World";
import WorldObject from "../../WorldObject";

type WorldObjectType = new (...args: any[]) => WorldObject;

export default function HealthArea<TBase extends WorldObjectType>(Base: TBase) {
  return class HealthAreaMixin extends Base implements WorldObject {
    health: number = 0;
    areaType = 1;
    color = colors.healing;

    areaEffectOnCreature(creature: Creature) {
      creature.health += this.health;
    }

    draw(context: CanvasRenderingContext2D, worldSize: number) {
      this.color = this.health >= 0 ? colors.healing : colors.danger;
      super.draw(context, worldSize);
    }
  };
}
