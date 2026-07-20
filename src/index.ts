import express from "express";
import routes from "./routes";
import { AppDataSource } from "./datasource";

const app = express();

const port = 3000;

// Configuration du middleware pour parser le corps des requêtes en JSON
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(routes);

AppDataSource.initialize()
  .then(() => {
    console.log("Database initialized");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Database initialization failed", error);
  });
