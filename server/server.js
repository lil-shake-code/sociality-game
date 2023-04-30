const { google } = require("googleapis");
const { Storage } = require("@google-cloud/storage");
const gapi = google.storage("v1");
//gcp credentials for the storage bucket

// Replace with your own values
const projectId = "the-sociality-game";
const bucketName = "the-sociality-game-player-data";
// [START appengine_websockets_app]
const app = require("express")();
const createStorageClient = require("./storage");

// Route to list all objects in a bucket
app.get("/list-objects", async (req, res) => {
  try {
    // Create an authenticated client for the Google Cloud Storage API
    const storage = await createStorageClient();

    // List all objects in the "my-bucket" bucket
    const response = await storage.objects.list({
      bucket: bucketName,
    });

    // Send the list of objects as the response
    res.send(response.data);
  } catch (error) {
    console.error("Error listing objects:", error);
    res.status(500).send("Error listing objects");
  }
});

app.set("view engine", "pug");
//express public static webpage
app.use(require("express").static("public"));

// List all objects in the "my-bucket" bucket
const storage = new Storage();
async function listFiles() {
  const [files] = await storage.bucket(bucketName).getFiles();
  console.log("Files:");
  files.forEach((file) => {
    console.log(file.name);
  });
}
listFiles().catch(console.error);

const WebSocket = require("ws");

const server = require("http").Server(app);
const wss = new WebSocket.Server({ server });

//Use an static html file for the main page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
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
