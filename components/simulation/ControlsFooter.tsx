import React from "react";
import RestartButton from "./RestartButton";
import PlayPauseButton from "./PlayPauseButton";

export default function ControlsFooter() {
  return (
    <div className="sticky bottom-0 bg-grey-mid/80 shadow-sm backdrop-blur-sm">
      <div className="section-container py-2 lg:py-5">
        <div className="flex">
          <div className="ml-auto flex gap-1">
            <RestartButton />
            <PlayPauseButton />
          </div>
        </div>
      </div>
    </div>
  );
}
