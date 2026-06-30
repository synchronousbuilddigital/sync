import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { sendOnboardingEmail } from "@/lib/mail";

export const dynamic = 'force-dynamic';

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
    const { name, email, password, department } = await req.json();

    let finalEmail = email ? email.toLowerCase().trim() : "";
    if (!finalEmail || !finalEmail.endsWith("@synchronous.com")) {
      const cleanName = (name || "user").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
      finalEmail = `${cleanName}@synchronous.com`;
    }

    // Ensure uniqueness
    let count = 1;
    let checkEmail = finalEmail;
    while (await User.findOne({ email: checkEmail })) {
      const base = finalEmail.replace("@synchronous.com", "");
      checkEmail = `${base}${count}@synchronous.com`;
      count++;
    }
    finalEmail = checkEmail;

    const emailPrefix = finalEmail.replace("@synchronous.com", "");
    const defaultPassword = (!password || password === "password123" || /^[a-z0-9]+123$/i.test(password)) ? `${emailPrefix}123` : password;

    const intern = await User.create({
      name,
      email: finalEmail,
      password: defaultPassword,
      role: "intern",
      department: department || "Tech",
      mustChangePassword: true,
    });

    try {
      await sendOnboardingEmail(finalEmail, name, defaultPassword);
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
