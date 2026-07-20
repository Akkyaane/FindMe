import { Router } from "express";
import QuestionController from "../controllers/QuestionController";

const router = Router();
const questionController = new QuestionController();

router.post("/", questionController.create);

export default router;
