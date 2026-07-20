import { Router } from "express";
import { MediaController } from "../controllers/MediaController";
import { upload, resizeImage } from "../middlewares/upload";

const router = Router();

router.post(
  "/question/:questionId",
  upload.single("image"),
  resizeImage,
  MediaController.upload
);


router.delete("/:id", MediaController.deleteMedia);

export default router;
