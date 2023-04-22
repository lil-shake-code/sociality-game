const loginForm = document.getElementById("login-form");
const loginScreen = document.getElementById("login-screen");
const gameCanvas = document.getElementById("game-canvas");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loginScreen.style.display = "none";
  gameCanvas.width = window.innerWidth;
  gameCanvas.height = window.innerHeight;
  gameCanvas.style.display = "block";
  document.body.style.overflow = "hidden";
  const ctx = gameCanvas.getContext("2d");
  const background = new Image();
  background.src = "assets/background.png";
  background.onload = () => {
    ctx.drawImage(background, 0, 0, gameCanvas.width, gameCanvas.height);
    // start game logic here
  };
});
