import { Router } from "express";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { createEmployeeSchema, updateEmployeeSchema } from "../validations/employee.validation.js";
import {
	getAllEmployees,
	getEmployeeById,
	createEmployee,
	updateEmployee,
	deleteEmployee,
} from "../controllers/employee.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = Router();

// All employee routes require authentication
router.use(protect);

router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);
router.post("/", validateRequest(createEmployeeSchema), createEmployee);
router.put("/:id", validateRequest(updateEmployeeSchema), updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;

