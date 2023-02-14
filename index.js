import { RectRenderer } from "./src/engine/renderer.js";
import { HumanInput } from "./src/engine/input.js";
import { PrimMaze } from "./src/primMaze.js";
import { Player } from "./src/player.js";
import { Enemy, generateEnemies } from "./src/enemy.js";
import { Status, WIN, LOSE, RUNNING } from "./src/status.js";

// Constants about the world
const width = 47;
const height = 47;
const cellSize = 20;
const trapPercent = 0.1;
const playerSpeedMilliseconds = 100;
const enemySpeedMilliseconds = 500;
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
  canvas.width = width * cellSize;
  canvas.height = height * cellSize;
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
  const cellRenderer = new RectRenderer("#808080", 0, 0, cellSize, cellSize);
  const trapActiveRenderer = new RectRenderer(
    "#ff0000",
    0,
    0,
    cellSize,
    cellSize
  );
  const trapInactiveRenderer = new RectRenderer(
    "#0000ff",
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
  const playerRenderer = new RectRenderer("#00ff00", 0, 0, cellSize, cellSize);
  const humanInput = new HumanInput(document);
  player = new Player(
    { row: Math.floor(height / 2), col: Math.floor(width / 2) },
    playerRenderer,
    humanInput,
    maze,
    playerSpeedMilliseconds
  );

  // Create Status
  status = new Status(maze, player);

  // Create Enemies
  const enemyRenderer = new RectRenderer("#ffff00", 0, 0, cellSize, cellSize);
  enemies = generateEnemies(
    numberEnemies,
    enemyRenderer,
    enemySpeedMilliseconds,
    player,
    maze
  );

  prevTimestamp = timestamp;

  window.requestAnimationFrame(loop);
}

function loop(timestamp) {
  const deltaTime = timestamp - prevTimestamp;
  prevTimestamp = timestamp;

  // Draw
  maze.draw(context);
  player.draw(context);
  enemies.forEach((enemy) => enemy.draw(context));

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
