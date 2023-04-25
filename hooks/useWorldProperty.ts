import { useCallback, useState } from "react";
import { worldAtom } from "@/components/simulation/store";
import World from "@/simulation/world/World";
import { useAtomValue } from "jotai";
import { useInterval } from "react-use";

export default function useWorldProperty<T>(
  getter: (world: World) => T,
  setter: (world: World, value: T) => void,
  defaultValue: T,
  compare?: (a: T, b: T) => boolean
): [T, (value: T) => void] {
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

  const set = useCallback(
    (value: T) => {
      if (world) {
        setter(world, value);
        setValue(value);
      }
    },
    [setter, world]
  );

  return [value, set];
}
