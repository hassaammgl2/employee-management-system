import asyncHandler from "express-async-handler";
import { DepartmentService } from "../services/department.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getAllDepartments = asyncHandler(async (req, res) => {
	const departments = await DepartmentService.getAllDepartments();
	return ApiResponse.success(res, {
		message: "Departments fetched successfully",
		data: departments,
	});
});

export const getDepartmentById = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const department = await DepartmentService.getDepartmentById(id);
	return ApiResponse.success(res, {
		message: "Department fetched successfully",
		data: department,
	});
});

export const createDepartment = asyncHandler(async (req, res) => {
	const department = await DepartmentService.createDepartment(req.body);
	return ApiResponse.success(res, {
		statusCode: 201,
		message: "Department created successfully",
		data: department,
	});
});

export const updateDepartment = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const department = await DepartmentService.updateDepartment(id, req.body);
	return ApiResponse.success(res, {
		message: "Department updated successfully",
		data: department,
	});
});

export const deleteDepartment = asyncHandler(async (req, res) => {
	const { id } = req.params;
	await DepartmentService.deleteDepartment(id);
	return ApiResponse.success(res, {
		message: "Department deleted successfully",
	});
});

