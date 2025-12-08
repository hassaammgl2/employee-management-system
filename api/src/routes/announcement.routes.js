import express from "express";
import {
	getAllAnnouncements,
	getAnnouncementById,
	createAnnouncement,
	updateAnnouncement,
	deleteAnnouncement,
} from "../controllers/announcement.controller.js";
import { protect, admin } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Public routes (for all authenticated users)
router.get("/", getAllAnnouncements);
router.get("/:id", getAnnouncementById);

// Admin-only routes
router.post("/", admin, createAnnouncement);
router.patch("/:id", admin, updateAnnouncement);
router.delete("/:id", admin, deleteAnnouncement);

export default router;
