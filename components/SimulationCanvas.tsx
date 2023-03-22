"use client";

import React from "react";

interface Props {
  className?: string;
}

export default function SimulationCanvas({ className }: Props) {
  return <canvas className={className}></canvas>;
}
