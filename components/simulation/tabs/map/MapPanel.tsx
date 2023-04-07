"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { worldAtom } from "../../store";
import { useAtomValue } from "jotai";
import WorldObject from "@/simulation/world/WorldObject";
import WorldArea from "@/simulation/world/areas/WorldArea";
import { useWindowSize } from "react-use";

function getName(obj: Object) {
  return Object.getPrototypeOf(obj).constructor.name;
}

export default function LoadPanel() {
  const world = useAtomValue(worldAtom);
  const canvas = useRef<HTMLCanvasElement>(null);

  const { width } = useWindowSize();
  const [worldSize, setWorldSize] = useState(0);
  const [obstacles, setObstacles] = useState<WorldObject[]>([]);
  const [areas, setAreas] = useState<WorldArea[]>([]);

  const draw = useCallback(() => {
    if (canvas.current) {
      // Update size
      canvas.current.width = canvas.current.clientWidth;
      canvas.current.height = canvas.current.clientHeight;

      const context = canvas.current.getContext("2d")!;

      areas.forEach((area) => {
        area.draw(context, worldSize);
      });

      obstacles.forEach((obstacle) => {
        obstacle.draw(context, worldSize);
      });
    }
  }, [areas, obstacles, worldSize]);

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

      <div>
        <h3 className="mb-1 text-2xl font-bold">Obstacles</h3>
        {obstacles.map((obstacle, index) => {
          const { color } = obstacle;

          return (
            <div key={index}>
              {getName(obstacle)} {color}
            </div>
          );
        })}

        <h3 className="mb-1 text-2xl font-bold">Areas</h3>
        {areas.map((area, index) => {
          const { color } = area;

          return (
            <div key={index}>
              {getName(area)} {color}
            </div>
          );
        })}
      </div>
    </div>
  );
}
