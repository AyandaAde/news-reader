import { getAuthenticatedUserId } from "@/lib/auth/server-auth";
import { updateNewsReaderVoiceSettings } from "@/lib/news-reader-api";
import type { ConversationStyle } from "@/lib/platform-settings";
import { ensureBackendUser } from "@/lib/server/user-location";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_STYLES = new Set<ConversationStyle>([
  "HostCohost",
  "ReporterAnalyst",
  "AssistantHuman",
  "Custom",
]);

type UpdateVoiceSettingsBody = {
  useGlobalVoiceOverride?: boolean;
  conversationStyle?: string;
  conversationStyleCustom?: string | null;
  ttsProviderName?: string | null;
  hostVoice?: string;
  hostVoiceB?: string;
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

    const body = (await req.json()) as UpdateVoiceSettingsBody;
    const conversationStyle =
      typeof body.conversationStyle === "string"
        ? body.conversationStyle.trim()
        : "";

    if (!ALLOWED_STYLES.has(conversationStyle as ConversationStyle)) {
      return NextResponse.json(
        { error: "Invalid conversation style." },
        { status: 400 },
      );
    }

    const hostVoice =
      typeof body.hostVoice === "string" ? body.hostVoice.trim() : "";
    const hostVoiceB =
      typeof body.hostVoiceB === "string" ? body.hostVoiceB.trim() : "";

    if (!hostVoice || !hostVoiceB) {
      return NextResponse.json(
        { error: "hostVoice and hostVoiceB are required." },
        { status: 400 },
      );
    }

    const customPrompt =
      typeof body.conversationStyleCustom === "string"
        ? body.conversationStyleCustom.trim()
        : null;

    const updated = await updateNewsReaderVoiceSettings(userId, {
      useGlobalVoiceOverride: body.useGlobalVoiceOverride ?? true,
      conversationStyle,
      conversationStyleCustom:
        conversationStyle === "Custom" ? customPrompt || null : null,
      ttsProviderName:
        typeof body.ttsProviderName === "string" && body.ttsProviderName.trim()
          ? body.ttsProviderName.trim()
          : undefined,
      hostVoice,
      hostVoiceB,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update voice settings" },
        { status: 502 },
      );
    }

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Failed to update voice settings:", error);
    return NextResponse.json(
      { error: "Failed to update voice settings" },
      { status: 500 },
    );
  }
}
