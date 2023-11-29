// set up the canvas
const canvas = document.getElementById("game-board");
canvas.width = 450;
canvas.height = 300;
const ctx = canvas.getContext("2d");

// Object to track pressed keys
const pressedKeys = {};
const mouseInput = {};

// game variables
var isPlaying = false;
var numPlayers = 2;
var controls = [
  ["a", "w", "s", "d"],
  ["ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight"],
];

// Function to update the pressedKeys object when a key is pressed
function handleKeyDown(event) {
  pressedKeys[event.key] = true;
  console.log(mouseInput, pressedKeys);
}

// Function to update the pressedKeys object when a key is released
function handleKeyUp(event) {
  pressedKeys[event.key] = false;
  console.log(mouseInput, pressedKeys);
}

// Function to update the mouse position
function handleMouseMove(event) {
  mouseInput["x"] = event.clientX;
  mouseInput["y"] = event.clientY;
  console.log("Mouse Position:", "X:", mouseInput["x"], "Y:", mouseInput["y"]);
}
function handleCanvasClick(event) {
  isPlaying = !isPlaying;
}
// Event listeners for keydown and keyup events
canvas.addEventListener("click", handleCanvasClick);
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// this may need to be offset by the canvas position in the page
canvas.addEventListener("mousemove", handleMouseMove);

// generate maps functions for randomized maps
function createRandomMap(rows = 30, columns = 45, fillPercent = 0.1) {
  const mapArray = [];

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      if (Math.random() <= fillPercent) {
        row.push(10);
      } else {
        row.push(0);
      }
    }
    mapArray.push(row);
  }

  return mapArray;
}

// Create a 45 by 30 list for the map
const currentMap = createRandomMap();
console.log(currentMap);
// main menu function
function drawWalls(currentMap) {
  for (row = 0; row < currentMap.length; row++) {
    console.log(row);
    for (column = 0; column < currentMap[row].length; column++) {
      console.log(currentMap[row][column]);
      if (currentMap[row][column]) {
        ctx.fillRect(column * 10, row * 10, 10, 10);
      }
    }
  }
}
//

// game loop function once build map function is completed.
function gameLoop() {
  requestAnimationFrame(gameLoop); // Call the game loop recursively
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (isPlaying) {
    drawWalls(currentMap);
  } else {
    // Set text options
    ctx.font = "18px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const text = "Click to Play";
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    ctx.fillText(text, x, y);
  }
}

// Start the game loop
gameLoop();
