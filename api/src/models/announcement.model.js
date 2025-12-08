import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true
		},
		message: {
			type: String,
			required: true,
			trim: true
		},
		priority: {
			type: String,
			enum: ["low", "medium", "high"],
			default: "medium"
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		isActive: {
			type: Boolean,
			default: true
		}
	},
	{ timestamps: true }
);

const Announcement = mongoose.model("Announcement", announcementSchema);
export default Announcement;
