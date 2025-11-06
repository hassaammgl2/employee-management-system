import { Router } from "express";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { createDepartmentSchema, updateDepartmentSchema } from "../validations/department.validation.js";
import {
	getAllDepartments,
	getDepartmentById,
	createDepartment,
	updateDepartment,
	deleteDepartment,
} from "../controllers/department.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = Router();

// All department routes require authentication
router.use(protect);

router.get("/", getAllDepartments);
router.get("/:id", getDepartmentById);
router.post("/", validateRequest(createDepartmentSchema), createDepartment);
router.put("/:id", validateRequest(updateDepartmentSchema), updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;

