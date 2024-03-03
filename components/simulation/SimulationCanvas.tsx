"use client";

import AsexualRandomPopulation from "@/simulation/creature/population/AsexualRandomPopulation";
import InsideReproductionAreaSelection from "@/simulation/creature/selection/InsideReproductionAreaSelection";
import World from "@/simulation/world/World";
import RectangleReproductionArea from "@/simulation/world/areas/reproduction/RectangleReproductionArea";
import RectangleObject from "@/simulation/world/objects/RectangleObject";
import { useAtom, useAtomValue } from "jotai";
import React, { useCallback, useEffect, useRef } from "react";
import {
  enabledActionsAtom,
  enabledSensorsAtom,
  geneInsertionDeletionProbabilityAtom,
  initialGenomeSizeAtom,
  initialPopulationAtom,
  maxGenomeSizeAtom,
  maxNeuronsAtom,
  mutationModeAtom,
  mutationProbabilityAtom,
  restartAtom,
  worldAtom,
  worldSizeAtom,
} from "./store";

interface Props {
  className?: string;
}

export default function SimulationCanvas({ className }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [world, setWorld] = useAtom(worldAtom);

  const [shouldRestart, setShouldRestart] = useAtom(restartAtom);

  // Initial settings
  const worldSize = useAtomValue(worldSizeAtom);
  const initialPopulation = useAtomValue(initialPopulationAtom);
  const initialGenomeSize = useAtomValue(initialGenomeSizeAtom);
  const maxGenomeSize = useAtomValue(maxGenomeSizeAtom);
  const maxNeurons = useAtomValue(maxNeuronsAtom);
  const mutationMode = useAtomValue(mutationModeAtom);
  const mutationProbability = useAtomValue(mutationProbabilityAtom);
  const geneInsertionDeletionProbability = useAtomValue(
    geneInsertionDeletionProbabilityAtom
  );
  const enabledSensors = useAtomValue(enabledSensorsAtom);
  const enabledActions = useAtomValue(enabledActionsAtom);

  // Function to set initial values
  const applyInitialValues = useCallback(
    (world: World) => {
      // Map
      world.size = worldSize;

      // Sensors and actions
      world.sensors.loadFromList(enabledSensors);
      world.actions.loadFromList(enabledActions);

      // Population
      world.initialPopulation = initialPopulation;
      world.populationStrategy = new AsexualRandomPopulation();
      world.selectionMethod = new InsideReproductionAreaSelection();

      // Neural networks
      world.initialGenomeSize = initialGenomeSize;
      world.maxGenomeSize = maxGenomeSize;
      world.maxNumberNeurons = maxNeurons;

      // Mutations
      world.mutationMode = mutationMode;
      world.mutationProbability = mutationProbability;
      world.geneInsertionDeletionProbability = geneInsertionDeletionProbability;
      world.deletionRatio = 0.5;
    },
    [
      enabledActions,
      enabledSensors,
      initialGenomeSize,
      initialPopulation,
      maxGenomeSize,
      maxNeurons,
      mutationMode,
      mutationProbability,
      geneInsertionDeletionProbability,
      worldSize,
    ]
  );

  // Instantiate the world
  useEffect(() => {
    // Create world and store it
    const world = new World(canvas.current, 100);
    setWorld(world);

    applyInitialValues(world);

    world.objects = [
      // A reproduction zone at the center
      new RectangleReproductionArea(0.25, 0.25, 0.5, 0.5, true),
      // A map divided in two sections by 5 squares
      new RectangleObject(0, 0, 0.2, 0.2),
      new RectangleObject(0.2, 0.2, 0.2, 0.2),
      new RectangleObject(0.4, 0.4, 0.2, 0.2),
      new RectangleObject(0.6, 0.6, 0.2, 0.2),
      new RectangleObject(0.8, 0.8, 0.2, 0.2),
    ];

    // Initialize world and start simulation
    world.initializeWorld(true);
    world.startRun();

    console.log("World instantiated");

    return () => {
      console.log("World destroyed");

      setWorld(null);
      world.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restartSimulation = useCallback(() => {
    if (world) {
      const isPaused = world.isPaused;
      applyInitialValues(world);
      world.initializeWorld(true);

      if (!isPaused) {
        world.startRun();
      }
    }
  }, [applyInitialValues, world]);

  // Restart the simulation
  useEffect(() => {
    if (shouldRestart) {
      restartSimulation();
      setShouldRestart(false);
    }
  }, [restartSimulation, setShouldRestart, shouldRestart]);

  return <canvas className={className} ref={canvas}></canvas>;
}
