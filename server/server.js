// Load the required modules
const http = require("http");
const WebSocket = require("ws");

// Create a new HTTP server
const server = http.createServer();

// Create a new WebSocket server
const wss = new WebSocket.Server({ server });

//Client Id's array
var clientCount = 0;

var players = [];
class Player {
  constructor(name, ws) {
    this.clientId = clientCount++;
    this.name = name;
    this.ws = ws;
  }
  x = 10;
  y = 10;
}

/*
 * Function to tell every player about every other player
 */
function globalStateUpdate() {
  for (let i in players) {
    var sendThis = {
      eventName: "global_state_update",
      clientId: players[i].clientId,
      x: players[i].x,
      y: players[i].y,
      username: players[i].name,
    };
    for (let j in players) {
      if (players[i].clientId != players[j].clientId) {
        players[j].ws.send(JSON.stringify(sendThis));
      }
    }
  }
}
setInterval(globalStateUpdate, 1000 / 60);

// Handle WebSocket connections
wss.on("connection", (ws) => {
  // Handle incoming messages from the client
  ws.on("message", (message) => {
    //console.log(`Received message: ${message}`);
    var realData = JSON.parse(message);
    switch (realData.eventName) {
      case "create_me":
        console.log(realData);
        var player = new Player(realData.name, ws);
        players.push(player);
        //tell the client his id
        ws.send(
          JSON.stringify({
            eventName: "created_you",
            clientId: player.clientId,
          })
        );
        break;
      case "state_update":
        for (let i in players) {
          if (players[i].clientId == realData.clientId) {
            players[i].x = realData.x;
            players[i].y = realData.y;
          }
        }
        break;
    }
  });
});
// Start the server
server.listen(3000, () => {
  console.log("Server started on port   " + server.address().port);
});

//every 1 second print the players array
// setInterval(() => {
//   console.log(players);
// }, 1000);
