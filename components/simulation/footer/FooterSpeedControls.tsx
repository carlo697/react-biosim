import React from "react";
import {
  immediateStepsAtom,
  pauseBetweenGenerationsAtom,
  pauseBetweenStepsAtom,
} from "../store";
import { ToggleGroup } from "@/components/global/ToggleGroup";
import Toggle from "@/components/global/Toggle";
import classNames from "classnames";

interface Props
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<"div"> {}

export function FooterSpeedControls({ className, ...rest }: Props) {
  const finalClassName = classNames(
    "flex flex-wrap gap-4 text-xs lg:text-sm",
    className
  );

  return (
    <div className={finalClassName} {...rest}>
      <div className="flex flex-col items-start gap-1">
        Pause between steps (ms):
        <ToggleGroup atom={pauseBetweenStepsAtom}>
          <Toggle value={0}>0</Toggle>
          <Toggle value={50}>50</Toggle>
          <Toggle value={200}>200</Toggle>
        </ToggleGroup>
      </div>
      <div className="flex flex-col items-start gap-1">
        Pause between generations (ms):
        <ToggleGroup atom={pauseBetweenGenerationsAtom}>
          <Toggle value={0}>0</Toggle>
          <Toggle value={1000}>1000</Toggle>
          <Toggle value={2000}>4000</Toggle>
        </ToggleGroup>
      </div>
      <div className="flex flex-col items-start gap-1">
        Immediate steps:
        <ToggleGroup atom={immediateStepsAtom}>
          <Toggle value={1}>1</Toggle>
          <Toggle value={20}>20</Toggle>
          <Toggle value={200}>200</Toggle>
        </ToggleGroup>
      </div>
    </div>
  );
}
