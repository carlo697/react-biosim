"use client";

import { getName } from "./MapLayer";
import NumberInput from "@/components/global/inputs/NumberInput";
import { useAtom } from "jotai";
import {
  painterObjectsAtom,
  painterSelectedObjectIndexAtom,
} from "../../store/mapPainterAtoms";

export default function MapObjectProperties() {
  const [objects, setObjects] = useAtom(painterObjectsAtom);
  const [selectedObjectIndex, setSelectedObjectIndex] = useAtom(
    painterSelectedObjectIndexAtom
  );

  const selectedObject =
    selectedObjectIndex !== undefined
      ? objects[selectedObjectIndex]
      : undefined;

  return (
    <div>
      {selectedObject && (
        <>
          <h4>
            <strong>Type:</strong> {getName(selectedObject)}
          </h4>

          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput
              label="X"
              value={selectedObject.x}
              onChange={(value) => (selectedObject.x = value)}
              step={0.02}
            />
            <NumberInput
              label="Y"
              value={selectedObject.y}
              onChange={(value) => (selectedObject.y = value)}
              step={0.02}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput
              label="Width"
              value={selectedObject.width}
              onChange={(value) => (selectedObject.width = value)}
              step={0.02}
            />
            <NumberInput
              label="Height"
              value={selectedObject.height}
              onChange={(value) => (selectedObject.height = value)}
              step={0.02}
            />
          </div>
        </>
      )}
    </div>
  );
}
