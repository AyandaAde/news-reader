import { getAuthenticatedUserId } from "@/lib/auth/server-auth";
import { fetchNewsReaderDailyPodcastAudio } from "@/lib/news-reader-api";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300;

type RouteContext = {
  params: Promise<{ podcastId: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { podcastId } = await context.params;

  if (!podcastId?.trim()) {
    return NextResponse.json({ error: "podcastId is required." }, { status: 400 });
  }

  try {
    const audio = await fetchNewsReaderDailyPodcastAudio(podcastId.trim());

    if (!audio) {
      return NextResponse.json({ error: "Audio not found" }, { status: 404 });
    }

    return new NextResponse(Buffer.from(audio), {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "private, max-age=3600",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error) {
    console.error("Failed to fetch daily podcast audio:", error);
    return NextResponse.json(
      { error: "Failed to fetch podcast audio" },
      { status: 500 },
    );
  }
}
