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
import { worldAtom } from "../../store";
import ToggleableFullscreen from "@/components/global/ToggleableFullscreen";
import classNames from "classnames";
import { useEffectOnce, useInterval } from "react-use";
import useSavedMap from "./useSavedMap";

export default function MapDesigner() {
  const isFullscreen = useAtomValue(mapDesignerFullscreenAtom);

  const world = useAtomValue(worldAtom);
  const [worldSize, setWorldSize] = useAtom(mapDesignerWorldSizeAtom);
  const [objects, setObjects] = useAtom(mapDesignerObjectsAtom);

  // Load objects from local storage
  const { savedObjects, setSavedObjects, savedWorldSize, setSavedWorldSize } =
    useSavedMap();

  // Initialize this component with values from the world or the local storage
  useEffectOnce(() => {
    if (world) {
      if (savedObjects) {
        setObjects([...savedObjects]);
      } else {
        setObjects(world.objects.map((obj) => obj.clone()));
      }

      if (savedWorldSize) {
        setWorldSize(savedWorldSize);
      } else {
        setWorldSize(world.size);
      }
    }
  });

  // Save the objects every 1 seconds
  useInterval(() => {
    setSavedObjects(objects);
    setWorldSize(worldSize);
  }, 1000);

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
