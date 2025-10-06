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
let shapeImg;                 
let shapes = [];              
let shapeReady = false;  



function setup() {
  createCanvas(windowWidth, windowHeight);
  generateRandomColors();
  initGlitter();  
  
  // imageload
  loadImage(
    'assets/shape.png',
    (img) => {
      console.log('Image loaded successfully!', img.width, img.height);
      shapeImg = img;
      shapeReady = true;
      initShapes();   
    },
    (err) => {
      console.error('shape.png failed to load:', err);
      shapeReady = false;
    }
  );

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

  // overlay 
  saverEase += (saver ? 1 : 0) - saverEase;   
  saverEase = constrain(saverEase, 0, 1);
  if (saverEase > 0.01) {
    noStroke();
    fill(0, 60 * saverEase);
    rect(0, 0, width, height);
  }
  
  // moves the pngs diagonally
  if (saver && shapeReady) {
    for (let shape of shapes) {
      const shapeW = shapeImg.width * shape.scale;
      const shapeH = shapeImg.height * shape.scale;
      
      shape.x += shape.vx;
      shape.y += shape.vy;
      
      // Wrap around when off screen
      if (shape.x - shapeW * 0.5 > width + 60) {
        shape.x = -shapeW * 0.5 - 60;
      }
      if (shape.y - shapeH * 0.5 > height + 60) {
        shape.y = -shapeH * 0.5 - 60;
      }
      if (shape.y + shapeH * 0.5 < -60) {
        shape.y = height + shapeH * 0.5 + 60;
      }
    }
  }

  // Draw the PNG images first
  if (saver && shapeReady && shapeImg) {
    for (let shape of shapes) {
      push();
      image(shapeImg, 
            shape.x, 
            shape.y,
            shapeImg.width * shape.scale,
            shapeImg.height * shape.scale);
      pop();
    }
  }
  
  // Draw glitter 
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
  initGlitter();
  
  if (shapeImg && shapeReady) {
    initShapes();  
  }
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
  lightT += 0.01;                                  // sweeping light
  const lx = cos(lightT), ly = sin(lightT * 0.85); // light direction

  blendMode(ADD);               // bloom highlights
  strokeCap(SQUARE);
  colorMode(RGB, 255);

  for (const f of flakes) {
    f.x = (f.x + sin(frameCount * 0.002 + f.n) * 0.3 + width) % width;
    f.y = (f.y + cos(frameCount * 0.002 + f.n) * 0.25 + height) % height;

    const nx = cos(f.theta), ny = sin(f.theta);
    let spec = max(0, nx * lx + ny * ly); spec = pow(spec, 24);
    const tw = pow(noise(f.x * 0.02 + f.n, f.y * 0.02 + f.n, frameCount * 0.02), 3);
    const intensity = constrain(0.15 * tw + 1.2 * spec, 0, 1);

    noStroke(); fill(255, 255 * 0.18 * intensity);
    circle(f.x, f.y, f.s * 6);
    drawStarburst(f.x, f.y, f.s * (1.2 + 1.0 * intensity), 180 + 75 * intensity, f.theta);
  }

  // sparkle effect in png
  if (shapeReady) {
    const currentFrame = frameCount * 0.15;
    
    for (let shape of shapes) {
      if (shape.flakes && shape.flakes.length) {
        for (const f of shape.flakes) {
          const px = shape.x + (f.dx + shapeImg.width / 2) * shape.scale;
          const py = shape.y + (f.dy + shapeImg.height / 2) * shape.scale;

          // rotates the sparkles slowly
          f.theta += f.rotSpeed;
          
          // flashing effect
          const flashChance = noise(f.n + currentFrame);
          const isFlashing = flashChance > 0.75;  // 25% chance (less = better performance)
          
          // skips dim sparkles, help with lag
          if (!isFlashing && random() > 0.3) continue;  
          
          const intensity = isFlashing ? 1.0 : 0.15;

          push();
          translate(px, py);
          rotate(f.theta);
          
          noStroke();
          
          if (isFlashing) {
            //bright sparkle
            fill(255, 50);
            beginShape();
            vertex(0, -f.s * 4);
            vertex(f.s * 2, 0);
            vertex(0, f.s * 4);
            vertex(-f.s * 2, 0);
            endShape(CLOSE);
            
            // main diamond
            fill(255, 200);
            beginShape();
            vertex(0, -f.s * 2.5);
            vertex(f.s * 1.2, 0);
            vertex(0, f.s * 2.5);
            vertex(-f.s * 1.2, 0);
            endShape(CLOSE);
            
            // bright cener
            fill(255);
            beginShape();
            vertex(0, -f.s * 1.2);
            vertex(f.s * 0.6, 0);
            vertex(0, f.s * 1.2);
            vertex(-f.s * 0.6, 0);
            endShape(CLOSE);
            
            // cross sparkle lines
            stroke(255);
            strokeWeight(2);
            line(0, -f.s * 3, 0, f.s * 3);
            line(-f.s * 1.5, 0, f.s * 1.5, 0);
            
            // rays
            strokeWeight(1.5);
            rotate(PI / 4);
            line(-f.s * 2.5, 0, f.s * 2.5, 0);
            line(0, -f.s * 2.5, 0, f.s * 2.5);
          } else {
            // dim sparkles
            fill(255, 30);
            beginShape();
            vertex(0, -f.s * 2);
            vertex(f.s, 0);
            vertex(0, f.s * 2);
            vertex(-f.s, 0);
            endShape(CLOSE);
          }
          
          pop();
        }
      }
    }
  }

  blendMode(BLEND);
  colorMode(RGB, 255);
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

function initShapes() {
  if (!shapeImg) return;
  
  shapes = [];
  const targetW = width * 0.25;  //png scale
  const scale = targetW / shapeImg.width;
  const count = 15;  // number of pngs on screen
  
  for (let i = 0; i < count; i++) {
    const shape = {
      x: random(-width * 0.5, width),
      y: random(-height * 0.5, height),
      scale: scale,
      vx: random(0.5, 1.2),   // Horizontal speed
      vy: random(0.3, 0.8),   // Vertical speed 
      flakes: []
    };
    
    // Spawn sparkles for this shape
    spawnMaskFlakes(shapeImg, shape, 200);  
    shapes.push(shape);
  }
}

function spawnMaskFlakes(img, shape, count) {
  shape.flakes = [];
  if (!img) return;

  img.loadPixels();
  const w = img.width, h = img.height;
  let placed = 0, guard = 0;

  while (placed < count && guard++ < count * 30) {
    const x = floor(random(w));
    const y = floor(random(h));
    const a = img.pixels[(y * w + x) * 4 + 3]; 
    if (a > 10) { // visible png parts
      shape.flakes.push({
        dx: (x - w / 2),
        dy: (y - h / 2),
        s: random(2, 5),  // larger sizes for visible diamonds
        n: random(1000),
        theta: random(TWO_PI),
        rotSpeed: random(-0.08, 0.08)  // rotation speed
      });
      placed++;
    }
  }
}