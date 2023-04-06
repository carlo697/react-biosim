import RectangleObject from "../../objects/RectangleObject";
import World from "../../World";
import ReproductionArea from "./ReproductionArea";

export default class RectangleReproductionArea extends ReproductionArea(
  RectangleObject
) {
  constructor(
    world: World,
    x: number,
    y: number,
    width: number,
    height: number,
    relative: boolean = true
  ) {
    super(world, x, y, width, height, relative);
  }
}
