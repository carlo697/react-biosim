"use client";

import React from "react";
import Button from "../global/Button";
import { useAtom, useSetAtom } from "jotai";
import { isPausedAtom } from "./store";

export default function PlayPauseButton() {
  const [isPaused, setIsPaused] = useAtom(isPausedAtom);

  const handleClick = () => {
    setIsPaused(!isPaused);
  };

  return (
    <Button variant="dark" onClick={handleClick}>
      {isPaused ? "Play" : "Pause"}
    </Button>
  );
}
