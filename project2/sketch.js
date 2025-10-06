let pixelSize = 10;
let patternSize = 30;
let yOffset = 0;
let xOffset = 0;
let bgYOffset = 0;
let bgXOffset = 0;
let colorGrid = [];
const IDLE_MS = 3000;      
let lastActivity = Date.now();
let saver = false;         
let saverEase = 0;         

function setup() {
  createCanvas(windowWidth, windowHeight);
  generateRandomColors();

  // user activity resets/exits
  const bump = () => { lastActivity = Date.now(); if (saver) setSaver(false); };
  window.addEventListener('mousemove', bump, { passive: true });
  window.addEventListener('mousedown', bump, { passive: true });
  window.addEventListener('keydown', bump);
  window.addEventListener('wheel', bump, { passive: true });
  window.addEventListener('touchstart', bump, { passive: true });
}


function draw() {
  // 3s idle
  if (Date.now() - lastActivity > IDLE_MS) setSaver(true);

  // idle and awake
  background(0);
  if (!saver) {            
    drawText();            
    return;                
  }

  // screensaver

  // background layer
  for (let y = 0; y < height + patternSize; y += patternSize) {
    for (let x = 0; x < width + patternSize; x += patternSize) {
      drawBackgroundViolet(
        x + (bgXOffset % patternSize),
        y + (bgYOffset % patternSize)
      );
    }
  }

  // foreground layer
  for (let y = 0; y < height + patternSize; y += patternSize) {
    for (let x = 0; x < width + patternSize; x += patternSize) {
      drawPattern(
        x - (xOffset % patternSize),
        y + (yOffset % patternSize),
        x, y
      );
    }
  }

  // movement
  yOffset -= 1;
  xOffset += 1;
  bgYOffset -= 0.5;
  bgXOffset -= 0.5;

  if (frameCount % 60 === 0) generateRandomColors();

  //overlay
  saverEase += (saver ? 1 : 0) - saverEase;   
  saverEase = constrain(saverEase, 0, 1);
  if (saverEase > 0.01) {
    noStroke();
    fill(0, 140 * saverEase);
    rect(0, 0, width, height);
  }
}


function drawText() {
  fill(255);
  rect(0, 0, width, 25);
  fill(0);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("3 seconds for screensaver", width / 2, 15);
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
  if (saver) {
    generateRandomColors();   
  } else {
    setSaver(true);           
  }
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
function setSaver(active) {
  saver = active;
  // toggle cursor hider
  document.body.classList.toggle('saver-active', saver);
}
