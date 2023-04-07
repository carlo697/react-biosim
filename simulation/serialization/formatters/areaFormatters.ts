import EllipseHealthArea from "../../world/areas/health/EllipseHealthArea";
import RectangleHealthArea from "../../world/areas/health/RectangleHealthArea";
import EllipseReproductionArea from "../../world/areas/reproduction/EllipseReproductionArea";
import RectangleReproductionArea from "../../world/areas/reproduction/RectangleReproductionArea";
import { DataFormatter } from "./DataFormatter";

const areaFormatters: {
  [key: string]: DataFormatter<any, { [key: string]: any }>;
} = {
  RectangleReproductionArea: {
    serialize({ x, y, width, height, relative }: RectangleReproductionArea) {
      return { x, y, width, height, relative };
    },
    deserialize(data): RectangleReproductionArea {
      return new RectangleReproductionArea(
        data.x,
        data.y,
        data.width,
        data.height,
        data.relative
      );
    },
  },

  EllipseReproductionArea: {
    serialize({ x, y, width, height, relative }: EllipseReproductionArea) {
      return { x, y, width, height, relative };
    },
    deserialize(data): EllipseReproductionArea {
      return new EllipseReproductionArea(
        data.x,
        data.y,
        data.width,
        data.height,
        data.relative
      );
    },
  },

  RectangleHealthArea: {
    serialize({ x, y, width, height, relative, health }: RectangleHealthArea) {
      return { x, y, width, height, relative, health };
    },
    deserialize(data): RectangleHealthArea {
      return new RectangleHealthArea(
        data.x,
        data.y,
        data.width,
        data.height,
        data.relative,
        data.health
      );
    },
  },

  EllipseHealthArea: {
    serialize({ x, y, width, height, relative, health }: EllipseHealthArea) {
      return { x, y, width, height, relative, health };
    },
    deserialize(data): EllipseHealthArea {
      return new EllipseHealthArea(
        data.x,
        data.y,
        data.width,
        data.height,
        data.relative,
        data.health
      );
    },
  },
};

export default areaFormatters;
