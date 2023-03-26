import { useAtomValue } from "jotai";
import { worldAtom } from "../../store";
import { useEffect, useRef } from "react";
import { Species } from "./Species";
import { useWindowSize } from "react-use";
import { drawCreatureNeuronalNetwork } from "@/simulation/creature/brain/Helpers/drawCreatureNeuronalNetwork";

interface Props {
  species: Species[];
  selectedSpecies?: Species;
}

export default function SelectedSpeciesPanel({
  species,
  selectedSpecies,
}: Props) {
  const world = useAtomValue(worldAtom);
  const graphCanvas = useRef<HTMLCanvasElement>(null);
  const { width } = useWindowSize();

  const actualSelectedSpecies =
    selectedSpecies &&
    species.find((item) => item.genomeKey === selectedSpecies.genomeKey);

  const aliveCreatures =
    (actualSelectedSpecies && actualSelectedSpecies.creatures.length) ?? 0;

  const populationPercentage = (
    actualSelectedSpecies && world
      ? (actualSelectedSpecies.creatures.length / world.initialPopulation) * 100
      : 0
  ).toFixed(2);

  useEffect(() => {
    if (graphCanvas.current && selectedSpecies) {
      const creature = selectedSpecies.creatures[0];
      const newGraph = drawCreatureNeuronalNetwork(
        creature,
        graphCanvas.current
      );

      return () => {
        newGraph.stop();
      };
    }
  }, [selectedSpecies, graphCanvas, width]);

  return (
    <>
      {selectedSpecies && world ? (
        <>
          <h3 className="mb-2 text-center text-2xl font-bold">
            Selected species{" "}
            <span
              className="text-shadow-sm inline-block p-1"
              style={{ backgroundColor: selectedSpecies.genome.getColor() }}
            >
              {selectedSpecies.genome.getHexColor()}
            </span>
          </h3>

          <div className="mb-2">
            {actualSelectedSpecies ? (
              <>
                <div>
                  <strong>Alive creatures:</strong> {aliveCreatures}
                </div>

                <div>
                  <strong>Population percentage:</strong> {populationPercentage}
                  %
                </div>
              </>
            ) : (
              <p className="bg-red p-4">This species went extinct.</p>
            )}
          </div>

          <canvas
            className="aspect-[5/4] w-full bg-white"
            ref={graphCanvas}
          ></canvas>
        </>
      ) : (
        <div className="flex max-w-md flex-col gap-6 text-lg">
          <p className="mb-2">
            The colorful boxes to the right are the top species on the current
            generation. The list is ordered by population.
          </p>
          <p>
            Click one of the boxes to see more information about that species
            (genes, neuronal network, etc).
          </p>
        </div>
      )}
    </>
  );
}
