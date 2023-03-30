import { ReactNode, useState } from "react";
import { PrimitiveAtom, atom as newAtom, useAtom } from "jotai";

interface Props {
  id?: string;
  value?: number;
  onChange?: (value: number) => void;
  atom?: PrimitiveAtom<number>;
  label?: ReactNode;
}

export default function NumberInput({
  id,
  value,
  onChange,
  atom,
  label,
}: Props) {
  const [defaultAtom] = useState(() => newAtom(0));
  const [currentValue, setCurrentValue] = useAtom(atom ?? defaultAtom);

  return (
    <div className="flex flex-col">
      {label && (
        <label className="grow" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        type="number"
        value={value ?? currentValue}
        onChange={(e) =>
          onChange
            ? onChange(parseFloat(e.target.value))
            : setCurrentValue(parseFloat(e.target.value))
        }
        className="min-w-0 bg-grey-mid p-1 text-sm"
      />
    </div>
  );
}
