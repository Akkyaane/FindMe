import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: "database.sqlite",
  logging: true,
  synchronize: true,
  entities: [User],
});