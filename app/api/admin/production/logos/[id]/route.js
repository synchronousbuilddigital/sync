import dbConnect from "@/lib/mongodb";
import PartnerLogo from "@/models/PartnerLogo";
import { verifyToken } from "@/lib/auth";

export async function PATCH(req, { params }) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Admin only" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const updateData = await req.json();

    const logo = await PartnerLogo.findByIdAndUpdate(id, updateData, { new: true });
    if (!logo) {
      return Response.json({ success: false, message: "Partner logo not found" }, { status: 404 });
    }
    return Response.json({ success: true, logo });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Admin only" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    const logo = await PartnerLogo.findByIdAndDelete(id);
    if (!logo) {
      return Response.json({ success: false, message: "Partner logo not found" }, { status: 404 });
    }
    return Response.json({ success: true, message: "Partner logo deleted" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
