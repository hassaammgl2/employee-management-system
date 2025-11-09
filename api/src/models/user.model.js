import mongoose from "mongoose";
import argon2 from "argon2";
import { passwordRegex } from "../validations/auth.validation.js";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
			trim: true,
			minlength: [2, "Name must be at least 2 characters"],
			maxlength: [50, "Name cannot exceed 50 characters"],
		},
		fatherName: {
			type: String,
			required: [true, "Father's name is required"],
			trim: true,
			minlength: [2, "Father's name must be at least 2 characters"],
			maxlength: [50, "Father's name cannot exceed 50 characters"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
			validate: {
				validator: (v) => {
					return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
				},
				message: (props) =>
					`${props.value} is not a valid email address!`,
			},
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			select: false,
			validate: {
				validator: function (v) {
					// Only validate password pattern on new user creation or password change
					if (this.isNew || this.isModified("password")) {
						return passwordRegex.test(v);
					}
					return true;
				},
				message: () =>
					"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
			},
		},
		role: {
			type: String,
			enum: ["admin", "employee"],
			required: [true, "Role is required"],
		},
		employeeCode: {
			type: String,
			trim: true,
			unique: true,
			required: true,
		},
		refreshToken: {
			type: String,
			select: false,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		this.password = await argon2.hash(this.password);
		next();
	} catch (err) {
		next(err);
	}
});

userSchema.methods.verifyPassword = async function (candidatePassword) {
	return await argon2.verify(this.password, candidatePassword);
};

const User = mongoose.model("User", userSchema);
export default User;
 