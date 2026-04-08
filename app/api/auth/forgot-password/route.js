import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import { sendForgotPasswordEmail } from "@/lib/mail";

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists for security
      return Response.json({ success: true, message: "If an account exists with this email, a reset link will be sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const resetLink = `${BASE_URL}/reset-password?token=${resetToken}`;

    try {
      await sendForgotPasswordEmail(email, user.name, resetLink);
    } catch (mailErr) {
      console.error("Mail Error:", mailErr);
      return Response.json({ success: false, message: "Failed to send email" }, { status: 500 });
    }

    return Response.json({ success: true, message: "Security protocol initiated. Check your inbox." });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
