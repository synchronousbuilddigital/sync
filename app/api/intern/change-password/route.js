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

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(decoded.id, { 
      password: hashedPassword, 
      mustChangePassword: false 
    });

    return Response.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
