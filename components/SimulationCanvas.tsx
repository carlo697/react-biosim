"use client";

import { MutationMode } from "@/simulation/creature/genome/MutationMode";
import AsexualRandomPopulation from "@/simulation/creature/population/AsexualRandomPopulation";
import InsideReproductionAreaSelection from "@/simulation/creature/selection/InsideReproductionAreaSelection";
import World from "@/simulation/world/World";
import RectangleReproductionArea from "@/simulation/world/areas/reproduction/RectangleReproductionArea";
import RectangleObject from "@/simulation/world/objects/RectangleObject";
import React, { useEffect, useRef } from "react";

interface Props {
  className?: string;
}

export default function SimulationCanvas({ className }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Create world
    const world = new World(canvas.current, 100);
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
  });

  return <canvas className={className} ref={canvas}></canvas>;
}
