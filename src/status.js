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

export class Status {
  constructor(maze, player, enemies) {
    this.maze = maze;
    this.player = player;
    this.enemies = enemies;

    this.state = RUNNING;
  }

  update(deltaTime) {
    if (
      this.maze.isTrapped(this.player.position) ||
      isEnemied(this.player, this.enemies)
    ) {
      this.state = LOSE;
    } else if (this.maze.isGoal(this.player.position)) {
      this.state = WIN;
    }
  }
}
