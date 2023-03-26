import classNames from "classnames";
import { Atom, WritableAtom, atom } from "jotai";
import React from "react";
import { createContext } from "react";

type ToggleAtom = WritableAtom<any, any[], any>;

interface Props extends React.ComponentPropsWithoutRef<"div"> {
  atom: ToggleAtom;
}

export const toggleGroupContext = createContext<{
  currentValueAtom: ToggleAtom;
}>({ currentValueAtom: atom(false) });

export function ToggleGroup({ className, atom, ...rest }: Props) {
  const finalClassName = classNames(
    "inline-grid auto-cols-fr grid-flow-col",
    className
  );

  return (
    <toggleGroupContext.Provider value={{ currentValueAtom: atom }}>
      <div className={finalClassName} {...rest}></div>
    </toggleGroupContext.Provider>
  );
}
