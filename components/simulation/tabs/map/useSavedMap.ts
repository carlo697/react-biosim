import { deserializeObjects } from "@/simulation/serialization/loadWorld";
import { serializeObjects } from "@/simulation/serialization/saveWorld";
import WorldObject from "@/simulation/world/WorldObject";
import { useLocalStorage } from "react-use";

export default function useSavedMap() {
  const [savedWorldSize = 100, setSavedWorldSize] = useLocalStorage<number>(
    "mapDesignerWorldSize",
    100,
    {
      raw: false,
      serializer: (value) => value.toString(),
      deserializer: (value) => parseInt(value),
    }
  );

  const [savedObjects = [], setSavedObjects] = useLocalStorage<WorldObject[]>(
    "mapDesignerObjects",
    [],
    {
      raw: false,
      serializer: (value: WorldObject[]) =>
        JSON.stringify(serializeObjects(value)),
      deserializer: (value: string) => deserializeObjects(JSON.parse(value)),
    }
  );

  return { savedObjects, setSavedObjects, savedWorldSize, setSavedWorldSize };
}
