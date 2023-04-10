import Creature from "../creature/Creature";
import Genome from "../creature/genome/Genome";
import { GenerationRegistry } from "../world/stats/GenerationRegistry";
import World from "../world/World";
import WorldObject from "../world/WorldObject";
import SavedWorld from "./data/SavedWorld";
import generationRegistryFormatter from "./formatters/generationRegistryFormatter";
import objectFormatters from "./formatters/objectFormatters";

export function loadWorld(world: World, data: string) {
  const parsed = JSON.parse(data) as SavedWorld;

  world.pause();

  // Load basic world data
  world.size = parsed.size;
  world.initialPopulation = parsed.initialPopulation;
  world.currentGen = parsed.currentGen;
  world.currentStep = parsed.currentStep;
  world.timePerStep = parsed.timePerStep;
  world.stepsPerGen = parsed.stepsPerGen;
  world.immediateSteps = parsed.immediateSteps;
  world.initialGenomeSize = parsed.initialGenomeSize;
  world.maxGenomeSize = parsed.maxGenomeSize;
  world.maxNumberNeurons = parsed.maxNumberNeurons;
  world.mutationProbability = parsed.mutationProbability;
  world.geneInsertionDeletionProbability =
    parsed.geneInsertionDeletionProbability;
  world.deletionRatio = parsed.deletionRatio;
  world.mutationMode = parsed.mutationMode;
  world.pauseBetweenGenerations = parsed.pauseBetweenGenerations;

  // Stats
  world.lastCreatureCount = parsed.lastCreatureCount;
  world.lastSurvivorsCount = parsed.lastSurvivorsCount;
  world.lastSurvivalRate = parsed.lastSurvivalRate;
  world.lastGenerationDuration = parsed.lastGenerationDuration;
  world.totalTime = parsed.totalTime;

  // Enable sensors and actions
  world.sensors.loadFromList(parsed.sensors);
  world.actions.loadFromList(parsed.actions);

  // Load creatures
  const creatures: Creature[] = [];
  parsed.species.forEach((savedSpecies) => {
    savedSpecies.creatures.forEach((savedCreature) => {
      const genome: Genome = new Genome(savedSpecies.genes);
      const creature = new Creature(world, savedCreature.position, genome);
      creature.lastMovement = savedCreature.lastMovement;
      creature.lastPosition = savedCreature.lastPosition;

      creatures.push(creature);
    });
  });
  world.currentCreatures = creatures;

  // Clear world objects
  world.objects = [];

  // Load objects
  parsed.objects.forEach((savedObject) => {
    const formatter = objectFormatters[savedObject.type];

    if (formatter) {
      const worldObject: WorldObject = formatter.deserialize(
        savedObject.data,
        world
      );
      world.objects.push(worldObject);
    }
  });

  // Load generation registry
  if (parsed.generations) {
    world.generationRegistry = generationRegistryFormatter.deserialize(
      parsed.generations,
      world
    );
  } else {
    world.generationRegistry = new GenerationRegistry(world);
  }

  // Initialize world
  world.initializeWorld(false);
}
