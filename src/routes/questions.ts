import { Router } from "express";
import QuestionController from "../controllers/QuestionController";
import { upload, resizeImage } from "../middlewares/upload";

const router = Router();
const questionController = new QuestionController();

router.post("/", upload.single("image"), resizeImage, questionController.create);
router.delete("/:id", questionController.delete);

export default router;
