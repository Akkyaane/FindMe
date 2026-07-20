import "reflect-metadata";
import { DataSource } from "typeorm";
import User from "./entities/User";
import Question from "./entities/Question";
import Questionnaire from "./entities/Questionnaire";
import { Media } from "./entities/Media";

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: "database.sqlite",
  logging: true,
  synchronize: true,
  entities: [User, Questionnaire, Question, Media],
});
