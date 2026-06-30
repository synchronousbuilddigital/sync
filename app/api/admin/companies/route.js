import dbConnect from "@/lib/mongodb";
import Company from "@/models/Company";
import { verifyToken } from "@/lib/auth";

// GET all companies
export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Admin only" }, { status: 401 });
    }
    await dbConnect();
    const companies = await Company.find({}).sort({ name: 1 });
    return Response.json({ success: true, companies });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

// POST - create a new company
export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Admin only" }, { status: 401 });
    }
    await dbConnect();
    const { name } = await req.json();
    if (!name) return Response.json({ success: false, message: "Company name required" }, { status: 400 });

    const existing = await Company.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    if (existing) return Response.json({ success: false, message: "Company already exists" }, { status: 409 });

    const company = await Company.create({ name, departments: [] });
    return Response.json({ success: true, company });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
