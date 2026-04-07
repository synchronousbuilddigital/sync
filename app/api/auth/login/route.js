import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ success: false, message: "Invalid email" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Check if it's the first login with the default password for interns
      // We set a default password for interns when added
      return Response.json({ success: false, message: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, mustChangePassword: user.mustChangePassword },
      process.env.JWT_SECRET || "sync_secret",
      { expiresIn: "10d" }
    );

    return Response.json({ 
      success: true, 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        mustChangePassword: user.mustChangePassword 
      } 
    });

  } catch (error) {
    console.error("Login route error:", error);
    return Response.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}
