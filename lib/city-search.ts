export type CitySearchResult = {
  id: string;
  label: string;
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
};

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

type CitySearchApiResponse = {
  results?: CitySearchResult[];
  error?: string;
};

const OPEN_METEO_GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

const POPULAR_CITY_QUERIES = [
  "New York",
  "London",
  "Tokyo",
  "Paris",
  "Los Angeles",
  "Berlin",
  "Toronto",
  "Sydney",
] as const;

function formatCityLabel(city: string, region: string, country: string) {
  if (city && region) {
    return `${city}, ${region}`;
  }

  return [city, region, country].filter(Boolean).join(", ");
}

function mapOpenMeteoResult(
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

async function fetchOpenMeteoCities(
  name: string,
  count: number,
): Promise<CitySearchResult[]> {
  const trimmed = name.trim();
  // Open-Meteo: empty/single-char searches return no results.
  if (trimmed.length < 2) {
    return [];
  }

  // Prefer the Next BFF when available (browser), fall back to Open-Meteo directly.
  if (typeof window !== "undefined") {
    const params = new URLSearchParams({
      name: trimmed,
      count: String(count),
    });
    const response = await fetch(`/api/locations/search?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`City search failed (${response.status})`);
    }

    const payload = (await response.json()) as CitySearchApiResponse;
    return payload.results ?? [];
  }

  const url = new URL(OPEN_METEO_GEOCODING_URL);
  url.searchParams.set("name", trimmed);
  url.searchParams.set("count", String(count));
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`City search failed (${response.status})`);
  }

  const payload = (await response.json()) as OpenMeteoGeocodingResponse;
  const seen = new Set<string>();
  const results: CitySearchResult[] = [];

  for (const item of payload.results ?? []) {
    const mapped = mapOpenMeteoResult(item);
    if (!mapped || seen.has(mapped.id)) {
      continue;
    }

    seen.add(mapped.id);
    results.push(mapped);
  }

  return results;
}

let popularCitiesCache: CitySearchResult[] | null = null;
let popularCitiesPromise: Promise<CitySearchResult[]> | null = null;

export async function searchCities(query: string): Promise<CitySearchResult[]> {
  return fetchOpenMeteoCities(query, 10);
}

export async function getPopularCities(): Promise<CitySearchResult[]> {
  if (popularCitiesCache) {
    return popularCitiesCache;
  }

  if (popularCitiesPromise) {
    return popularCitiesPromise;
  }

  popularCitiesPromise = (async () => {
    const batches = await Promise.all(
      POPULAR_CITY_QUERIES.map(async (name) => {
        try {
          const results = await fetchOpenMeteoCities(name, 1);
          return results[0] ?? null;
        } catch {
          return null;
        }
      }),
    );

    const seen = new Set<string>();
    const results: CitySearchResult[] = [];

    for (const item of batches) {
      if (!item || seen.has(item.id)) {
        continue;
      }

      seen.add(item.id);
      results.push(item);
    }

    popularCitiesCache = results;
    return results;
  })();

  try {
    return await popularCitiesPromise;
  } finally {
    popularCitiesPromise = null;
  }
}
