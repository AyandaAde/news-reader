import { getAuthenticatedUserId } from "@/lib/auth/server-auth";
import { getNewsReaderPodcastsByClerkId } from "@/lib/news-reader-api";
import { ensureBackendUser } from "@/lib/server/user-location";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureBackendUser(req, userId);
    const podcasts = await getNewsReaderPodcastsByClerkId(userId);

    return NextResponse.json({ podcasts });
  } catch (error) {
    console.error("Failed to load podcasts:", error);
    return NextResponse.json({ error: "Failed to load podcasts" }, { status: 500 });
  }
}
