"use client";

import { useCallback, useEffect, useState } from "react";
import { worldAtom } from "../../store";
import { useAtomValue } from "jotai";
import { WorldEvents } from "@/simulation/events/WorldEvents";
import { SingleGeneration } from "@/simulation/world/stats/GenerationRegistry";
import LinearGraph from "@/components/global/graphs/LinearGraph";
import useWorldPropertyValue from "@/hooks/useWorldPropertyValue";

function getter(data: SingleGeneration) {
  return data.survivorCount;
}

export default function StatsPanel() {
  const world = useAtomValue(worldAtom);
  const [data, setData] = useState<SingleGeneration[]>([]);
  const [updates, setUpdates] = useState(0);

  const initialPopulation = useWorldPropertyValue(
    (world) => world.initialPopulation,
    0
  );

  const survivorCountFormatter = useCallback((value: number) => {
    return ((value / initialPopulation) * 100).toFixed(1).toString() + "%";
  }, [initialPopulation]);

  const generationFormatter = useCallback((value: number) => {
    return "Generation #" + Math.round(value).toString();
  }, []);

  const onStartGeneration = useCallback(() => {
    setUpdates((value) => value + 1);
  }, []);

  // Bind world events
  useEffect(() => {
    if (world) {
      setData(world.generationRegistry.generations);

      world.events.addEventListener(
        WorldEvents.startGeneration,
        onStartGeneration
      );

      return () => {
        world.events.removeEventListener(
          WorldEvents.startGeneration,
          onStartGeneration
        );
      };
    }
  }, [onStartGeneration, world]);

  return (
    <div>
      <LinearGraph
        data={data}
        getter={getter}
        updateKey={updates}
        preSmooth={true}
        preSmoothSamples={10}
        preSmoothRadius={1}
        postSmooth={true}
        postSmoothness={2}
        xLabelFormatter={generationFormatter}
        yLabelFormatter={survivorCountFormatter}
      />
    </div>
  );
}
