import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function DELETE(req, { params }) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") return Response.json({ success: false, message: "Admin only" }, { status: 401 });

    await dbConnect();
    await User.findByIdAndDelete(params.id);
    
    return Response.json({ success: true, message: "Brand manager deleted" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") return Response.json({ success: false, message: "Admin only" }, { status: 401 });

    await dbConnect();
    const updateData = await req.json();
    
    // Do not allow role change via this route
    delete updateData.role;
    
    // Hash password if updating
    if (updateData.password) {
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updated = await User.findByIdAndUpdate(params.id, updateData, { new: true });
    
    return Response.json({ success: true, client: updated });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
