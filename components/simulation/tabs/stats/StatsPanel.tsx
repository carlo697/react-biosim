"use client";

import { useCallback, useEffect, useState } from "react";
import { worldAtom } from "../../store";
import { useAtomValue } from "jotai";
import { WorldEvents } from "@/simulation/events/WorldEvents";
import { SingleGeneration } from "@/simulation/world/stats/GenerationRegistry";
import { useUpdate } from "react-use";
import LinearGraph from "@/components/global/graphs/LinearGraph";

function getter(data: SingleGeneration) {
  return data.survivorCount;
}

export default function StatsPanel() {
  const world = useAtomValue(worldAtom);
  const [data, setData] = useState<SingleGeneration[]>([]);
  const [updates, setUpdates] = useState(0);

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
      <LinearGraph data={data} getter={getter} updateKey={updates} />
    </div>
  );
}
