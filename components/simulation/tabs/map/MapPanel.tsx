"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { worldAtom } from "../../store";
import { useAtom, useAtomValue } from "jotai";
import WorldObject from "@/simulation/world/WorldObject";
import { useWindowSize } from "react-use";
import MapLayer from "./MapLayer";
import {
  painterObjectsAtom,
  painterWorldSizeAtom,
  painterSelectedObjectIndexAtom,
} from "../../store/mapPainterAtoms";
import MapObjectProperties from "./MapObjectProperties";
import MapPainterHeader from "./MapPainterHeader";

type Coordinates = {
  x: number;
  y: number;
};

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

  // Handles
  const normalizedHandles: Coordinates[] = [
    { x: obj.x, y: obj.y },
    { x: obj.x + obj.width, y: obj.y },
    { x: obj.x, y: obj.y + obj.height },
    { x: obj.x + obj.width, y: obj.y + obj.height },
  ];
  normalizedHandles.forEach((handle) => {
    context.fillStyle = "white";
    context.beginPath();
    context.rect(
      context.canvas.width * handle.x - 5,
      context.canvas.height * handle.y - 5,
      10,
      10
    );
    context.stroke();
    context.fill();
  });
}

export default function LoadPanel() {
  const world = useAtomValue(worldAtom);
  const canvas = useRef<HTMLCanvasElement>(null);

  const { width } = useWindowSize();
  const [worldSize, setWorldSize] = useAtom(painterWorldSizeAtom);
  const [objects, setObjects] = useAtom(painterObjectsAtom);
  const selectedObjectIndex = useAtomValue(painterSelectedObjectIndexAtom);
  const selectedObject =
    selectedObjectIndex != undefined ? objects[selectedObjectIndex] : undefined;

  // Mouse interaction
  const [isClicking, setIsClicking] = useState(false);
  const [normalizedMouse, setNormalizedMouse] = useState<Coordinates>({
    x: 0,
    y: 0,
  });

  // Mouse dragging
  const [isDragging, setIsDragging] = useState(false);
  const [startDragMousePos, setStartDragMousePos] = useState<
    Coordinates | undefined
  >(undefined);
  const [startDragTargetPos, setStartDragTargetPos] = useState<
    Coordinates | undefined
  >(undefined);

  // Draw the objects, outlines and handles
  const draw = useCallback(() => {
    if (canvas.current) {
      // Update size
      canvas.current.width = canvas.current.clientWidth;
      canvas.current.height = canvas.current.clientHeight;

      // Get the canvas' context
      const context = canvas.current.getContext("2d")!;

      // Draw every object
      objects.forEach((obj) => {
        obj.computePixels(worldSize);
        obj.draw(context, worldSize);
      });

      // Draw outlines
      objects.forEach((obj, index) => {
        if (index === selectedObjectIndex) drawOutline(context, obj);
      });
    }
  }, [objects, selectedObjectIndex, worldSize]);

  const onPointerMove = useCallback((e: MouseEvent) => {
    e.preventDefault();

    if (canvas.current) {
      const canvasRect = canvas.current.getBoundingClientRect();

      // Calculate the normalized mouse position relative to the canvas
      const x = (e.clientX - canvasRect.left) / canvasRect.width;
      const y = (e.clientY - canvasRect.top) / canvasRect.height;
      setNormalizedMouse({ x, y });
    }
  }, []);

  const onPointerDown = useCallback((e: MouseEvent) => {
    e.preventDefault();

    setIsClicking(true);
  }, []);

  const onPointerUp = useCallback((e: MouseEvent) => {
    e.preventDefault();

    setIsClicking(false);
  }, []);

  // Bind canvas events
  useEffect(() => {
    const _canvas = canvas.current;
    if (_canvas) {
      _canvas.addEventListener("pointermove", onPointerMove);
      // _canvas.addEventListener("pointerleave", onPointerUp);
      _canvas.addEventListener("pointerdown", onPointerDown);
      _canvas.addEventListener("pointerup", onPointerUp);

      return () => {
        _canvas.removeEventListener("pointermove", onPointerMove);
        // _canvas.addEventListener("pointerleave", onPointerUp);
        _canvas.removeEventListener("pointerdown", onPointerDown);
        _canvas.removeEventListener("pointerup", onPointerUp);
      };
    }
  }, [onPointerMove, onPointerDown, onPointerUp]);

  // Move objecs
  useEffect(() => {
    if (isClicking && selectedObject) {
      // Start dragging an object
      if (
        normalizedMouse.x >= selectedObject.x &&
        normalizedMouse.x <= selectedObject.x + selectedObject.width &&
        normalizedMouse.y >= selectedObject.y &&
        normalizedMouse.y <= selectedObject.y + selectedObject.height
      ) {
        setIsDragging(true);
      }

      if (isDragging) {
        if (!startDragMousePos || !startDragTargetPos) {
          // Save the start position
          setStartDragMousePos({ x: normalizedMouse.x, y: normalizedMouse.y });
          setStartDragTargetPos({ x: selectedObject.x, y: selectedObject.y });
        } else {
          // Calculate new position
          let newX =
            startDragTargetPos.x + (normalizedMouse.x - startDragMousePos.x);
          let newY =
            startDragTargetPos.y + (normalizedMouse.y - startDragMousePos.y);
          // Round the new position
          newX = Math.round(newX * worldSize) / worldSize;
          newY = Math.round(newY * worldSize) / worldSize;

          if (selectedObject.x !== newX || selectedObject.y !== newY) {
            // Only apply it if there were any change
            selectedObject.x = newX;
            selectedObject.y = newY;
            setObjects(objects.map((obj) => obj.clone()));
          }
        }
      }
    } else {
      setIsDragging(false);
      setStartDragMousePos(undefined);
      setStartDragTargetPos(undefined);
    }
  }, [
    isClicking,
    isDragging,
    normalizedMouse.x,
    normalizedMouse.y,
    objects,
    selectedObject,
    setObjects,
    startDragMousePos,
    startDragTargetPos,
    worldSize,
  ]);

  // Draw the map
  useEffect(() => {
    draw();
  }, [draw, world, width]);

  // Initialize this component with values from the world
  useEffect(() => {
    if (world) {
      setWorldSize(world.size);
      setObjects(world.objects.map((obj) => obj.clone()));
    }
  }, [setObjects, setWorldSize, world]);

  return (
    <div className="flex flex-col gap-5">
      <MapPainterHeader />

      <div className="grid lg:grid-cols-3">
        <canvas
          className="aspect-square w-full bg-white lg:col-span-2"
          ref={canvas}
        ></canvas>

        <div className="w-full overflow-x-hidden overflow-y-scroll px-5 lg:aspect-[1/2]">
          <h3 className="mb-1 text-2xl font-bold">Objects</h3>
          <div className="flex flex-col gap-1">
            {objects.map((obstacle, index) => (
              <MapLayer key={index} index={index} obj={obstacle} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div></div>
        <div>
          <MapObjectProperties />
        </div>
      </div>
    </div>
  );
}
