import User from "../models/user.model.js";
import { TokenService } from "../utils/Jwt.js";
import { AppError } from "../utils/AppError.js";
import { dto } from "../utils/Dto.js";

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
		const { email, name, fatherName, password, role, employeeCode } = data;

		// Check if email already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			throw new AppError("Email already in use", 400);
		}

		const userData = {
			email,
			name,
			fatherName,
			password,
			role,
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
		const { email, password, employeeCode } = data;

		const user = await User.findOne({ email, employeeCode }).select(
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
		return {
			...tokens,
			user: dto.userDto(user),
		};
	}

	async logout(_id) {
		await User.findByIdAndUpdate(_id, { refreshToken: null });
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
}


export const authService = new AuthService()