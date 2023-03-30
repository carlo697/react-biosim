"use client";

import Button from "@/components/global/Button";
import { worldAtom } from "../../store";
import { useAtomValue } from "jotai";
import CopyToClipboardTextarea from "@/components/global/inputs/CopyToClipboardTextarea";
import { useState } from "react";
import { saveWorld } from "@/simulation/serialization/saveWorld";

export default function SavePanel() {
  const world = useAtomValue(worldAtom);
  const [data, setData] = useState("");

  const handleSave = () => {
    if (world) {
      const savedWorld = saveWorld(world);
      const json = JSON.stringify(savedWorld);
      setData(json);
    }
  };

  return (
    <div>
      <p className="mb-2">
        Press the &quot;Save&quot; button below to generate a JSON code of world
        that you can back up somewhere else! If you want to load it, use the
        &quot;Load&quot; tab.
      </p>

      <CopyToClipboardTextarea
        value={data}
        maxRows={20}
        minRows={20}
        withScrollbar
      />

      <div className="mt-2 text-center">
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
