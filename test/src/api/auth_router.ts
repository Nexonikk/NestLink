import { Router } from "express";
import AuthController from "../controllers/auth_controller.js";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.Register);

router.post("/login", authController.Login);

export default router;
