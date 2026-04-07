import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Task from "@/models/Task";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const intern = await User.findById(id);
    if (!intern || intern.role !== "intern") {
      return Response.json({ success: false, message: "Intern not found" }, { status: 404 });
    }

    await User.findByIdAndDelete(id);
    await Task.deleteMany({ internId: id });

    return Response.json({ success: true, message: "Intern removed successfully" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
