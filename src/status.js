import { positionEq } from "./primMaze.js";

export const RUNNING = "running";
export const LOSE = "lose";
export const WIN = "win";
export const MENU = "menu";
export const RESTART = "restart";

function isEnemied(player, enemies) {
  for (let i = 0; i < enemies.length; i++) {
    if (positionEq(player.position, enemies[i].position)) {
      return true;
    }
  }

  return false;
}

export class Status {
  constructor(maze, player, enemies, keys) {
    this.maze = maze;
    this.player = player;
    this.enemies = enemies;
    this.keys = keys;
  }

  isOpen() {
    return this.keys.length == 0;
  }

  state() {
    if (
      this.maze.isTrapped(this.player.position) ||
      isEnemied(this.player, this.enemies)
    ) {
      return LOSE;
    }
    if (this.maze.isGoal(this.player.position) && this.isOpen()) {
      return WIN;
    }
    return RUNNING;
  }
}
