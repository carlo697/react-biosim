import classNames from "classnames";

interface Props
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<"div"> {
  enable?: boolean;
}

export default function ToggleableFullscreen({
  children,
  className,
  enable,
  ...rest
}: Props) {
  const finalClassName = classNames(
    enable && "fixed w-full h-full top-0 left-0 z-50 overflow-y-auto",
    className
  );

  return (
    <div {...rest} className={finalClassName}>
      {children}
    </div>
  );
}
