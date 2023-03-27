"use client";

import NumberInput from "@/components/global/inputs/NumberInput";
import {
  enabledActionsAtom,
  enabledSensorsAtom,
  initialGenomeSizeAtom,
  initialPopulationAtom,
  maxGenomeSizeAtom,
  maxNeuronsAtom,
  mutationModeAtom,
  worldAtom,
  worldSizeAtom,
} from "../../store";
import SelectInput from "@/components/global/inputs/SelectInput";
import CheckboxInput from "@/components/global/inputs/CheckboxInput";
import { useAtom, useAtomValue } from "jotai";
import {
  Sensor,
  SensorName,
} from "@/simulation/creature/sensors/CreatureSensors";
import {
  Action,
  ActionName,
} from "@/simulation/creature/actions/CreatureActions";

export default function SettingsPanel() {
  const world = useAtomValue(worldAtom);
  const [enabledSensors, setEnabledSensors] = useAtom(enabledSensorsAtom);
  const [enabledActions, setEnabledActions] = useAtom(enabledActionsAtom);
  const sensors = Object.values(world?.sensors.data ?? {});
  const actions = Object.values(world?.actions.data ?? {});

  const handleSensorChange = (name: SensorName, checked: boolean) => {
    if (checked) {
      setEnabledSensors([...enabledSensors, name]);
    } else if (enabledSensors.length > 1) {
      setEnabledSensors(enabledSensors.filter((item) => item !== name));
    }
  };

  const handleActionChange = (name: ActionName, checked: boolean) => {
    if (checked) {
      setEnabledActions([...enabledActions, name]);
    } else if (enabledActions.length > 1) {
      setEnabledActions(enabledActions.filter((item) => item !== name));
    }
  };

  const getPrettyName = (name: string) =>
    name.replace(/([A-Z])/g, " $1").trim();

  const getSensorLabel = (sensor: Sensor) =>
    `${getPrettyName(sensor.name)} (${sensor.neuronCount} neurons)`;

  const getActionLabel = (action: Action) =>
    `${getPrettyName(action.name)} (1 neuron)`;

  return (
    <div>
      <p className="mb-2">
        You need to restart the simulation for these settings to work:
      </p>

      <div className="flex flex-col gap-8">
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

        <div>
          <h3 className="mb-1 text-2xl font-bold">Sensors</h3>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {sensors.map((sensor) => (
              <CheckboxInput
                id={sensor.name}
                key={sensor.name}
                label={getSensorLabel(sensor)}
                checked={enabledSensors.includes(sensor.name)}
                onChange={(checked) => handleSensorChange(sensor.name, checked)}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-1 text-2xl font-bold">Actions</h3>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {actions.map((actions) => (
              <CheckboxInput
                id={actions.name}
                key={actions.name}
                label={getActionLabel(actions)}
                checked={enabledActions.includes(actions.name)}
                onChange={(checked) =>
                  handleActionChange(actions.name, checked)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
