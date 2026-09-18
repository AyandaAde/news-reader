import { getAuthenticatedUserId } from "@/lib/auth/server-auth";
import {
  updateNewsReaderBriefingRoutine,
  type NewsReaderBriefingRoutineSlot,
} from "@/lib/news-reader-api";
import { ensureBackendUser } from "@/lib/server/user-location";
import { NextRequest, NextResponse } from "next/server";

const MAX_BRIEFING_ROUTINE_ITEMS = 6;

type UpdateBriefingRoutineBody = {
  briefingRoutine?: NewsReaderBriefingRoutineSlot[];
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

    const body = (await req.json()) as UpdateBriefingRoutineBody;
    const briefingRoutine = Array.isArray(body.briefingRoutine)
      ? body.briefingRoutine
      : null;

    if (!briefingRoutine) {
      return NextResponse.json(
        { error: "briefingRoutine is required." },
        { status: 400 },
      );
    }

    if (briefingRoutine.length > MAX_BRIEFING_ROUTINE_ITEMS) {
      return NextResponse.json(
        {
          error: `Briefing routine can have at most ${MAX_BRIEFING_ROUTINE_ITEMS} items.`,
        },
        { status: 400 },
      );
    }

    const updated = await updateNewsReaderBriefingRoutine(
      userId,
      briefingRoutine.map((slot, index) => ({
        id: slot.id || `${slot.type}-${index}`,
        type: slot.type,
        label: slot.label,
        podcastId: slot.podcastId ?? null,
      })),
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update briefing routine" },
        { status: 502 },
      );
    }

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Failed to update briefing routine:", error);
    return NextResponse.json(
      { error: "Failed to update briefing routine" },
      { status: 500 },
    );
  }
}
