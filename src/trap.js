export class Trap {
  constructor(
    position,
    rendererActive,
    rendererInactive,
    speedMilliseconds = 100
  ) {
    this.rendererActive = rendererActive;
    this.rendererInactive = rendererInactive;
    this.position = position;

    this.active = false;
    this.animationMilliseconds = Math.random() * speedMilliseconds;
    this.speedMilliseconds = speedMilliseconds;
  }

  update(deltaTime) {
    this.animationMilliseconds -= deltaTime;

    if (this.animationMilliseconds <= 0) {
      this.animationMilliseconds = this.speedMilliseconds;

      this.active = !this.active;
    }
  }

  draw(context) {
    const renderer = this.active ? this.rendererActive : this.rendererInactive;
    renderer.x = this.position.col;
    renderer.y = this.position.row;
    renderer.draw(context);
  }
}
