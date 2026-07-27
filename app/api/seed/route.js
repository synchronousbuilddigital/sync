import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();
    const email = "synchronous.build.digital@gmail.com";
    const password = "Devam@56789";

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      existingAdmin.password = password;
      existingAdmin.role = "admin";
      existingAdmin.mustChangePassword = false;
      await existingAdmin.save();
    } else {
      await User.create({
        name: "Admin",
        email: email,
        password: password,
        role: "admin",
        mustChangePassword: false
      });
    }

    return Response.json({ success: true, message: "Admin seeded successfully" });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
