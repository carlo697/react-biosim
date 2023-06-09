import Creature from "../Creature";

export type ActionName =
  | "MoveNorth"
  | "MoveSouth"
  | "MoveEast"
  | "MoveWest"
  | "RandomMove"
  | "MoveForward";

export type Action = {
  name: ActionName;
  enabled: boolean;
};

export type Actions = Record<ActionName, Action>;

export default class CreatureActions {
  data: Actions = {
    MoveNorth: {
      name: "MoveNorth",
      enabled: true,
    },
    MoveSouth: {
      name: "MoveSouth",
      enabled: true,
    },
    MoveEast: {
      name: "MoveEast",
      enabled: true,
    },
    MoveWest: {
      name: "MoveWest",
      enabled: true,
    },
    RandomMove: {
      name: "RandomMove",
      enabled: true,
    },
    MoveForward: {
      name: "MoveForward",
      enabled: true,
    },
  };

  neuronsCount: number = 0;

  getList() {
    const list: ActionName[] = [];
    for (const key of Object.keys(this.data) as ActionName[]) {
      const item = this.data[key];
      if (item.enabled) {
        list.push(item.name);
      }
    }
    return list;
  }

  loadFromList(names: string[]) {
    for (const key of Object.keys(this.data) as ActionName[]) {
      this.data[key].enabled = names.includes(key);
    }

    this.updateInternalValues();
  }

  updateInternalValues() {
    this.neuronsCount = 0;

    for (const { enabled } of Object.values(this.data)) {
      if (enabled) {
        this.neuronsCount++;
      }
    }
  }

  executeActions(creature: Creature, values: number[]) {
    let currentIndex = 0;
    let input = values[0];

    // MoveNorth
    if (this.data.MoveNorth.enabled) {
      if (input > 0) {
        creature.addUrgeToMove(0, -input);
      }

      currentIndex++;
      input = values[currentIndex];
    }

    // MoveSouth
    if (this.data.MoveSouth.enabled) {
      if (input > 0) {
        creature.addUrgeToMove(0, input);
      }

      currentIndex++;
      input = values[currentIndex];
    }

    // MoveEast
    if (this.data.MoveEast.enabled) {
      if (input > 0) {
        creature.addUrgeToMove(input, 0);
      }

      currentIndex++;
      input = values[currentIndex];
    }

    // MoveWest
    if (this.data.MoveWest.enabled) {
      if (input > 0) {
        creature.addUrgeToMove(-input, 0);
      }

      currentIndex++;
      input = values[currentIndex];
    }

    // RandomMove
    if (this.data.RandomMove.enabled) {
      if (input > 0) {
        creature.addUrgeToMove(
          (Math.random() * 2 - 1) * input,
          (Math.random() * 2 - 1) * input
        );
      }

      currentIndex++;
      input = values[currentIndex];
    }

    // MoveForward
    if (this.data.MoveForward.enabled) {
      if (input > 0) {
        creature.addUrgeToMove(
          creature.lastMovement[0],
          creature.lastMovement[1]
        );
      }
    }
  }
}
