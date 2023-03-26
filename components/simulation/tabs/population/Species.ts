import Creature from "@/simulation/creature/Creature";
import Genome from "@/simulation/creature/genome/Genome";

export class Species {
  genomeKey: string;

  constructor(public genome: Genome, public creatures: Creature[] = []) {
    this.genomeKey = genome.toDecimalString(false);
  }
}
