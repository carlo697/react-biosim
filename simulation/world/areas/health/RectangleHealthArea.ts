import RectangleObject from "../../objects/RectangleObject";
import HealthAreaMixin from "./HealthArea";

export default class RectangleHealthArea extends HealthAreaMixin(
  RectangleObject
) {
  name = "RectangleHealthArea";

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    relative: boolean = true,
    public health: number = 0
  ) {
    super(x, y, width, height, relative);
  }

  clone() {
    return new RectangleHealthArea(
      this.x,
      this.y,
      this.width,
      this.height,
      this.relative,
      this.health
    );
  }
}

// export default class RectangleHealthArea
//   extends RectangleObject
//   implements WorldArea
// {
//   healthPerStep: number = 0;

//   constructor(
//     public world: World,
//     public x: number,
//     public y: number,
//     public width: number,
//     public height: number,
//     public relative: boolean = true,
//     healthPerStep: number = 0
//   ) {
//     super(world, x, y, width, height, relative);

//     this.healthPerStep = healthPerStep;
//     if (this.healthPerStep >= 0) {
//       this.color = "rgba(0,255,0, 0.1)";
//     } else {
//       this.color = "rgba(255,0,0, 0.1)";
//     }
//   }

//   get areaType(): number {
//     return 1;
//   }

//   computeStepOnCreature(creature: Creature) {
//     creature.health += this.healthPerStep;
//   }
// }
