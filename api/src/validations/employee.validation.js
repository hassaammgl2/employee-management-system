import Joi from "joi";

export const createEmployeeSchema = Joi.object({
	name: Joi.string().trim().min(2).max(50).required().messages({
		"string.empty": "Name is required",
		"string.min": "Name must be at least 2 characters long",
		"string.max": "Name cannot exceed 50 characters",
		"any.required": "Name is required",
	}),
	fatherName: Joi.string().trim().min(2).max(50).required().messages({
		"string.empty": "Father's name is required",
		"string.min": "Father's name must be at least 2 characters long",
		"string.max": "Father's name cannot exceed 50 characters",
		"any.required": "Father's name is required",
	}),
	email: Joi.string().email().required().messages({
		"string.email": "Please provide a valid email address",
		"string.empty": "Email is required",
		"any.required": "Email is required",
	}),
	password: Joi.string()
		.min(8)
		.pattern(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_@$!%*?&])[A-Za-z\d_@$!%*?&]{8,}$/
		)
		.required()
		.messages({
			"string.empty": "Password is required",
			"string.min": "Password must be at least 8 characters long",
			"string.pattern.base":
				"Password must contain at least: 1 uppercase, 1 lowercase, 1 number, 1 special character (_@$!%*?&), and be 8+ characters long.",
			"any.required": "Password is required",
		}),
	jobTitle: Joi.string().trim().min(2).max(100).required().messages({
		"string.empty": "Role title is required",
		"string.min": "Role title must be at least 2 characters long",
		"string.max": "Role title cannot exceed 100 characters",
		"any.required": "Role title is required",
	}),
	department: Joi.string().trim().optional().allow(""),
	salary: Joi.number().min(0).required().messages({
		"number.base": "Salary must be a number",
		"number.min": "Salary must be at least 0",
		"any.required": "Salary is required",
	}),
	status: Joi.string()
		.valid("active", "on_leave", "terminated")
		.default("active")
		.messages({
			"any.only": "Status must be one of: active, on_leave, terminated",
		}),
	joinDate: Joi.date().iso().required().messages({
		"date.base": "Join date must be a valid date",
		"date.format": "Join date must be in ISO format (YYYY-MM-DD)",
		"any.required": "Join date is required",
	}),
	avatar: Joi.string().uri().allow("").optional().messages({
		"string.uri": "Avatar must be a valid URL",
	}),
});

export const updateEmployeeSchema = Joi.object({
	name: Joi.string().trim().min(2).max(50).optional().messages({
		"string.min": "Name must be at least 2 characters long",
		"string.max": "Name cannot exceed 50 characters",
	}),
	fatherName: Joi.string().trim().min(2).max(50).optional().messages({
		"string.min": "Father's name must be at least 2 characters long",
		"string.max": "Father's name cannot exceed 50 characters",
	}),
	email: Joi.string().email().optional().messages({
		"string.email": "Please provide a valid email address",
	}),
	roleTitle: Joi.string().trim().min(2).max(100).optional().messages({
		"string.min": "Role title must be at least 2 characters long",
		"string.max": "Role title cannot exceed 100 characters",
	}),
	department: Joi.string().trim().optional().messages({
		"string.empty": "Department cannot be empty",
	}),
	salary: Joi.number().min(0).optional().messages({
		"number.base": "Salary must be a number",
		"number.min": "Salary must be at least 0",
	}),
	status: Joi.string()
		.valid("active", "on_leave", "terminated")
		.optional()
		.messages({
			"any.only": "Status must be one of: active, on_leave, terminated",
		}),
	joinDate: Joi.date().iso().optional().messages({
		"date.base": "Join date must be a valid date",
		"date.format": "Join date must be in ISO format (YYYY-MM-DD)",
	}),
	avatar: Joi.string().uri().allow("").optional().messages({
		"string.uri": "Avatar must be a valid URL",
	}),
});
