import { getAuthenticatedUserId } from "@/lib/auth/server-auth";
import { lookupPlaceLocation } from "@/lib/ipinfo";
import {
  updateNewsReaderWeatherSettings,
  type NewsReaderWeatherSavedLocation,
} from "@/lib/news-reader-api";
import { MAX_WEATHER_SAVED_LOCATIONS } from "@/lib/platform-settings";
import { ensureBackendUser } from "@/lib/server/user-location";
import { NextRequest, NextResponse } from "next/server";

type WeatherSavedLocationBody = {
  id?: string;
  city?: string;
  isHome?: boolean;
};

type UpdateWeatherSettingsBody = {
  weatherZipCode?: string | null;
  weatherSavedLocations?: WeatherSavedLocationBody[];
};

function normalizeSavedLocations(
  value: WeatherSavedLocationBody[] | undefined,
): NewsReaderWeatherSavedLocation[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  return value
    .map((item, index) => {
      const city = typeof item.city === "string" ? item.city.trim() : "";
      if (!city) {
        return null;
      }

      const id =
        typeof item.id === "string" && item.id.trim()
          ? item.id.trim()
          : `loc-${index}`;

      return {
        id,
        city,
        isHome: Boolean(item.isHome),
      };
    })
    .filter((item): item is NewsReaderWeatherSavedLocation => item !== null);
}

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

    const body = (await req.json()) as UpdateWeatherSettingsBody;
    const weatherSavedLocations = normalizeSavedLocations(
      body.weatherSavedLocations,
    );

    if (!weatherSavedLocations) {
      return NextResponse.json(
        { error: "weatherSavedLocations is required." },
        { status: 400 },
      );
    }

    if (weatherSavedLocations.length > MAX_WEATHER_SAVED_LOCATIONS) {
      return NextResponse.json(
        {
          error: `You can save up to ${MAX_WEATHER_SAVED_LOCATIONS} weather locations.`,
        },
        { status: 400 },
      );
    }

    const weatherZipCode =
      typeof body.weatherZipCode === "string"
        ? body.weatherZipCode.trim()
        : body.weatherZipCode === null
          ? null
          : undefined;

    const homeLocation =
      weatherSavedLocations.find((location) => location.isHome) ??
      weatherSavedLocations[0] ??
      null;

    const primaryLocation = homeLocation
      ? ((await lookupPlaceLocation(homeLocation.city)) ?? {
          label: homeLocation.city,
          city: homeLocation.city.split(",")[0]?.trim() || homeLocation.city,
          region: homeLocation.city.split(",")[1]?.trim() || undefined,
        })
      : null;

    const updated = await updateNewsReaderWeatherSettings(userId, {
      weatherZipCode: weatherZipCode ?? null,
      weatherSavedLocations,
      primaryLocation,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update weather settings" },
        { status: 502 },
      );
    }

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Failed to update weather settings:", error);
    return NextResponse.json(
      { error: "Failed to update weather settings" },
      { status: 500 },
    );
  }
}
