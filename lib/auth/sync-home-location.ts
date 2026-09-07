import type { IpLocation } from "@/lib/ipinfo";
import type { NewsReaderUser } from "@/lib/news-reader-api";

export type UserCoordinates = {
  lat: number;
  lon: number;
};

type SyncLocationResponse = {
  saved?: boolean;
  location?: IpLocation | null;
  user?: NewsReaderUser;
  error?: string;
};

export function requestBrowserLocation(): Promise<UserCoordinates | null> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => resolve(null),
      {
        enableHighAccuracy: false,
        maximumAge: 5 * 60 * 1000,
        timeout: 10_000,
      },
    );
  });
}

export async function syncHomeLocation(coordinates?: UserCoordinates | null) {
  const response = await fetch("/api/user/location", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(coordinates ?? {}),
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as
    | SyncLocationResponse
    | null;

  if (!response.ok) {
    throw new Error(payload?.error ?? "Failed to sync location");
  }

  return payload;
}

export async function resolveHomeLocation() {
  const coordinates = await requestBrowserLocation();
  return syncHomeLocation(coordinates);
}
