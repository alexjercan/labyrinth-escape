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
    this.image = new Image();
    this.image.src = src;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(context) {
    context.save();

    context.translate(this.x * this.width, this.y * this.height);

    context.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, this.width, this.height);

    context.restore();
  }
}

export class TextRenderer {
  constructor(text, fillStyle, font, x, y) {
    this.text = text;
    this.fillStyle = fillStyle;
    this.font = font;
    this.x = x;
    this.y = y;
  }

  draw(context) {
    context.font = this.font;
    context.fillStyle = this.fillStyle;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(this.text, this.x, this.y);
  }
}

export class ArrayRenderer {
  constructor(renderers) {
    this.renderers = renderers;
  }

  draw(context) {
    this.renderers.forEach((renderer) => renderer.draw(context));
  }
}
