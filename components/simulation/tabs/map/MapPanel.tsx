"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { worldAtom } from "../../store";
import { useAtom, useAtomValue } from "jotai";
import WorldObject from "@/simulation/world/WorldObject";
import WorldArea from "@/simulation/world/areas/WorldArea";
import { useWindowSize } from "react-use";
import MapLayer from "./MapLayer";
import { selectedMapObjectAtom } from "../../store/mapDrawingAtoms";

function drawOutline(context: CanvasRenderingContext2D, obj: WorldObject) {
  context.strokeStyle = "black";
  context.lineWidth = 3;
  context.beginPath();
  context.rect(
    context.canvas.width * obj.x,
    context.canvas.height * obj.y,
    context.canvas.width * obj.width,
    context.canvas.height * obj.height
  );
  context.stroke();
}

export default function LoadPanel() {
  const world = useAtomValue(worldAtom);
  const canvas = useRef<HTMLCanvasElement>(null);

  const { width } = useWindowSize();
  const [worldSize, setWorldSize] = useState(0);
  const [obstacles, setObstacles] = useState<WorldObject[]>([]);
  const [areas, setAreas] = useState<WorldArea[]>([]);

  const [selectedMapObject, setSelectedMapObject] = useAtom(
    selectedMapObjectAtom
  );

  const draw = useCallback(() => {
    if (canvas.current) {
      // Update size
      canvas.current.width = canvas.current.clientWidth;
      canvas.current.height = canvas.current.clientHeight;

      // Get the canvas' context
      const context = canvas.current.getContext("2d")!;

      // Draw every object
      const allObjs = [...areas, ...obstacles];
      allObjs.forEach((obj) => {
        obj.draw(context, worldSize);
      });

      // Draw outlines
      allObjs.forEach((obj) => {
        if (selectedMapObject === obj) drawOutline(context, obj);
      });
    }
  }, [areas, obstacles, selectedMapObject, worldSize]);

  // Draw the map
  useEffect(() => {
    draw();
  }, [draw, world, width]);

  // Initialize this component with values from the world
  useEffect(() => {
    if (world) {
      setWorldSize(world.size);
      setObstacles(world.obstacles);
      setAreas(world.areas);
    }
  }, [world]);

  return (
    <div className="grid grid-cols-3">
      <canvas
        className="col-span-2 aspect-square w-full bg-white"
        ref={canvas}
      ></canvas>

      <div className="px-5 w-full aspect-[1/2] overflow-y-scroll overflow-x-hidden">
        <h3 className="mb-1 text-2xl font-bold">Obstacles</h3>
        <div className="flex flex-col gap-1">
          {obstacles.map((obstacle, index) => (
            <MapLayer key={index} obj={obstacle} worldSize={worldSize} />
          ))}
        </div>

        <h3 className="mb-1 text-2xl font-bold">Areas</h3>
        <div className="flex flex-col gap-1">
          {areas.map((area, index) => (
            <MapLayer key={index} obj={area} worldSize={worldSize} />
          ))}
        </div>
      </div>
    </div>
  );
}
