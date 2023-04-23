const loginForm = document.getElementById("login-form");
const loginScreen = document.getElementById("login-screen");
const gameCanvas = document.getElementById("game-canvas");

//initally hide the game canvas
gameCanvas.style.display = "none";
var onLoginScreen = true;
const ctx = gameCanvas.getContext("2d");

//define loop animation class
class LoopAnimation {
  constructor(options) {
    this.image = options.image;
    this.frameWidth = options.frameWidth;
    this.frameHeight = options.frameHeight;
    this.framesPerRow = options.framesPerRow;
    this.numRows = options.numRows;
    this.startFrame = options.startFrame;
    this.endFrame = options.endFrame;
    this.frameDelay = options.frameDelay;
    this.currentFrame = this.startFrame;
    this.currentRow = 0;
    this.frameCount = 0;
  }
  update() {
    this.frameCount++;
    if (this.frameCount >= this.frameDelay) {
      this.frameCount = 0;
      this.currentFrame++;
      if (this.currentFrame > this.endFrame) {
        this.currentFrame = this.startFrame;
      }
    }
  }
  draw(ctx, x, y) {
    const row = Math.floor(this.currentFrame / this.framesPerRow);
    const col = Math.floor(this.currentFrame % this.framesPerRow);
    ctx.drawImage(
      this.image,
      col * this.frameWidth,
      row * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      x,
      y,
      this.frameWidth,
      this.frameHeight
    );
  }
}

loginForm.addEventListener("submit", (event) => {
  onLoginScreen = false;
  event.preventDefault();
  loginScreen.style.display = "none";
  gameCanvas.style.display = "block";
  gameCanvas.width = window.innerWidth;
  gameCanvas.height = window.innerHeight;
  // bat-sprite.png is a 4*3 sprite sheet, so 3 rows and 4 columns for frames. Make a loop sprite from the first row and draw it on the canvas.
});

//if not on login screen draw the bat sprite and make it loop and control it with wasd keys
// Load the sprite sheet
const batImage = new Image();
batImage.src = "assets/new-bat-sprite.png";

// Define the size of each frame
const frameWidth = 32;
const frameHeight = 32;

// Define the animation frames
const framesPerRow = 4;
const numRows = 4;
const numFrames = framesPerRow;
const startFrame = 0;
const endFrame = numFrames - 1;

// Create the loop animation from the first row and scale it to 50% of the original size
const batAnimation = new LoopAnimation({
  image: batImage,
  frameWidth: frameWidth,
  frameHeight: frameHeight,
  framesPerRow: framesPerRow,
  numRows: numRows,
  startFrame: startFrame,
  endFrame: endFrame,
  frameDelay: 10,
});

// Set the initial position of the bat
let batX = gameCanvas.width / 2 - frameWidth / 2;
let batY = gameCanvas.height / 2 - frameHeight / 2;

// Listen for key presses to move the bat
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyW":
      batY -= 5;
      break;
    case "KeyA":
      batX -= 5;
      break;
    case "KeyS":
      batY += 5;
      break;
    case "KeyD":
      batX += 5;
      break;
  }
});
