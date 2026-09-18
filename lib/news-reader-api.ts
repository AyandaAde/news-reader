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

export type NewsReaderBriefingRoutineSlot = {
  id: string;
  type: "email" | "news" | "weather" | "podcast" | string;
  label: string;
  podcastId?: string | null;
};

export type NewsReaderWeatherSavedLocation = {
  id: string;
  city: string;
  isHome?: boolean;
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
  briefingRoutine: NewsReaderBriefingRoutineSlot[];
  weatherZipCode?: string | null;
  weatherSavedLocations?: NewsReaderWeatherSavedLocation[];
  voiceSettings?: NewsReaderVoiceSettings | null;
  language?: string | null;
  locale?: string | null;
  podcastLocale?: string | null;
  briefReadyNotifications?: boolean;
  newEpisodeNotifications?: boolean;
  podcastReadyNotifications?: boolean;
};

export type NewsReaderVoiceSettings = {
  useGlobalVoiceOverride: boolean;
  conversationStyle: string;
  conversationStyleCustom: string | null;
  ttsProviderName: string;
  hostVoice: string;
  hostVoiceB: string;
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
  options?: { location?: string | null; locationIndex?: number },
): NewsReaderWeatherQuery {
  const explicitLocation = options?.location?.trim();
  if (explicitLocation) {
    return { location: explicitLocation };
  }

  if (!user) {
    return { location: DEFAULT_WEATHER_LOCATION };
  }

  const savedLocations = user.weatherSavedLocations ?? [];
  const locationIndex =
    typeof options?.locationIndex === "number" &&
    Number.isFinite(options.locationIndex)
      ? Math.max(0, Math.floor(options.locationIndex))
      : 0;
  const selectedSavedLocation =
    savedLocations[locationIndex]?.city?.trim() ||
    savedLocations[0]?.city?.trim();

  if (selectedSavedLocation) {
    return { location: selectedSavedLocation };
  }

  const hasCoords =
    user.locationLatitude != null &&
    user.locationLongitude != null &&
    Number.isFinite(user.locationLatitude) &&
    Number.isFinite(user.locationLongitude);

  const rawLabel =
    user.locationLabel?.trim() ||
    [user.locationCity, user.locationRegion].filter(Boolean).join(", ") ||
    user.locationCountry?.trim() ||
    null;

  // Coordinate-looking labels are a failed reverse-geocode fallback. Prefer
  // lat/lon so the weather API can resolve a real city name.
  const locationLabel =
    rawLabel && !/^-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?$/.test(rawLabel)
      ? rawLabel
      : null;

  if (hasCoords) {
    return {
      latitude: user.locationLatitude,
      longitude: user.locationLongitude,
      ...(locationLabel ? { location: locationLabel } : {}),
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

    return normalizeNewsReaderUser(
      (await response.json()) as NewsReaderUser,
    );
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

function normalizeBriefingRoutineFromApi(
  value: unknown,
): NewsReaderBriefingRoutineSlot[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const slots: NewsReaderBriefingRoutineSlot[] = [];

  for (const [index, item] of value.entries()) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const slot = item as Record<string, unknown>;
    const type = typeof slot.type === "string" ? slot.type : "podcast";
    const label =
      typeof slot.label === "string" && slot.label.trim()
        ? slot.label
        : type;
    const id =
      typeof slot.id === "string" && slot.id.trim()
        ? slot.id
        : `${type}-${index}`;
    const podcastId =
      typeof slot.podcastId === "string" && slot.podcastId.trim()
        ? slot.podcastId
        : null;

    slots.push({ id, type, label, podcastId });
  }

  return slots;
}

function normalizeWeatherSavedLocationsFromApi(
  value: unknown,
): NewsReaderWeatherSavedLocation[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const locations: NewsReaderWeatherSavedLocation[] = [];

  for (const [index, item] of value.entries()) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const record = item as Record<string, unknown>;
    const city =
      typeof record.city === "string"
        ? record.city.trim()
        : typeof record.City === "string"
          ? record.City.trim()
          : "";
    if (!city) {
      continue;
    }

    const idRaw =
      typeof record.id === "string"
        ? record.id
        : typeof record.Id === "string"
          ? record.Id
          : "";
    const id = idRaw.trim() || `loc-${index}`;
    const isHome = Boolean(record.isHome ?? record.IsHome);

    locations.push({ id, city, isHome });
  }

  return locations;
}

export function normalizeNewsReaderUser(
  payload: NewsReaderUser | Record<string, unknown>,
): NewsReaderUser {
  const record = payload as Record<string, unknown>;
  const user = payload as NewsReaderUser;

  const weatherZipCodeRaw =
    record.weatherZipCode ?? record.WeatherZipCode ?? user.weatherZipCode;
  const weatherZipCode =
    typeof weatherZipCodeRaw === "string" && weatherZipCodeRaw.trim()
      ? weatherZipCodeRaw.trim()
      : null;

  return {
    ...user,
    briefingRoutine: normalizeBriefingRoutineFromApi(
      record.briefingRoutine ?? user.briefingRoutine,
    ),
    weatherZipCode,
    weatherSavedLocations: normalizeWeatherSavedLocationsFromApi(
      record.weatherSavedLocations ??
        record.WeatherSavedLocations ??
        user.weatherSavedLocations,
    ),
    voiceSettings: normalizeVoiceSettingsFromApi(
      record.voiceSettings ?? record.VoiceSettings ?? user.voiceSettings,
    ),
    language: normalizeLanguageFromApi(
      record.locale ??
        record.Locale ??
        record.language ??
        record.Language,
    ),
    locale: normalizeLanguageFromApi(
      record.locale ??
        record.Locale ??
        record.language ??
        record.Language,
    ),
    podcastLocale: normalizePodcastLocaleFromApi(
      record.podcastLocale ?? record.PodcastLocale,
    ),
    briefReadyNotifications: normalizeBooleanFromApi(
      record.briefReadyNotifications ?? record.BriefReadyNotifications,
      true,
    ),
    newEpisodeNotifications: normalizeBooleanFromApi(
      record.newEpisodeNotifications ?? record.NewEpisodeNotifications,
      true,
    ),
    podcastReadyNotifications: normalizeBooleanFromApi(
      record.podcastReadyNotifications ?? record.PodcastReadyNotifications,
      true,
    ),
  };
}

function normalizeBooleanFromApi(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  return fallback;
}

function normalizeLanguageFromApi(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const language = value.trim().toLowerCase();
  if (!language) {
    return null;
  }
  if (language === "zh") {
    return "cmn";
  }
  return language;
}

function normalizePodcastLocaleFromApi(value: unknown): string | null {
  return normalizeLanguageFromApi(value);
}

function normalizeVoiceSettingsFromApi(
  value: unknown,
): NewsReaderVoiceSettings | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const conversationStyle =
    typeof record.conversationStyle === "string"
      ? record.conversationStyle.trim()
      : typeof record.ConversationStyle === "string"
        ? record.ConversationStyle.trim()
        : "";
  if (!conversationStyle) {
    return null;
  }

  const customRaw =
    record.conversationStyleCustom ?? record.ConversationStyleCustom;
  const conversationStyleCustom =
    typeof customRaw === "string" && customRaw.trim()
      ? customRaw.trim()
      : null;

  const ttsProviderName =
    typeof record.ttsProviderName === "string" && record.ttsProviderName.trim()
      ? record.ttsProviderName.trim()
      : typeof record.TtsProviderName === "string" &&
          record.TtsProviderName.trim()
        ? record.TtsProviderName.trim()
        : "ElevenTTS2_5";

  const hostVoice =
    typeof record.hostVoice === "string" && record.hostVoice.trim()
      ? record.hostVoice.trim()
      : typeof record.HostVoice === "string" && record.HostVoice.trim()
        ? record.HostVoice.trim()
        : "";

  const hostVoiceB =
    typeof record.hostVoiceB === "string" && record.hostVoiceB.trim()
      ? record.hostVoiceB.trim()
      : typeof record.HostVoiceB === "string" && record.HostVoiceB.trim()
        ? record.HostVoiceB.trim()
        : "";

  return {
    useGlobalVoiceOverride: Boolean(
      record.useGlobalVoiceOverride ?? record.UseGlobalVoiceOverride ?? true,
    ),
    conversationStyle,
    conversationStyleCustom,
    ttsProviderName,
    hostVoice,
    hostVoiceB,
  };
}

export async function updateNewsReaderBriefingRoutine(
  clerkUserId: string,
  briefingRoutine: NewsReaderBriefingRoutineSlot[],
): Promise<NewsReaderUser | null> {
  const baseUrl = getNewsReaderApiBaseUrl();

  try {
    const response = await fetch(
      `${baseUrl}/users/clerk/${encodeURIComponent(clerkUserId)}/briefing-routine`,
      {
        method: "PUT",
        headers: getNewsReaderApiHeaders(),
        body: JSON.stringify({ briefingRoutine }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error(
        "News.Reader briefing routine update failed:",
        response.status,
        await response.text(),
      );
      return null;
    }

    return normalizeNewsReaderUser(
      (await response.json()) as NewsReaderUser,
    );
  } catch (error) {
    console.error("News.Reader briefing routine update error:", error);
    return null;
  }
}

export type UpdateNewsReaderWeatherSettingsInput = {
  weatherZipCode?: string | null;
  weatherSavedLocations: NewsReaderWeatherSavedLocation[];
  primaryLocation?: NewsReaderUserLocation | IpLocation | null;
};

export async function updateNewsReaderWeatherSettings(
  clerkUserId: string,
  input: UpdateNewsReaderWeatherSettingsInput,
): Promise<NewsReaderUser | null> {
  const baseUrl = getNewsReaderApiBaseUrl();

  try {
    const response = await fetch(
      `${baseUrl}/users/clerk/${encodeURIComponent(clerkUserId)}/weather-settings`,
      {
        method: "PUT",
        headers: getNewsReaderApiHeaders(),
        body: JSON.stringify({
          weatherZipCode: input.weatherZipCode ?? null,
          weatherSavedLocations: input.weatherSavedLocations.map((location) => ({
            id: location.id,
            city: location.city,
            isHome: Boolean(location.isHome),
          })),
          primaryLocation: normalizeLocation(input.primaryLocation) ?? null,
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error(
        "News.Reader weather settings update failed:",
        response.status,
        await response.text(),
      );
      return null;
    }

    return normalizeNewsReaderUser(
      (await response.json()) as NewsReaderUser,
    );
  } catch (error) {
    console.error("News.Reader weather settings update error:", error);
    return null;
  }
}

export type UpdateNewsReaderVoiceSettingsInput = {
  useGlobalVoiceOverride?: boolean;
  conversationStyle: string;
  conversationStyleCustom?: string | null;
  ttsProviderName?: string;
  hostVoice: string;
  hostVoiceB: string;
};

export async function updateNewsReaderVoiceSettings(
  clerkUserId: string,
  input: UpdateNewsReaderVoiceSettingsInput,
): Promise<NewsReaderUser | null> {
  const baseUrl = getNewsReaderApiBaseUrl();

  try {
    const response = await fetch(
      `${baseUrl}/users/clerk/${encodeURIComponent(clerkUserId)}/voice-settings`,
      {
        method: "PUT",
        headers: getNewsReaderApiHeaders(),
        body: JSON.stringify({
          useGlobalVoiceOverride: input.useGlobalVoiceOverride ?? true,
          conversationStyle: input.conversationStyle,
          conversationStyleCustom: input.conversationStyleCustom ?? null,
          ttsProviderName: input.ttsProviderName ?? null,
          hostVoice: input.hostVoice,
          hostVoiceB: input.hostVoiceB,
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error(
        "News.Reader voice settings update failed:",
        response.status,
        await response.text(),
      );
      return null;
    }

    return normalizeNewsReaderUser(
      (await response.json()) as NewsReaderUser,
    );
  } catch (error) {
    console.error("News.Reader voice settings update error:", error);
    return null;
  }
}

export async function updateNewsReaderLanguageSettings(
  clerkUserId: string,
  input: {
    language: string;
    podcastLocale?: string;
  },
): Promise<NewsReaderUser | null> {
  const baseUrl = getNewsReaderApiBaseUrl();

  try {
    const response = await fetch(
      `${baseUrl}/users/clerk/${encodeURIComponent(clerkUserId)}/language-settings`,
      {
        method: "PUT",
        headers: getNewsReaderApiHeaders(),
        body: JSON.stringify({
          locale: input.language,
          language: input.language,
          podcastLocale: input.podcastLocale,
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error(
        "News.Reader language settings update failed:",
        response.status,
        await response.text(),
      );
      return null;
    }

    return normalizeNewsReaderUser(
      (await response.json()) as NewsReaderUser,
    );
  } catch (error) {
    console.error("News.Reader language settings update error:", error);
    return null;
  }
}

export async function updateNewsReaderNotificationSettings(
  clerkUserId: string,
  input: {
    briefReadyNotifications?: boolean;
    newEpisodeNotifications?: boolean;
  },
): Promise<NewsReaderUser | null> {
  const baseUrl = getNewsReaderApiBaseUrl();

  try {
    const response = await fetch(
      `${baseUrl}/users/clerk/${encodeURIComponent(clerkUserId)}/notification-settings`,
      {
        method: "PUT",
        headers: getNewsReaderApiHeaders(),
        body: JSON.stringify({
          briefReadyNotifications: input.briefReadyNotifications,
          newEpisodeNotifications: input.newEpisodeNotifications,
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error(
        "News.Reader notification settings update failed:",
        response.status,
        await response.text(),
      );
      return null;
    }

    return normalizeNewsReaderUser(
      (await response.json()) as NewsReaderUser,
    );
  } catch (error) {
    console.error("News.Reader notification settings update error:", error);
    return null;
  }
}

export type GenerateDailyPodcastInput = {
  clerkUserId: string;
  topics: string[];
  language: string;
  durationMinutes: number;
  instructions?: string | null;
};

export type GenerateDailyPodcastResult = {
  success: boolean;
  message: string;
  podcastId: string;
  title: string | null;
  audioUrl: string;
  audioChunkCount: number | null;
  audioGeneratedAt: string | null;
};

export async function generateNewsReaderDailyPodcast(
  input: GenerateDailyPodcastInput,
): Promise<GenerateDailyPodcastResult | null> {
  const baseUrl = getNewsReaderApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/api/briefings/generate`, {
      method: "POST",
      headers: getNewsReaderApiHeaders(),
      body: JSON.stringify({
        userId: input.clerkUserId,
        topics: input.topics,
        language: input.language,
        durationMinutes: input.durationMinutes,
        instructions: input.instructions ?? undefined,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "News.Reader daily podcast generate failed:",
        response.status,
        await response.text(),
      );
      return null;
    }

    const payload = (await response.json()) as Record<string, unknown>;
    const success = payload.success === true || payload.Success === true;
    const podcastId = String(payload.podcastId ?? payload.PodcastId ?? "");
    const audioUrl = String(payload.audioUrl ?? payload.AudioUrl ?? "");
    const message =
      typeof (payload.message ?? payload.Message) === "string"
        ? String(payload.message ?? payload.Message)
        : "Podcast generated successfully.";

    if (!success || !podcastId || !audioUrl) {
      return null;
    }

    return {
      success: true,
      message,
      podcastId,
      title:
        typeof (payload.title ?? payload.Title) === "string"
          ? String(payload.title ?? payload.Title)
          : null,
      audioUrl,
      audioChunkCount:
        typeof (payload.audioChunkCount ?? payload.AudioChunkCount) === "number"
          ? Number(payload.audioChunkCount ?? payload.AudioChunkCount)
          : null,
      audioGeneratedAt:
        typeof (payload.audioGeneratedAt ?? payload.AudioGeneratedAt) ===
        "string"
          ? String(payload.audioGeneratedAt ?? payload.AudioGeneratedAt)
          : null,
    };
  } catch (error) {
    console.error("News.Reader daily podcast generate error:", error);
    return null;
  }
}

export async function fetchNewsReaderDailyPodcastAudio(
  podcastId: string,
): Promise<ArrayBuffer | null> {
  const baseUrl = getNewsReaderApiBaseUrl();

  try {
    const response = await fetch(
      `${baseUrl}/api/podcasts/${encodeURIComponent(podcastId)}/audio`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": env.NEWS_READER_API_KEY,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error(
        "News.Reader daily podcast audio fetch failed:",
        response.status,
        await response.text(),
      );
      return null;
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error("News.Reader daily podcast audio fetch error:", error);
    return null;
  }
}
