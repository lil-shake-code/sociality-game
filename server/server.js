const { google } = require("googleapis");
const { Storage } = require("@google-cloud/storage");
const gapi = google.storage("v1");
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

/*
 *RECORDING CSV FILE
 */
//write to a csv file and store it in the bucket after 1 minute
// [client id , name , x , y]
var recordingData = [];
var recording = false;
var seconds = 0;
var recordingInterval = setInterval(() => {
  if (recording) {
    console.log("Recording data");
    seconds++;
    //write all players client id , name , x , y to a csv file row by row along with time in seconds
    var data = "";
    for (let i in players) {
      data +=
        players[i].clientId +
        "," +
        players[i].name +
        "," +
        players[i].x +
        "," +
        players[i].y +
        "," +
        seconds +
        "\n";
    }
    recordingData.push(data);
  }
}, 1000);
//allow all cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
//if someone makes a get request at a particular url, send them an array
app.get("/record", (req, res) => {
  console.log("Someone made a request at /record");
  if (!recording) {
    recording = true;
    seconds = 0;
    res.send("Recording started");
  } else {
    res.send("Recording already started");
  }
});
app.get("/stop", (req, res) => {
  console.log("Someone made a request at /stop");
  if (recording) {
    recording = false;
    //write the array to a csv file
    var data = "";
    for (let i in recordingData) {
      data += recordingData[i];
    }
    //write to a csv file and store it in the bucket
    const { Storage } = require("@google-cloud/storage");
    const storage = new Storage();
    const bucket = storage.bucket(bucketName);
    //save filename as date and time 2020-11-11 10:53.csv

    const filename = new Date().toISOString().replace(/:/g, "-") + ".csv";
    const file = bucket.file(filename);
    file.save(data, function (err) {
      if (!err) {
        console.log("File saved");
        res.send("File saved");
      } else {
        console.log("Error saving file");
        res.send("Error saving file");
      }
    });
  } else {
    res.send("Recording already stopped");
  }
});
app.get("/recordings", (req, res) => {
  console.log("Someone made a request at /recordings");
  // List all objects in the "my-bucket" bucket as a array of filenames
  const storage = new Storage();
  async function listFiles() {
    const [files] = await storage.bucket(bucketName).getFiles();
    console.log("Files:");
    var filenames = [];
    files.forEach((file) => {
      filenames.push(file.name);
    });
    res.send(filenames);
  }
  listFiles().catch(console.error);
});
app.get("/game", (req, res) => {
  res.sendFile(__dirname + "/game/index.html");
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
//download a file from the bucket when someone makes a get request at a particular url
app.get("/download/:filename", (req, res) => {
  //example url: /download/2020-11-11T10-53-00.000Z.csv
  console.log("Someone made a request at /download");
  const { Storage } = require("@google-cloud/storage");
  const storage = new Storage();
  const bucket = storage.bucket(bucketName);
  const filename = req.params.filename;
  const file = bucket.file(filename);
  file.download(function (err, contents) {
    if (!err) {
      console.log("File downloaded");
      res.send(contents);
    } else {
      console.log("Error downloading file");
      // error is
      console.log(err);
      res.send(err);
    }
  });
});
const WebSocket = require("ws");

const server = require("http").Server(app);
const wss = new WebSocket.Server({ server });

//Use an static html file for the main page
app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "admin/index.html");
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
