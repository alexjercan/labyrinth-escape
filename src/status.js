export const RUNNING = "running";
export const LOSE = "lose";
export const WIN = "win";

export class Status {
  constructor(maze, player) {
    this.maze = maze;
    this.player = player;

    this.state = RUNNING;
  }

  update(deltaTime) {
    if (this.maze.isTrapped(this.player.position)) {
      this.state = LOSE;
    } else if (this.maze.isGoal(this.player.position)) {
      this.state = WIN;
    }
  }
}
