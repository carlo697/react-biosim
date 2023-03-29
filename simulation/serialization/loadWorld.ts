import Creature from "../creature/Creature";
import Genome from "../creature/genome/Genome";
import WorldArea from "../world/areas/WorldArea";
import { GenerationRegistry } from "../world/stats/GenerationRegistry";
import World from "../world/World";
import WorldObject from "../world/WorldObject";
import SavedWorld from "./data/SavedWorld";
import areaFormatters from "./formatters/areaFormatters";
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

  // Clear world obstacles
  world.obstacles = [];

  // Load obstacles
  parsed.obstacles.forEach((savedObject) => {
    const formatter = objectFormatters[savedObject.type];

    if (formatter) {
      const worldObject: WorldObject = formatter.deserialize(
        savedObject.data,
        world
      );
      world.obstacles.push(worldObject);
    }
  });

  // Clear world areas
  world.areas = [];

  // Load areas
  parsed.areas.forEach((savedObject) => {
    const formatter = areaFormatters[savedObject.type];

    if (formatter) {
      const worldArea: WorldArea = formatter.deserialize(
        savedObject.data,
        world
      );
      world.areas.push(worldArea);
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
