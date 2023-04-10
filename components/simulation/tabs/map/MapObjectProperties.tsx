"use client";

import WorldObject from "@/simulation/world/WorldObject";
import { getName } from "./MapLayer";
import NumberInput from "@/components/global/inputs/NumberInput";

interface Props {
  obj: WorldObject;
}

export default function MapObjectProperties({ obj }: Props) {
  return (
    <div>
      <h4>
        <strong>Type:</strong> {getName(obj)}
      </h4>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberInput
          label="X"
          value={obj.x}
          onChange={(value) => (obj.x = value)}
          step={0.02}
        />
        <NumberInput
          label="Y"
          value={obj.y}
          onChange={(value) => (obj.y = value)}
          step={0.02}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberInput
          label="Width"
          value={obj.width}
          onChange={(value) => (obj.width = value)}
          step={0.02}
        />
        <NumberInput
          label="Height"
          value={obj.height}
          onChange={(value) => (obj.height = value)}
          step={0.02}
        />
      </div>
    </div>
  );
}
