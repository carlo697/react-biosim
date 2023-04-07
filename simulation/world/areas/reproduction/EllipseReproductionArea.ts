import EllipseObject from "../../objects/EllipseObject";
import World from "../../World";
import ReproductionArea from "./ReproductionArea";

export default class EllipseReproductionArea extends ReproductionArea(
  EllipseObject
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
