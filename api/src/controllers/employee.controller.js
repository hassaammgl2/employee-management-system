import asyncHandler from "express-async-handler";
import { EmployeeService } from "../services/employee.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getAllEmployees = asyncHandler(async (req, res) => {
	const employees = await EmployeeService.getAllEmployees();
	return ApiResponse.success(res, {
		message: "Employees fetched successfully",
		data: employees,
	});
});

export const getEmployeeById = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const employee = await EmployeeService.getEmployeeById(id);
	return ApiResponse.success(res, {
		message: "Employee fetched successfully",
		data: employee,
	});
});

export const createEmployee = asyncHandler(async (req, res) => {
	const employee = await EmployeeService.createEmployee(req.body);
	return ApiResponse.success(res, {
		statusCode: 201,
		message: "Employee created successfully",
		data: employee,
	});
});

export const updateEmployee = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const employee = await EmployeeService.updateEmployee(id, req.body);
	return ApiResponse.success(res, {
		message: "Employee updated successfully",
		data: employee,
	});
});

export const deleteEmployee = asyncHandler(async (req, res) => {
	const { id } = req.params;
	await EmployeeService.deleteEmployee(id);
	return ApiResponse.success(res, {
		message: "Employee deleted successfully",
	});
});

