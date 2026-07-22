import { Router } from "express";
import QuestionnaireController from "../controllers/QuestionnaireController";
import { requireAuth } from "../middlewares/UserMiddleware";
import { upload, resizeImages } from "../middlewares/upload";

const router = Router();
const questionnaireController = new QuestionnaireController();

router.post("/", requireAuth, upload.array("images"), resizeImages, questionnaireController.create);
router.get("/", questionnaireController.getAll);
router.get("/:id", questionnaireController.getOne);
router.delete("/:id", questionnaireController.delete);

export default router;
