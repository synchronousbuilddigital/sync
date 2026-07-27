import { verifyToken } from "@/lib/auth";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const roomName = searchParams.get('roomName');

    if (!roomName) {
      return Response.json({ success: false, message: "Room name is required" }, { status: 400 });
    }

    // Jitsi 8x8 (JaaS) Credentials
    const JAAS_APP_ID = process.env.JAAS_APP_ID; 
    const JAAS_API_KEY = process.env.JAAS_API_KEY; 
    const JAAS_PRIVATE_KEY = process.env.JAAS_PRIVATE_KEY;

    if (!JAAS_APP_ID || !JAAS_API_KEY || !JAAS_PRIVATE_KEY) {
      // If credentials are not set yet, we return a success but no token, 
      // the frontend will fallback to free Jitsi which might have limits,
      // or we can just return a basic token for testing.
      console.warn("JaaS credentials are not configured in .env. Falling back to free Jitsi.");
      return Response.json({ success: true, token: null });
    }

    // Reformat private key if needed (replace literal \n with actual newlines)
    const privateKey = JAAS_PRIVATE_KEY.replace(/\\n/g, '\n');

    const payload = {
      aud: "jitsi",
      iss: "chat",
      sub: JAAS_APP_ID,
      room: "*", 
      context: {
        user: {
          name: decoded.name || "User",
          email: decoded.email || "",
          id: decoded.id
        },
        features: {
          recording: true,
          livestreaming: true,
          "screen-sharing": true
        }
      }
    };

    const token = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      keyid: JAAS_API_KEY,
      expiresIn: "2h"
    });

    return Response.json({ success: true, token });
  } catch (err) {
    console.error("Token generation error:", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
