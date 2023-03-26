"use client";

import { createContext, useState } from "react";

interface Props extends React.PropsWithChildren {}

const defaultContextValue = {
  currentIndex: 0,
  setCurrentIndex: (value: number) => {},
};
export const tabsContext = createContext(defaultContextValue);

export default function Tabs({ children, ...rest }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <tabsContext.Provider value={{ currentIndex, setCurrentIndex }}>
      <div {...rest}>{children}</div>
    </tabsContext.Provider>
  );
}
