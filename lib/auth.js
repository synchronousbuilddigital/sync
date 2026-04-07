import jwt from "jsonwebtoken";

export function verifyToken(req) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "sync_secret");
    return decoded;
  } catch (error) {
    return null;
  }
}
