import type { NewsReaderUser } from "@/lib/news-reader-api";
import { loadPlatformSettings } from "@/lib/platform-settings";

export function formatNewsReaderUserLocation(user: NewsReaderUser | null | undefined) {
  if (!user) {
    return null;
  }

  if (user.locationLabel?.trim()) {
    return user.locationLabel.trim();
  }

  const parts = [user.locationCity, user.locationRegion].filter(Boolean);
  if (parts.length > 0) {
    return parts.join(", ");
  }

  if (user.locationCountry?.trim()) {
    return user.locationCountry.trim();
  }

  return null;
}

export function readSavedHomeLocationLabel() {
  if (typeof window === "undefined") {
    return null;
  }

  const settings = loadPlatformSettings();
  const home = settings.weatherSavedLocations.find((entry) => entry.isHome);
  return home?.city?.trim() || null;
}
