import { Router } from "express";
import { QuestionController } from "../controllers/QuestionController";

const router = Router();

router.post("/", QuestionController.create);

export default router;