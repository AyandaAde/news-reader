import { getAuthenticatedUserId } from "@/lib/auth/server-auth";
import { updateNewsReaderNotificationSettings } from "@/lib/news-reader-api";
import { ensureBackendUser } from "@/lib/server/user-location";
import { NextRequest, NextResponse } from "next/server";

type UpdateNotificationSettingsBody = {
  briefReadyNotifications?: boolean;
  newEpisodeNotifications?: boolean;
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

    const body = (await req.json()) as UpdateNotificationSettingsBody;
    const hasBriefReady = typeof body.briefReadyNotifications === "boolean";
    const hasNewEpisode = typeof body.newEpisodeNotifications === "boolean";

    if (!hasBriefReady && !hasNewEpisode) {
      return NextResponse.json(
        {
          error:
            "briefReadyNotifications or newEpisodeNotifications is required.",
        },
        { status: 400 },
      );
    }

    const updated = await updateNewsReaderNotificationSettings(userId, {
      ...(hasBriefReady
        ? { briefReadyNotifications: body.briefReadyNotifications }
        : {}),
      ...(hasNewEpisode
        ? { newEpisodeNotifications: body.newEpisodeNotifications }
        : {}),
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update notification settings" },
        { status: 502 },
      );
    }

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Failed to update notification settings:", error);
    return NextResponse.json(
      { error: "Failed to update notification settings" },
      { status: 500 },
    );
  }
}
