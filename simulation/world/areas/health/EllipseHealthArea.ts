import EllipseObject from "../../objects/EllipseObject";
import World from "../../World";
import HealthArea from "./HealthArea";

export default class EllipseHealthArea extends HealthArea(EllipseObject) {
  constructor(
    world: World,
    x: number,
    y: number,
    width: number,
    height: number,
    relative: boolean = true,
    public health: number = 0
  ) {
    super(world, x, y, width, height, relative);
  }
}
