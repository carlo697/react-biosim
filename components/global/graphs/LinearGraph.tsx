import { clamp, interpolate, lerp } from "@/simulation/helpers/helpers";
import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowSize } from "react-use";

interface Props {
  data: any[];
  getter: (point: any) => number;
  resolution?: number;
  margins?: { top: number; bottom: number; left: number; right: number };
  preSmooth?: boolean;
  preSmoothSamples?: number;
  preSmoothRadius?: number;
  postSmooth?: boolean;
  postSmoothness?: number;
  updateKey?: any;
}

export default function LinearGraph({
  data,
  getter,
  resolution = 1,
  margins = { top: 20, bottom: 40, left: 20, right: 40 },
  preSmooth = true,
  preSmoothSamples = 10,
  preSmoothRadius = 1,
  postSmooth = false,
  postSmoothness = 1,
  updateKey,
}: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);

  const canvasWidth = canvas.current ? canvas.current.width : 100;
  const canvasHeight = canvas.current ? canvas.current.height : 100;

  const absoluteGraphWidth = canvasWidth - margins.left - margins.right;
  const absoluteGraphHeight = canvasHeight - margins.top - margins.bottom;

  // Mouse
  const [isMouseInsideGraph, setIsMouseInsideGraph] = useState(false);
  const [isMouseInsideCanvas, setIsMouseInsideCanvas] = useState(false);
  const [relativeMouseX, setRelativeMouseX] = useState(0);
  const [relativeMouseY, setRelativeMouseY] = useState(0);
  const [mouseNormalized, setMouseNormalized] = useState(0);

  // Zoom
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomViewportLeft, setZoomViewportLeft] = useState(0);
  const [zoomViewportWidth, setZoomViewportWidth] = useState(1);

  // Panning
  const [mouseMovementX, setMouseMovementX] = useState(0);
  const [mouseLastX, setMouseLastX] = useState(0);

  // Calculations for zoom
  useEffect(() => {
    const oldViewportWidth = zoomViewportWidth;
    let newViewportWidth = 1 / zoomLevel;
    const oldMouse = mouseNormalized * oldViewportWidth;
    const newMouse = mouseNormalized * newViewportWidth;

    const oldViewportLeft = zoomViewportLeft;
    let newViewportLeft =
      oldViewportLeft +
      (oldViewportLeft + oldMouse - (oldViewportLeft + newMouse));

    // Add mouse movement
    newViewportLeft -= (mouseMovementX / absoluteGraphWidth) * newViewportWidth;
    setMouseMovementX(0);

    // Clamp values because of loss of precision on the results
    newViewportLeft = clamp(newViewportLeft, 0, 1 - newViewportWidth);

    // Set new values for viewport
    setZoomViewportLeft(newViewportLeft);
    setZoomViewportWidth(newViewportWidth);
  }, [
    absoluteGraphWidth,
    mouseMovementX,
    mouseNormalized,
    zoomLevel,
    zoomViewportLeft,
    zoomViewportWidth,
  ]);

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
      const sampledPoints: number[] = [];
      const offset = zoomViewportLeft * (points.length - 1);

      // Sample the points for the new filtered data
      for (let sampleIndex = 0; sampleIndex < sampleSize; sampleIndex++) {
        let finalValue = 0;

        if (preSmooth) {
          // Apply median filter
          const count = preSmoothSamples * 2 + 1;
          const leftIndex =
            offset + (sampleIndex - 1) * resizeFactor * zoomViewportWidth;
          const rightIndex =
            offset + (sampleIndex + 1) * resizeFactor * zoomViewportWidth;
          const minInterpolant = 0.5 - preSmoothRadius / 2;
          const maxInterpolant = 0.5 + preSmoothRadius / 2;

          let sum = 0;
          for (let j = -preSmoothSamples; j <= preSmoothSamples; j++) {
            const interpolant = interpolate(
              j,
              -preSmoothSamples,
              preSmoothSamples,
              minInterpolant,
              maxInterpolant
            );
            const medianIndex = lerp(leftIndex, rightIndex, interpolant);
            sum += getInterpolatedPointAt(points, medianIndex)[1];
          }

          finalValue = sum / count;
        } else {
          // This decimal value represents where this index
          // would lay on the original array
          const originalIndex =
            offset + sampleIndex * resizeFactor * zoomViewportWidth;

          // Set the data
          finalValue = getInterpolatedPointAt(points, originalIndex)[1];
        }

        // Set new value
        sampledPoints[sampleIndex] = finalValue;
      }

      const finalPoints: number[] = [];

      // Record min and max values
      let minX = Number.MAX_VALUE;
      let maxX = Number.MIN_VALUE;
      let minY = Number.MAX_VALUE;
      let maxY = Number.MIN_VALUE;

      // Apply mean filter
      for (let index = 0; index < sampledPoints.length; index++) {
        let finalValue = 0;

        if (postSmooth) {
          // Apply median filter
          let count = 0;
          let sum = 0;
          for (
            let j = Math.max(0, index - postSmoothness);
            j < Math.min(sampledPoints.length - 1, index + postSmoothness);
            j++
          ) {
            sum += sampledPoints[j];
            count++;
          }

          finalValue = sum / count;
        } else {
          finalValue = sampledPoints[index];
        }

        // Set new value
        finalPoints[index] = finalValue;

        // Find min and max X values
        if (index < minX) {
          minX = index;
        } else if (index > maxX) {
          maxX = index;
        }

        // Find min and max Y values
        if (finalValue < minY) {
          minY = finalValue;
        } else if (finalValue > maxY) {
          maxY = finalValue;
        }
      }

      return { points: finalPoints, minX, maxX, minY, maxY };
    },
    [
      absoluteGraphWidth,
      resolution,
      zoomViewportLeft,
      preSmooth,
      zoomViewportWidth,
      preSmoothRadius,
      preSmoothSamples,
      getInterpolatedPointAt,
      postSmooth,
      postSmoothness,
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

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (isMouseInsideGraph) {
        // Calculate normalized position
        setMouseNormalized(
          interpolate(
            relativeMouseX,
            margins.left,
            canvasWidth - margins.right,
            0,
            1
          )
        );

        // Calculate new zoom
        let newZoom = zoomLevel;
        if (e.deltaY > 0) {
          newZoom /= 1.1;
        } else {
          newZoom *= 1.02;
        }
        newZoom = clamp(newZoom, 1, 1000);
        setZoomLevel(newZoom);

        e.preventDefault();
      }
    },
    [
      canvasWidth,
      isMouseInsideGraph,
      margins.left,
      margins.right,
      relativeMouseX,
      zoomLevel,
    ]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (canvas.current) {
        const canvasRect = canvas.current.getBoundingClientRect();

        // Calculate the mouse position relative to the canvas
        const newRelativeMouseX = e.clientX - canvasRect.left;
        const newRelativeMouseY = e.clientY - canvasRect.top;

        // Check if the mouse is inside the graph
        const newIsMouseInsideGraph =
          newRelativeMouseX >= margins.left &&
          newRelativeMouseX <= canvas.current.width - margins.right &&
          newRelativeMouseY >= margins.top &&
          newRelativeMouseY <= canvas.current.height - margins.bottom;

        // Calculate the horizontal speed of the mouse when the user is clicking
        if (e.buttons === 1 && newIsMouseInsideGraph) {
          if (mouseLastX) {
            setMouseMovementX(e.clientX - mouseLastX);
          }
          setMouseLastX(e.clientX);
        } else {
          setMouseMovementX(0);
          setMouseLastX(0);
        }

        setRelativeMouseX(newRelativeMouseX);
        setRelativeMouseY(newRelativeMouseY);
        setIsMouseInsideGraph(newIsMouseInsideGraph);
        setIsMouseInsideCanvas(true);
      }
    },
    [margins.bottom, margins.left, margins.right, margins.top, mouseLastX]
  );

  const handleMouseLeave = () => {
    setIsMouseInsideGraph(false);
    setIsMouseInsideCanvas(false);
    setMouseMovementX(0);
    setMouseLastX(0);
  };

  // Bind mouse events to the canvas
  useEffect(() => {
    if (canvas.current) {
      const actualCanvas = canvas.current;

      actualCanvas.addEventListener("wheel", handleWheel);
      actualCanvas.addEventListener("mousemove", handleMouseMove);
      actualCanvas.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        actualCanvas.removeEventListener("wheel", handleWheel);
        actualCanvas.removeEventListener("mousemove", handleMouseMove);
        actualCanvas.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [handleMouseMove, handleWheel]);

  // Update the graph when the window resizes
  const { width } = useWindowSize();
  useEffect(() => {
    if (canvas.current) drawGraph(canvas.current);
  }, [drawGraph, width, updateKey]);

  return (
    <canvas ref={canvas} className="aspect-square w-full bg-white"></canvas>
  );
}
