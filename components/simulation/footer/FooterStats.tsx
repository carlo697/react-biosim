"use client";

import React from "react";
import { useAtomValue } from "jotai";
import {
  lastGenerationDurationAtom,
  lastSurvivalRateAtom,
  lastSurvivorCountAtom,
  totalTimeAtom,
} from "../store";

export default function Footer() {
  const lastGenerationDuration = useAtomValue(lastGenerationDurationAtom);
  const totalTime = useAtomValue(totalTimeAtom);
  const lastSurvivorCount = useAtomValue(lastSurvivorCountAtom);
  const lastSurvivalRate = useAtomValue(lastSurvivalRateAtom);

  // Convert the survival rate from range [0, 1] to [0, 100]
  const survivalRatePercentage = lastSurvivalRate * 100;
  // Leave two decimals
  const survivalRateFormatted = Math.round(survivalRatePercentage * 100) / 100;

  // Conver the total time to minutes and
  const totalTimeMinutes = totalTime / 1000 / 60;
  // Leave two decimals
  const totalTimeFormatted = Math.round(totalTimeMinutes * 100) / 100;

  const waitMessage = "Wait...";

  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
      <div>
        <strong>Survivors: </strong>
        {lastSurvivorCount ? (
          <span className="inline-block min-w-[80px]">
            {lastSurvivorCount} ({survivalRateFormatted}%)
          </span>
        ) : (
          waitMessage
        )}
      </div>

      <div>
        <strong>Total time: </strong>
        {totalTime ? <span>{totalTimeFormatted} min</span> : waitMessage}
      </div>

      <div className="col-span-2">
        <strong>Last generation duration: </strong>
        {lastGenerationDuration ? (
          <span className="inline-block min-w-[60px]">
            {lastGenerationDuration} ms
          </span>
        ) : (
          waitMessage
        )}
      </div>
    </div>
  );
}
