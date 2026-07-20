import { v4 as uuidv4 } from "uuid";
import WebSocket from "ws";

const clients = new Map();

export default class WsManager {
  constructor(ws: WebSocket.Server) {
    ws.on("connection", (ws, request) => {
      const clientId = uuidv4();

      clients.set(clientId, {
        ws,
        connectedAt: new Date(),
        ip: request.socket.remoteAddress || null,
      });

      console.log(`Client connected: ${clientId}`);

      // Send welcome message with client ID
      ws.send(
        JSON.stringify({
          type: "connected",
          clientId,
          message: "Welcome to the WebSocket server",
        }),
      );

      ws.on("message", (data) => {
        try {
          const message = JSON.parse(data.toString());
          console.log(`Received from ${clientId}:`, message);

          ws.send(
            JSON.stringify({
              type: "echo",
              originalMessage: message,
              timestamp: new Date().toISOString(),
            }),
          );
        } catch (error) {
          console.error("Failed to parse message:", error);
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Invalid JSON format",
            }),
          );
        }
      });

      ws.on("close", (code, reason) => {
        console.log(`Client disconnected: ${clientId}, code: ${code}`);
        clients.delete(clientId);
      });

      ws.on("error", (error) => {
        console.error(`WebSocket error for ${clientId}:`, error);
        clients.delete(clientId);
      });
    });
  }
}
