import { positionEq } from "./primMaze.js";

export const RUNNING = "running";
export const LOSE = "lose";
export const WIN = "win";

function isEnemied(player, enemies) {
  for (let i = 0; i < enemies.length; i++) {
    if (positionEq(player.position, enemies[i].position)) {
      return true;
    }
  }

  return false;
}

function tryRemoveKeyAt(player, keys) {
  for (let i = 0; i < keys.length; i++) {
    if (positionEq(player.position, keys[i].position)) {
      keys.splice(i, 1);
    }
  }
}

export class Status {
  constructor(maze, player, enemies, keys) {
    this.maze = maze;
    this.player = player;
    this.enemies = enemies;
    this.keys = keys;

    this.state = RUNNING;
  }

  isOpen() {
    return this.keys.length == 0;
  }

  update(deltaTime) {
    tryRemoveKeyAt(this.player, this.keys);

    if (
      this.maze.isTrapped(this.player.position) ||
      isEnemied(this.player, this.enemies)
    ) {
      this.state = LOSE;
    } else if (this.maze.isGoal(this.player.position) && this.isOpen()) {
      this.state = WIN;
    }
  }
}
