export class Player {
  constructor(position, renderer, input, maze, speedMilliseconds = 100) {
    this.renderer = renderer;
    this.input = input;

    this.maze = maze;

    this.position = position;
    this.target = position;

    this.animationMilliseconds = 0;
    this.speedMilliseconds = speedMilliseconds;
  }

  update(deltaTime) {
    const [dx, dy] = this.input.waitInput();
    this.animationMilliseconds -= deltaTime;

    if (this.animationMilliseconds <= 0) {
      this.animationMilliseconds = 0;

      this.position = this.target;

      const { row, col } = this.position;
      const target = { row: row - dx, col: col + dy };

      if (this.maze.contains(target)) {
        this.target = target;
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
}
