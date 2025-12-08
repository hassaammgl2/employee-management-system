import Announcement from "../models/announcement.model.js";

export class AnnouncementService {
	static async getAllAnnouncements(filter = {}) {
		const announcements = await Announcement.find(filter)
			.populate("createdBy", "name email")
			.sort({ createdAt: -1 });
		return announcements;
	}

	static async getAnnouncementById(id) {
		const announcement = await Announcement.findById(id).populate("createdBy", "name email");
		if (!announcement) {
			throw new Error("Announcement not found");
		}
		return announcement;
	}

	static async createAnnouncement(data) {
		const announcement = await Announcement.create(data);
		return announcement.populate("createdBy", "name email");
	}

	static async updateAnnouncement(id, data) {
		const announcement = await Announcement.findByIdAndUpdate(
			id,
			data,
			{ new: true, runValidators: true }
		).populate("createdBy", "name email");
		
		if (!announcement) {
			throw new Error("Announcement not found");
		}
		return announcement;
	}

	static async deleteAnnouncement(id) {
		const announcement = await Announcement.findByIdAndDelete(id);
		if (!announcement) {
			throw new Error("Announcement not found");
		}
		return announcement;
	}
}
