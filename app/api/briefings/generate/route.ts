import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUserId } from "@/lib/auth/server-auth";
import {
  fetchNewsReaderDailyPodcastAudio,
  generateNewsReaderDailyPodcast,
} from "@/lib/news-reader-api";
import { appendUserPodcast, type UserPodcast } from "@/lib/mongo";
import { LANGUAGE_OPTIONS } from "@/lib/platform-settings";
import { ensureBackendUser } from "@/lib/server/user-location";

export const maxDuration = 300;

type GenerateBriefingBody = {
  topics?: string[];
  language?: string;
  durationMinutes?: number;
  instructions?: string | null;
  podcastName?: string;
  imageUrl?: string | null;
  description?: string | null;
};

function resolveLanguageLabel(language: string) {
  const trimmed = language.trim();
  return (
    LANGUAGE_OPTIONS.find((option) => option.value === trimmed)?.label ??
    trimmed
  );
}

export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await ensureBackendUser(req, userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = (await req.json()) as GenerateBriefingBody;
    const topics = Array.isArray(body.topics)
      ? body.topics
          .filter((topic): topic is string => typeof topic === "string")
          .map((topic) => topic.trim())
          .filter(Boolean)
      : [];
    const language =
      typeof body.language === "string" ? body.language.trim() : "";
    const durationMinutes =
      typeof body.durationMinutes === "number" &&
      Number.isFinite(body.durationMinutes)
        ? Math.round(body.durationMinutes)
        : null;
    const instructions =
      typeof body.instructions === "string" ? body.instructions.trim() : null;
    const podcastName =
      typeof body.podcastName === "string" && body.podcastName.trim()
        ? body.podcastName.trim()
        : null;
    const imageUrl =
      typeof body.imageUrl === "string" && body.imageUrl.trim()
        ? body.imageUrl.trim()
        : null;
    const description =
      typeof body.description === "string" && body.description.trim()
        ? body.description.trim()
        : null;

    if (topics.length === 0) {
      return NextResponse.json(
        { error: "At least one topic is required." },
        { status: 400 },
      );
    }

    if (!language) {
      return NextResponse.json(
        { error: "language is required." },
        { status: 400 },
      );
    }

    if (durationMinutes === null) {
      return NextResponse.json(
        { error: "durationMinutes is required." },
        { status: 400 },
      );
    }

    const result = await generateNewsReaderDailyPodcast({
      clerkUserId: userId,
      topics,
      language: resolveLanguageLabel(language),
      durationMinutes,
      instructions,
    });

    if (!result?.success || !result.podcastId || !result.audioUrl) {
      return NextResponse.json(
        { error: "Failed to generate podcast" },
        { status: 502 },
      );
    }

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();
    let audioUrl = `/api/podcasts/${result.podcastId}/audio`;
    let podcast: UserPodcast | null = null;

    if (blobToken) {
      const audio = await fetchNewsReaderDailyPodcastAudio(result.podcastId);
      if (audio) {
        const podcastRecordId = randomUUID();
        const blob = await put(
          `podcasts/${userId}/${podcastRecordId}.wav`,
          Buffer.from(audio),
          {
            access: "public",
            contentType: "audio/wav",
            token: blobToken,
            addRandomSuffix: false,
          },
        );

        podcast = await appendUserPodcast(userId, {
          id: podcastRecordId,
          userId,
          podcastName: podcastName || result.title || "Daily Podcast",
          imageUrl,
          description,
          tags: topics,
          audioUrl: blob.url,
          createdAt: new Date().toISOString(),
        });
        audioUrl = blob.url;
      }
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      podcastId: podcast?.id ?? result.podcastId,
      title: podcast?.podcastName ?? result.title,
      audioUrl,
      audioChunkCount: result.audioChunkCount,
      audioGeneratedAt: result.audioGeneratedAt,
      podcast,
    });
  } catch (error) {
    console.error("Failed to generate daily podcast:", error);
    return NextResponse.json(
      { error: "Failed to generate podcast" },
      { status: 500 },
    );
  }
}
