import { RectRenderer } from "./src/engine/renderer.js";
import { HumanInput } from "./src/engine/input.js";
import { primMaze, isContained } from "./src/primMaze.js";

// Constants about the world
const width = 47;
const height = 47;
const cellSize = 20;
const playerStepMilliseconds = 100;

// Scene Stuff
let context = null;
let cells = null;
let player = null;
let humanInput = null;
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

  cells = primMaze(width, height);

  player = {
    position: { row: Math.floor(height / 2), col: Math.floor(width / 2) },
    stepMilliseconds: 0,
  };

  humanInput = new HumanInput(document);

  prevTimestamp = timeStamp;

  window.requestAnimationFrame(loop);
}

function loop(timestamp) {
  const deltaTime = timestamp - prevTimestamp;
  prevTimestamp = timestamp;

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const contains = isContained({ row, col }, cells);
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
  const { row, col } = player.position;
  const cellRenderer = new RectRenderer(
    "#00ff00",
    cellSize / 2,
    cellSize / 2,
    cellSize,
    cellSize
  );
  context.translate(col * cellSize, row * cellSize);
  cellRenderer.draw(context);
  context.translate(-1 * col * cellSize, -1 * row * cellSize);

  // Input
  player.stepMilliseconds -= deltaTime;
  const [dx, dy] = humanInput.waitInput();
  const newPosition = { row: row - dx, col: col + dy };
  if (isContained(newPosition, cells) && player.stepMilliseconds <= 0) {
    player.stepMilliseconds = playerStepMilliseconds;
    player.position = newPosition;
  }

  window.requestAnimationFrame(loop);
}

window.onload = init;
