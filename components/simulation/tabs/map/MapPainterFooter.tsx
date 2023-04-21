import SelectInput from "@/components/global/inputs/SelectInput";
import MapObjectProperties from "./MapObjectProperties";
import WorldObject from "@/simulation/world/WorldObject";
import RectangleObject from "@/simulation/world/objects/RectangleObject";
import { useAtom, useSetAtom } from "jotai";
import {
  painterObjectsAtom,
  painterSelectedObjectIndexAtom,
} from "../../store/mapPainterAtoms";
import EllipseObject from "@/simulation/world/objects/EllipseObject";
import RectangleReproductionArea from "@/simulation/world/areas/reproduction/RectangleReproductionArea";
import EllipseReproductionArea from "@/simulation/world/areas/reproduction/EllipseReproductionArea";
import RectangleHealthArea from "@/simulation/world/areas/health/RectangleHealthArea";
import EllipseHealthArea from "@/simulation/world/areas/health/EllipseHealthArea";

const defaultX = 0;
const defaultY = 0;
const defaultWidth = 0.2;
const defaultHeight = 0.2;

type MapPainterAddObjectPreset = {
  name: string;
  create: () => WorldObject;
};

const addPresets: Record<string, MapPainterAddObjectPreset> = {
  rectangle: {
    name: "Rectangle",
    create: () =>
      new RectangleObject(defaultX, defaultY, defaultWidth, defaultHeight),
  },
  ellipse: {
    name: "Ellipse",
    create: () =>
      new EllipseObject(defaultX, defaultY, defaultWidth, defaultHeight),
  },
  rectangleReproduction: {
    name: "Rectangle Reproduction",
    create: () =>
      new RectangleReproductionArea(
        defaultX,
        defaultY,
        defaultWidth,
        defaultHeight
      ),
  },
  ellipseReproduction: {
    name: "Ellipse Reproduction",
    create: () =>
      new EllipseReproductionArea(
        defaultX,
        defaultY,
        defaultWidth,
        defaultHeight
      ),
  },
  rectangleHealth: {
    name: "Rectangle Health",
    create: () =>
      new RectangleHealthArea(
        defaultX,
        defaultY,
        defaultWidth,
        defaultHeight,
        true,
        1
      ),
  },
  ellipseHealth: {
    name: "Ellipse Health",
    create: () =>
      new EllipseHealthArea(
        defaultX,
        defaultY,
        defaultWidth,
        defaultHeight,
        true,
        1
      ),
  },
};

export default function MapPainterFooter() {
  const [objects, setObjects] = useAtom(painterObjectsAtom);
  const setSelectedIndex = useSetAtom(painterSelectedObjectIndexAtom);

  const handleSelect = (value: string) => {
    setObjects([...objects, addPresets[value].create()]);
    setSelectedIndex(objects.length);
  };

  return (
    <div className="grid grid-cols-2 gap-5">
      <div>
        <SelectInput label="Add object" onChange={handleSelect}>
          <option value="placeholder">Select an object...</option>
          {Object.entries(addPresets).map(([key, { name }]) => (
            <option value={key} key={key}>
              {name}
            </option>
          ))}
        </SelectInput>
      </div>

      <div>
        <MapObjectProperties />
      </div>
    </div>
  );
}
