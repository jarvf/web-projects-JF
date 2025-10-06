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
let flakes = [];
const GLITTER_COUNT = 1000;   
let lightT = 0;      
function setup() {
  createCanvas(windowWidth, windowHeight);
  generateRandomColors();
  initGlitter();                    

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

  if (saver && frameCount % (60 * 5) === 0) generateRandomColors();


  //overlay
  saverEase += (saver ? 1 : 0) - saverEase;   
  saverEase = constrain(saverEase, 0, 1);
  if (saverEase > 0.01) {
    noStroke();
    fill(0, 60 * saverEase);
    rect(0, 0, width, height);
  }
    if (saver) {
    drawGlitter();
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

function mousePressed() {
  if (!saver) setSaver(true);   
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
function initGlitter() {
  flakes = [];
  for (let i = 0; i < GLITTER_COUNT; i++) {
    flakes.push({
      x: random(width),
      y: random(height),
      s: random(1.4, 3.2),        // flake size
      n: random(1000),            // twinkle
      theta: random(TWO_PI),      // orient the flakes
      hue: random([200, 280, 320])// colors
    });
  }
}

function drawGlitter() {
  lightT += 0.01;                     // hoverlights
  const lx = cos(lightT), ly = sin(lightT * 0.85);

  blendMode(ADD);                     // adds bloom
  strokeCap(SQUARE);
  colorMode(RGB, 255);

  for (const f of flakes) {
    // hover/float effect
    f.x = (f.x + sin(frameCount * 0.002 + f.n) * 0.3 + width) % width;
    f.y = (f.y + cos(frameCount * 0.002 + f.n) * 0.25 + height) % height;

    // shiny flash effect
    const nx = cos(f.theta), ny = sin(f.theta);
    let spec = max(0, nx * lx + ny * ly);
    spec = pow(spec, 24);             

    const tw = pow(noise(f.x * 0.02 + f.n, f.y * 0.02 + f.n, frameCount * 0.02), 3);

    const intensity = constrain(0.15 * tw + 1.2 * spec, 0, 1);

    // glowing
    noStroke();
    fill(255, 255 * 0.18 * intensity);
    circle(f.x, f.y, f.s * 6);

    // star
    drawStarburst(f.x, f.y, f.s * (1.2 + 1.0 * intensity), 180 + 75 * intensity, f.theta);
  }

  blendMode(BLEND);
}
// star sparkle
function drawStarburst(x, y, r, alpha, rot) {
  push();
  translate(x, y);
  rotate(rot);

  stroke(255, alpha);      
  // main shape
  strokeWeight(max(1, r * 0.22));
  line(-r, 0, r, 0);       
  line(0, -r, 0, r);      
  strokeWeight(max(1, r * 0.16));
  rotate(PI / 4);
  line(-r * 0.75, 0, r * 0.75, 0);
  rotate(PI / 2);
  line(-r * 0.75, 0, r * 0.75, 0);

  pop();
}

