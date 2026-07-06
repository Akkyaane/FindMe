import { Router } from "express";
import users from "./users";
import questions from "./questions";

const router = Router();

router.use("/users", users);
router.use("/questions", questions);

export default router;