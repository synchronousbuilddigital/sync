import dbConnect from "@/lib/mongodb";
import ProductionCategory from "@/models/ProductionCategory";
import ProductionItem from "@/models/ProductionItem";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Admin only" }, { status: 401 });
    }

    await dbConnect();
    const categories = await ProductionCategory.find().sort({ index: 1, name: 1 });
    return Response.json({ success: true, categories });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Admin only" }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();
    if (!data.name || !data.image) {
      return Response.json({ success: false, message: "Name and image file are required" }, { status: 400 });
    }

    const category = await ProductionCategory.create(data);
    return Response.json({ success: true, category });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Admin only" }, { status: 401 });
    }

    await dbConnect();
    const { id, name, image, index, oldName } = await req.json();
    if (!id) {
      return Response.json({ success: false, message: "Missing category ID" }, { status: 400 });
    }

    const updatedCategory = await ProductionCategory.findByIdAndUpdate(
      id,
      { name, image, index },
      { new: true }
    );

    // If category name was renamed, update all production items under this category name as well
    if (oldName && name && oldName !== name) {
      await ProductionItem.updateMany({ category: oldName }, { category: name });
    }

    return Response.json({ success: true, category: updatedCategory });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Admin only" }, { status: 401 });
    }

    await dbConnect();
    const { id, name } = await req.json();
    if (!id) {
      return Response.json({ success: false, message: "Missing category ID" }, { status: 400 });
    }

    await ProductionCategory.findByIdAndDelete(id);

    // If category name is provided, delete all reels in this category too
    if (name) {
      await ProductionItem.deleteMany({ category: name });
    }

    return Response.json({ success: true, message: "Category and reels deleted successfully" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
