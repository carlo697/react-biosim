"use client";

import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
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
import MapPainterHeader from "./MapPainterHeader";
import MapPainterFooter from "./MapPainterFooter";

type Coordinates = {
  x: number;
  y: number;
};

const HANDLE_SIZE = 10;

function getEventRelativeMousePosition(
  element: HTMLElement,
  e: MouseEvent,
  normalized?: boolean
) {
  const canvasRect = element.getBoundingClientRect();

  // Calculate the normalized mouse position relative to the element
  let x = e.clientX - canvasRect.left;
  let y = e.clientY - canvasRect.top;
  if (normalized) {
    x /= canvasRect.width;
    y /= canvasRect.height;
  }

  return { x, y } as Coordinates;
}

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
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mousePositionWhenClicked, setNormalizedMouseWhenClicked] =
    useState<Coordinates>({
      x: 0,
      y: 0,
    });
  const [normalizedMousePosition, setNormalizedMousePosition] =
    useState<Coordinates>({
      x: 0,
      y: 0,
    });
  const [isClicking, setIsClicking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Mouse dragging
  const [isDraggingObject, setIsDraggingObject] = useState(false);
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

  const onPointerMove = (e: MouseEvent) => {
    if (!canvas.current) return;
    e.preventDefault();

    if (canvas.current) {
      // Get the normalized position
      const normalizedPosition = getEventRelativeMousePosition(
        canvas.current,
        e,
        true
      );
      setNormalizedMousePosition(normalizedPosition);

      if (isMouseDown) {
        // Get position in pixels
        const position = getEventRelativeMousePosition(
          canvas.current,
          e,
          false
        );

        // Measure the distance to the fist click
        const distanceFromFirstClick = Math.sqrt(
          Math.pow(position.x - mousePositionWhenClicked.x, 2) +
            Math.pow(position.y - mousePositionWhenClicked.y, 2)
        );

        if (distanceFromFirstClick > 6) {
          setIsDragging(true);
        }
      }
    }
  };

  const onPointerDown = (e: MouseEvent) => {
    if (!canvas.current) return;
    e.preventDefault();

    setIsMouseDown(true);
    const mousePosition = getEventRelativeMousePosition(canvas.current, e);
    setNormalizedMouseWhenClicked(mousePosition);
  };

  const onPointerUp = (e: MouseEvent) => {
    if (!canvas.current) return;
    e.preventDefault();

    if (!isDragging) {
      setIsClicking(true);
    }

    setIsMouseDown(false);
    setIsDragging(false);
  };

  useEffect(() => {
    setIsClicking(false);
  }, [isClicking]);

  const updateObjects = useCallback(() => {
    setObjects((value) => value.map((obj) => obj.clone()));
  }, [setObjects]);

  // Move objecs
  useEffect(() => {
    if (!canvas.current) return;

    let startedDragging = false;

    if (isDragging && selectedObject) {
      if (isDraggingObject) {
        if (!startDragMousePos || !startDragTargetPos) {
          // Save the start position of the mouse and the object
          setStartDragMousePos({
            x: normalizedMousePosition.x,
            y: normalizedMousePosition.y,
          });
          setStartDragTargetPos({ x: selectedObject.x, y: selectedObject.y });
        } else {
          if (draggedHandle != undefined) {
            const mousePosition = roundCoordinates(
              normalizedMousePosition,
              worldSize
            );
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
                  (normalizedMousePosition.x - startDragMousePos.x),
                y:
                  startDragTargetPos.y +
                  (normalizedMousePosition.y - startDragMousePos.y),
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
          const xDistance = Math.abs(normalizedMousePosition.x - handle.x);
          const yDistance = Math.abs(normalizedMousePosition.y - handle.y);

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
          setIsDraggingObject(true);
          startedDragging = true;
        } else if (
          areCoordinatesInsideObject(normalizedMousePosition, selectedObject)
        ) {
          // Start dragging an object
          setIsDraggingObject(true);
          startedDragging = true;
        }
      }
    } else {
      setIsDraggingObject(false);
      setStartDragMousePos(undefined);
      setStartDragTargetPos(undefined);
      setDraggedHandle(undefined);
    }

    if (isClicking && !isDraggingObject && !startedDragging) {
      const reversedObjects = [...objects].reverse();
      for (let index = 0; index < reversedObjects.length; index++) {
        const obj = reversedObjects[index];

        if (
          obj !== selectedObject &&
          areCoordinatesInsideObject(normalizedMousePosition, obj)
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
    isDraggingObject,
    normalizedMousePosition,
    objects,
    selectedObject,
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
          onPointerMove={onPointerMove}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
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

      <MapPainterFooter />
    </div>
  );
}
