import classNames from "classnames";

interface Props
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<"button"> {
  variant?: "dark" | "danger";
}

export default function Button({
  children,
  variant = "danger",
  ...rest
}: Props) {
  const className = classNames(
    "py-1 px-3 lg:py-2 lg:px-4 text-sm lg:text-base hover:brightness-90 rounded-md",
    variant === "dark" && "bg-grey-dark text-white",
    variant === "danger" && "bg-red text-whitef"
  );

  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
}
