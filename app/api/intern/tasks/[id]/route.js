import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/auth";

export async function PATCH(req, { params }) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const { status, note, isApproved } = await req.json();

    let query = { _id: id };
    if (decoded.role === "intern") {
      query.internId = decoded.id;
    }

    const updateData = { status, note };
    if (isApproved !== undefined) updateData.isApproved = isApproved;

    const task = await Task.findOneAndUpdate(
      query, 
      updateData, 
      { returnDocument: 'after' }
    );

    if (!task) {
      return Response.json({ success: false, message: "Task not found or access denied" }, { status: 404 });
    }

    return Response.json({ success: true, task });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
