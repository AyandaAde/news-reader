import { lookupCoordinatesLocation } from "@/lib/ipinfo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const latRaw = req.nextUrl.searchParams.get("lat");
  const lonRaw = req.nextUrl.searchParams.get("lon");
  const lat = Number.parseFloat(latRaw ?? "");
  const lon = Number.parseFloat(lonRaw ?? "");

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json(
      { error: "lat and lon are required." },
      { status: 400 },
    );
  }

  try {
    const location = await lookupCoordinatesLocation(lat, lon);

    if (!location) {
      return NextResponse.json(
        { error: "Could not resolve that location." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      label: location.label,
      city: location.city,
      region: location.region,
      country: location.country,
      postal: location.postal ?? null,
      latitude: location.lat,
      longitude: location.lon,
    });
  } catch (error) {
    console.error("Failed to reverse-geocode location:", error);
    return NextResponse.json(
      { error: "Failed to resolve location." },
      { status: 500 },
    );
  }
}
