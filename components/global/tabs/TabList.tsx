interface Props extends React.PropsWithChildren {}

export default function TabList({ children }: Props) {
  return <div className={"-m-0.5 flex flex-wrap"}>{children}</div>;
}
