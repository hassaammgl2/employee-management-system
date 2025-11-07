import mongoose from "mongoose";

const employeeProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department"
    },
    roleTitle: {
      type: String,
      trim: true
    },
    salary: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["active", "on_leave", "terminated"],
      default: "active"
    },
    joinDate: { type: Date },
    avatar: { type: String },
  },
  { timestamps: true }
);

const EmployeeProfile = mongoose.model("EmployeeProfile", employeeProfileSchema);
export default EmployeeProfile;


