import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();
    const { token, newPassword } = await req.json();

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return Response.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    user.mustChangePassword = false;
    await user.save();

    return Response.json({ success: true, message: "Access credentials updated successfully." });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
