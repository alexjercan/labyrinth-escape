import { positionEq, path } from "./primMaze.js";

export class Enemy {
  constructor(renderer, position, targetPlayer, maze, speedMilliseconds = 100) {
    this.renderer = renderer;
    this.position = position;
    this.target = position;
    this.targetPlayer = targetPlayer;
    this.maze = maze;

    this.targetPosition = null;
    this.steps = [];

    this.animationMilliseconds = 0;
    this.speedMilliseconds = speedMilliseconds;
  }

  update(deltaTime) {
    if (
      this.targetPosition == null ||
      !positionEq(this.targetPosition, this.targetPlayer.position)
    ) {
      this.targetPosition = this.targetPlayer.target;
      this.steps = path(this.target, this.targetPosition, this.maze.cells);
    }

    this.animationMilliseconds -= deltaTime;

    if (this.animationMilliseconds <= 0) {
      this.animationMilliseconds = 0;

      this.position = this.target;

      if (this.steps.length > 0) {
        this.target = this.steps.shift();
        this.animationMilliseconds = this.speedMilliseconds;
      }
    } else {
      const { row, col } = this.position;
      const { row: rowT, col: colT } = this.target;

      const dx = rowT - row;
      const dy = colT - col;
      const f = 1 - this.animationMilliseconds / this.speedMilliseconds;
      this.position = { row: row + dx * f, col: col + dy * f };
    }
  }

  draw(context) {
    this.renderer.x = this.position.col;
    this.renderer.y = this.position.row;
    this.renderer.draw(context);
  }
}

function getRandom(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

export function generateEnemies(
  count,
  renderer,
  speedMilliseconds,
  player,
  maze
) {
  return getRandom(maze.cells, count).map(
    (position) => new Enemy(renderer, position, player, maze, speedMilliseconds)
  );
}
