import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { sendOnboardingEmail } from "@/lib/mail";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password, name } = await req.json();

    // Verify user exists and is intern
    const user = await User.findOne({ email, role: "intern" });
    if (!user) {
      return Response.json({ success: false, message: "Intern not found" }, { status: 404 });
    }

    // Send actual email via Nodemailer
    try {
      await sendOnboardingEmail(email, name, password || 'SyncIntern123');
    } catch (mailErr) {
      console.error("Failed to transmit invite email", mailErr);
      return Response.json({ success: false, message: "Credential transmission failed" }, { status: 500 });
    }

    return Response.json({ 
      success: true, 
      message: "Portal invite sent successfully",
      sentTo: email
    });

  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
