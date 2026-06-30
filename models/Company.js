import mongoose from "mongoose";

const TaskTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" }
});

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mainDepartment: { type: String, enum: ["Tech", "Digital Marketing"], default: "Digital Marketing" },
  taskTypes: [TaskTypeSchema]
});

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  departments: [DepartmentSchema]
}, { timestamps: true });

export default mongoose.models.Company || mongoose.model("Company", CompanySchema);
