import classNames from "classnames";
import { useAtom } from "jotai";
import { useContext } from "react";
import { toggleGroupContext } from "./ToggleGroup";

interface Props
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<"button"> {
  value: any;
}

export default function Toggle({ children, className, value, ...rest }: Props) {
  const { currentValueAtom } = useContext(toggleGroupContext);
  const [currentValue, setCurrentValue] = useAtom(currentValueAtom);
  const isActive = currentValue === value;

  const finalClassName = classNames(
    "py-2 px-2 text-sm lg:text-sm !leading-none",
    "hover:border-2 hover:border-white/50",
    "first:rounded-tl-md first:rounded-bl-md",
    "last:rounded-tr-md last:rounded-br-md",
    isActive && "bg-grey-mid border-2",
    !isActive && "bg-grey-dark border-2 border-grey-dark",
    className
  );

  const handleClick = () => {
    setCurrentValue(value);
  };

  return (
    <button {...rest} className={finalClassName} onClick={handleClick}>
      {children}
    </button>
  );
}
