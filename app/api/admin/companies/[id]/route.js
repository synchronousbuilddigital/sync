import dbConnect from "@/lib/mongodb";
import Company from "@/models/Company";
import { verifyToken } from "@/lib/auth";

// PATCH - add department or task type to a company
export async function PATCH(req, { params }) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Admin only" }, { status: 401 });
    }
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const company = await Company.findById(id);
    if (!company) return Response.json({ success: false, message: "Company not found" }, { status: 404 });

    // Add a new department
    if (body.addDepartment) {
      const exists = company.departments.find(d => d.name.toLowerCase() === body.addDepartment.toLowerCase() && d.mainDepartment === (body.mainDepartment || "Digital Marketing"));
      if (exists) return Response.json({ success: false, message: "Department already exists in this branch" }, { status: 409 });
      company.departments.push({ name: body.addDepartment, mainDepartment: body.mainDepartment || "Digital Marketing", taskTypes: [] });
    }

    // Add a task type to a department
    if (body.addTaskType && body.departmentId) {
      const dept = company.departments.id(body.departmentId);
      if (!dept) return Response.json({ success: false, message: "Department not found" }, { status: 404 });
      const taskExists = dept.taskTypes.find(t => t.name.toLowerCase() === body.addTaskType.toLowerCase());
      if (taskExists) return Response.json({ success: false, message: "Task type already exists" }, { status: 409 });
      dept.taskTypes.push({ name: body.addTaskType, description: body.description || "" });
    }

    // Update company name
    if (body.name) {
      company.name = body.name;
    }

    await company.save();
    return Response.json({ success: true, company });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE a company
export async function DELETE(req, { params }) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Admin only" }, { status: 401 });
    }
    await dbConnect();
    const { id } = await params;
    await Company.findByIdAndDelete(id);
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
