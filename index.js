import { RectRenderer, ImageRenderer } from "./src/engine/renderer.js";
import { HumanInput } from "./src/engine/input.js";
import { PrimMaze } from "./src/primMaze.js";
import { Player } from "./src/player.js";
import { generateEnemies } from "./src/enemy.js";
import { Status, WIN, LOSE, RUNNING } from "./src/status.js";

// Constants about the world
const width = 47;
const height = 47;
const padding = { col: 7, row: 3 };
const cellSize = 128;
const trapPercent = 0.1;
const playerSpeedMilliseconds = 500;
const enemySpeedMilliseconds = 1000;
const trapSpeedMilliseconds = 2000;
const numberEnemies = 3;

// Scene Stuff
let context = null;
let maze = null;
let player = null;
let prevTimestamp = null;
let status = null;
let enemies = null;

function pre() {
  const canvas = document.createElement("canvas");
  context = canvas.getContext("2d");

  canvas.id = "CursorLayer";
  canvas.width = (padding.col * 2 + 1) * cellSize;
  canvas.height = (padding.row * 2 + 1) * cellSize;
  canvas.style.zIndex = 8;
  canvas.style.position = "absolute";
  canvas.style.border = "1px solid";

  const gameDiv = document.getElementById("game");
  gameDiv.appendChild(canvas);

  window.requestAnimationFrame(init);
}

function init(timestamp) {
  // Create maze
  const wallRenderer = new RectRenderer("#000000", 0, 0, cellSize, cellSize);
  const cellRenderer = new ImageRenderer(
    "assets/floor.png",
    0,
    0,
    cellSize,
    cellSize
  );
  const trapActiveRenderer = new ImageRenderer(
    "assets/spikesActive.png",
    0,
    0,
    cellSize,
    cellSize
  );
  const trapInactiveRenderer = new ImageRenderer(
    "assets/spikesInactive.png",
    0,
    0,
    cellSize,
    cellSize
  );
  maze = new PrimMaze(
    width,
    height,
    wallRenderer,
    cellRenderer,
    trapPercent,
    trapActiveRenderer,
    trapInactiveRenderer,
    trapSpeedMilliseconds
  );

  // Create player
  const playerRenderer = new ImageRenderer(
    "assets/player.png",
    0,
    0,
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

  // Create Enemies
  const enemyRenderer = new ImageRenderer(
    "assets/enemy.png",
    0,
    0,
    cellSize,
    cellSize
  );
  enemies = generateEnemies(
    numberEnemies,
    enemyRenderer,
    enemySpeedMilliseconds,
    player,
    maze
  );

  // Create Status
  status = new Status(maze, player, enemies);

  prevTimestamp = timestamp;

  window.requestAnimationFrame(loop);
}

function loop(timestamp) {
  const deltaTime = timestamp - prevTimestamp;
  prevTimestamp = timestamp;

  // Draw the rectangle
  context.fillStyle = "black";
  context.fillRect(0, 0, width * cellSize, height * cellSize);

  // Create a clipping path in the shape of a circle
  context.beginPath();
  context.arc(
    (padding.col + 0.5) * cellSize,
    (padding.row + 0.5) * cellSize,
    (padding.row + 0.5) * cellSize,
    0,
    2 * Math.PI
  );
  context.clip();

  // Draw
  context.save();

  let x =
    player.position.col > padding.col &&
    player.position.col < width - padding.col
      ? player.position.col - padding.col
      : 0;
  let y =
    player.position.row > padding.row &&
    player.position.row < height - padding.row
      ? player.position.row - padding.row
      : 0;

  context.translate(-1 * x * cellSize, -1 * y * cellSize);
  maze.draw(context);
  player.draw(context);
  enemies.forEach((enemy) => enemy.draw(context));

  context.restore();

  // Update
  maze.update(deltaTime);
  player.update(deltaTime);
  enemies.forEach((enemy) => enemy.update(deltaTime));
  status.update(deltaTime);

  // Manage state
  const state = status.state;
  switch (state) {
    case WIN:
      console.log("WIN");
      window.requestAnimationFrame(init);
      break;
    case LOSE:
      console.log("LOST");
      window.requestAnimationFrame(init);
      break;
    case RUNNING:
      window.requestAnimationFrame(loop);
      break;
    default:
      throw new Error(`Uknown state ${state}`);
  }
}

window.onload = pre;
