import { Router } from "express";
import QuestionController from "../controllers/QuestionController";
import { upload, resizeImage } from "../middlewares/upload";
import { requireAuth } from "../middlewares/UserMiddleware";

const router = Router();
const questionController = new QuestionController();

router.post("/", requireAuth, upload.single("image"), resizeImage, questionController.create);
router.delete("/:id", questionController.delete);

export default router;
