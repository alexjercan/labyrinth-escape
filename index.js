import { RectRenderer } from "./src/engine/renderer.js";
import { primMaze } from "./src/primMaze.js";

const width = 23;
const height = 23;
const cellSize = 20;

const canvas = document.createElement('canvas');
canvas.id     = "CursorLayer";
canvas.width  = width * cellSize;
canvas.height = height * cellSize;
canvas.style.zIndex   = 8;
canvas.style.position = "absolute";
canvas.style.border   = "1px solid";

const gameDiv = document.getElementById("game");
gameDiv.appendChild(canvas);

const context = canvas.getContext('2d');
const cells = primMaze(width, height);
for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
        const contains = cells.filter((point) => point.row == row && point.col == col).length != 0;
        const color = contains ? "#808080" : "#000000";
        const cellRenderer = new RectRenderer(color, cellSize / 2, cellSize / 2, cellSize, cellSize);

        context.translate(col * cellSize, row * cellSize);
        cellRenderer.draw(context);
        context.translate(-1 * col * cellSize, -1 * row * cellSize);
    }
}
