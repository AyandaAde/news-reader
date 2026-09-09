import { env } from "@/env";
import type { IpLocation } from "@/lib/ipinfo";

export type NewsReaderUserLocation = {
  label?: string;
  city?: string;
  region?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
};

export type ProvisionNewsReaderUserInput = {
  clerkUserId: string;
  email: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  location?: NewsReaderUserLocation | IpLocation | null;
};

export type ProvisionNewsReaderUserResult = {
  userId: string;
  clerkUserId: string;
  created: boolean;
};

export type NewsReaderUser = {
  id: string;
  clerkUserId: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  onboardingCompleted: boolean;
  locationLabel: string | null;
  locationCity: string | null;
  locationRegion: string | null;
  locationCountry: string | null;
  locationLatitude: number | null;
  locationLongitude: number | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  hasGoogleAccessToken: boolean;
  briefCount: number;
  latestBriefStoryCount: number;
};

export type NewsReaderPodcast = {
  id: string;
  title: string;
  description: string | null;
  sourceType: string;
  artworkUrl: string | null;
  topicTags: string[];
  episodeCount: number;
  createdAt: string;
  updatedAt: string;
};

export type NewsReaderWeather = {
  location: string;
  temperatureF: number;
  feelsLikeF: number | null;
  condition: string;
  iconId: string;
  latitude: number | null;
  longitude: number | null;
  humidityPercent: number | null;
  windSpeedMph: number | null;
};

export type NewsReaderWeatherQuery = {
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export const DEFAULT_WEATHER_LOCATION = "Pittsburgh, PA";

function getNewsReaderApiBaseUrl() {
  return env.NEWS_READER_API_URL.replace(/\/$/, "");
}

function getNewsReaderApiHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Api-Key": env.NEWS_READER_API_KEY,
  };
}

function normalizeLocation(
  location?: NewsReaderUserLocation | IpLocation | null,
): NewsReaderUserLocation | undefined {
  if (!location) {
    return undefined;
  }

  return {
    label: location.label,
    city: "city" in location ? location.city : undefined,
    region: "region" in location ? location.region : undefined,
    country: "country" in location ? location.country : undefined,
    latitude: "lat" in location ? location.lat : location.latitude,
    longitude: "lon" in location ? location.lon : location.longitude,
  };
}

export function buildNewsReaderWeatherQuery(
  user: NewsReaderUser | null | undefined,
): NewsReaderWeatherQuery {
  if (!user) {
    return { location: DEFAULT_WEATHER_LOCATION };
  }

  const hasCoords =
    user.locationLatitude != null &&
    user.locationLongitude != null &&
    Number.isFinite(user.locationLatitude) &&
    Number.isFinite(user.locationLongitude);

  const locationLabel =
    user.locationLabel?.trim() ||
    [user.locationCity, user.locationRegion].filter(Boolean).join(", ") ||
    user.locationCountry?.trim() ||
    null;

  if (hasCoords) {
    return {
      latitude: user.locationLatitude,
      longitude: user.locationLongitude,
      location: locationLabel ?? DEFAULT_WEATHER_LOCATION,
    };
  }

  if (locationLabel) {
    return { location: locationLabel };
  }

  return { location: DEFAULT_WEATHER_LOCATION };
}

export async function getNewsReaderWeather(
  query: NewsReaderWeatherQuery,
): Promise<NewsReaderWeather | null> {
  const baseUrl = getNewsReaderApiBaseUrl();
  const params = new URLSearchParams();

  if (query.location?.trim()) {
    params.set("location", query.location.trim());
  }

  if (
    query.latitude != null &&
    query.longitude != null &&
    Number.isFinite(query.latitude) &&
    Number.isFinite(query.longitude)
  ) {
    params.set("latitude", String(query.latitude));
    params.set("longitude", String(query.longitude));
  }

  if (!params.has("location") && !params.has("latitude")) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/api/weather?${params.toString()}`, {
      method: "GET",
      headers: getNewsReaderApiHeaders(),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "News.Reader weather lookup failed:",
        response.status,
        await response.text(),
      );
      return null;
    }

    return (await response.json()) as NewsReaderWeather;
  } catch (error) {
    console.error("News.Reader weather lookup error:", error);
    return null;
  }
}

export async function provisionNewsReaderUser(
  input: ProvisionNewsReaderUserInput,
): Promise<ProvisionNewsReaderUserResult | null> {
  const baseUrl = getNewsReaderApiBaseUrl();
  const location = normalizeLocation(input.location);

  try {
    const response = await fetch(`${baseUrl}/users/clerk`, {
      method: "POST",
      headers: getNewsReaderApiHeaders(),
      body: JSON.stringify({
        clerkUserId: input.clerkUserId,
        email: input.email,
        displayName: input.displayName ?? undefined,
        avatarUrl: input.avatarUrl ?? undefined,
        location,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "News.Reader user provisioning failed:",
        response.status,
        await response.text(),
      );
      return null;
    }

    return (await response.json()) as ProvisionNewsReaderUserResult;
  } catch (error) {
    console.error("News.Reader user provisioning error:", error);
    return null;
  }
}

export type GoogleConnectUrlResult = {
  authUrl: string | null;
  error: string | null;
  status: number;
};

export async function getGoogleConnectUrl(
  clerkUserId: string,
): Promise<GoogleConnectUrlResult> {
  const baseUrl = getNewsReaderApiBaseUrl();

  try {
    const response = await fetch(
      `${baseUrl}/users/clerk/${encodeURIComponent(clerkUserId)}/google/connect`,
      {
        method: "POST",
        headers: getNewsReaderApiHeaders(),
        cache: "no-store",
      },
    );

    const payload = (await response.json().catch(() => null)) as {
      authUrl?: string;
      AuthUrl?: string;
      error?: string;
    } | null;

    if (!response.ok) {
      const error =
        payload?.error ??
        (response.status === 503
          ? "Google OAuth is not configured on the News.Reader backend."
          : response.status === 404
            ? "Backend user not found."
            : "Failed to start Google connection.");

      console.error(
        "News.Reader Google connect URL failed:",
        response.status,
        error,
      );

      return { authUrl: null, error, status: response.status };
    }

    const authUrl = (payload?.authUrl ?? payload?.AuthUrl)?.trim() || null;

    if (!authUrl) {
      return {
        authUrl: null,
        error: "News.Reader did not return a Google authorization URL.",
        status: 502,
      };
    }

    return { authUrl, error: null, status: response.status };
  } catch (error) {
    console.error("News.Reader Google connect URL error:", error);
    return {
      authUrl: null,
      error:
        "Could not reach the News.Reader backend. Make sure it is running on localhost:5047.",
      status: 502,
    };
  }
}

export async function getNewsReaderUserByClerkId(
  clerkUserId: string,
): Promise<NewsReaderUser | null> {
  const baseUrl = getNewsReaderApiBaseUrl();

  try {
    const response = await fetch(
      `${baseUrl}/users/clerk/${encodeURIComponent(clerkUserId)}`,
      {
        method: "GET",
        headers: getNewsReaderApiHeaders(),
        cache: "no-store",
      },
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      console.error(
        "News.Reader user lookup failed:",
        response.status,
        await response.text(),
      );
      return null;
    }

    return (await response.json()) as NewsReaderUser;
  } catch (error) {
    console.error("News.Reader user lookup error:", error);
    return null;
  }
}

export async function getNewsReaderPodcastsByClerkId(
  clerkUserId: string,
): Promise<NewsReaderPodcast[]> {
  const baseUrl = getNewsReaderApiBaseUrl();

  try {
    const response = await fetch(
      `${baseUrl}/users/clerk/${encodeURIComponent(clerkUserId)}/podcasts`,
      {
        method: "GET",
        headers: getNewsReaderApiHeaders(),
        cache: "no-store",
      },
    );

    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      console.error(
        "News.Reader podcast lookup failed:",
        response.status,
        await response.text(),
      );
      return [];
    }

    return (await response.json()) as NewsReaderPodcast[];
  } catch (error) {
    console.error("News.Reader podcast lookup error:", error);
    return [];
  }
}
