function neighbors({ row, col }) {
  return [
    { row: row + 1, col },
    { row: row - 1, col },
    { row, col: col + 1 },
    { row, col: col - 1 },
  ];
}

function isValid({ row, col }, width, height) {
  return 0 < row && row < height - 1 && 0 < col && col < width - 1;
}

export function isContained(point, cells) {
  return (
    cells.filter(({ row, col }) => point.row == row && point.col == col)
      .length != 0
  );
}

function canRemoveWall(wall, cells) {
  return (
    neighbors(wall).reduce(
      (sum, nwall) => sum + isContained(nwall, cells),
      0
    ) == 1
  );
}

export function primMaze(width, height) {
  let start = { row: 0, col: Math.floor(width / 2) };
  let center = { row: Math.floor(height / 2), col: Math.floor(width / 2) };
  let cells = [start, center];

  let walls = [];
  neighbors(start)
    .filter((point) => isValid(point, width, height))
    .forEach((point) => walls.push(point));

  while (walls.length != 0) {
    const index = Math.floor(Math.random() * walls.length);
    const wall = walls[index];

    if (canRemoveWall(wall, cells) || isContained(center, neighbors(wall))) {
      cells.push(wall);
      neighbors(wall)
        .filter(
          (point) =>
            isValid(point, width, height) &&
            !isContained(point, cells) &&
            !isContained(point, walls)
        )
        .forEach((point) => walls.push(point));
    }

    walls.splice(index, 1);
  }

  return cells;
}
