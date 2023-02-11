export class RectRenderer {
    constructor(fillStyle, x, y, width, height) {
        this.fillStyle = fillStyle;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(context) {
        context.translate(-1 * this.width / 2, -1 * this.height / 2);

        context.lineWidth = 1;
        context.lineCap = "butt";
        context.strokeStyle = "black";
        context.strokeRect(this.x, this.y, this.width, this.height);

        context.fillStyle = this.fillStyle;
        context.fillRect(this.x, this.y, this.width, this.height);

        context.translate(this.width / 2, this.height / 2);
    }
}
