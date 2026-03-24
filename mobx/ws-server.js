import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let todos = [];
let nextId = 1;

console.log("WebSocket server running on ws://localhost:8080");

function broadcast(message, excludeWs = null) {
  const data = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client !== excludeWs && client.readyState === 1) {
      client.send(data);
    }
  });
}

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.send(JSON.stringify({ type: "SYNC", todos, nextId }));

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log("Received:", message);

      switch (message.type) {
        case "ADD_TODO":
          const newTodo = {
            id: nextId++,
            text: message.text,
            completed: false,
          };
          todos.push(newTodo);
          broadcast({ type: "TODO_ADDED", todo: newTodo });
          break;

        case "TOGGLE_TODO":
          const todoToToggle = todos.find((t) => t.id === message.id);
          if (todoToToggle) {
            todoToToggle.completed = !todoToToggle.completed;
            broadcast({ type: "TODO_TOGGLED", id: message.id }, ws);
          }
          break;

        case "REMOVE_TODO":
          todos = todos.filter((t) => t.id !== message.id);
          broadcast({ type: "TODO_REMOVED", id: message.id }, ws);
          break;
      }
    } catch (e) {
      console.error("Failed to parse message:", e);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
