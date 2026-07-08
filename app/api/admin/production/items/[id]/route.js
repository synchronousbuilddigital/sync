import dbConnect from "@/lib/mongodb";
import ProductionItem from "@/models/ProductionItem";
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

    const item = await ProductionItem.findByIdAndUpdate(id, updateData, { new: true });
    if (!item) {
      return Response.json({ success: false, message: "Production item not found" }, { status: 404 });
    }
    return Response.json({ success: true, item });
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

    const item = await ProductionItem.findByIdAndDelete(id);
    if (!item) {
      return Response.json({ success: false, message: "Production item not found" }, { status: 404 });
    }
    return Response.json({ success: true, message: "Production item deleted" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
