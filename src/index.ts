import express from "express";
import { AppDataSource } from "./datasource";
import { UserController } from "./controllers/UserController";

const app = express();
const PORT = 3000;

app.use(express.json());

// 👉 route POST /users
app.post("/users", UserController.create);

AppDataSource.initialize()
  .then(() => {
    console.log("DB connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error(err));