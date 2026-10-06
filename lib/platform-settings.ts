import { normalizeSpeakerId } from "@/lib/voice-catalog";

export type BriefingRoutineSlot = {
  id: string;
  type: "email" | "news" | "weather" | "podcast";
  label: string;
  podcastId?: string;
};

export type ConversationStyle =
  | "HostCohost"
  | "ReporterAnalyst"
  | "AssistantHuman"
  | "Custom";

export type WeatherTemperatureUnit = "fahrenheit" | "celsius";

export type WeatherSavedLocation = {
  id: string;
  city: string;
  isHome?: boolean;
};

export const DEFAULT_WEATHER_LOCATIONS: WeatherSavedLocation[] = [
  { id: "loc-pittsburgh", city: "Pittsburgh, PA", isHome: true },
  { id: "loc-san-francisco", city: "San Francisco, CA" },
];

export { VOICE_ENGINES } from "@/lib/voice-catalog";
export {
  defaultSpeakersForEngine,
  getVoiceLabel,
  normalizeSpeakerId,
  voicesByEngine,
} from "@/lib/voice-catalog";

export type PlatformSettings = {
  briefingRoutine: BriefingRoutineSlot[];
  useGlobalVoiceOverride: boolean;
  conversationStyle: ConversationStyle;
  customPrompt: string;
  voiceEngine: string;
  speakerA: string;
  speakerB: string;
  emailConversationStyle: ConversationStyle;
  emailCustomPrompt: string;
  emailVoiceEngine: string;
  emailSpeakerA: string;
  emailSpeakerB: string;
  emailMaxItems: number;
  emailLookbackHours: number;
  emailSkipDuplicates: boolean;
  newsConversationStyle: ConversationStyle;
  newsCustomPrompt: string;
  newsVoiceEngine: string;
  newsSpeakerA: string;
  newsSpeakerB: string;
  skipBackSeconds: number;
  skipForwardSeconds: number;
  freshEpisodeMinutes: number;
  language: string;
  podcastLocalizationMode: PodcastLocalizationMode;
  podcastLocalizationRegion: string;
  weatherZipCode: string;
  weatherSavedLocations: WeatherSavedLocation[];
  weatherTemperatureUnit: WeatherTemperatureUnit;
  weatherDailyForecastAlerts: boolean;
  weatherSevereWeatherAlerts: boolean;
  weatherDeliveryTime: string;
  notifyNewBrief: boolean;
  notifyLiveStation: boolean;
  notifyNewEpisode: boolean;
  subscriptionPlan: SubscriptionPlan;
  subscriptionRenewsAt: string;
  gmailConnected: boolean;
};

export const SETTINGS_STORAGE_KEY = "eilo-platform-settings";

export const CONVERSATION_STYLES = [
  {
    id: "HostCohost" as const,
    title: "Host & Co-Host",
    description: "Casual and conversational",
  },
  {
    id: "ReporterAnalyst" as const,
    title: "Reporter & Analyst",
    description: "Professional broadcast tone",
  },
  {
    id: "AssistantHuman" as const,
    title: "Assistant & Human",
    description: "Helpful and natural",
  },
  {
    id: "Custom" as const,
    title: "Custom",
    description: "Write your own prompt",
  },
];

export const EMAIL_MAX_ITEMS = [10, 15, 25, 50] as const;

export const EMAIL_LOOKBACK_OPTIONS = [
  { hours: 6, label: "6 hours" },
  { hours: 12, label: "12 hours" },
  { hours: 24, label: "24 hours" },
  { hours: 48, label: "2 days" },
  { hours: 72, label: "3 days" },
  { hours: 168, label: "1 week" },
] as const;

/** App UI languages — keep in sync with `lib/i18n.ts` resources. */
export const APP_LANGUAGE_OPTIONS = [
  { value: "en", label: "English", englishLabel: "English" },
  { value: "es", label: "Español", englishLabel: "Spanish" },
  { value: "cmn", label: "中文", englishLabel: "Chinese" },
  { value: "hi", label: "हिन्दी", englishLabel: "Hindi" },
  { value: "pt", label: "Português", englishLabel: "Portuguese" },
  { value: "fr", label: "Français", englishLabel: "French" },
  { value: "ar", label: "العربية", englishLabel: "Arabic" },
  { value: "ja", label: "日本語", englishLabel: "Japanese" },
  { value: "de", label: "Deutsch", englishLabel: "German" },
  { value: "id", label: "Bahasa Indonesia", englishLabel: "Indonesian" },
  { value: "ms", label: "Bahasa Melayu", englishLabel: "Malay" },
  { value: "it", label: "Italiano", englishLabel: "Italian" },
  { value: "ko", label: "한국어", englishLabel: "Korean" },
] as const;

export type AppLanguageCode = (typeof APP_LANGUAGE_OPTIONS)[number]["value"];

/** Podcast localisation languages — same set as the app sidebar. */
export const LANGUAGE_OPTIONS = APP_LANGUAGE_OPTIONS;

export type PodcastLanguageCode = (typeof LANGUAGE_OPTIONS)[number]["value"];

/** ISO 639-3 podcast locales for premium voice engines (e.g. ElevenLabs). */
export const PREMIUM_PODCAST_LANGUAGE_OPTIONS = [
  { value: "ara", label: "العربية", englishLabel: "Arabic" },
  { value: "cmn", label: "中文", englishLabel: "Chinese" },
  { value: "eng", label: "English", englishLabel: "English" },
  { value: "fra", label: "Français", englishLabel: "French" },
  { value: "deu", label: "Deutsch", englishLabel: "German" },
  { value: "hin", label: "हिन्दी", englishLabel: "Hindi" },
  { value: "ind", label: "Bahasa Indonesia", englishLabel: "Indonesian" },
  { value: "ita", label: "Italiano", englishLabel: "Italian" },
  { value: "jpn", label: "日本語", englishLabel: "Japanese" },
  { value: "kor", label: "한국어", englishLabel: "Korean" },
  { value: "msa", label: "Bahasa Melayu", englishLabel: "Malay" },
  { value: "por", label: "Português", englishLabel: "Portuguese" },
  { value: "spa", label: "Español", englishLabel: "Spanish" },
] as const;

export type PremiumPodcastLanguageCode =
  (typeof PREMIUM_PODCAST_LANGUAGE_OPTIONS)[number]["value"];

/** Maps app UI language codes onto premium podcast ISO 639-3 codes. */
export const APP_LANGUAGE_TO_PREMIUM_PODCAST: Record<
  string,
  PremiumPodcastLanguageCode
> = {
  ar: "ara",
  cmn: "cmn",
  zh: "cmn",
  en: "eng",
  fr: "fra",
  de: "deu",
  hi: "hin",
  id: "ind",
  it: "ita",
  ja: "jpn",
  ko: "kor",
  ms: "msa",
  pt: "por",
  es: "spa",
};

export function isPremiumPodcastLanguageCode(value: string): boolean {
  return PREMIUM_PODCAST_LANGUAGE_OPTIONS.some(
    (option) => option.value === value,
  );
}

export function mapAppLanguageToPremiumPodcastLocale(
  appLanguage: string,
): PremiumPodcastLanguageCode | null {
  return (
    APP_LANGUAGE_TO_PREMIUM_PODCAST[appLanguage.trim().toLowerCase()] ?? null
  );
}

export function appLanguageSupportsPremiumPodcastMatch(
  appLanguage: string,
): boolean {
  return mapAppLanguageToPremiumPodcastLocale(appLanguage) != null;
}

export function getCustomPodcastLanguageOptions(_isPremiumVoice?: boolean) {
  return APP_LANGUAGE_OPTIONS;
}

export function mapPremiumPodcastToAppLanguage(
  premiumCode: string,
): AppLanguageCode | null {
  const normalized = premiumCode.trim().toLowerCase();
  const match = APP_LANGUAGE_OPTIONS.find(
    (option) => APP_LANGUAGE_TO_PREMIUM_PODCAST[option.value] === normalized,
  );
  return match?.value ?? null;
}

/** Normalize a custom podcast region to an app language code for the UI. */
export function coerceCustomPodcastRegion(region: string): AppLanguageCode {
  const normalized = region.trim().toLowerCase();
  if (APP_LANGUAGE_OPTIONS.some((option) => option.value === normalized)) {
    return normalized as AppLanguageCode;
  }
  return mapPremiumPodcastToAppLanguage(normalized) ?? "en";
}

export function ensurePodcastLocalizationForVoice(input: {
  language: string;
  podcastLocalizationMode: PodcastLocalizationMode;
  podcastLocalizationRegion: string;
  isPremiumVoice: boolean;
}): {
  podcastLocalizationMode: PodcastLocalizationMode;
  podcastLocalizationRegion: string;
} {
  if (!input.isPremiumVoice) {
    return {
      podcastLocalizationMode: input.podcastLocalizationMode,
      podcastLocalizationRegion: coerceCustomPodcastRegion(
        input.podcastLocalizationRegion || input.language,
      ),
    };
  }

  const matchLocale = mapAppLanguageToPremiumPodcastLocale(input.language);
  if (!matchLocale) {
    return {
      podcastLocalizationMode: "custom",
      podcastLocalizationRegion: coerceCustomPodcastRegion(
        input.podcastLocalizationRegion || "en",
      ),
    };
  }

  if (input.podcastLocalizationMode === "custom") {
    return {
      podcastLocalizationMode: "custom",
      podcastLocalizationRegion: coerceCustomPodcastRegion(
        input.podcastLocalizationRegion || input.language,
      ),
    };
  }

  return {
    podcastLocalizationMode: "match-app",
    podcastLocalizationRegion: input.language,
  };
}

export type PodcastLocalizationMode = "match-app" | "custom";

export type SubscriptionPlan = "free" | "premium";

export const SUBSCRIPTION_PLANS = {
  premium: {
    title: "Premium",
    priceLabel: "$40 / month",
    features: [
      "Unlimited daily briefs",
      "Premium voice engines",
      "Live station alerts",
      "Priority episode generation",
    ],
  },
  free: {
    title: "Free",
    priceLabel: "$0 / month",
    features: ["Limited daily briefs", "Standard voices", "Core listening features"],
  },
} as const;

export function formatSubscriptionRenewalDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getSubscriptionLabel(plan: SubscriptionPlan) {
  return SUBSCRIPTION_PLANS[plan].title;
}

export const PODCAST_LOCALIZATION_REGIONS = [
  { value: "en-us", label: "English (US)" },
  { value: "en-gb", label: "English (UK)" },
  { value: "en-au", label: "English (Australia)" },
  { value: "en-ca", label: "English (Canada)" },
  { value: "es-es", label: "Spanish (Spain)" },
  { value: "es-mx", label: "Spanish (Mexico)" },
  { value: "es-ar", label: "Spanish (Argentina)" },
  { value: "fr-fr", label: "French (France)" },
  { value: "fr-ca", label: "French (Canada)" },
  { value: "de-de", label: "German (Germany)" },
  { value: "de-at", label: "German (Austria)" },
  { value: "pt-br", label: "Portuguese (Brazil)" },
  { value: "pt-pt", label: "Portuguese (Portugal)" },
  { value: "it-it", label: "Italian (Italy)" },
  { value: "ja-jp", label: "Japanese (Japan)" },
  { value: "ko-kr", label: "Korean (Korea)" },
  { value: "zh-cn", label: "Chinese (Simplified)" },
  { value: "zh-tw", label: "Chinese (Traditional)" },
  { value: "ar-sa", label: "Arabic (Saudi Arabia)" },
  { value: "ar-eg", label: "Arabic (Egypt)" },
  { value: "hi-in", label: "Hindi (India)" },
  { value: "bn-in", label: "Bengali (India)" },
  { value: "bn-bd", label: "Bengali (Bangladesh)" },
  { value: "ca-es", label: "Catalan (Spain)" },
  { value: "hr-hr", label: "Croatian (Croatia)" },
  { value: "cs-cz", label: "Czech (Czechia)" },
  { value: "da-dk", label: "Danish (Denmark)" },
  { value: "nl-nl", label: "Dutch (Netherlands)" },
  { value: "nl-be", label: "Dutch (Belgium)" },
  { value: "fil-ph", label: "Filipino (Philippines)" },
  { value: "fi-fi", label: "Finnish (Finland)" },
  { value: "el-gr", label: "Greek (Greece)" },
  { value: "he-il", label: "Hebrew (Israel)" },
  { value: "hu-hu", label: "Hungarian (Hungary)" },
  { value: "id-id", label: "Indonesian (Indonesia)" },
  { value: "ms-my", label: "Malay (Malaysia)" },
  { value: "no-no", label: "Norwegian (Norway)" },
  { value: "fa-ir", label: "Persian (Iran)" },
  { value: "pl-pl", label: "Polish (Poland)" },
  { value: "ro-ro", label: "Romanian (Romania)" },
  { value: "sk-sk", label: "Slovak (Slovakia)" },
  { value: "sv-se", label: "Swedish (Sweden)" },
  { value: "ta-in", label: "Tamil (India)" },
  { value: "th-th", label: "Thai (Thailand)" },
  { value: "tr-tr", label: "Turkish (Turkey)" },
  { value: "uk-ua", label: "Ukrainian (Ukraine)" },
  { value: "ur-pk", label: "Urdu (Pakistan)" },
  { value: "vi-vn", label: "Vietnamese (Vietnam)" },
] as const;

export function resolvePodcastLocale(input: {
  language: string;
  podcastLocalizationMode: PodcastLocalizationMode;
  podcastLocalizationRegion: string;
  isPremiumVoice?: boolean;
}): string {
  const isPremiumVoice = Boolean(input.isPremiumVoice);

  if (input.podcastLocalizationMode === "custom") {
    const region = input.podcastLocalizationRegion.trim().toLowerCase();
    if (isPremiumVoice) {
      if (isPremiumPodcastLanguageCode(region)) {
        return region;
      }
      return mapAppLanguageToPremiumPodcastLocale(region) ?? "eng";
    }
    return coerceCustomPodcastRegion(region);
  }

  if (isPremiumVoice) {
    return mapAppLanguageToPremiumPodcastLocale(input.language) ?? "eng";
  }

  return input.language.trim().toLowerCase();
}

export function podcastLocalizationFromLocale(
  podcastLocale: string,
  appLanguage?: string,
  isPremiumVoice = false,
): {
  podcastLocalizationMode: PodcastLocalizationMode;
  podcastLocalizationRegion: string;
} {
  const normalized = podcastLocale.trim().toLowerCase();
  const app = appLanguage?.trim().toLowerCase() || "";

  if (isPremiumVoice) {
    const premiumDirect = PREMIUM_PODCAST_LANGUAGE_OPTIONS.find(
      (option) => option.value === normalized,
    );
    const mappedFromAppCode =
      mapAppLanguageToPremiumPodcastLocale(normalized) ??
      (normalized.includes("-")
        ? mapAppLanguageToPremiumPodcastLocale(normalized.split("-")[0] ?? "")
        : null);
    const asPremium = premiumDirect?.value ?? mappedFromAppCode ?? "eng";
    const asAppRegion =
      mapPremiumPodcastToAppLanguage(asPremium) ??
      (APP_LANGUAGE_OPTIONS.some((option) => option.value === normalized)
        ? (normalized as AppLanguageCode)
        : "en");
    const appMapped = app ? mapAppLanguageToPremiumPodcastLocale(app) : null;

    if (!appMapped) {
      return {
        podcastLocalizationMode: "custom",
        podcastLocalizationRegion: asAppRegion,
      };
    }

    if (asPremium === appMapped) {
      return {
        podcastLocalizationMode: "match-app",
        podcastLocalizationRegion: app || asAppRegion,
      };
    }

    return {
      podcastLocalizationMode: "custom",
      podcastLocalizationRegion: asAppRegion,
    };
  }

  const appDirect = APP_LANGUAGE_OPTIONS.find(
    (option) => option.value === normalized,
  );
  const directMatch =
    appDirect ??
    LANGUAGE_OPTIONS.find((option) => option.value === normalized);
  const legacyBase = normalized.includes("-")
    ? APP_LANGUAGE_OPTIONS.find(
        (option) => option.value === normalized.split("-")[0],
      ) ??
      LANGUAGE_OPTIONS.find(
        (option) => option.value === normalized.split("-")[0],
      )
    : undefined;
  const asLanguage = directMatch?.value ?? legacyBase?.value;

  if (!asLanguage) {
    return {
      podcastLocalizationMode: "match-app",
      podcastLocalizationRegion: "en",
    };
  }

  const asAppRegion = coerceCustomPodcastRegion(asLanguage);

  if (!app || asAppRegion === app) {
    return {
      podcastLocalizationMode: "match-app",
      podcastLocalizationRegion: asAppRegion,
    };
  }

  return {
    podcastLocalizationMode: "custom",
    podcastLocalizationRegion: asAppRegion,
  };
}

/** Native/endonym names shown as the primary label in language selects. */
const LANGUAGE_REGIONAL_LABELS: Record<string, string> = {
  ar: "العربية",
  cmn: "中文",
  zh: "中文",
  en: "English",
  fr: "Français",
  de: "Deutsch",
  hi: "हिन्दी",
  id: "Bahasa Indonesia",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  ms: "Bahasa Melayu",
  pt: "Português",
  es: "Español",
  // Premium podcast ISO 639-3 codes
  ara: "العربية",
  eng: "English",
  fra: "Français",
  deu: "Deutsch",
  hin: "हिन्दी",
  ind: "Bahasa Indonesia",
  ita: "Italiano",
  jpn: "日本語",
  kor: "한국어",
  msa: "Bahasa Melayu",
  por: "Português",
  spa: "Español",
};

export function getLanguageRegionalLabel(value: string) {
  return (
    LANGUAGE_REGIONAL_LABELS[value] ??
    APP_LANGUAGE_OPTIONS.find((option) => option.value === value)?.label ??
    LANGUAGE_OPTIONS.find((option) => option.value === value)?.label ??
    PREMIUM_PODCAST_LANGUAGE_OPTIONS.find((option) => option.value === value)
      ?.label ??
    "English"
  );
}

export function getLanguageEnglishLabel(value: string) {
  return (
    APP_LANGUAGE_OPTIONS.find((option) => option.value === value)?.englishLabel ??
    LANGUAGE_OPTIONS.find((option) => option.value === value)?.englishLabel ??
    PREMIUM_PODCAST_LANGUAGE_OPTIONS.find((option) => option.value === value)
      ?.englishLabel ??
    getLanguageRegionalLabel(value)
  );
}

export const MAX_BRIEFING_ROUTINE_ITEMS = 6;
export const MAX_WEATHER_SAVED_LOCATIONS = 3;


export const DEFAULT_BRIEFING_ROUTINE: BriefingRoutineSlot[] = [
  { id: "routine-news", type: "news", label: "World News" },
];

function normalizeBriefingRoutine(
  routine: BriefingRoutineSlot[] | undefined,
): BriefingRoutineSlot[] {
  if (!routine?.length) {
    return DEFAULT_BRIEFING_ROUTINE;
  }

  const normalized = routine
    .filter((slot) => slot.type !== "email")
    .map((slot) =>
      slot.type === "news" && (slot.label === "News Pod" || !slot.label)
        ? { ...slot, label: "World News" }
        : slot,
    )
    .slice(0, MAX_BRIEFING_ROUTINE_ITEMS);

  return normalized.length > 0 ? normalized : DEFAULT_BRIEFING_ROUTINE;
}

export function mapApiBriefingRoutine(
  routine: Array<{
    id?: string;
    type?: string;
    label?: string;
    podcastId?: string | null;
  }> | null | undefined,
): BriefingRoutineSlot[] | null {
  if (!routine) {
    return null;
  }

  if (routine.length === 0) {
    return [];
  }

  return normalizeBriefingRoutine(
    routine.map((slot, index) => ({
      id: slot.id || `${slot.type ?? "podcast"}-${index}`,
      type: (slot.type as BriefingRoutineSlot["type"]) || "podcast",
      label: slot.label || slot.type || "Item",
      podcastId: slot.podcastId ?? undefined,
    })),
  );
}

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  briefingRoutine: DEFAULT_BRIEFING_ROUTINE,
  useGlobalVoiceOverride: false,
  conversationStyle: "HostCohost",
  customPrompt: "",
  voiceEngine: "ElevenTTS2_5",
  speakerA: "XEQBC9sleaE3f5ff82UR",
  speakerB: "mkrzc6Zmz8alRK0wX5dd",
  emailConversationStyle: "HostCohost",
  emailCustomPrompt: "",
  emailVoiceEngine: "ElevenTTS2_5",
  emailSpeakerA: "XEQBC9sleaE3f5ff82UR",
  emailSpeakerB: "mkrzc6Zmz8alRK0wX5dd",
  emailMaxItems: 25,
  emailLookbackHours: 24,
  emailSkipDuplicates: true,
  newsConversationStyle: "ReporterAnalyst",
  newsCustomPrompt: "",
  newsVoiceEngine: "ElevenTTS2_5",
  newsSpeakerA: "XEQBC9sleaE3f5ff82UR",
  newsSpeakerB: "mkrzc6Zmz8alRK0wX5dd",
  skipBackSeconds: 10,
  skipForwardSeconds: 30,
  freshEpisodeMinutes: 60,
  language: "en",
  podcastLocalizationMode: "match-app",
  podcastLocalizationRegion: "en",
  weatherZipCode: "",
  weatherSavedLocations: DEFAULT_WEATHER_LOCATIONS,
  weatherTemperatureUnit: "fahrenheit",
  weatherDailyForecastAlerts: true,
  weatherSevereWeatherAlerts: true,
  weatherDeliveryTime: "07:30",
  notifyNewBrief: true,
  notifyLiveStation: true,
  notifyNewEpisode: true,
  subscriptionPlan: "premium",
  subscriptionRenewsAt: "2026-09-17",
  gmailConnected: false,
};

export function loadPlatformSettings(): PlatformSettings {
  if (typeof window === "undefined") {
    return DEFAULT_PLATFORM_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_PLATFORM_SETTINGS;
    }

    const parsed = JSON.parse(raw) as Partial<PlatformSettings>;
    const merged = {
      ...DEFAULT_PLATFORM_SETTINGS,
      ...parsed,
      briefingRoutine: normalizeBriefingRoutine(parsed.briefingRoutine),
      weatherSavedLocations:
        parsed.weatherSavedLocations?.length
          ? parsed.weatherSavedLocations
          : DEFAULT_PLATFORM_SETTINGS.weatherSavedLocations,
    };

    return {
      ...merged,
      speakerA: normalizeSpeakerId(merged.speakerA, merged.voiceEngine),
      speakerB: normalizeSpeakerId(merged.speakerB, merged.voiceEngine),
      emailSpeakerA: normalizeSpeakerId(merged.emailSpeakerA, merged.emailVoiceEngine),
      emailSpeakerB: normalizeSpeakerId(merged.emailSpeakerB, merged.emailVoiceEngine),
      newsSpeakerA: normalizeSpeakerId(merged.newsSpeakerA, merged.newsVoiceEngine),
      newsSpeakerB: normalizeSpeakerId(merged.newsSpeakerB, merged.newsVoiceEngine),
    };
  } catch {
    return DEFAULT_PLATFORM_SETTINGS;
  }
}

export function savePlatformSettings(settings: PlatformSettings) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent("eilo-platform-settings-changed"));
}

export type SettingsSectionId =
  | "briefing-routine"
  | "voice-style"
  | "language"
  | "weather"
  | "notifications"
  | "subscription"
  | "connections"
  | "manage-account";

export const SETTINGS_SECTIONS: {
  id: SettingsSectionId;
  title: string;
  subtitle?: string;
  icon: string;
}[] = [
  {
    id: "briefing-routine",
    title: "Briefing Routine",
    subtitle: "What plays when you generate a brief",
    icon: "format_list_bulleted",
  },
  {
    id: "voice-style",
    title: "Voice & Style",
    subtitle: "Global voice engine, speakers & style",
    icon: "mic",
  },
  {
    id: "language",
    title: "Language",
    icon: "language",
  },
  {
    id: "weather",
    title: "Weather",
    subtitle: "Set your city",
    icon: "partly_cloudy_day",
  },
  {
    id: "notifications",
    title: "Notifications",
    subtitle: "Briefs, live stations & new episodes",
    icon: "notifications",
  },
  {
    id: "subscription",
    title: "Subscription",
    subtitle: "Plan, billing & renewal",
    icon: "workspace_premium",
  },
  {
    id: "connections",
    title: "Connections",
    subtitle: "Manage email & calendar",
    icon: "link",
  },
  {
    id: "manage-account",
    title: "Manage Account",
    subtitle: "Devices, passkeys & sign out",
    icon: "person",
  },
];
