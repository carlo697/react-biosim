"use client";

import { useAtomValue } from "jotai";
import { worldAtom } from "../../store";
import { useCallback, useEffect, useState } from "react";
import { WorldEvents } from "@/simulation/events/WorldEvents";
import classNames from "classnames";
import { Species } from "./Species";
import SelectedSpecies from "./SelectedSpecies";
import SpeciesButton from "./SpeciesButton";

export default function PopulationPanel() {
  const world = useAtomValue(worldAtom);

  const [species, setSpecies] = useState<Species[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | undefined>();
  const renderedSpecies = species.slice(0, 42);

  const onStartGeneration = useCallback(() => {
    if (!world) return;

    const creatureMap = new Map<string, Species>();

    // Create the species from the creature list
    for (
      let creatureIdx = 0;
      creatureIdx < world.currentCreatures.length;
      creatureIdx++
    ) {
      const creature = world.currentCreatures[creatureIdx];
      const genomeString = creature.genome.toDecimalString(false);

      let species: Species | undefined = creatureMap.get(genomeString);
      if (!species) {
        species = new Species(creature.genome.clone());
        creatureMap.set(genomeString, species);
      }

      species.creatures.push(creature);
    }

    // Order by population
    const newSpecies = Array.from(creatureMap.values()).sort(
      (a, b) => b.creatures.length - a.creatures.length
    );

    setSpecies(newSpecies);
  }, [world]);

  // Bind events
  useEffect(() => {
    if (world) {
      onStartGeneration();

      world.events.addEventListener(
        WorldEvents.startGeneration,
        onStartGeneration
      );

      return () => {
        world.events.removeEventListener(
          WorldEvents.startGeneration,
          onStartGeneration
        );
      };
    }
  }, [world]);

  return (
    <div className="flex flex-col gap-6">
      <div className="lg:text-lg">
        <strong>Total species alive:</strong> {species.length}
      </div>

      <div className="flex gap-4">
        <div className="grow">
          <SelectedSpecies
            species={species}
            selectedSpecies={selectedSpecies}
          />
        </div>

        <div
          className={classNames(
            "inline-grid shrink-0 overflow-y-auto pr-2 lg:grid-cols-2 2xl:grid-cols-3",
            "max-h-[75vh] lg:max-h-[65vh]"
          )}
        >
          {renderedSpecies.map((species) => {
            const { genomeKey } = species;
            const isSelected = selectedSpecies?.genomeKey === genomeKey;

            return (
              <SpeciesButton
                key={species.genomeKey}
                species={species}
                isSelected={isSelected}
                onClick={() =>
                  isSelected
                    ? setSelectedSpecies(undefined)
                    : setSelectedSpecies(species)
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
