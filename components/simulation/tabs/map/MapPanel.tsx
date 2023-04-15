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

const HANDLE_SIZE = 10;

function roundCoordinates(coordinates: Coordinates, worldSize: number) {
  return {
    x: Math.round(coordinates.x * worldSize) / worldSize,
    y: Math.round(coordinates.y * worldSize) / worldSize,
  };
}

function getHandles(obj: WorldObject): Coordinates[] {
  const normalizedHandles = [
    { x: obj.x, y: obj.y },
    { x: obj.x + obj.width, y: obj.y },
    { x: obj.x + obj.width, y: obj.y + obj.height },
    { x: obj.x, y: obj.y + obj.height },
  ];
  return normalizedHandles;
}

function areCoordinatesInsideObject(
  coordinates: Coordinates,
  obj: WorldObject
) {
  return (
    coordinates.x >= obj.x &&
    coordinates.x <= obj.x + obj.width &&
    coordinates.y >= obj.y &&
    coordinates.y <= obj.y + obj.height
  );
}

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
  const normalizedHandles = getHandles(obj);
  normalizedHandles.forEach((handle) => {
    context.fillStyle = "white";
    context.beginPath();
    context.rect(
      context.canvas.width * handle.x - HANDLE_SIZE / 2,
      context.canvas.height * handle.y - HANDLE_SIZE / 2,
      HANDLE_SIZE,
      HANDLE_SIZE
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
  const [selectedObjectIndex, setSelectedObjectIndex] = useAtom(
    painterSelectedObjectIndexAtom
  );
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
  const [draggedHandle, setDraggedHandle] = useState<number | undefined>(
    undefined
  );

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

  const updateObjects = useCallback(() => {
    setObjects((value) => value.map((obj) => obj.clone()));
  }, [setObjects]);

  // Move objecs
  useEffect(() => {
    if (!canvas.current) return;

    let startedDragging = false;

    if (isClicking && selectedObject) {
      if (isDragging) {
        if (!startDragMousePos || !startDragTargetPos) {
          // Save the start position of the mouse and the object
          setStartDragMousePos({ x: normalizedMouse.x, y: normalizedMouse.y });
          setStartDragTargetPos({ x: selectedObject.x, y: selectedObject.y });
        } else {
          if (draggedHandle != undefined) {
            const mousePosition = roundCoordinates(normalizedMouse, worldSize);
            const normalizedHandles = getHandles(selectedObject);

            let anchor1 = { x: 0, y: 0 };
            let anchor2 = { x: 0, y: 0 };

            if (draggedHandle === 0) {
              anchor1 = { x: mousePosition.x, y: mousePosition.y };
              anchor2 = {
                x: normalizedHandles[2].x,
                y: normalizedHandles[2].y,
              };
            } else if (draggedHandle === 1) {
              anchor1 = { x: normalizedHandles[0].x, y: mousePosition.y };
              anchor2 = { x: mousePosition.x, y: normalizedHandles[2].y };
            } else if (draggedHandle === 2) {
              anchor1 = {
                x: normalizedHandles[0].x,
                y: normalizedHandles[0].y,
              };
              anchor2 = { x: mousePosition.x, y: mousePosition.y };
            } else if (draggedHandle === 3) {
              anchor1 = { x: mousePosition.x, y: normalizedHandles[0].y };
              anchor2 = { x: normalizedHandles[2].x, y: mousePosition.y };
            }

            const newPosition = { x: anchor1.x, y: anchor1.y };
            const newSize = {
              x: anchor2.x - anchor1.x,
              y: anchor2.y - anchor1.y,
            };

            if (
              selectedObject.x !== newPosition.x ||
              selectedObject.y !== newPosition.y ||
              selectedObject.width !== newSize.x ||
              selectedObject.height !== newSize.y
            ) {
              selectedObject.x = newPosition.x;
              selectedObject.y = newPosition.y;
              selectedObject.width = newSize.x;
              selectedObject.height = newSize.y;
              updateObjects();
            }
          } else {
            const mousePosition = roundCoordinates(
              {
                x:
                  startDragTargetPos.x +
                  (normalizedMouse.x - startDragMousePos.x),
                y:
                  startDragTargetPos.y +
                  (normalizedMouse.y - startDragMousePos.y),
              },
              worldSize
            );

            if (
              selectedObject.x !== mousePosition.x ||
              selectedObject.y !== mousePosition.y
            ) {
              // Only apply it if there were any change
              selectedObject.x = mousePosition.x;
              selectedObject.y = mousePosition.y;
              updateObjects();
            }
          }
        }
      } else {
        // Check if mouse is inside a handle
        let targetHandle: undefined | number = undefined;
        const normalizedHandles = getHandles(selectedObject);
        const handleNormalizedSize = HANDLE_SIZE / canvas.current.width;
        for (let index = 0; index < normalizedHandles.length; index++) {
          const handle = normalizedHandles[index];
          const xDistance = Math.abs(normalizedMouse.x - handle.x);
          const yDistance = Math.abs(normalizedMouse.y - handle.y);

          if (
            xDistance < handleNormalizedSize &&
            yDistance < handleNormalizedSize
          ) {
            targetHandle = index;
            break;
          }
        }

        if (targetHandle != undefined) {
          setDraggedHandle(targetHandle);
          setIsDragging(true);
          startedDragging = true;
        } else if (
          areCoordinatesInsideObject(normalizedMouse, selectedObject)
        ) {
          // Start dragging an object
          setIsDragging(true);
          startedDragging = true;
        }
      }
    } else {
      setIsDragging(false);
      setStartDragMousePos(undefined);
      setStartDragTargetPos(undefined);
      setDraggedHandle(undefined);
    }

    if (isClicking && !isDragging && !startedDragging) {
      const reversedObjects = [...objects].reverse();
      for (let index = 0; index < reversedObjects.length; index++) {
        const obj = reversedObjects[index];

        if (
          obj !== selectedObject &&
          areCoordinatesInsideObject(normalizedMouse, obj)
        ) {
          setSelectedObjectIndex(objects.indexOf(obj));
          break;
        }
      }
    }
  }, [
    draggedHandle,
    isClicking,
    isDragging,
    normalizedMouse,
    normalizedMouse.x,
    normalizedMouse.y,
    objects,
    selectedObject,
    setObjects,
    setSelectedObjectIndex,
    startDragMousePos,
    startDragTargetPos,
    updateObjects,
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
