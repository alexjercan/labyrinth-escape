export class Door {
  constructor(position, rendererOpen, rendererClosed, keys) {
    this.rendererOpen = rendererOpen;
    this.rendererClosed = rendererClosed;
    this.position = position;

    this.keys = keys;
  }

  isOpen() {
    return this.keys.length == 0;
  }

  draw(context) {
    const renderer = this.isOpen() ? this.rendererOpen : this.rendererClosed;
    renderer.x = this.position.col;
    renderer.y = this.position.row;
    renderer.draw(context);
  }
}
