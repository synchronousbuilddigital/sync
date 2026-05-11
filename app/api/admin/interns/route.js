import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { sendOnboardingEmail } from "@/lib/mail";

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
    const { name, email, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ success: false, message: "Intern with this email already exists" }, { status: 400 });
    }

    const defaultPassword = password || "SyncIntern123";

    const intern = await User.create({
      name,
      email,
      password: defaultPassword,
      role: "intern",
      mustChangePassword: true,
    });

    try {
      await sendOnboardingEmail(email, name, defaultPassword);
    } catch (mailErr) {
      console.error("Failed to send onboarding email:", mailErr);
    }

    const internObj = intern.toObject();
    delete internObj.password;

    return Response.json({ 
      success: true, 
      intern: { ...internObj, password: defaultPassword } 
    });
  } catch (err) {
    console.error("Error in /api/admin/interns POST:", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
