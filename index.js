import { RectRenderer } from "./src/engine/renderer.js";
import { HumanInput } from "./src/engine/input.js";
import { PrimMaze } from "./src/primMaze.js";
import { Player } from "./src/player.js";

// Constants about the world
const width = 47;
const height = 47;
const cellSize = 20;
const playerSpeedMilliseconds = 100;

// Scene Stuff
let context = null;
let maze = null;
let player = null;
let prevTimestamp = null;

function init({ timeStamp }) {
  const canvas = document.createElement("canvas");
  context = canvas.getContext("2d");

  canvas.id = "CursorLayer";
  canvas.width = width * cellSize;
  canvas.height = height * cellSize;
  canvas.style.zIndex = 8;
  canvas.style.position = "absolute";
  canvas.style.border = "1px solid";

  const gameDiv = document.getElementById("game");
  gameDiv.appendChild(canvas);

  // Create maze
  maze = new PrimMaze(width, height);

  // Create player
  const playerRenderer = new RectRenderer(
    "#00ff00",
    cellSize / 2,
    cellSize / 2,
    cellSize,
    cellSize
  );
  const humanInput = new HumanInput(document);
  player = new Player(
    { row: Math.floor(height / 2), col: Math.floor(width / 2) },
    playerRenderer,
    humanInput,
    maze,
    playerSpeedMilliseconds
  );

  prevTimestamp = timeStamp;

  window.requestAnimationFrame(loop);
}

function loop(timestamp) {
  const deltaTime = timestamp - prevTimestamp;
  prevTimestamp = timestamp;

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const contains = maze.contains({ row, col });
      const color = contains ? "#808080" : "#000000";
      const cellRenderer = new RectRenderer(
        color,
        cellSize / 2,
        cellSize / 2,
        cellSize,
        cellSize
      );

      context.translate(col * cellSize, row * cellSize);
      cellRenderer.draw(context);
      context.translate(-1 * col * cellSize, -1 * row * cellSize);
    }
  }

  // Draw Player
  const cellRenderer = player.renderer;
  const { row, col } = player.position;
  context.translate(col * cellSize, row * cellSize);
  cellRenderer.draw(context);
  context.translate(-1 * col * cellSize, -1 * row * cellSize);

  // Move Player
  player.update(deltaTime);

  window.requestAnimationFrame(loop);
}

window.onload = init;
