import dbConnect from "@/lib/mongodb";
import ProductionGalleryItem from "@/models/ProductionGalleryItem";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Admin only" }, { status: 401 });
    }

    await dbConnect();
    const items = await ProductionGalleryItem.find().sort({ index: 1, createdAt: -1 });
    return Response.json({ success: true, items });
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
    if (!data.title || !data.type || !data.mediaUrl) {
      return Response.json(
        { success: false, message: "Title, Type, and Media File are required" },
        { status: 400 }
      );
    }

    const item = await ProductionGalleryItem.create(data);
    return Response.json({ success: true, item });
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
    const { id, title, type, mediaUrl, thumbnailUrl, index } = await req.json();
    if (!id) {
      return Response.json({ success: false, message: "Missing item ID" }, { status: 400 });
    }

    const updatedItem = await ProductionGalleryItem.findByIdAndUpdate(
      id,
      { title, type, mediaUrl, thumbnailUrl, index },
      { new: true }
    );

    return Response.json({ success: true, item: updatedItem });
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
    const { id } = await req.json();
    if (!id) {
      return Response.json({ success: false, message: "Missing item ID" }, { status: 400 });
    }

    await ProductionGalleryItem.findByIdAndDelete(id);
    return Response.json({ success: true, message: "Gallery item deleted successfully" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
