import { getAuthenticatedUserId } from "@/lib/auth/server-auth";
import {
  buildNewsReaderWeatherQuery,
  getNewsReaderWeather,
} from "@/lib/news-reader-api";
import { ensureBackendUser } from "@/lib/server/user-location";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await ensureBackendUser(req, userId);
    const locationParam = req.nextUrl.searchParams.get("location");
    const indexParam = req.nextUrl.searchParams.get("index");
    const locationIndex =
      indexParam != null && indexParam.trim() !== ""
        ? Number.parseInt(indexParam, 10)
        : undefined;

    const query = buildNewsReaderWeatherQuery(user, {
      location: locationParam,
      locationIndex: Number.isFinite(locationIndex) ? locationIndex : undefined,
    });

    const weather = await getNewsReaderWeather(query);

    if (!weather) {
      return NextResponse.json(
        { error: "Weather data not found for the given location" },
        { status: 404 },
      );
    }

    return NextResponse.json({ weather });
  } catch (error) {
    console.error("Failed to load weather:", error);
    return NextResponse.json({ error: "Failed to load weather" }, { status: 500 });
  }
}
