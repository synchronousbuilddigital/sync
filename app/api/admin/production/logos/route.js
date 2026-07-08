import dbConnect from "@/lib/mongodb";
import PartnerLogo from "@/models/PartnerLogo";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Admin only" }, { status: 401 });
    }

    await dbConnect();
    const logos = await PartnerLogo.find().sort({ index: 1, createdAt: -1 });
    return Response.json({ success: true, logos });
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
    const logo = await PartnerLogo.create(data);
    return Response.json({ success: true, logo });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
