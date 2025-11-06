import Department from "../models/department.model.js";
import { AppError } from "../utils/AppError.js";

export class DepartmentService {
	static async getAllDepartments() {
		const departments = await Department.find().sort({ createdAt: -1 });
		return departments.map((dept) => ({
			id: dept._id.toString(),
			_id: dept._id.toString(),
			name: dept.name || "",
			head: dept.head || "",
			description: dept.description || "",
			employeeCount: dept.employeeCount || 0,
			createdAt: dept.createdAt,
			updatedAt: dept.updatedAt,
		}));
	}

	static async getDepartmentById(id) {
		const department = await Department.findById(id);
		if (!department) {
			throw new AppError("Department not found", 404);
		}
		return {
			id: department._id.toString(),
			_id: department._id.toString(),
			name: department.name || "",
			head: department.head || "",
			description: department.description || "",
			employeeCount: department.employeeCount || 0,
			createdAt: department.createdAt,
			updatedAt: department.updatedAt,
		};
	}

	static async createDepartment(data) {
		const { name, head, description, employeeCount } = data;

		// Check if department with same name already exists
		const existingDepartment = await Department.findOne({ name });
		if (existingDepartment) {
			throw new AppError("Department with this name already exists", 400);
		}

		const department = new Department({
			name,
			head: head || "",
			description: description || "",
			employeeCount: employeeCount || 0,
		});
		await department.save();

		return {
			id: department._id.toString(),
			_id: department._id.toString(),
			name: department.name || "",
			head: department.head || "",
			description: department.description || "",
			employeeCount: department.employeeCount || 0,
			createdAt: department.createdAt,
			updatedAt: department.updatedAt,
		};
	}

	static async updateDepartment(id, data) {
		const department = await Department.findById(id);
		if (!department) {
			throw new AppError("Department not found", 404);
		}

		const { name, head, description, employeeCount } = data;

		// Check if name is being changed and if new name already exists
		if (name && name !== department.name) {
			const existingDepartment = await Department.findOne({ name, _id: { $ne: id } });
			if (existingDepartment) {
				throw new AppError("Department with this name already exists", 400);
			}
		}

		// Update fields
		if (name !== undefined) department.name = name;
		if (head !== undefined) department.head = head;
		if (description !== undefined) department.description = description;
		if (employeeCount !== undefined) department.employeeCount = employeeCount;

		await department.save();

		return {
			id: department._id.toString(),
			_id: department._id.toString(),
			name: department.name || "",
			head: department.head || "",
			description: department.description || "",
			employeeCount: department.employeeCount || 0,
			createdAt: department.createdAt,
			updatedAt: department.updatedAt,
		};
	}

	static async deleteDepartment(id) {
		const department = await Department.findById(id);
		if (!department) {
			throw new AppError("Department not found", 404);
		}

		// Check if department has employees
		if (department.employeeCount > 0) {
			throw new AppError("Cannot delete department with employees. Please reassign employees first.", 400);
		}

		await Department.findByIdAndDelete(id);
		return { message: "Department deleted successfully" };
	}
}

