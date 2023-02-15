export class RectRenderer {
  constructor(fillStyle, x, y, width, height) {
    this.fillStyle = fillStyle;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(context) {
    context.save();

    context.scale(this.width, this.height);
    context.translate(this.x, this.y);

    context.lineWidth = 1 / this.width;
    context.lineCap = "butt";
    context.strokeStyle = "black";
    context.strokeRect(0, 0, 1, 1);

    context.fillStyle = this.fillStyle;
    context.fillRect(0, 0, 1, 1);

    context.restore();
  }
}

export class ImageRenderer {
  constructor(src, x, y, width, height) {
    this.image = new Image(width, height);
    this.image.src = src;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(context) {
    context.save();

    context.translate(this.x * this.width, this.y * this.height);

    context.drawImage(this.image, 0, 0);

    context.restore();
  }
}
