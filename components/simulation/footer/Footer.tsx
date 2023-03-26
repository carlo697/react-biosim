"use client";

import React, { useState } from "react";
import RestartButton from "../RestartButton";
import PlayPauseButton from "../PlayPauseButton";
import { useAtomValue } from "jotai";
import { currentGenerationAtom } from "../store";
import FooterStats from "./FooterStats";
import { FooterSpeedControls } from "./FooterSpeedControls";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import classNames from "classnames";

export default function Footer() {
  const [extended, setExtended] = useState(false);
  const currentGeneration = useAtomValue(currentGenerationAtom);

  return (
    <div className="sticky bottom-0 bg-grey-mid/80 shadow-sm backdrop-blur-sm">
      <div className="section-container flex flex-col gap-2 py-2 lg:py-5">
        <button
          className="flex-center xl:hidden"
          onClick={() => setExtended(!extended)}
        >
          {extended ? <FaChevronDown /> : <FaChevronUp />}
        </button>

        <div className="flex items-center gap-2 sm:gap-10">
          <div>
            <span className="hidden lg:inline-block">Generation</span>{" "}
            <strong>#{currentGeneration}</strong>
          </div>

          <FooterStats />

          <div className="ml-auto flex gap-10">
            <div className="hidden xl:block">
              <FooterSpeedControls />
            </div>

            <div className="flex flex-col gap-1 sm:flex-row">
              <RestartButton />
              <PlayPauseButton />
            </div>
          </div>
        </div>

        <div className={classNames("xl:hidden", !extended && "hidden")}>
          <FooterSpeedControls />
        </div>
      </div>
    </div>
  );
}
