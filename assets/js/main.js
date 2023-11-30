// set up the canvas
const canvas = document.getElementById("game-board");
canvas.width = 600;
canvas.height = 300;
const ctx = canvas.getContext("2d");

// Object to track pressed keys
const pressedKeys = new Set();
const mouseInput = {};
var playing = false;
// game variables

// Function to update the pressedKeys object when a key is pressed
function handleKeyDown(event) {
  pressedKeys.add(event.key);
  // console.log(mouseInput, pressedKeys);
}

// Function to update the pressedKeys object when a key is released
function handleKeyUp(event) {
  pressedKeys.delete(event.key);
  // pressedKeys[event.key] = false;
  // console.log(mouseInput, pressedKeys);
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
function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
class Tank {
  constructor() {
    // [this.x, this.y] = [15, 15];
    [this.x, this.y] = this.getSpawnLocation();
    this.rotation = 0;
    this.bullets = [];
    console.log(this.x, this.y);
    this.img = tankImage1;
    this.width = 8;
    this.height = 10;
    this.radius = 5;
    this.color = "red";
    this.rotationSpeed = (2 * Math.PI) / 60;
    console.log(this.rotationSpeed);
    this.speed = 1;
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
    // ctx.arc(0, 0, 5, 0, 2 * Math.PI);
    // ctx.stroke();

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "black";
  }

  rotate(direction) {
    console.log(direction, this.rotation);
    if (direction == "left") {
      this.rotation -= this.rotationSpeed;
    } else if (direction == "right") {
      this.rotation += this.rotationSpeed;
    }
  }
  drive(direction) {
    var vx = this.speed * Math.cos(this.rotation + Math.PI / 2);
    var vy = this.speed * Math.sin(this.rotation + Math.PI / 2);
    let testx = 0;
    let testy = 0;
    if (direction == "forward") {
      testx = this.x - vx;
      testy = this.y - vy;
    } else if (direction == "backward") {
      testx = this.x + vx;
      testy = this.y + vy;
    }
    console.log(Math.round(this.y / 10), Math.round(testx / 10));
    let isWall = currentMap[Math.round(this.y / 10)][Math.round(this.x / 10)];
    let distanceToWall = calculateDistance(
      Math.round(this.y / 10),
      Math.round(this.x / 10),
      this.x,
      this.y
    );
    let distanceToCorner = Math.sqrt(
      (this.width / 2) ** 2 + (this.height / 2) ** 2
    );
    console.log(distanceToCorner, distanceToWall);
    if (!isWall || distanceToWall > distanceToCorner) {
      this.x = testx;
    }
    if (!currentMap[Math.round(testy / 10)][Math.round(this.x / 10)]) {
      this.y = testy;
    }
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

  playing = true;
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

  if (playing) {
    // tasks to do for the game running here

    // update all objects

    // check for any player inputs
    pressedKeys.forEach((key) => {
      console.log(key);
      switch (key) {
        // rotation
        case "a":
          p1.rotate("left");
          break;
        case "d":
          p1.rotate("right");
          break;
        case "ArrowLeft":
          p2.rotate("left");
          break;
        case "ArrowRight":
          p2.rotate("right");
          break;
        // drive
        case "w":
          p1.drive("forward");
          break;
        case "s":
          p1.drive("backward");
          break;
        case "ArrowUp":
          p2.drive("forward");
          break;
        case "ArrowDown":
          p2.drive("backward");
          break;
      }
    });
    // draw all objects
    p1.draw();
    p2.draw();
  }
  // p1.x += 1;
}

// Start the game loop
gameLoop();
