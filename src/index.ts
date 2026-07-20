import express from "express";
import routes from "./routes";
import { AppDataSource } from "./datasource";
import { createServer } from "http";
import WebSocket from "ws";
import WsManager from "../utils/wsManager";

const app = express();

const port = process.env.PORT || 3000;

// Configuration du middleware pour parser le corps des requêtes en JSON
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(routes);

const server = createServer(app);

const ws = new WebSocket.Server({ server });

new WsManager(ws);

AppDataSource.initialize()
  .then(() => {
    console.log("Database initialized");
    server.listen(port, () => {
      console.log(`WebSocket server running on ws://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Database initialization failed", error);
  });
