import { worldAtom } from "@/components/simulation/store";
import World from "@/simulation/world/World";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { useInterval } from "react-use";

export default function useWorldPropertyValue<T>(
  getter: (world: World) => T,
  defaultValue: T,
  compare?: (a: T, b: T) => boolean
) {
  const world = useAtomValue(worldAtom);
  const [value, setValue] = useState(() =>
    world ? getter(world) : defaultValue
  );

  useInterval(() => {
    if (world) {
      const newValue = getter(world);
      if (compare) {
        if (!compare(value, newValue)) {
          setValue(newValue);
        }
      } else {
        setValue(newValue);
      }
    }
  }, 20);

  return value;
}
