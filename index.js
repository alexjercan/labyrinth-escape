import {
  RectRenderer,
  ImageRenderer,
  TextRenderer,
} from "./src/engine/renderer.js";
import { HumanInput } from "./src/engine/input.js";
import { PrimMaze } from "./src/primMaze.js";
import { Player } from "./src/player.js";
import { generateEnemies } from "./src/enemy.js";
import { Door } from "./src/door.js";
import { generateKeys } from "./src/key.js";
import { Status, WIN, LOSE, RUNNING } from "./src/status.js";
import { ScoreUI } from "./src/scoreUI.js";

// Constants about the world
const width = 31;
const height = 31;
const padding = { col: 5, row: 3 };
const cellSize = 128;
const trapPercent = 0.1;
const playerSpeedMilliseconds = 500;
const enemySpeedMilliseconds = 1000;
const trapSpeedMilliseconds = 2000;
const numberEnemies = Math.floor(width / 10);
const numberKeys = Math.floor(width / 5);
const canvasWidth = (padding.col * 2 + 1) * cellSize;
const canvasHeight = (padding.row * 2 + 1) * cellSize;

// Scene Stuff
let context = null;
let maze = null;
let player = null;
let prevTimestamp = null;
let status = null;
let enemies = null;
let keys = null;
let door = null;
let scoreUI = null;

function pre() {
  const canvas = document.createElement("canvas");
  context = canvas.getContext("2d");

  canvas.id = "CursorLayer";
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
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

  // Create Keys and Door
  const keyRenderer = new ImageRenderer(
    "assets/key.png",
    0,
    0,
    cellSize,
    cellSize
  );
  keys = generateKeys(numberKeys, keyRenderer, maze);

  const openDoorRenderer = new ImageRenderer(
    "assets/openDoor.png",
    0,
    0,
    cellSize,
    cellSize
  );
  const closedDoorRenderer = new ImageRenderer(
    "assets/closedDoor.png",
    0,
    0,
    cellSize,
    cellSize
  );
  door = new Door(maze.goal, openDoorRenderer, closedDoorRenderer, keys);

  // Create Score UI
  const scoreKeyRenderer = new ImageRenderer(
    "assets/key.png",
    1,
    0,
    cellSize,
    cellSize
  );
  const scoreTextRenderer = new TextRenderer(
    "",
    "white",
    `${Math.floor(cellSize / 2)}px Arial`,
    Math.floor(cellSize / 2),
    Math.floor(cellSize / 2)
  );
  scoreUI = new ScoreUI(keys, scoreKeyRenderer, scoreTextRenderer);

  // Create Status
  status = new Status(maze, player, enemies, keys);

  prevTimestamp = timestamp;

  window.requestAnimationFrame(loop);
}

function loop(timestamp) {
  const deltaTime = timestamp - prevTimestamp;
  prevTimestamp = timestamp;

  // Drawing
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  let centerX = (padding.col + 0.5) * cellSize;
  let centerY = (padding.row + 0.5) * cellSize;

  const gradient = context.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    centerX
  );
  gradient.addColorStop(0, "#181818");
  gradient.addColorStop(0.5, "#181818");
  gradient.addColorStop(1, "#000000");

  // Draw the rectangle
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  let dx =
    player.position.col < padding.col
      ? (player.position.col + 0.5) * cellSize
      : player.position.col > width - padding.col
      ? (padding.col * 2 - (width - player.position.col) + 0.5) * cellSize
      : centerX;
  let dy =
    player.position.row < padding.row
      ? (player.position.row + 0.5) * cellSize
      : player.position.row > height - padding.row
      ? (padding.row * 2 - (height - player.position.row) + 0.5) * cellSize
      : centerY;

  scoreUI.draw(context);

  context.save();

  // Create a clipping path in the shape of a circle
  context.beginPath();
  context.arc(dx, dy, centerY * 0.75, 0, 2 * Math.PI);
  context.closePath();
  context.clip();

  // Camera
  let x =
    player.position.col < padding.col
      ? 0
      : player.position.col > width - padding.col
      ? width - 2 * padding.col
      : player.position.col - padding.col;

  let y =
    player.position.row < padding.row
      ? 0
      : player.position.row > height - padding.row
      ? height - 2 * padding.row
      : player.position.row - padding.row;
  context.translate(-1 * x * cellSize, -1 * y * cellSize);

  maze.draw(context);
  door.draw(context);
  player.draw(context);
  enemies.forEach((enemy) => enemy.draw(context));
  keys.forEach((key) => key.draw(context));

  context.restore();

  // Because of clip LMAO this is scuffed
  scoreUI.draw(context);

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
