import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// POST /api/push/subscribe — save a push subscription for the logged-in user
export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { subscription } = await req.json();
    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return Response.json({ success: false, message: "Invalid subscription object" }, { status: 400 });
    }

    await dbConnect();

    // Add subscription if not already stored (deduplicate by endpoint)
    await User.findByIdAndUpdate(decoded.id, {
      $pull: { pushSubscriptions: { endpoint: subscription.endpoint } }
    });
    await User.findByIdAndUpdate(decoded.id, {
      $push: {
        pushSubscriptions: {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth
          }
        }
      }
    });

    return Response.json({ success: true, message: "Push subscription saved" });
  } catch (err) {
    console.error("[Push Subscribe] Error:", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE /api/push/subscribe — remove a push subscription (on logout/unsub)
export async function DELETE(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { endpoint } = await req.json();
    if (!endpoint) return Response.json({ success: false, message: "Missing endpoint" }, { status: 400 });

    await dbConnect();
    await User.findByIdAndUpdate(decoded.id, {
      $pull: { pushSubscriptions: { endpoint } }
    });

    return Response.json({ success: true, message: "Push subscription removed" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
