import dbConnect from "@/lib/mongodb";
import ClientProject from "@/models/ClientProject";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "client") return Response.json({ success: false, message: "Client only" }, { status: 401 });

    await dbConnect();
    const project = await ClientProject.findOne({ clientId: decoded.userId }).populate("clientId", "name email");
    
    if (!project) return Response.json({ success: false, message: "No project found for this account" });
    
    return Response.json({ success: true, project });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "client") return Response.json({ success: false, message: "Client only" }, { status: 401 });

    await dbConnect();
    const { message } = await req.json();
    
    const project = await ClientProject.findOneAndUpdate(
      { clientId: decoded.userId },
      { $push: { discussions: { sender: "client", content: message } } },
      { new: true }
    );

    if (!project) return Response.json({ success: false, message: "No project found" });
    
    return Response.json({ success: true, project });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
