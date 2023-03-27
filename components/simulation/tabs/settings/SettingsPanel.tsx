"use client";

import NumberInput from "@/components/global/inputs/NumberInput";
import {
  initialGenomeSizeAtom,
  initialPopulationAtom,
  maxGenomeSizeAtom,
  maxNeuronsAtom,
  mutationModeAtom,
  worldSizeAtom,
} from "../../store";
import SelectInput from "@/components/global/inputs/SelectInput";

export default function SettingsPanel() {
  return (
    <div>
      <p className="mb-2">
        You need to restart the simulation for these settings to work:
      </p>

      <div className="flex flex-col gap-6">
        <div>
          <h3 className="mb-1 text-2xl font-bold">World</h3>
          <div className="grid grid-cols-2 gap-4">
            <NumberInput atom={worldSizeAtom} label="World Size" />
            <NumberInput
              atom={initialPopulationAtom}
              label="Initial population"
            />
          </div>
        </div>

        <div>
          <h3 className="mb-1 text-2xl font-bold">Neuronal Networks</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <NumberInput
              atom={initialGenomeSizeAtom}
              label="Initial genome size"
            />
            <NumberInput atom={maxGenomeSizeAtom} label="Max genome size" />
            <NumberInput atom={maxNeuronsAtom} label="Max neurons" />
            <SelectInput atom={mutationModeAtom} label="Mutation mode">
              <option value="wholeGene">Whole Genes</option>
              <option value="singleBit">Single Bits</option>
              <option value="singleHexDigit">Single Hexadecimal Digits</option>
            </SelectInput>
          </div>
        </div>
      </div>
    </div>
  );
}
