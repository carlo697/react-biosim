"use client";

import WorldObject from "@/simulation/world/WorldObject";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { useWindowSize } from "react-use";
import {
  painterWorldSizeAtom,
  painterSelectedObjectIndexAtom,
} from "../../store/mapPainterAtoms";
import classNames from "classnames";

interface Props {
  index: number;
  obj: WorldObject;
}

export function getName(obj: Object) {
  return Object.getPrototypeOf(obj).constructor.name;
}

export default function MapLayer({ index, obj }: Props) {
  const worldSize = useAtomValue(painterWorldSizeAtom);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [selectedObjectIndex, setSelectedObjectIndex] = useAtom(
    painterSelectedObjectIndexAtom
  );

  const draw = useCallback(() => {
    if (canvas.current) {
      // Update size
      canvas.current.width = canvas.current.clientWidth;
      canvas.current.height = canvas.current.clientHeight;

      const context = canvas.current.getContext("2d")!;
      obj.computePixels(worldSize);
      obj.draw(context, worldSize);
    }
  }, [obj, worldSize]);

  // Draw the map
  const { width } = useWindowSize();
  useEffect(() => {
    draw();
  }, [draw, width]);

  const handleClick = () => {
    setSelectedObjectIndex(index);
  };

  return (
    <button
      className={classNames(
        "flex w-full items-center gap-2 border-2 bg-grey-mid",
        selectedObjectIndex === index ? "border-white" : "border-transparent"
      )}
      onClick={handleClick}
    >
      <canvas className="aspect-square h-10 bg-white" ref={canvas}></canvas>

      <h4>{getName(obj)}</h4>
    </button>
  );
}
