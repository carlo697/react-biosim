"use client";

import Button from "@/components/global/Button";
import { useAtom, useAtomValue } from "jotai";
import { worldAtom } from "../../store";
import {
  mapDesignerObjectsAtom,
  mapDesignerWorldSizeAtom,
} from "../../store/mapDesignerAtoms";

export default function MapDesignerHeader() {
  const world = useAtomValue(worldAtom);

  const [worldSize, setWorldSize] = useAtom(mapDesignerWorldSizeAtom);
  const [objects, setObjects] = useAtom(mapDesignerObjectsAtom);

  const handleUse = () => {
    if (world) {
      const isPaused = world.isPaused;
      world.size = worldSize;
      world.objects = objects.map((obj) => obj.clone());
      world.initializeWorld(true);

      if (!isPaused) {
        world.startRun();
      }
    }
  };

  const handleReset = () => {
    if (world) {
      setWorldSize(world.size);
      setObjects(world.objects.map((obj) => obj.clone()));
    }
  };

  return (
    <div className="flex-center gap-2">
      <Button variant="grey" onClick={handleUse}>
        Use this map
      </Button>
      <Button onClick={handleReset}>Reset Painter</Button>
    </div>
  );
}
