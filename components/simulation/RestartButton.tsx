"use client";

import React from "react";
import Button from "../global/Button";
import { useSetAtom } from "jotai";
import { restartAtom } from "./store";

export default function RestartButton() {
  const restart = useSetAtom(restartAtom);

  const handleClick = () => {
    restart(true);
  };

  return (
    <Button variant="danger" onClick={handleClick}>
      Restart
    </Button>
  );
}
