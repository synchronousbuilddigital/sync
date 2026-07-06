import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Evaluated once when the server/build starts up so it stays constant across requests
const SERVER_STARTUP_VERSION = "build-" + (
  process.env.VERCEL_GIT_COMMIT_SHA || 
  process.env.VERCEL_DEPLOYMENT_ID || 
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 
  process.env.NEXT_BUILD_ID || 
  process.env.VERCEL_URL || 
  "static-build-v1"
);

export async function GET() {
  if (process.env.NODE_ENV === "development") {
    return NextResponse.json({
      commit: "development-mode",
      timestamp: 0
    });
  }

  return NextResponse.json({
    commit: SERVER_STARTUP_VERSION,
    timestamp: process.env.VERCEL_GIT_COMMIT_TIMESTAMP || 0
  }, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    }
  });
}
