import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { sendOnboardingEmail } from "@/lib/mail";

export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") return Response.json({ success: false, message: "Admin only" }, { status: 401 });

    await dbConnect();
    const { name, email, password } = await req.json();
    
    // Find or create client user
    let client = await User.findOne({ email });
    
    if (client) {
      // If client exists, just return it. Optionally update name if needed.
      // return Response.json({ success: true, client, message: "Existing brand node synchronized." });
    } else {
      client = await User.create({
        name,
        email,
        password, // In a real app, hash this!
        role: "client",
        mustChangePassword: true
      });
      // Send the premium onboarding email only for new users
      await sendOnboardingEmail(email, name, password);
    }

    return Response.json({ success: true, client });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
