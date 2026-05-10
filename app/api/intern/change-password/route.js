import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/auth";

export async function PATCH(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { newPassword } = await req.json();

    const user = await User.findById(decoded.id);
    if (!user) return Response.json({ success: false, message: "User not found" }, { status: 404 });

    user.password = newPassword;
    user.mustChangePassword = false;
    await user.save();

    return Response.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
