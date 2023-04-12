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
  const normalizedHandles = [
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

  const [isClicking, setIsClicking] = useState(false);
  const [normalizedMouse, setNormalizedMouse] = useState({ x: 0, y: 0 });
  const [lastNormalizedMouse, setLastNormalizedMouse] = useState({
    x: 0,
    y: 0,
  });
  const [normalizedMouseSpeed, setNormalizedMouseSpeed] = useState({
    x: 0,
    y: 0,
  });

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

  // Capture mouse speed
  useEffect(() => {
    const newSpeed = {
      x: normalizedMouse.x - lastNormalizedMouse.x,
      y: normalizedMouse.y - lastNormalizedMouse.y,
    };
    setLastNormalizedMouse(normalizedMouse);
    setNormalizedMouseSpeed(newSpeed);
  }, [lastNormalizedMouse.x, lastNormalizedMouse.y, normalizedMouse]);

  // Move objecs
  useEffect(() => {
    if (isClicking && selectedObject) {
      if (
        normalizedMouse.x >= selectedObject.x &&
        normalizedMouse.x <= selectedObject.x + selectedObject.width &&
        normalizedMouse.y >= selectedObject.y &&
        normalizedMouse.y <= selectedObject.y + selectedObject.height &&
        (normalizedMouseSpeed.x || normalizedMouseSpeed.y)
      ) {
        selectedObject.x += normalizedMouseSpeed.x;
        selectedObject.y += normalizedMouseSpeed.y;
        setObjects(objects.map((obj) => obj.clone()));
      }
    }
  }, [
    isClicking,
    normalizedMouse.x,
    normalizedMouse.y,
    normalizedMouseSpeed.x,
    normalizedMouseSpeed.y,
    objects,
    selectedObject,
    setObjects,
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
