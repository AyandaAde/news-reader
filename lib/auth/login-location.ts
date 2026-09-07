import type { IpLocation } from "@/lib/ipinfo";
import {
  DEFAULT_WEATHER_LOCATIONS,
  loadPlatformSettings,
  savePlatformSettings,
} from "@/lib/platform-settings";
import { readOnboardingData, writeOnboardingData } from "@/lib/onboarding";

const DEFAULT_HOME_CITY = DEFAULT_WEATHER_LOCATIONS.find(
  (location) => location.isHome,
)?.city;

export type StoredLoginLocation = IpLocation & {
  updatedAt: string;
};

export function applyLoginLocationToLocalStorage(
  location: IpLocation,
  userId?: string | null,
) {
  if (typeof window === "undefined") return;

  const onboarding = readOnboardingData(userId);
  if (onboarding.lat == null || onboarding.lon == null) {
    writeOnboardingData(
      {
        ...onboarding,
        lat: location.lat,
        lon: location.lon,
      },
      userId,
    );
  }

  const settings = loadPlatformSettings();
  const homeLocation = settings.weatherSavedLocations.find(
    (entry) => entry.isHome,
  );
  const usesDefaultHome =
    !homeLocation ||
    (DEFAULT_HOME_CITY ? homeLocation.city === DEFAULT_HOME_CITY : false);

  if (!usesDefaultHome || !location.label) return;

  const hasHome = settings.weatherSavedLocations.some((entry) => entry.isHome);
  const weatherSavedLocations = hasHome
    ? settings.weatherSavedLocations.map((entry) =>
        entry.isHome ? { ...entry, city: location.label } : entry,
      )
    : [
        { id: "loc-home", city: location.label, isHome: true },
        ...settings.weatherSavedLocations,
      ];

  savePlatformSettings({
    ...settings,
    weatherSavedLocations,
  });
}
