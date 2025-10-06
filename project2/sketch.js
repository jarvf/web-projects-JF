let pixelSize = 10;
let patternSize = 30;
let yOffset = 0;
let xOffset = 0;
let bgYOffset = 0;
let bgXOffset = 0;
let colorGrid = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  generateRandomColors();
}

function draw() {
  background(0);

  //background
  for (let y = 0; y < height + patternSize; y += patternSize) {
    for (let x = 0; x < width + patternSize; x += patternSize) {
      drawBackgroundViolet(
        x + (bgXOffset % patternSize),
        y + (bgYOffset % patternSize)
      );
    }
  }

  //foreground
  for (let y = 0; y < height + patternSize; y += patternSize) {
    for (let x = 0; x < width + patternSize; x += patternSize) {
      drawPattern(
        x - (xOffset % patternSize),
        y + (yOffset % patternSize),
        x,
        y
      );
    }
  }

  //movespeed
  yOffset -= 1;
  xOffset += 1;
  bgYOffset -= 0.5;
  bgXOffset -= 0.5;

  if (frameCount % 60 === 0) {
    generateRandomColors();
  }

  drawText();
}

function drawText() {
  fill(255);
  rect(0, 0, width, 25);
  fill(0);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("Click to change colors", width / 2, 15);
}

// color generator
function generateRandomColors() {
  colorGrid = [];
  for (let i = 0; i < 1000; i++) {
    colorGrid.push(color(random(50, 200), random(50, 200), random(150, 255)));
  }
}

//click for new colors too
function mousePressed() {
  generateRandomColors();
}

// slow background layer for effect
function drawBackgroundViolet(startX, startY) {
  let violetColor = color(138, 43, 226); 
  drawPixel(startX, startY - 10, pixelSize, violetColor);
  drawPixel(startX + 20, startY - 10, pixelSize, violetColor);
  drawPixel(startX, startY + 10, pixelSize, violetColor);
  drawPixel(startX + 20, startY + 10, pixelSize, violetColor);
}

function drawPattern(startX, startY, gridX, gridY) {
  let index = Math.abs(Math.floor(gridX / 30) + Math.floor(gridY / 30));
  let store = index % colorGrid.length;
  let randColor = colorGrid[store];

  drawPixel(startX + 10, startY, pixelSize, randColor);
  drawPixel(startX, startY, pixelSize, randColor);
  drawPixel(startX + 20, startY, pixelSize, randColor);
  drawPixel(startX + 10, startY - 10, pixelSize, randColor);
  drawPixel(startX + 10, startY + 10, pixelSize, randColor);
}

// pixel
function drawPixel(x, y, size, col) {
  fill(col);
  noStroke();
  rect(x, y, size, size);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateRandomColors();
}
