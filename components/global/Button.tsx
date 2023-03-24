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
    "py-2 px-4 hover:brightness-90 rounded-md",
    variant === "dark" && "bg-grey-dark text-white",
    variant === "danger" && "bg-red text-whitef"
  );

  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
}
