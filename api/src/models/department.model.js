import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    head: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    employeeCount: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);
export default Department;


 