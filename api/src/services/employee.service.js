import User from "../models/user.model.js";
import EmployeeProfile from "../models/employeeProfile.model.js";
import Department from "../models/department.model.js";
import { AppError } from "../utils/AppError.js";
import { DTO } from "../utils/Dto.js";

export class EmployeeService {
	static async getAllEmployees() {
		const employeeProfiles = await EmployeeProfile.find()
			.populate("user", "name fatherName email employeeCode")
			.populate("department", "name")
			.sort({ createdAt: -1 });

		return employeeProfiles.map((profile) => {
			const user = profile.user;
			return DTO.employeeDto(profile, user);
		});
	}

	static async getEmployeeById(id) {
		const employeeProfile = await EmployeeProfile.findById(id)
			.populate("user", "name fatherName email employeeCode")
			.populate("department", "name");

		if (!employeeProfile) {
			throw new AppError("Employee not found", 404);
		}

		return DTO.employeeDto(employeeProfile, employeeProfile.user);
	}

	static async createEmployee(data) {
		const { name, fatherName, email, password, roleTitle, department, salary, status, joinDate, avatar } = data;

		// Check if email already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			throw new AppError("Email already in use", 400);
		}

		// Find or validate department
		let departmentDoc = null;
		if (department) {
			departmentDoc = await Department.findOne({ name: department });
			if (!departmentDoc) {
				// Create department if it doesn't exist
				departmentDoc = await Department.create({ name: department });
			}
		}

		// Generate employee code
		const employeeCode = `EMP${Math.floor(Math.random() * 99999).toString().padStart(5, "0")}`;

		// Create user
		const user = new User({
			name,
			fatherName,
			email,
			password,
			role: "employee",
			employeeCode,
		});
		await user.save();

		// Create employee profile
		const employeeProfile = new EmployeeProfile({
			user: user._id,
			department: departmentDoc?._id || null,
			roleTitle,
			salary: salary || 0,
			status: status || "active",
			joinDate: joinDate ? new Date(joinDate) : new Date(),
			avatar: avatar || null,
		});
		await employeeProfile.save();

		// Update department employee count
		if (departmentDoc) {
			await Department.findByIdAndUpdate(departmentDoc._id, {
				$inc: { employeeCount: 1 },
			});
		}

		// Populate and return
		await employeeProfile.populate("user", "name fatherName email employeeCode");
		await employeeProfile.populate("department", "name");

		return DTO.employeeDto(employeeProfile, user);
	}

	static async updateEmployee(id, data) {
		const employeeProfile = await EmployeeProfile.findById(id).populate("user", "name fatherName email employeeCode");

		if (!employeeProfile) {
			throw new AppError("Employee not found", 404);
		}

		const { name, fatherName, email, roleTitle, department, salary, status, joinDate, avatar } = data;

		// Update user if provided
		if (name || fatherName || email) {
			const userUpdates = {};
			if (name) userUpdates.name = name;
			if (fatherName) userUpdates.fatherName = fatherName;
			if (email) {
				// Check if email is already taken by another user
				const existingUser = await User.findOne({ email, _id: { $ne: employeeProfile.user._id } });
				if (existingUser) {
					throw new AppError("Email already in use", 400);
				}
				userUpdates.email = email;
			}
			await User.findByIdAndUpdate(employeeProfile.user._id, userUpdates);
		}

		// Update department if provided
		let departmentDoc = null;
		if (department) {
			departmentDoc = await Department.findOne({ name: department });
			if (!departmentDoc) {
				// Create department if it doesn't exist
				departmentDoc = await Department.create({ name: department });
			}

			// Update employee count if department changed
			if (employeeProfile.department && employeeProfile.department.toString() !== departmentDoc._id.toString()) {
				await Department.findByIdAndUpdate(employeeProfile.department, {
					$inc: { employeeCount: -1 },
				});
				await Department.findByIdAndUpdate(departmentDoc._id, {
					$inc: { employeeCount: 1 },
				});
			} else if (!employeeProfile.department) {
				await Department.findByIdAndUpdate(departmentDoc._id, {
					$inc: { employeeCount: 1 },
				});
			}
		}

		// Update employee profile
		const profileUpdates = {};
		if (roleTitle !== undefined) profileUpdates.roleTitle = roleTitle;
		if (departmentDoc) profileUpdates.department = departmentDoc._id;
		if (salary !== undefined) profileUpdates.salary = salary;
		if (status !== undefined) profileUpdates.status = status;
		if (joinDate !== undefined) profileUpdates.joinDate = new Date(joinDate);
		if (avatar !== undefined) profileUpdates.avatar = avatar;

		Object.assign(employeeProfile, profileUpdates);
		await employeeProfile.save();

		// Populate and return
		await employeeProfile.populate("user", "name fatherName email employeeCode");
		await employeeProfile.populate("department", "name");

		// Refresh user data
		const updatedUser = await User.findById(employeeProfile.user._id);

		return DTO.employeeDto(employeeProfile, updatedUser);
	}

	static async deleteEmployee(id) {
		const employeeProfile = await EmployeeProfile.findById(id);

		if (!employeeProfile) {
			throw new AppError("Employee not found", 404);
		}

		// Update department employee count
		if (employeeProfile.department) {
			await Department.findByIdAndUpdate(employeeProfile.department, {
				$inc: { employeeCount: -1 },
			});
		}

		// Delete employee profile
		await EmployeeProfile.findByIdAndDelete(id);

		// Delete user
		await User.findByIdAndDelete(employeeProfile.user);

		return { message: "Employee deleted successfully" };
	}
}

