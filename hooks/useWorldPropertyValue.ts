"use client";

import { worldAtom } from "@/components/simulation/store";
import World from "@/simulation/world/World";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { useInterval } from "react-use";

export default function useWorldPropertyValue<T>(
  getter: (world: World) => T,
  defaultValue: T
) {
  const world = useAtomValue(worldAtom);
  const [value, setValue] = useState(() =>
    world ? getter(world) : defaultValue
  );

  useInterval(() => {
    if (world) setValue(getter(world));
  }, 20);

  return value;
}
