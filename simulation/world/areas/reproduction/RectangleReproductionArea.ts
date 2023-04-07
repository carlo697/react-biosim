import RectangleObject from "../../objects/RectangleObject";
import World from "../../World";
import ReproductionArea from "./ReproductionArea";

export default class RectangleReproductionArea extends ReproductionArea(
  RectangleObject
) {
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    relative: boolean = true
  ) {
    super(x, y, width, height, relative);
  }
}
