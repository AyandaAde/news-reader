import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUserId } from "@/lib/auth/server-auth";
import { fetchNewsReaderDailyPodcastAudio } from "@/lib/news-reader-api";
import { appendUserPodcast, type UserPodcast } from "@/lib/mongo";
import { ensureBackendUser } from "@/lib/server/user-location";

export const maxDuration = 300;

type CreateAudioBody = {
  podcastId?: string;
  podcastName?: string;
  imageUrl?: string | null;
  description?: string | null;
  tags?: string[];
};

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!blobToken) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN is not configured." },
      { status: 500 },
    );
  }

  try {
    const user = await ensureBackendUser(req, userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = (await req.json()) as CreateAudioBody;
    const podcastId = readString(body.podcastId);
    const podcastName = readString(body.podcastName) || "Daily Podcast";
    const imageUrl = readString(body.imageUrl) || null;
    const description = readString(body.description) || null;
    const tags = Array.isArray(body.tags)
      ? body.tags
          .filter((tag): tag is string => typeof tag === "string")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    if (!podcastId) {
      return NextResponse.json(
        { error: "podcastId is required." },
        { status: 400 },
      );
    }

    const audio = await fetchNewsReaderDailyPodcastAudio(podcastId);
    if (!audio) {
      return NextResponse.json(
        { error: "Failed to fetch podcast audio from News.Reader." },
        { status: 502 },
      );
    }

    const podcastRecordId = randomUUID();
    const blobPath = `podcasts/${userId}/${podcastRecordId}.wav`;
    const blob = await put(blobPath, Buffer.from(audio), {
      access: "public",
      contentType: "audio/wav",
      token: blobToken,
      addRandomSuffix: false,
    });

    const podcast: UserPodcast = {
      id: podcastRecordId,
      userId,
      podcastName,
      imageUrl,
      description,
      tags,
      audioUrl: blob.url,
      createdAt: new Date().toISOString(),
    };

    await appendUserPodcast(userId, podcast);

    return NextResponse.json({
      success: true,
      podcast,
    });
  } catch (error) {
    console.error("Failed to create podcast audio blob:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create podcast audio",
      },
      { status: 500 },
    );
  }
}
