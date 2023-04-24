// Load the required modules
const http = require("http");
const WebSocket = require("ws");

// Create a new HTTP server
const server = http.createServer();

// Create a new WebSocket server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on("connection", (ws) => {
  // Send a welcome message to the newly connected client
  ws.send("Welcome to the WebSocket server!");

  // Handle incoming messages from the client
  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    // Echo the message back to the client
    ws.send(`You sent: ${message}`);
  });
});
// Start the server
server.listen(3000, () => {
  console.log("Server started on port   " + server.address().port);
});
