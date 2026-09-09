import { getAuthenticatedUserId } from "@/lib/auth/server-auth";
import { getGoogleConnectUrl } from "@/lib/news-reader-api";
import { ensureBackendUser } from "@/lib/server/user-location";
import { NextRequest, NextResponse } from "next/server";

async function resolveGoogleConnectUrl(req: NextRequest, clerkUserId: string) {
  let result = await getGoogleConnectUrl(clerkUserId);

  if (result.status === 404) {
    const user = await ensureBackendUser(req, clerkUserId);

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Your account is not ready yet. Refresh the page and try again.",
        },
        { status: 404 },
      );
    }

    result = await getGoogleConnectUrl(clerkUserId);
  }

  if (!result.authUrl) {
    return NextResponse.json(
      {
        error:
          result.error ??
          "Google connection is unavailable. Make sure the News.Reader backend is running and Google OAuth is configured.",
      },
      { status: result.status >= 400 ? result.status : 502 },
    );
  }

  return NextResponse.json({ authUrl: result.authUrl });
}

export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return await resolveGoogleConnectUrl(req, userId);
  } catch (error) {
    console.error("Failed to start Google connection:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to start Google connection",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await resolveGoogleConnectUrl(req, userId);
    const payload = (await response.json()) as {
      authUrl?: string;
      error?: string;
    };

    if (!response.ok || !payload.authUrl) {
      return NextResponse.json(
        { error: payload.error ?? "Failed to start Google connection" },
        { status: response.status },
      );
    }

    return NextResponse.redirect(payload.authUrl);
  } catch (error) {
    console.error("Failed to start Google connection:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to start Google connection",
      },
      { status: 500 },
    );
  }
}
