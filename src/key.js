export class Key {
  constructor(renderer, position) {
    this.renderer = renderer;
    this.position = position;
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

export function generateKeys(count, renderer, maze) {
  return getRandom(maze.cells, count).map(
    (position) => new Key(renderer, position)
  );
}
