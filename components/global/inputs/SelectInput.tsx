import { ReactNode } from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import { EnumType } from "typescript";

interface Props extends React.PropsWithChildren {
  atom: PrimitiveAtom<any>;
  label?: ReactNode;
}

export default function SelectInput({ atom, label, children }: Props) {
  const [currentValue, setCurrentValue] = useAtom(atom);

  return (
    <div className="flex flex-col">
      {label && <label className="grow">{label}</label>}
      <select
        value={currentValue.toString()}
        onChange={(e) => setCurrentValue(e.target.value)}
        className="min-w-0 bg-grey-mid p-1"
      >
        {children}
      </select>
    </div>
  );
}
