
const WebSocket = require("ws");
const readline = require("readline");

const ws = new WebSocket("ws://localhost:5000");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

ws.on("open", () => {
  console.log("Connected to WebSocket server!");
  console.log("Type a message and press Enter:");

  askMessage();
});

function askMessage() {
  rl.question("> ", (message) => {
    if (message.toLowerCase() === "exit") {
      ws.close();
      rl.close();
      return;
    }

    ws.send(message);
    askMessage();
  });
}

ws.on("message", (data) => {
  console.log("\nServer response:", data.toString());
});

ws.on("error", (error) => {
  console.log("WebSocket error:", error.message);
});

ws.on("close", () => {
  console.log("WebSocket connection closed");
});
