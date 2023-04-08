"use client";

import WorldObject from "@/simulation/world/WorldObject";
import WorldArea from "@/simulation/world/areas/WorldArea";
import { useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { useWindowSize } from "react-use";
import { selectedMapObjectAtom } from "../../store/mapDrawingAtoms";
import classNames from "classnames";

interface Props {
  worldSize: number;
  obj: WorldObject | WorldArea;
}

function getName(obj: Object) {
  return Object.getPrototypeOf(obj).constructor.name;
}

export default function MapLayer({ worldSize, obj }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [selectedMapObject, setSelectedMapObject] = useAtom(
    selectedMapObjectAtom
  );

  const draw = useCallback(() => {
    if (canvas.current) {
      // Update size
      canvas.current.width = canvas.current.clientWidth;
      canvas.current.height = canvas.current.clientHeight;

      const context = canvas.current.getContext("2d")!;

      obj.draw(context, worldSize);
    }
  }, [obj, worldSize]);

  // Draw the map
  const { width } = useWindowSize();
  useEffect(() => {
    draw();
  }, [draw, width]);

  const handleClick = () => {
    setSelectedMapObject(obj);
  };

  return (
    <button
      className={classNames(
        "flex w-full items-center gap-2 border-2 bg-grey-mid",
        selectedMapObject === obj ? "border-white" : "border-transparent"
      )}
      onClick={handleClick}
    >
      <canvas className="aspect-square h-10 bg-white" ref={canvas}></canvas>

      <h4>{getName(obj)}</h4>
    </button>
  );
}
