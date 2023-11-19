// set up the canvas
const canvas = document.getElementById("game-board");
canvas.width = 450;
canvas.height = 300;
const ctx = canvas.getContext("2d");

// Object to track pressed keys
const pressedKeys = {};
const mouseInput = {};

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

// Event listeners for keydown and keyup events
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// this may need to be offset by the canvas position in the page
canvas.addEventListener("mousemove", handleMouseMove);

// generate maps functions for randomized maps
function createRandomMap(rows = 30, columns = 45, fillPercent = 0.05) {
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
const currentMap = createRandomMap(45, 30);
console.log(currentMap);
// main menu function

//

// game loop function once build map function is completed.
