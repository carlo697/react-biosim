import { colors } from "../../World";
import WorldObject from "../../WorldObject";
import WorldArea from "../WorldArea";

type WorldObjectConstructor = new (...args: any[]) => WorldObject;

export default function ReproductionArea<TBase extends WorldObjectConstructor>(
  Base: TBase
) {
  return class ReproductionAreaMixin extends Base implements WorldArea {
    color = colors.reproduction;
    areaType = 0;
  };
}
