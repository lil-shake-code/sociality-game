//test a websocket connection
const WebSocket = require("ws");
const ws = new WebSocket("ws://the-sociality-game.uk.r.appspot.com:3000");
ws.on("open", function open() {
  console.log("hi");
});

//ws error
ws.on("error", function error() {
  //display the error in detail
  console.log("error");
});
