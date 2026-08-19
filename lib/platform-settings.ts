import { normalizeSpeakerId } from "@/lib/voice-catalog";

export type BriefingRoutineSlot = {
  id: string;
  type: "email" | "news" | "podcast";
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

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" },
  { value: "bn", label: "Bengali" },
  { value: "ca", label: "Catalan" },
  { value: "zh", label: "Chinese" },
  { value: "hr", label: "Croatian" },
  { value: "cs", label: "Czech" },
  { value: "da", label: "Danish" },
  { value: "nl", label: "Dutch" },
  { value: "fil", label: "Filipino" },
  { value: "fi", label: "Finnish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "el", label: "Greek" },
  { value: "he", label: "Hebrew" },
  { value: "hi", label: "Hindi" },
  { value: "hu", label: "Hungarian" },
  { value: "id", label: "Indonesian" },
  { value: "it", label: "Italian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "ms", label: "Malay" },
  { value: "no", label: "Norwegian" },
  { value: "fa", label: "Persian" },
  { value: "pl", label: "Polish" },
  { value: "pt", label: "Portuguese" },
  { value: "ro", label: "Romanian" },
  { value: "ru", label: "Russian" },
  { value: "sk", label: "Slovak" },
  { value: "es", label: "Spanish" },
  { value: "sv", label: "Swedish" },
  { value: "ta", label: "Tamil" },
  { value: "th", label: "Thai" },
  { value: "tr", label: "Turkish" },
  { value: "uk", label: "Ukrainian" },
  { value: "ur", label: "Urdu" },
  { value: "vi", label: "Vietnamese" },
];

export type PodcastLocalizationMode = "match-app" | "custom";

export type SubscriptionPlan = "free" | "premium";

export const SUBSCRIPTION_PLANS = {
  premium: {
    title: "Premium",
    priceLabel: "$9.99 / month",
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
  { value: "ru-ru", label: "Russian (Russia)" },
  { value: "sk-sk", label: "Slovak (Slovakia)" },
  { value: "sv-se", label: "Swedish (Sweden)" },
  { value: "ta-in", label: "Tamil (India)" },
  { value: "th-th", label: "Thai (Thailand)" },
  { value: "tr-tr", label: "Turkish (Turkey)" },
  { value: "uk-ua", label: "Ukrainian (Ukraine)" },
  { value: "ur-pk", label: "Urdu (Pakistan)" },
  { value: "vi-vn", label: "Vietnamese (Vietnam)" },
] as const;

const LANGUAGE_REGIONAL_LABELS: Record<string, string> = {
  en: "English (US)",
  ar: "Arabic (SA)",
  bn: "Bengali (IN)",
  ca: "Catalan (ES)",
  zh: "Chinese (CN)",
  hr: "Croatian (HR)",
  cs: "Czech (CZ)",
  da: "Danish (DK)",
  nl: "Dutch (NL)",
  fil: "Filipino (PH)",
  fi: "Finnish (FI)",
  fr: "French (FR)",
  de: "German (DE)",
  el: "Greek (GR)",
  he: "Hebrew (IL)",
  hi: "Hindi (IN)",
  hu: "Hungarian (HU)",
  id: "Indonesian (ID)",
  it: "Italian (IT)",
  ja: "Japanese (JP)",
  ko: "Korean (KR)",
  ms: "Malay (MY)",
  no: "Norwegian (NO)",
  fa: "Persian (IR)",
  pl: "Polish (PL)",
  pt: "Portuguese (PT)",
  ro: "Romanian (RO)",
  ru: "Russian (RU)",
  sk: "Slovak (SK)",
  es: "Spanish (ES)",
  sv: "Swedish (SE)",
  ta: "Tamil (IN)",
  th: "Thai (TH)",
  tr: "Turkish (TR)",
  uk: "Ukrainian (UA)",
  ur: "Urdu (PK)",
  vi: "Vietnamese (VN)",
};

export function getLanguageRegionalLabel(value: string) {
  return (
    LANGUAGE_REGIONAL_LABELS[value] ??
    LANGUAGE_OPTIONS.find((option) => option.value === value)?.label ??
    "English (US)"
  );
}

export const DEFAULT_BRIEFING_ROUTINE: BriefingRoutineSlot[] = [
  { id: "routine-email", type: "email", label: "Email Brief" },
  { id: "routine-news", type: "news", label: "World News" },
];

function normalizeBriefingRoutine(
  routine: BriefingRoutineSlot[] | undefined,
): BriefingRoutineSlot[] {
  if (!routine?.length) {
    return DEFAULT_BRIEFING_ROUTINE;
  }

  return routine.map((slot) =>
    slot.type === "news" && (slot.label === "News Pod" || !slot.label)
      ? { ...slot, label: "World News" }
      : slot,
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
  podcastLocalizationRegion: "en-us",
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
    subtitle: "Set your local zip code",
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
