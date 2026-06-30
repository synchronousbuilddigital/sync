import dbConnect from "@/lib/mongodb";
import ClientProject from "@/models/ClientProject";
import { verifyToken } from "@/lib/auth";

export const dynamic = 'force-dynamic';

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
    const { message, feed } = await req.json();
    
    let update = {};
    if (feed) {
      update = { $push: { feeds: { sender: "client", content: feed } } };
    } else {
      update = { $push: { discussions: { sender: "client", content: message } } };
    }

    const project = await ClientProject.findOneAndUpdate(
      { clientId: decoded.userId },
      update,
      { new: true }
    );

    if (!project) return Response.json({ success: false, message: "No project found" });
    
    return Response.json({ success: true, project });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "client") return Response.json({ success: false, message: "Client only" }, { status: 401 });

    await dbConnect();
    const body = await req.json();
    
    // Whitelist updateable fields
    const allowedUpdates = ["projectName", "description", "googleDriveLink", "credentials", "requirements", "features", "projectType"];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (body[field] !== undefined) updates[field] = body[field];
    });

    if (updates.googleDriveLink) {
      try {
        new URL(updates.googleDriveLink);
      } catch (e) {
        return Response.json({ success: false, message: "Invalid Google Drive URL" }, { status: 400 });
      }
    }

    const project = await ClientProject.findOneAndUpdate(
      { clientId: decoded.userId },
      { $set: updates },
      { new: true }
    );

    if (!project) return Response.json({ success: false, message: "No project found" });
    
    return Response.json({ success: true, project });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
