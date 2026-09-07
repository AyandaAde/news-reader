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
};

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
