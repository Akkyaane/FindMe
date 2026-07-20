import { Router } from "express";
import QuestionnaireController from "../controllers/QuestionnaireController";

const router = Router();
const questionnaireController = new QuestionnaireController();

// router.post("/", questionnaireController.create);

export default router;
