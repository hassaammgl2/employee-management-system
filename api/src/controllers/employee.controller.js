import asyncHandler from "express-async-handler";
import { EmployeeService } from "../services/employee.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

class Employee {
	getAllEmployees = asyncHandler(async (req, res) => {
		const employees = await EmployeeService.getAllEmployees(req.query);
		return ApiResponse.success(res, {
			message: "Employees fetched successfully",
			data: employees,
		});
	});

	getEmployeeById = asyncHandler(async (req, res) => {
		const { id } = req.params;
		const employee = await EmployeeService.getEmployeeById(id);
		return ApiResponse.success(res, {
			message: "Employee fetched successfully",
			data: employee,
		});
	});

	createEmployee = asyncHandler(async (req, res) => {
		const employee = await EmployeeService.createEmployee(req.body);
		return ApiResponse.success(res, {
			statusCode: 201,
			message: "Employee created successfully",
			data: employee,
		});
	});

	updateEmployee = asyncHandler(async (req, res) => {
		const { id } = req.params;
		const employee = await EmployeeService.updateEmployee(id, req.body);
		return ApiResponse.success(res, {
			message: "Employee updated successfully",
			data: employee,
		});
	});

	deleteEmployee = asyncHandler(async (req, res) => {
		const { id } = req.params;
		await EmployeeService.deleteEmployee(id);
		return ApiResponse.success(res, {
			message: "Employee deleted successfully",
		});
	});
}

export const employee = new Employee();
