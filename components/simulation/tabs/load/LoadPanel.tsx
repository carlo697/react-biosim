"use client";

import Button from "@/components/global/Button";
import { worldAtom } from "../../store";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { loadWorld } from "@/simulation/serialization/loadWorld";
import TextareaInput from "@/components/global/inputs/TextareaInput";

export default function LoadPanel() {
  const world = useAtomValue(worldAtom);
  const [data, setData] = useState("");

  const handleSave = () => {
    if (world) {
      loadWorld(world, data);
    }
  };

  return (
    <div>
      <p className="mb-2">
        Paste below the JSON code of a previously saved world and load it with
        the &quot;Load&quot; button.
      </p>

      <TextareaInput
        value={data}
        onChange={(e) => setData(e.target.value)}
        minRows={2}
        maxRows={20}
      />

      <div className="mt-2 text-center">
        <Button onClick={handleSave}>Load</Button>
      </div>
    </div>
  );
}
