"use client";

import { worldAtom } from "@/components/simulation/store";
import World from "@/simulation/world/World";
import { PrimitiveAtom, useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import useWorldPropertyValue from "./useWorldPropertyValue";

export default function useSyncAtomWithWorldProperty<T>(
  atom: PrimitiveAtom<T>,
  getter: (world: World) => T,
  compare?: (a: T, b: T) => boolean
) {
  const world = useAtomValue(worldAtom);
  const [atomValue, setAtomValue] = useAtom(atom);
  const value = useWorldPropertyValue(getter, atomValue, compare);

  useEffect(() => {
    if (world) setAtomValue(value);
  }, [world, value, setAtomValue]);
}
