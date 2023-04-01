import { clamp, interpolate, lerp } from "@/simulation/helpers/helpers";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUpdate, useWindowSize } from "react-use";

type getterFunc = (point: any) => number;

interface Props {
  data: any[];
  getter: (point: any) => number;
  resolution?: number;
  margins?: { top: number; bottom: number; left: number; right: number };
  smooth?: boolean;
  smoothness?: number;
  updateKey?: any;
}

export default function LinearGraph({
  data,
  getter,
  resolution = 1,
  margins = { top: 20, bottom: 40, left: 20, right: 40 },
  smooth = true,
  smoothness = 10,
  updateKey,
}: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const update = useUpdate();

  const absoluteGraphWidth =
    (canvas.current ? canvas.current.width : 100) -
    margins.left -
    margins.right;
  const absoluteGraphHeight =
    (canvas.current ? canvas.current.height : 100) -
    margins.top -
    margins.bottom;

  // Zoom
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mouseNormalized, setMouseNormalized] = useState(0);
  const [zoomViewportLeft, setZoomViewportLeft] = useState(0);
  const [zoomViewportWidth, setZoomViewportWidth] = useState(1);

  // Panning
  const [mouseMovementX, setMouseMovementX] = useState(0);
  const [mouseLastX, setMouseLastX] = useState(0);

  const getInterpolatedPointAt = useCallback(
    (points: any[], index: number): [number, number] => {
      // Position can be greater than (points.length - 1) (because of float
      // precision) for a extremely tiny value, for example (0.000000000002)
      // so let's clamp the value
      index = clamp(index, 0, points.length - 1);

      // Get the point to the left and to the right on the
      // original array by rounding the variable above
      const leftIndex = Math.floor(index);
      const rightIndex = Math.ceil(index);

      // This value (between 0 and 1) is used to interpolate
      // the left and right points
      const atPoint = index - leftIndex;

      // Get left and right points
      const leftPoint = getter(points[leftIndex]);
      const rightPoint = getter(points[rightIndex]);

      // Interpolate the points
      const interpolatedIndex = lerp(leftIndex, rightIndex, atPoint);
      const interpolatedValue = lerp(leftPoint, rightPoint, atPoint);
      return [interpolatedIndex, interpolatedValue];
    },
    [getter]
  );

  const getFilteredData = useCallback(
    (
      points: number[]
    ): {
      points: number[];
      minX: number;
      maxX: number;
      minY: number;
      maxY: number;
    } => {
      // Calculate the new size of array
      const sampleSize = Math.floor(absoluteGraphWidth / resolution);
      const resizeFactor = (points.length - 1) / (sampleSize - 1);

      // Create new array
      const newPoints: number[] = [];

      // Calculations for zoom
      const oldViewportWidth = zoomViewportWidth;
      let newViewportWidth = 1 / zoomLevel;
      const oldMouse = mouseNormalized * oldViewportWidth;
      const newMouse = mouseNormalized * newViewportWidth;

      const oldViewportLeft = zoomViewportLeft;
      let newViewportLeft =
        oldViewportLeft +
        (oldViewportLeft + oldMouse - (oldViewportLeft + newMouse));

      // Add mouse movement
      newViewportLeft -= mouseMovementX * newViewportWidth;

      // Clamp values because of loss of precision on the results
      newViewportLeft = clamp(newViewportLeft, 0, 1 - newViewportWidth);

      // Set new values for viewport
      setZoomViewportLeft(newViewportLeft);
      setZoomViewportWidth(newViewportWidth);

      const offset = zoomViewportLeft * (points.length - 1);

      for (let index = 0; index < sampleSize; index++) {
        // This decimal value represents where this index
        // would lay on the original array
        let position = offset + index * resizeFactor * newViewportWidth;
        // let position =
        //   offset +
        //   ((index / (sampleSize - 1)) * (points.length - 1)) / this.zoomLevel;

        // Set the data
        newPoints[index] = getInterpolatedPointAt(points, position)[1];
      }

      // Record min and max values
      let minX = Number.MAX_VALUE;
      let maxX = Number.MIN_VALUE;
      let minY = Number.MAX_VALUE;
      let maxY = Number.MIN_VALUE;

      // Apply mean filter
      for (let index = 0; index < newPoints.length; index++) {
        let finalValue = newPoints[index];
        if (smooth) {
          // Apply median filter
          let count = 0;
          let valueSum = 0;
          for (
            let j = Math.max(0, index - smoothness);
            j < Math.min(newPoints.length - 1, index + smoothness);
            j++
          ) {
            valueSum += newPoints[j];
            count++;
          }

          finalValue = valueSum / count;

          // Set new value
          newPoints[index] = finalValue;
        }

        // Find min and max values
        if (index < minX) {
          minX = index;
        }
        if (index > maxX) {
          maxX = index;
        }
        if (finalValue < minY) {
          minY = finalValue;
        }
        if (finalValue > maxY) {
          maxY = finalValue;
        }
      }

      return { points: newPoints, minX, maxX, minY, maxY };
    },
    [
      absoluteGraphWidth,
      resolution,
      zoomViewportWidth,
      zoomLevel,
      mouseNormalized,
      zoomViewportLeft,
      mouseMovementX,
      getInterpolatedPointAt,
      smooth,
      smoothness,
    ]
  );

  const drawGraph = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (!canvas) return;
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;

      // Draw X axis
      context.strokeStyle = "red";
      context.beginPath();
      const y = height - margins.bottom;
      context.moveTo(margins.left, y);
      context.lineTo(width - margins.right, y);
      context.stroke();

      // Draw Y axis
      context.strokeStyle = "green";
      context.beginPath();
      const x = width - margins.right;
      context.moveTo(x, margins.top);
      context.lineTo(x, height - margins.bottom);
      context.stroke();

      if (data.length > 1) {
        const textSize = 12;
        context.lineWidth = 2;
        context.strokeStyle = "blue";
        // Get the points to render
        const { points, minX, maxX, minY, maxY } = getFilteredData(data);

        // Function to get coordinates of point
        const dataToCanvasPoint = (index: number, value: number): number[] => {
          const x = interpolate(
            index,
            minX,
            maxX,
            margins.left,
            width - margins.right
          );

          const y = interpolate(
            value,
            minY,
            maxY,
            height - margins.bottom,
            margins.top
          );

          return [x, y];
        };

        // Begin path
        context.beginPath();

        // Start path at the first point
        let point = dataToCanvasPoint(0, points[0]);
        context.moveTo(point[0], point[1]);

        for (let pointIndex = 1; pointIndex < points.length; pointIndex++) {
          // Draw line to the next point
          point = dataToCanvasPoint(pointIndex, points[pointIndex]);
          context.lineTo(point[0], point[1]);
        }

        // Draw the path
        context.stroke();
      }

      // Draw zoom viewport
      // const left =
      //   margins.left + this.zoomViewportLeft * this.absoluteGraphWidth;
      // const right = left + this.zoomViewportWidth * this.absoluteGraphWidth;
      // context.beginPath();
      // context.moveTo(left, 0);
      // context.lineTo(left, height);
      // context.stroke();
      // context.beginPath();
      // context.moveTo(right, 0);
      // context.lineTo(right, height);
      // context.stroke();
    },
    [
      data,
      getFilteredData,
      margins.bottom,
      margins.left,
      margins.right,
      margins.top,
    ]
  );

  const { width } = useWindowSize();

  useEffect(() => {
    if (canvas.current) drawGraph(canvas.current);
  }, [drawGraph, width, updateKey]);

  return (
    <canvas ref={canvas} className="aspect-square w-full bg-white"></canvas>
  );
}
