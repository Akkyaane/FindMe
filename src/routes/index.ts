import { Router } from "express";
import users from "./users";
import questions from "./questions";
import media from "./media";

const router = Router();

router.use("/users", users);
router.use("/questions", questions);
router.use("/media", media);

export default router;
