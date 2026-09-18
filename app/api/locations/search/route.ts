import { NextRequest, NextResponse } from "next/server";

type OpenMeteoGeocodingResponse = {
  results?: Array<{
    id?: number;
    name?: string;
    latitude?: number;
    longitude?: number;
    country?: string;
    country_code?: string;
    admin1?: string;
    admin2?: string;
  }>;
};

export type CitySearchResult = {
  id: string;
  label: string;
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
};

function formatCityLabel(city: string, region: string, country: string) {
  if (city && region) {
    return `${city}, ${region}`;
  }

  return [city, region, country].filter(Boolean).join(", ");
}

function mapResult(
  result: NonNullable<OpenMeteoGeocodingResponse["results"]>[number],
): CitySearchResult | null {
  const city = result.name?.trim() ?? "";
  const region = result.admin1?.trim() ?? result.admin2?.trim() ?? "";
  const country = result.country?.trim() ?? "";
  const latitude = result.latitude;
  const longitude = result.longitude;

  if (
    !city ||
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  return {
    id: String(result.id ?? `${city}-${latitude}-${longitude}`),
    label: formatCityLabel(city, region, country),
    city,
    region,
    country,
    latitude,
    longitude,
  };
}

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name")?.trim() ?? "";
  const countRaw = Number.parseInt(
    req.nextUrl.searchParams.get("count") ?? "10",
    10,
  );
  const count = Number.isFinite(countRaw)
    ? Math.min(Math.max(countRaw, 1), 100)
    : 10;

  // Open-Meteo returns no results for empty/single-character searches.
  if (name.length < 2) {
    return NextResponse.json({ results: [] as CitySearchResult[] });
  }

  try {
    const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
    url.searchParams.set("name", name);
    url.searchParams.set("count", String(count));
    url.searchParams.set("language", "en");
    url.searchParams.set("format", "json");

    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      console.error(
        "Open-Meteo city search failed:",
        response.status,
        await response.text(),
      );
      return NextResponse.json(
        { error: "Failed to search cities" },
        { status: 502 },
      );
    }

    const payload = (await response.json()) as OpenMeteoGeocodingResponse;
    const seen = new Set<string>();
    const results: CitySearchResult[] = [];

    for (const item of payload.results ?? []) {
      const mapped = mapResult(item);
      if (!mapped || seen.has(mapped.id)) {
        continue;
      }

      seen.add(mapped.id);
      results.push(mapped);
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Open-Meteo city search error:", error);
    return NextResponse.json(
      { error: "Failed to search cities" },
      { status: 500 },
    );
  }
}
