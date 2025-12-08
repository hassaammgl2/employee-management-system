import asyncHandler from "express-async-handler";
import { AnnouncementService } from "../services/announcement.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getAllAnnouncements = asyncHandler(async (req, res) => {
	// Employees see only active announcements, admins see all
	const filter = req.user.role === "admin" ? {} : { isActive: true };
	const announcements = await AnnouncementService.getAllAnnouncements(filter);
	return ApiResponse.success(res, {
		message: "Announcements fetched successfully",
		data: announcements,
	});
});

export const getAnnouncementById = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const announcement = await AnnouncementService.getAnnouncementById(id);
	return ApiResponse.success(res, {
		message: "Announcement fetched successfully",
		data: announcement,
	});
});

export const createAnnouncement = asyncHandler(async (req, res) => {
	const announcementData = {
		...req.body,
		createdBy: req.user._id,
	};
	const announcement = await AnnouncementService.createAnnouncement(announcementData);
	return ApiResponse.success(res, {
		statusCode: 201,
		message: "Announcement created successfully",
		data: announcement,
	});
});

export const updateAnnouncement = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const announcement = await AnnouncementService.updateAnnouncement(id, req.body);
	return ApiResponse.success(res, {
		message: "Announcement updated successfully",
		data: announcement,
	});
});

export const deleteAnnouncement = asyncHandler(async (req, res) => {
	const { id } = req.params;
	await AnnouncementService.deleteAnnouncement(id);
	return ApiResponse.success(res, {
		message: "Announcement deleted successfully",
	});
});
