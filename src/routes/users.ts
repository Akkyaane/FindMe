import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();
const userController = new UserController();

router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);
router.post("/signout", userController.signOut);

export default router;
