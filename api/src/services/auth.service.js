import User from "../models/user.model.js";
import { TokenService } from "../utils/Jwt.js";
import { AppError } from "../utils/AppError.js";
import { dto } from "../utils/Dto.js";
import { logger } from "../utils/logger.js";
import { NotificationService } from "./notification.service.js";

class AuthService {
	async #generateAuthTokens(user) {
		const accessToken = TokenService.generateAccessToken(
			user._id.toString()
		);
		const refreshToken = TokenService.generateRefreshToken(
			user._id.toString()
		);

		user.refreshToken = refreshToken;
		await user.save({ validateBeforeSave: false });

		return {
			accessToken,
			refreshToken,
		};
	}

	async register(data) {
		const { email, name, fatherName, password } = data;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			throw new AppError("Email already in use", 400);
		}

		const userData = {
			email,
			name,
			fatherName,
			password,
			role: "admin",
			employeeCode: `A${Math.floor(Math.random() * 99999)}`,
		};

		const user = new User(userData);
		await user.save();

		const tokens = await this.#generateAuthTokens(user);
		return {
			...tokens,
			user: dto.userDto(user),
		};
	}

	async login(data) {
		const { email, password } = data;

		const user = await User.findOne({ email }).select(
			"+password +refreshToken"
		);

		if (!user) {
			throw new AppError("Invalid email or password", 401);
		}

		if (!user.password || typeof user.password !== "string") {
			throw new AppError(
				"Authentication error - invalid password storage",
				500
			);
		}

		try {
			const isPasswordValid = await user.verifyPassword(password);
			if (!isPasswordValid) {
				throw new AppError("Invalid email or password", 401);
			}
		} catch (err) {
			if (err.message.includes("pchstr must be a non-empty string")) {
				throw new AppError(
					"Authentication system error - please contact support",
					500
				);
			}
			throw err;
		}


		const tokens = await this.#generateAuthTokens(user);

        // Notify admins about employee login
        if (user.role === "employee") {
            const admins = await User.find({ role: "admin" });
            const notifications = admins.map(admin => ({
                user: admin._id,
                title: "Employee Login",
                message: `${user.name} has logged in.`,
                type: "info"
            }));
            
            // Execute in background
            Promise.all(notifications.map(n => NotificationService.createNotification(n))).catch(err => 
                console.error("Failed to send login notifications", err)
            );
        }

		return {
			...tokens,
			user: dto.userDto(user),
		};
	}

	async logout(_id) {
        const user = await User.findById(_id);
		await User.findByIdAndUpdate(_id, { refreshToken: null });

        // Notify admins about employee logout
        if (user && user.role === "employee") {
            const admins = await User.find({ role: "admin" });
            const notifications = admins.map(admin => ({
                user: admin._id,
                title: "Employee Logout",
                message: `${user.name} has logged out.`,
                type: "info"
            }));
            
            // Execute in background
            Promise.all(notifications.map(n => NotificationService.createNotification(n))).catch(err => 
                console.error("Failed to send logout notifications", err)
            );
        }

		return true;
	}

	async refresh(incomingRefreshToken) {
		if (!incomingRefreshToken) {
			throw new AppError("Refresh token is required", 401);
		}

		const decoded = TokenService.verifyRefreshToken(incomingRefreshToken);
		const user = await User.findById(decoded.id).select("+refreshToken");
		if (!user) {
			throw new AppError("User not found", 404);
		}

		if (!user.refreshToken || user.refreshToken !== incomingRefreshToken) {
			throw new AppError("Invalid refresh token", 401);
		}

		const tokens = await this.#generateAuthTokens(user);
		return {
			...tokens,
			user: dto.userDto(user),
		};
	}

	async updateUser(data, userData) {
		const { name, fatherName, password } = data;
		const user = await User.findOne({
			email: userData.email,
			employeeCode: userData.employeeCode,
		}).select("+password");

		try {
			const isPasswordValid = await user.verifyPassword(password);
			if (!isPasswordValid) {
				throw new AppError("Invalid email or password", 401);
			}
		} catch (err) {
			if (err.message.includes("pchstr must be a non-empty string")) {
				throw new AppError(
					"Authentication system error - please contact support",
					500
				);
			}
			throw err;
		}

		user.name = name;
		user.fatherName = fatherName;
		await user.save();

		return {
			user: dto.userDto(user),
		};
	}
}

export const authService = new AuthService();
