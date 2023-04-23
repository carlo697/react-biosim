"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import MapDesignerLayer from "./MapDesignerLayer";
import {
  mapDesignerObjectsAtom,
  mapDesignerWorldSizeAtom,
} from "../../store/mapDesignerAtoms";
import MapDesignerHeader from "./MapDesignerHeader";
import MapDesignerFooter from "./MapDesignerFooter";
import MapDesignerCanvas from "./MapDesignerCanvas";
import { useEffect } from "react";
import { worldAtom } from "../../store";

export default function MapDesigner() {
  const world = useAtomValue(worldAtom);
  const setWorldSize = useSetAtom(mapDesignerWorldSizeAtom);
  const [objects, setObjects] = useAtom(mapDesignerObjectsAtom);

  // Initialize this component with values from the world
  useEffect(() => {
    if (world) {
      setWorldSize(world.size);
      setObjects(world.objects.map((obj) => obj.clone()));
    }
  }, [setObjects, setWorldSize, world]);

  return (
    <>
      <MapDesignerHeader />

      <div className="grid lg:grid-cols-3">
        <MapDesignerCanvas />

        <div className="w-full overflow-x-hidden overflow-y-scroll px-5 lg:aspect-[1/2]">
          <h3 className="mb-1 text-2xl font-bold">Objects</h3>
          <div className="flex flex-col gap-1">
            {objects.map((obstacle, index) => (
              <MapDesignerLayer key={index} index={index} obj={obstacle} />
            ))}
          </div>
        </div>
      </div>

      <MapDesignerFooter />
    </>
  );
}
