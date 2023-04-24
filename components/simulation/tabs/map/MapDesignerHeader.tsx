"use client";

import Button from "@/components/global/Button";
import { useAtom, useAtomValue } from "jotai";
import { worldAtom } from "../../store";
import {
  mapDesignerFullscreenAtom,
  mapDesignerObjectsAtom,
  mapDesignerWorldSizeAtom,
} from "../../store/mapDesignerAtoms";
import { BsArrowsFullscreen, BsFullscreenExit } from "react-icons/bs";

export default function MapDesignerHeader() {
  const world = useAtomValue(worldAtom);

  const [worldSize, setWorldSize] = useAtom(mapDesignerWorldSizeAtom);
  const [objects, setObjects] = useAtom(mapDesignerObjectsAtom);
  const [isFullscreen, setIsFullscreen] = useAtom(mapDesignerFullscreenAtom);

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

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="flex items-center justify-start gap-2">
      <Button variant="grey" onClick={handleUse}>
        Use Map
      </Button>
      <Button onClick={handleReset}>Reset Designer</Button>

      <Button
        onClick={handleFullscreen}
        className="ml-auto"
        icon={isFullscreen ? <BsFullscreenExit /> : <BsArrowsFullscreen />}
        variant="grey"
      ></Button>
    </div>
  );
}
