"use client";

import React from "react";
import Button from "../global/Button";
import useWorldProperty from "@/hooks/useWorldProperty";

export default function PlayPauseButton() {
  const [isPaused, setIsPaused] = useWorldProperty(
    (world) => world.isPaused,
    (world) => {
      if (world.isPaused) {
        world.resume();
      } else {
        world.pause();
      }
    },
    false
  );

  const handleClick = () => {
    setIsPaused(!isPaused);
  };

  return (
    <Button variant="dark" onClick={handleClick}>
      {isPaused ? "Play" : "Pause"}
    </Button>
  );
}
