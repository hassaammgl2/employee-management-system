import Joi from "joi";

export const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_@$!%*?&])[A-Za-z\d_@$!%*?&]{8,}$/;

const passwordMessage =
	"Password must contain at least: 1 uppercase, 1 lowercase, 1 number, 1 special character (_@$!%*?&), and be 8+ characters long.";

export const registerSchema = Joi.object({
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
	password: Joi.string().min(8).pattern(passwordRegex).required().messages({
		"string.empty": "Password is required",
		"string.min": "Password must be at least 8 characters long",
		"string.pattern.base": passwordMessage,
		"any.required": "Password is required",
	}),
});

export const loginSchema = Joi.object({
	email: Joi.string().email().required().messages({
		"string.email": "Please provide a valid email address",
		"any.required": "Email is required",
	}),
	password: Joi.string().required().messages({
		"any.required": "Password is required",
	}),
});

export const updateUserSchema = Joi.object({
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
	password: Joi.string().required().messages({
		"any.required": "Password is required",
	}),
});
