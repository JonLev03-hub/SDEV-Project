// set up the canvas
const canvas = document.getElementById("game-board");
canvas.width = 600;
canvas.height = 300;
const ctx = canvas.getContext("2d");

// Object to track pressed keys
const pressedKeys = {};
const mouseInput = {};

// game variables

// Function to update the pressedKeys object when a key is pressed
function handleKeyDown(event) {
  pressedKeys[event.key] = true;
  // console.log(mouseInput, pressedKeys);
}

// Function to update the pressedKeys object when a key is released
function handleKeyUp(event) {
  pressedKeys[event.key] = false;
  //console.log(mouseInput, pressedKeys);
}

// Function to update the mouse position
function handleMouseMove(event) {
  mouseInput["x"] = event.clientX;
  mouseInput["y"] = event.clientY;
  //console.log("Mouse Position:", "X:", mouseInput["x"], "Y:", mouseInput["y"]);
}

// Event listeners for keydown and keyup events

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// this may need to be offset by the canvas position in the page
canvas.addEventListener("mousemove", handleMouseMove);

// generate maps functions for randomized maps
function createRandomMap(
  rows = canvas.height / 10,
  columns = canvas.width / 10,
  fillPercent = 0.05
) {
  const mapArray = [];
  mapArray.push(Array(columns).fill(10));
  for (let i = 0; i < rows - 2; i++) {
    const row = [10];
    for (let j = 0; j < columns - 2; j++) {
      if (Math.random() <= fillPercent) {
        row.push(10);
      } else {
        row.push(0);
      }
    }
    row.push(10);
    mapArray.push(row);
  }
  mapArray.push(Array(columns).fill(10));

  return mapArray;
}

// main menu function
function drawWalls(currentMap) {
  for (row = 0; row < currentMap.length; row++) {
    for (column = 0; column < currentMap[row].length; column++) {
      if (currentMap[row][column]) {
        ctx.fillStyle = "black";

        ctx.fillRect(column * 10, row * 10, 10, 10);
      }
    }
  }
}
class Tank {
  constructor(x, y, rotation) {
    // [this.x, this.y] = [15, 15];
    [this.x, this.y] = this.getSpawnLocation();
    this.rotation = rotation || 0;
    this.bullets = [];
    console.log(this.x, this.y);
    this.img = tankImage1;
    this.width = 8;
    this.height = 10;
    this.radius = 5;
    this.color = "red";
  }
  getSpawnLocation() {
    let x = Math.floor(((canvas.width - 20) * Math.random()) / 10) * 10 + 5;
    let y = Math.floor(((canvas.height - 20) * Math.random()) / 10) * 10 + 5;
    if (currentMap[Math.floor(y / 10)][Math.floor(x / 10)]) {
      [x, y] = this.getSpawnLocation();
    }
    return [x, y];
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fillStyle = "grey";
    ctx.fillRect(-2, -this.height / 2, 4, this.height / 4);
    ctx.fillRect(-2, this.height / 4, 4, this.height / 4);
    // ctx.arc(0, 0, 4, 0, 2 * Math.PI);
    // ctx.fill(); // Draw the circle outline
    ctx.fillStyle = this.color;
    ctx.fillRect(-1, -8, 2, 8);
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, 2 * Math.PI);
    ctx.fill(); // Draw the circle outline
    ctx.closePath();
    // this draws a 5px radius hitbox
    ctx.arc(0, 0, 5, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "black";
  }
}
// code to start a round
function startRound() {
  //remove start screen
  var startScreen = document.getElementById("startScreen");
  startScreen.classList.add("noDisplay");

  // generate new map
  currentMap = createRandomMap();

  // create tanks
  p1 = new Tank();
  p2 = new Tank();
}

// game loop function once build map function is completed.
currentMap = createRandomMap();
var p1 = new Tank();
var p2 = new Tank();
var tankImage1 = new Image();
tankImage1.src = "assets/Images/Tank_Big_Yellow_128x194.png";
function gameLoop() {
  requestAnimationFrame(gameLoop); // Call the game loop recursively
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWalls(currentMap);
  p1.draw();
  p2.draw();
  // p1.x += 1;
}

// Start the game loop
gameLoop();
