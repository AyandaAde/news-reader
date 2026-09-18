import { getAuthenticatedUserId } from "@/lib/auth/server-auth";
import { updateNewsReaderLanguageSettings } from "@/lib/news-reader-api";
import {
  LANGUAGE_OPTIONS,
  PREMIUM_PODCAST_LANGUAGE_OPTIONS,
} from "@/lib/platform-settings";
import { ensureBackendUser } from "@/lib/server/user-location";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_LANGUAGES = new Set(
  LANGUAGE_OPTIONS.map((option) => option.value),
);

const ALLOWED_PODCAST_LOCALES = new Set([
  ...LANGUAGE_OPTIONS.map((option) => option.value),
  ...PREMIUM_PODCAST_LANGUAGE_OPTIONS.map((option) => option.value),
]);

type UpdateLanguageSettingsBody = {
  language?: string;
  locale?: string;
  podcastLocale?: string;
};

export async function PUT(req: NextRequest) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await ensureBackendUser(req, userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = (await req.json()) as UpdateLanguageSettingsBody;
    const language =
      typeof body.locale === "string" && body.locale.trim()
        ? body.locale.trim().toLowerCase()
        : typeof body.language === "string"
          ? body.language.trim().toLowerCase()
          : "";

    if (!ALLOWED_LANGUAGES.has(language)) {
      return NextResponse.json({ error: "Invalid language." }, { status: 400 });
    }

    const podcastLocale =
      typeof body.podcastLocale === "string" && body.podcastLocale.trim()
        ? body.podcastLocale.trim().toLowerCase()
        : undefined;

    if (podcastLocale && !ALLOWED_PODCAST_LOCALES.has(podcastLocale)) {
      return NextResponse.json(
        { error: "Invalid podcast locale." },
        { status: 400 },
      );
    }

    const updated = await updateNewsReaderLanguageSettings(userId, {
      language,
      podcastLocale,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update language settings" },
        { status: 502 },
      );
    }

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Failed to update language settings:", error);
    return NextResponse.json(
      { error: "Failed to update language settings" },
      { status: 500 },
    );
  }
}
