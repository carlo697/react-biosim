"use client";

import { getName } from "./MapLayer";
import NumberInput from "@/components/global/inputs/NumberInput";
import { useAtom } from "jotai";
import {
  painterObjectsAtom,
  painterSelectedObjectIndexAtom,
} from "../../store/mapPainterAtoms";
import Button from "@/components/global/Button";

export default function MapObjectProperties() {
  const [objects, setObjects] = useAtom(painterObjectsAtom);
  const [selectedObjectIndex, setSelectedObjectIndex] = useAtom(
    painterSelectedObjectIndexAtom
  );

  const selectedObject =
    selectedObjectIndex !== undefined
      ? objects[selectedObjectIndex]
      : undefined;

  const update = () => {
    setObjects(objects.map((obj) => obj.clone()));
  };

  const updateX = (value: number) => {
    if (selectedObject && !isNaN(value)) {
      selectedObject.x = value;
      update();
    }
  };

  const updateY = (value: number) => {
    if (selectedObject && !isNaN(value)) {
      selectedObject.y = value;
      update();
    }
  };

  const updateWidth = (value: number) => {
    if (selectedObject && !isNaN(value)) {
      selectedObject.width = value;
      update();
    }
  };

  const updateHeight = (value: number) => {
    if (selectedObject && !isNaN(value)) {
      selectedObject.height = value;
      update();
    }
  };

  const handleDelete = () => {
    setSelectedObjectIndex(undefined);
    setObjects(objects.filter((_, index) => index !== selectedObjectIndex));
  };

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
              onChange={updateX}
              step={0.01}
            />
            <NumberInput
              label="Y"
              value={selectedObject.y}
              onChange={updateY}
              step={0.01}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput
              label="Width"
              value={selectedObject.width}
              onChange={updateWidth}
              step={0.01}
            />
            <NumberInput
              label="Height"
              value={selectedObject.height}
              onChange={updateHeight}
              step={0.01}
            />
          </div>

          <div className="mt-2 grid grid-cols-2">
            <Button onClick={handleDelete}>Delete</Button>
          </div>
        </>
      )}
    </div>
  );
}
