"use client";

import React from "react";
import RestartButton from "../RestartButton";
import PlayPauseButton from "../PlayPauseButton";
import { useAtomValue } from "jotai";
import { currentGenerationAtom } from "../store";
import FooterStats from "./FooterStats";

export default function Footer() {
  const currentGeneration = useAtomValue(currentGenerationAtom);

  return (
    <div className="sticky bottom-0 bg-grey-mid/80 shadow-sm backdrop-blur-sm">
      <div className="section-container py-2 lg:py-5">
        <div className="flex items-center gap-2 sm:gap-10">
          <div>
            <span className="hidden lg:inline-block">Generation</span> #
            {currentGeneration}
          </div>

          <FooterStats />

          <div className="ml-auto flex flex-col gap-1 sm:flex-row">
            <RestartButton />
            <PlayPauseButton />
          </div>
        </div>
      </div>
    </div>
  );
}
