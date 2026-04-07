import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password, name } = await req.json();

    // Verify user exists and is intern
    const user = await User.findOne({ email, role: "intern" });
    if (!user) {
      return Response.json({ success: false, message: "Intern not found" }, { status: 404 });
    }

    // In a real app, this would use nodemailer/resend to send the email
    console.log(`[MAIL SIMULATION] Sending login credentials to: ${email}`);
    console.log(`
      Hello ${name},
      Welcome to Synchronous Build Digital. 
      Your intern portal has been established.

      Login URL: ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/login
      Username: ${email}
      Temporary Password: ${password || 'SyncIntern123'}

      Please change your password upon first login.
    `);

    return Response.json({ 
      success: true, 
      message: "Portal invite sent successfully",
      sentTo: email
    });

  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
