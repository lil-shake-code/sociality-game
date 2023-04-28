//express websocket server
const express = require("express");
const WebSocket = require("ws");

// [START appengine_websockets_app]
const app = require("express")();
app.set("view engine", "pug");

const server = require("http").Server(app);
const wss = new WebSocket.Server({ server });

app.get("/", (req, res) => {
  res.send("Hello world");
});

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

  // Handle closing connection
  ws.on("close", () => {
    console.log("Client disconnected");
    for (let i in players) {
      if (players[i].ws == ws) {
        var sendThis = {
          eventName: "destroy_player",
          clientId: players[i].clientId,
        };
        //remove this player from the players array
        players.splice(i, 1);
        //tell everyone that this player is destroyed
        for (let j in players) {
          players[j].ws.send(JSON.stringify(sendThis));
        }
        break;
      }
    }
  });
});

if (module === require.main) {
  const PORT = parseInt(process.env.PORT) || 8080;
  server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log("Press Ctrl+C to quit.");
  });
}
// [END appengine_websockets_app]

module.exports = server;
