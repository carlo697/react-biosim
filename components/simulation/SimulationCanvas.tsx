"use client";

import { MutationMode } from "@/simulation/creature/genome/MutationMode";
import AsexualRandomPopulation from "@/simulation/creature/population/AsexualRandomPopulation";
import InsideReproductionAreaSelection from "@/simulation/creature/selection/InsideReproductionAreaSelection";
import World from "@/simulation/world/World";
import RectangleReproductionArea from "@/simulation/world/areas/reproduction/RectangleReproductionArea";
import RectangleObject from "@/simulation/world/objects/RectangleObject";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import React, { useCallback, useEffect, useRef } from "react";
import {
  currentGenerationAtom,
  currentStepAtom,
  immediateStepsAtom,
  initialGenomeSizeAtom,
  initialPopulationAtom,
  isPausedAtom,
  lastGenerationDurationAtom,
  lastSurvivalRateAtom,
  lastSurvivorCountAtom,
  maxGenomeSizeAtom,
  maxNeuronsAtom,
  mutationModeAtom,
  newPopulationCountAtom,
  pauseBetweenGenerationsAtom,
  pauseBetweenStepsAtom,
  restartAtom,
  stepsPerGenerationAtom,
  totalTimeAtom,
  worldAtom,
  worldSizeAtom,
} from "./store";
import { WorldEvents } from "@/simulation/events/WorldEvents";

interface Props {
  className?: string;
}

export default function SimulationCanvas({ className }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [world, setWorld] = useAtom(worldAtom);

  const [shouldRestart, setShouldRestart] = useAtom(restartAtom);
  const [isPaused] = useAtom(isPausedAtom);

  // Dinamic values
  const stepsPerGeneration = useAtomValue(stepsPerGenerationAtom);
  const pauseBetweenSteps = useAtomValue(pauseBetweenStepsAtom);
  const pauseBetweenGenerations = useAtomValue(pauseBetweenGenerationsAtom);
  const immediateSteps = useAtomValue(immediateStepsAtom);

  // Initial settings
  const worldSize = useAtomValue(worldSizeAtom);
  const initialPopulation = useAtomValue(initialPopulationAtom);
  const initialGenomeSize = useAtomValue(initialGenomeSizeAtom);
  const maxGenomeSize = useAtomValue(maxGenomeSizeAtom);
  const maxNeurons = useAtomValue(maxNeuronsAtom);
  const mutationMode = useAtomValue(mutationModeAtom);

  // Keep the world synchronized with dinamic values
  useEffect(() => {
    if (world) world.stepsPerGen = stepsPerGeneration;
  }, [stepsPerGeneration]);
  useEffect(() => {
    if (world) world.timePerStep = pauseBetweenSteps;
  }, [pauseBetweenSteps]);
  useEffect(() => {
    if (world) world.immediateSteps = immediateSteps;
  }, [immediateSteps]);
  useEffect(() => {
    if (world) world.pauseBetweenGenerations = pauseBetweenGenerations;
  }, [pauseBetweenGenerations]);

  // Function to set initial values
  const applyInitialValues = (world: World) => {
    // Restart stats
    setCurrentStep(0);
    setCurrentGeneration(0);
    setLastGenerationDuration(0);
    setTotalTime(0);
    setLastSurvivorCount(0);
    setLastSurvivalRate(0);
    setNewPopulationCount(0);

    // Default values (map)
    world.size = worldSize;

    // Default values (time)
    world.timePerStep = pauseBetweenSteps;
    world.immediateSteps = immediateSteps;
    world.pauseBetweenGenerations = pauseBetweenGenerations;

    // Default values (population)
    world.initialPopulation = initialPopulation;
    world.stepsPerGen = stepsPerGeneration;
    world.populationStrategy = new AsexualRandomPopulation();
    world.selectionMethod = new InsideReproductionAreaSelection();

    // Default values (neural networks)
    world.initialGenomeSize = initialGenomeSize;
    world.maxGenomeSize = maxGenomeSize;
    world.maxNumberNeurons = maxNeurons;

    // Default values (mutations)
    world.mutationMode = mutationMode;
    world.mutationProbability = 0.05;
    world.geneInsertionDeletionProbability = 0.015;
    world.deletionRatio = 0.5;
  };

  // Instantiate the world
  useEffect(() => {
    // Create world and store it
    const world = new World(canvas.current, 100);
    setWorld(world);

    applyInitialValues(world);

    // A map divided in two sections by 5 squares
    world.obstacles = [
      new RectangleObject(world, 0, 0, 0.2, 0.2),
      new RectangleObject(world, 0.2, 0.2, 0.2, 0.2),
      new RectangleObject(world, 0.4, 0.4, 0.2, 0.2),
      new RectangleObject(world, 0.6, 0.6, 0.2, 0.2),
      new RectangleObject(world, 0.8, 0.8, 0.2, 0.2),
    ];
    // A reproduction zone at the center
    world.areas = [
      new RectangleReproductionArea(world, 0.25, 0.25, 0.5, 0.5, true),
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
  }, []);

  // Bind events
  useEffect(() => {
    if (world) {
      world.events.addEventListener(
        WorldEvents.startGeneration,
        onStartGeneration
      );
      world.events.addEventListener(WorldEvents.startStep, onStartStep);

      return () => {
        world.events.removeEventListener(
          WorldEvents.startGeneration,
          onStartGeneration
        );
        world.events.removeEventListener(WorldEvents.startStep, onStartStep);
      };
    }
  }, [world]);

  // Stats
  const setCurrentStep = useSetAtom(currentStepAtom);
  const setCurrentGeneration = useSetAtom(currentGenerationAtom);
  const setLastGenerationDuration = useSetAtom(lastGenerationDurationAtom);
  const setTotalTime = useSetAtom(totalTimeAtom);
  const setLastSurvivorCount = useSetAtom(lastSurvivorCountAtom);
  const setNewPopulationCount = useSetAtom(newPopulationCountAtom);
  const setLastSurvivalRate = useSetAtom(lastSurvivalRateAtom);

  const onStartGeneration = useCallback(() => {
    if (world) {
      setCurrentGeneration(world.currentGen);
      setLastGenerationDuration(world.lastGenerationDuration);
      setTotalTime((value) => value + world.lastGenerationDuration);
      setLastSurvivorCount(world.lastSurvivorsCount);
      setLastSurvivalRate(world.lastSurvivalRate);
      setNewPopulationCount(world.currentCreatures.length);
    }
  }, [world]);

  const onStartStep = useCallback(() => {
    if (world) {
      setCurrentStep(world.currentStep);
    }
  }, [world]);

  const restartSimulation = () => {
    if (world) {
      const isPaused = world.isPaused;
      applyInitialValues(world);
      world.initializeWorld(true);

      if (!isPaused) {
        world.startRun();
      }
    }
  };

  // Restart the simulation
  useEffect(() => {
    if (shouldRestart) {
      restartSimulation();
      setShouldRestart(false);
    }
  }, [shouldRestart]);

  // Pause the simulation
  useEffect(() => {
    if (world) {
      if (isPaused) {
        world.pause();
      } else {
        world.resume();
      }
    }
  }, [isPaused]);

  return <canvas className={className} ref={canvas}></canvas>;
}
