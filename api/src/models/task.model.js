import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true
		},
		description: {
			type: String,
			trim: true
		},
		assignedTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		dueDate: { type: Date },
		priority: {
			type: String,
			enum: ["low", "medium", "high"],
			default: "medium",
		},
		completed: {
			type: Boolean,
			default: false
		},
	},
	{ timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
