import { ReactNode, useState } from "react";
import { PrimitiveAtom, atom as newAtom, useAtom } from "jotai";

interface Props {
  id?: string;
  value?: number;
  onChange?: (value: number) => void;
  atom?: PrimitiveAtom<number>;
  label?: ReactNode;
  step?: number;
}

export default function NumberInput({
  id,
  value,
  onChange,
  atom,
  label,
  step,
}: Props) {
  const [defaultAtom] = useState(() => newAtom(0));
  const [currentValue, setCurrentValue] = useAtom(atom ?? defaultAtom);

  const parse = (value: string) => {
    return parseFloat(value);
  };

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
            ? onChange(parse(e.target.value))
            : setCurrentValue(parse(e.target.value))
        }
        className="w-0 min-w-full bg-grey-mid p-1 text-sm"
        step={step}
      />
    </div>
  );
}
