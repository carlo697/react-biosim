"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { tabsContext } from "./Tabs";
import classNames from "classnames";

interface Props extends React.PropsWithChildren {
  index: number;
}

export default function Tab({ index, children }: Props) {
  const { currentIndex, setCurrentIndex } = useContext(tabsContext);
  const isActive = index === currentIndex;

  const handleClick = () => {
    setCurrentIndex(index);
  };

  return (
    <button
      className={classNames(
        "border-b-2 px-4 py-2 transition-colors",
        isActive && "border-white",
        !isActive && "border-transparent"
      )}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
