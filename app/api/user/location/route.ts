import { getAuthenticatedUserId } from "@/lib/auth/server-auth";
import {
  getSupportedCityById,
  supportedCityToIpLocation,
} from "@/lib/supported-cities";
import { syncUserLocation } from "@/lib/server/user-location";
import { NextRequest, NextResponse } from "next/server";

type LocationRequestBody = {
  lat?: number;
  lon?: number;
  cityId?: string;
};

export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: LocationRequestBody = {};

  try {
    body = (await req.json()) as LocationRequestBody;
  } catch {
    body = {};
  }

  const selectedCity =
    typeof body.cityId === "string" ? getSupportedCityById(body.cityId) : null;

  if (typeof body.cityId === "string" && !selectedCity) {
    return NextResponse.json({ error: "Invalid city" }, { status: 400 });
  }

  const coordinates =
    typeof body.lat === "number" &&
    typeof body.lon === "number" &&
    Number.isFinite(body.lat) &&
    Number.isFinite(body.lon)
      ? { lat: body.lat, lon: body.lon }
      : null;

  try {
    const { location, user } = await syncUserLocation(
      req,
      userId,
      coordinates,
      {
        forceUpdate: true,
        explicitLocation: selectedCity
          ? supportedCityToIpLocation(selectedCity)
          : undefined,
      },
    );

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      saved: Boolean(location),
      location,
      user,
    });
  } catch (error) {
    console.error("Failed to sync user location:", error);
    return NextResponse.json(
      { error: "Failed to sync location" },
      { status: 500 },
    );
  }
}
