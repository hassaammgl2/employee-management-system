import { Router } from "express";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import {
	auth
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/register", validateRequest(registerSchema), auth.register);
router.post("/login", validateRequest(loginSchema), auth.login);
router.post("/logout", protect, auth.logout);
router.get("/me", protect, auth.getCurrentUser);
router.post("/refresh", auth.refreshTokens);

export default router;
