import { Router } from "express";
import users from "./users";
import questions from "./questions";
import media from "./media";
import questionnaires from "./questionnaires";

const router = Router();

router.use("/users", users);
router.use("/questions", questions);
router.use("/media", media);
router.use("/questionnaires", questionnaires);

export default router;
