// set up the canvas
const canvas = document.getElementById("game-board");
canvas.width = 600;
canvas.height = 300;
const ctx = canvas.getContext("2d");

var color1 = "red";
var color2 = "blue";

function updateSelectedColor(option) {
  return function () {
    // Get the selected radio button
    var selectedRadioButton = document.querySelector(
      `input[name="colorOption${option}"]:checked`
    );

    if (selectedRadioButton) {
      window[`color${option}`] = selectedRadioButton.value;
      console.log(`Selected Color Option ${option}:`, window[`color${option}`]);
    }
  };
}

// Attach the function to the click event of the radio buttons for each option
for (let i = 1; i <= 2; i++) {
  var radioButtons = document.querySelectorAll(`input[name="colorOption${i}"]`);
  radioButtons.forEach(function (radioButton) {
    radioButton.addEventListener("click", updateSelectedColor(i));
  });
}

// Object to track pressed keys
const pressedKeys = new Set();
const mouseInput = {};
var playing = false;
// game variables
var bulletSound = new Audio("assets/sounds/bullet2.wav");
var explosionSound = new Audio("assets/sounds/explosion.wav");
bulletSound.volume = 0.2;
explosionSound.volume = 0.5;
var p1_score_card = document.getElementById("p1-points");
var p2_score_card = document.getElementById("p2-points");
var p1_score = 0;
var p2_score = 0;

function Distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  return Math.sqrt(dx * dx + dy * dy);
}
function pause() {
  playing = false;
  // do pause screen
}
function resume() {
  playing = true;
  // do remove pause screen
}
// Function to update the pressedKeys object when a key is pressed
function handleKeyDown(event) {
  pressedKeys.add(event.key);
  // check for on click tasks
  switch (event.key) {
    case ",":
      p2_score += 5;
      p2_score_card.innerHTML = p2_score;
      p2.shoot();
      break;
    case " ":
      p1_score += 5;
      p1_score_card.innerHTML = p1_score;
      p1.shoot();
      break;
  }
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
class Bullet {
  constructor(x, y, rotation) {
    this.width = 2;
    this.x = x - this.width / 2;
    this.y = y - this.width / 2;
    this.damage = 1;
    this.rotation = rotation;
    this.speed = 2;
  }
  insideWall() {
    if (currentMap[Math.floor(this.y / 10)][Math.floor(this.x / 10)]) {
      return true;
    }
    return false;
  }
  move() {
    var vx = this.speed * Math.cos(this.rotation + Math.PI / 2);
    var vy = this.speed * Math.sin(this.rotation + Math.PI / 2);
    this.x -= vx;
    this.y -= vy;
  }
  draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, 3, 3);
    console.log(this.x, this.y);
  }
  explode(target = null) {
    if (target) {
      target.damage();
      explosionSound.currentTime = 0;
      explosionSound.play();
    }
    console.log("boom");
  }
}

class Tank {
  constructor(color) {
    // [this.x, this.y] = [15, 15];
    [this.x, this.y] = this.getSpawnLocation();
    this.rotation = 0;
    this.bullets = [];
    console.log(this.x, this.y);
    this.img = tankImage1;
    this.width = 8;
    this.height = 10;
    this.radius = 5;
    this.color = color;
    this.rotationSpeed = (2 * Math.PI) / 60;
    console.log(this.rotationSpeed);
    this.speed = 1;
    this.maxBullets = 10;
    this.health = 2;
    console.log(color);
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
    // draw all of the bullets
    this.bullets.forEach((bullet) => {
      bullet.draw();
    });
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
    if (direction == "left") {
      this.rotation -= this.rotationSpeed;
    } else if (direction == "right") {
      this.rotation += this.rotationSpeed;
    }
  }
  drive(direction) {
    var vx = this.speed * Math.cos(this.rotation + Math.PI / 2);
    var vy = this.speed * Math.sin(this.rotation + Math.PI / 2);
    if (direction == "forward") {
      this.x -= vx;
      if (this.insideWall()) {
        this.x += vx;
      }
      this.y -= vy;

      if (this.insideWall()) {
        this.y += vy;
      }
    } else if (direction == "backward") {
      this.x += vx;
      if (this.insideWall()) {
        this.x -= vx;
      }
      this.y += vy;

      if (this.insideWall()) {
        this.y -= vy;
      }
    }
  }
  insideWall(x = this.x, y = this.y) {
    var corners = [
      [this.x + (this.width - 1) / 2, this.y + (this.height - 1) / 2],
      [this.x - (this.width - 1) / 2, this.y - (this.height - 1) / 2],
      [this.x + (this.width - 1) / 2, this.y - (this.height - 1) / 2],
      [this.x - (this.width - 1) / 2, this.y + (this.height - 1) / 2],
    ];
    var result = false;
    corners.forEach((corner) => {
      if (currentMap[Math.floor(corner[1] / 10)][Math.floor(corner[0] / 10)]) {
        console.log("collision");
        result = true;
        return;
      }
    });
    return result;
  }
  shoot() {
    if (this.bullets.length < this.maxBullets) {
      bulletSound.currentTime = 0;
      bulletSound.play();
      this.bullets.push(new Bullet(this.x, this.y, this.rotation));
    }
  }
  damage(damage = 1) {
    this.health -= damage;
    if (this.health <= 0) {
      playing = false;
      this.color = "transparent";
      setTimeout(startRound, 3000);
    }
  }
}
// code to start a round
function startRound() {
  //remove start screen
  var startScreen = document.getElementById("startScreen");
  startScreen.classList.add("noDisplay");

  var p1Name = document.getElementById("player1nameinput");
  var p2Name = document.getElementById("player2nameinput");

  // Get the span element by its ID
  var p1namecard = document.getElementById("p1name");
  var p2namecard = document.getElementById("p2name");

  // Update the span text content with the input value
  console.log(p1Name, p2Name);
  if (p1Name.value) {
    p1namecard.innerText = p1Name.value;
  }
  if (p2Name.value) {
    p2namecard.innerText = p2Name.value;
  }

  // generate new map
  currentMap = createRandomMap();

  // create tanks
  p1 = new Tank(color1);
  p2 = new Tank(color2);

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

    p1.bullets.forEach((bullet) => {
      bullet.move();
    });
    p1.bullets = p1.bullets.filter((bullet) => {
      if (bullet.insideWall()) {
        bullet.explode();
        return false;
      }
      if (
        Distance(p2.x, p2.y, bullet.x, bullet.y) <
        (p1.width + p1.height) / 4
      ) {
        p1_score += 500;
        p1_score_card.innerHTML = p1_score;
        bullet.explode(p2);
        return false;
      }
      return true; // Include bullets that don't meet the explosion conditions
    });
    p2.bullets.forEach((bullet) => {
      bullet.move();
    });
    p2.bullets = p2.bullets.filter((bullet) => {
      if (bullet.insideWall()) {
        bullet.explode();
        return false;
      }
      if (
        Distance(p1.x, p1.y, bullet.x, bullet.y) <
        (p1.width + p1.height) / 4
      ) {
        p2_score += 500;
        p2_score_card.innerHTML = p2_score;
        bullet.explode(p1);
        return false;
      }
      return true;
    });

    // draw all objects
  }
  p2.draw();
  p1.draw();
  // p1.x += 1;
}

// Start the game loop
gameLoop();
