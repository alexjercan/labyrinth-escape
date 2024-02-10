const defaultKeymap = {
  w: [1, 0],
  ArrowUp: [1, 0],
  a: [0, -1],
  ArrowLeft: [0, -1],
  s: [-1, 0],
  ArrowDown: [-1, 0],
  d: [0, 1],
  ArrowRight: [0, 1],
};

export class HumanInput {
  constructor(document, keyMap = defaultKeymap) {
    this.map = {};
    this.keyMap = keyMap;
    this.input = [0, 0];

    document.addEventListener("keydown", (event) => {
      this.map[event.key] = true;
    });

    document.addEventListener("keyup", (event) => {
      this.map[event.key] = false;
    });
  }

  getInput(map) {
    let input = [0, 0];

    for (const key in map) {
      if (this.map[key] && key in this.keyMap) {
        input = this.keyMap[key];
        break;
      }
    }

    return input;
  }

  waitInput() {
    return this.getInput(this.map);
  }
}
