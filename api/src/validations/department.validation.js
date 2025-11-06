import Joi from "joi";

export const createDepartmentSchema = Joi.object({
	name: Joi.string().trim().min(2).max(100).required().messages({
		"string.empty": "Department name is required",
		"string.min": "Department name must be at least 2 characters long",
		"string.max": "Department name cannot exceed 100 characters",
		"any.required": "Department name is required",
	}),
	head: Joi.string().trim().min(2).max(100).optional().allow("").messages({
		"string.min": "Head name must be at least 2 characters long",
		"string.max": "Head name cannot exceed 100 characters",
	}),
	description: Joi.string().trim().max(500).optional().allow("").messages({
		"string.max": "Description cannot exceed 500 characters",
	}),
	employeeCount: Joi.number().min(0).optional().default(0).messages({
		"number.base": "Employee count must be a number",
		"number.min": "Employee count must be at least 0",
	}),
});

export const updateDepartmentSchema = Joi.object({
	name: Joi.string().trim().min(2).max(100).optional().messages({
		"string.min": "Department name must be at least 2 characters long",
		"string.max": "Department name cannot exceed 100 characters",
	}),
	head: Joi.string().trim().min(2).max(100).optional().allow("").messages({
		"string.min": "Head name must be at least 2 characters long",
		"string.max": "Head name cannot exceed 100 characters",
	}),
	description: Joi.string().trim().max(500).optional().allow("").messages({
		"string.max": "Description cannot exceed 500 characters",
	}),
	employeeCount: Joi.number().min(0).optional().messages({
		"number.base": "Employee count must be a number",
		"number.min": "Employee count must be at least 0",
	}),
});

