import { getAuthenticatedUserId } from "@/lib/auth/server-auth";
import { ensureBackendUser } from "@/lib/server/user-location";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await ensureBackendUser(req, userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Failed to load backend user:", error);
    return NextResponse.json({ error: "Failed to load user" }, { status: 500 });
  }
}
