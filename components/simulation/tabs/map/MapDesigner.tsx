"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import MapDesignerLayer from "./MapDesignerLayer";
import {
  mapDesignerFullscreenAtom,
  mapDesignerObjectsAtom,
  mapDesignerWorldSizeAtom,
} from "../../store/mapDesignerAtoms";
import MapDesignerHeader from "./MapDesignerHeader";
import MapDesignerFooter from "./MapDesignerFooter";
import MapDesignerCanvas from "./MapDesignerCanvas";
import { useEffect } from "react";
import { worldAtom } from "../../store";
import ToggleableFullscreen from "@/components/global/ToggleableFullscreen";
import classNames from "classnames";

export default function MapDesigner() {
  const isFullscreen = useAtomValue(mapDesignerFullscreenAtom);
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
    <ToggleableFullscreen enable={isFullscreen} className="bg-grey-dark">
      <div
        className={classNames(
          isFullscreen && "section-container py-6 xl:px-36 2xl:px-60"
        )}
      >
        <div className="flex flex-col gap-5 ">
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
        </div>
      </div>
    </ToggleableFullscreen>
  );
}
