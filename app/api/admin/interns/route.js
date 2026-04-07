import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") return Response.json({ success: false, message: "Admin only" }, { status: 401 });

    await dbConnect();
    const interns = await User.find({ role: "intern" }).select("-password");
    return Response.json({ success: true, interns });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") return Response.json({ success: false, message: "Admin only" }, { status: 401 });

    await dbConnect();
    const { name, email } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ success: false, message: "Intern with this email already exists" }, { status: 400 });
    }

    const defaultPassword = "SyncIntern123"; // Or generate random
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const intern = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "intern",
      mustChangePassword: true,
    });

    return Response.json({ success: true, intern: { ...intern._doc, password: defaultPassword } });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
