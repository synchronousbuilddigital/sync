import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { sendAnnouncementEmail } from "@/lib/mail";

export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") return Response.json({ success: false, message: "Admin only" }, { status: 401 });

    await dbConnect();
    const { message } = await req.json();

    const interns = await User.find({ role: "intern" });
    
    // Send emails in parallel but catch errors so one failure doesn't stop others
    const emailPromises = interns.map(intern => 
      sendAnnouncementEmail(intern.email, intern.name, message)
        .catch(err => console.error(`Failed to email ${intern.email}:`, err))
    );

    await Promise.all(emailPromises);

    return Response.json({ success: true, message: `Broadcast successfully deployed to ${interns.length} targets.` });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
