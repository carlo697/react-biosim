import { ReactNode } from "react";
import { PrimitiveAtom, useAtom } from "jotai";

type NumberInputAtom = PrimitiveAtom<number>;

interface Props {
  atom: NumberInputAtom;
  label?: ReactNode;
}

export default function NumberInput({ atom, label }: Props) {
  const [currentValue, setCurrentValue] = useAtom(atom);

  return (
    <div className="flex flex-col">
      {label && <label className="grow">{label}</label>}
      <input
        type="number"
        value={currentValue}
        onChange={(e) => setCurrentValue(parseFloat(e.target.value))}
        className="min-w-0 bg-grey-mid p-1 text-sm"
      />
    </div>
  );
}
