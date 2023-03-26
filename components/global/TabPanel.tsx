"use client";

import { useContext } from "react";
import { tabsContext } from "./Tabs";

interface Props extends React.PropsWithChildren {
  index: number;
}

export default function TabPanel({ index, children }: Props) {
  const { currentIndex } = useContext(tabsContext);
  const isActive = index === currentIndex;

  return (
    <>
      {isActive ? (
        <div className={"border-t-2 border-grey-mid py-4"}>{children}</div>
      ) : null}
    </>
  );
}
