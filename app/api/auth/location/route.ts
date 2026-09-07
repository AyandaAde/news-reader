import { clerkClient } from "@clerk/nextjs/server";
import { getAuthenticatedUserId } from "@/lib/auth/server-auth";
import { getIpInfoToken } from "@/env";
import { getRequestIp } from "@/lib/auth/get-request-ip";
import { lookupIpLocation } from "@/lib/ipinfo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId();

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = getIpInfoToken();
  if (!token) {
    console.error("IPINFO_TOKEN or IP_INFO_API_KEY is not set");
    return NextResponse.json({ error: "Location service unavailable" }, { status: 503 });
  }

  const ip = getRequestIp(req);
  if (!ip) return NextResponse.json({ error: "Could not determine IP address" }, { status: 400 });

  const location = await lookupIpLocation(ip);
  if (!location) return NextResponse.json({ error: "Location lookup failed" }, { status: 502 });

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    await client.users.updateUserMetadata(userId, {
      unsafeMetadata: {
        ...user.unsafeMetadata,
        loginLocation: {
          ...location,
          updatedAt: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({ saved: true, location });
  } catch (error) {
    console.error("Failed to save login location:", error);
    return NextResponse.json({ error: "Failed to save location" }, { status: 500 });
  }
}
