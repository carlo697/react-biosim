"use client";

import { MutationMode } from "@/simulation/creature/genome/MutationMode";
import AsexualRandomPopulation from "@/simulation/creature/population/AsexualRandomPopulation";
import InsideReproductionAreaSelection from "@/simulation/creature/selection/InsideReproductionAreaSelection";
import World from "@/simulation/world/World";
import RectangleReproductionArea from "@/simulation/world/areas/reproduction/RectangleReproductionArea";
import RectangleObject from "@/simulation/world/objects/RectangleObject";
import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import { isPausedAtom, restartAtom } from "./store";

interface Props {
  className?: string;
}

export default function SimulationCanvas({ className }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [world, setWorld] = useState<World | null>(null);

  const [shouldRestart, setShouldRestart] = useAtom(restartAtom);
  const [isPaused] = useAtom(isPausedAtom);

  useEffect(() => {
    // Create world
    const world = new World(canvas.current, 100);
    setWorld(world);
    const populationStrategy = new AsexualRandomPopulation();
    const selectionMethod = new InsideReproductionAreaSelection();

    // A map divided in two sections by 5 squares and a reproduction zone in the center
    world.obstacles = [
      new RectangleObject(world, 0, 0, 0.2, 0.2),
      new RectangleObject(world, 0.2, 0.2, 0.2, 0.2),
      new RectangleObject(world, 0.4, 0.4, 0.2, 0.2),
      new RectangleObject(world, 0.6, 0.6, 0.2, 0.2),
      new RectangleObject(world, 0.8, 0.8, 0.2, 0.2),
    ];
    world.areas = [
      new RectangleReproductionArea(world, 0.25, 0.25, 0.5, 0.5, true),
    ];

    // Default values
    world.initialPopulation = 1000;
    world.populationStrategy = populationStrategy;
    world.selectionMethod = selectionMethod;
    world.initialGenomeSize = 4;
    world.maxGenomeSize = 30;
    world.maxNumberNeurons = 15;
    world.timePerStep = 0;
    world.stepsPerGen = 300;
    world.immediateSteps = 1;
    world.mutationProbability = 0.05;
    world.geneInsertionDeletionProbability = 0.015;
    world.deletionRatio = 0.5;
    world.mutationMode = MutationMode.wholeGene;
    world.pauseBetweenGenerations = 0;

    // Initialize world and start simulation
    world.initializeWorld(true);
    world.startRun();

    return () => {
      world.pause();
    };
  }, []);

  const restartSimulation = () => {
    if (world) {
      const isPaused = world.isPaused;
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
