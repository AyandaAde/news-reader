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

export const LANGUAGE_OPTIONS = [
  { value: "af", label: "Afrikaans" },
  { value: "sq", label: "Albanian" },
  { value: "am", label: "Amharic" },
  { value: "ar", label: "Arabic" },
  { value: "hy", label: "Armenian" },
  { value: "az", label: "Azerbaijani" },
  { value: "eu", label: "Basque" },
  { value: "be", label: "Belarusian" },
  { value: "bn", label: "Bengali" },
  { value: "bg", label: "Bulgarian" },
  { value: "my", label: "Burmese" },
  { value: "ca", label: "Catalan" },
  { value: "ceb", label: "Cebuano" },
  { value: "hr", label: "Croatian" },
  { value: "cs", label: "Czech" },
  { value: "da", label: "Danish" },
  { value: "nl", label: "Dutch" },
  { value: "en", label: "English" },
  { value: "et", label: "Estonian" },
  { value: "fil", label: "Filipino" },
  { value: "fi", label: "Finnish" },
  { value: "fr", label: "French" },
  { value: "gl", label: "Galician" },
  { value: "ka", label: "Georgian" },
  { value: "de", label: "German" },
  { value: "el", label: "Greek" },
  { value: "gu", label: "Gujarati" },
  { value: "ht", label: "Haitian Creole" },
  { value: "he", label: "Hebrew" },
  { value: "hi", label: "Hindi" },
  { value: "hu", label: "Hungarian" },
  { value: "is", label: "Icelandic" },
  { value: "id", label: "Indonesian" },
  { value: "it", label: "Italian" },
  { value: "ja", label: "Japanese" },
  { value: "jv", label: "Javanese" },
  { value: "kn", label: "Kannada" },
  { value: "kok", label: "Konkani" },
  { value: "ko", label: "Korean" },
  { value: "lo", label: "Lao" },
  { value: "la", label: "Latin" },
  { value: "lv", label: "Latvian" },
  { value: "lt", label: "Lithuanian" },
  { value: "lb", label: "Luxembourgish" },
  { value: "mk", label: "Macedonian" },
  { value: "mai", label: "Maithili" },
  { value: "mg", label: "Malagasy" },
  { value: "ms", label: "Malay" },
  { value: "ml", label: "Malayalam" },
  { value: "cmn", label: "Mandarin Chinese" },
  { value: "mr", label: "Marathi" },
  { value: "mn", label: "Mongolian" },
  { value: "ne", label: "Nepali" },
  { value: "nb", label: "Norwegian Bokmål" },
  { value: "nn", label: "Norwegian Nynorsk" },
  { value: "or", label: "Odia" },
  { value: "ps", label: "Pashto" },
  { value: "fa", label: "Persian" },
  { value: "pl", label: "Polish" },
  { value: "pt", label: "Portuguese" },
  { value: "pa", label: "Punjabi" },
  { value: "ro", label: "Romanian" },
  { value: "ru", label: "Russian" },
  { value: "sr", label: "Serbian" },
  { value: "sd", label: "Sindhi" },
  { value: "si", label: "Sinhala" },
  { value: "sk", label: "Slovak" },
  { value: "sl", label: "Slovenian" },
  { value: "es", label: "Spanish" },
  { value: "sw", label: "Swahili" },
  { value: "sv", label: "Swedish" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
  { value: "th", label: "Thai" },
  { value: "tr", label: "Turkish" },
  { value: "uk", label: "Ukrainian" },
  { value: "ur", label: "Urdu" },
  { value: "vi", label: "Vietnamese" },
] as const;

export type AppLanguageCode = (typeof LANGUAGE_OPTIONS)[number]["value"];

/** ISO 639-3 podcast locales for premium voice engines (e.g. ElevenLabs). */
export const PREMIUM_PODCAST_LANGUAGE_OPTIONS = [
  { value: "afr", label: "Afrikaans" },
  { value: "ara", label: "Arabic" },
  { value: "hye", label: "Armenian" },
  { value: "asm", label: "Assamese" },
  { value: "aze", label: "Azerbaijani" },
  { value: "bel", label: "Belarusian" },
  { value: "ben", label: "Bengali" },
  { value: "bos", label: "Bosnian" },
  { value: "bul", label: "Bulgarian" },
  { value: "cat", label: "Catalan" },
  { value: "ceb", label: "Cebuano" },
  { value: "nya", label: "Chichewa" },
  { value: "hrv", label: "Croatian" },
  { value: "ces", label: "Czech" },
  { value: "dan", label: "Danish" },
  { value: "nld", label: "Dutch" },
  { value: "eng", label: "English" },
  { value: "est", label: "Estonian" },
  { value: "fil", label: "Filipino" },
  { value: "fin", label: "Finnish" },
  { value: "fra", label: "French" },
  { value: "glg", label: "Galician" },
  { value: "kat", label: "Georgian" },
  { value: "deu", label: "German" },
  { value: "ell", label: "Greek" },
  { value: "guj", label: "Gujarati" },
  { value: "hau", label: "Hausa" },
  { value: "heb", label: "Hebrew" },
  { value: "hin", label: "Hindi" },
  { value: "hun", label: "Hungarian" },
  { value: "isl", label: "Icelandic" },
  { value: "ind", label: "Indonesian" },
  { value: "gle", label: "Irish" },
  { value: "ita", label: "Italian" },
  { value: "jpn", label: "Japanese" },
  { value: "jav", label: "Javanese" },
  { value: "kan", label: "Kannada" },
  { value: "kaz", label: "Kazakh" },
  { value: "kir", label: "Kirghiz" },
  { value: "kor", label: "Korean" },
  { value: "lav", label: "Latvian" },
  { value: "lin", label: "Lingala" },
  { value: "lit", label: "Lithuanian" },
  { value: "ltz", label: "Luxembourgish" },
  { value: "mkd", label: "Macedonian" },
  { value: "msa", label: "Malay" },
  { value: "mal", label: "Malayalam" },
  { value: "cmn", label: "Mandarin Chinese" },
  { value: "mar", label: "Marathi" },
  { value: "nep", label: "Nepali" },
  { value: "nor", label: "Norwegian" },
  { value: "pus", label: "Pashto" },
  { value: "fas", label: "Persian" },
  { value: "pol", label: "Polish" },
  { value: "pan", label: "Punjabi" },
  { value: "por", label: "Portuguese" },
  { value: "ron", label: "Romanian" },
  { value: "rus", label: "Russian" },
  { value: "srp", label: "Serbian" },
  { value: "snd", label: "Sindhi" },
  { value: "slk", label: "Slovak" },
  { value: "slv", label: "Slovenian" },
  { value: "som", label: "Somali" },
  { value: "spa", label: "Spanish" },
  { value: "swa", label: "Swahili" },
  { value: "swe", label: "Swedish" },
  { value: "tam", label: "Tamil" },
  { value: "tel", label: "Telugu" },
  { value: "tha", label: "Thai" },
  { value: "tur", label: "Turkish" },
  { value: "ukr", label: "Ukrainian" },
  { value: "urd", label: "Urdu" },
  { value: "vie", label: "Vietnamese" },
  { value: "cym", label: "Welsh" },
] as const;

export type PremiumPodcastLanguageCode =
  (typeof PREMIUM_PODCAST_LANGUAGE_OPTIONS)[number]["value"];

/** Maps app UI language codes onto premium podcast ISO 639-3 codes. */
export const APP_LANGUAGE_TO_PREMIUM_PODCAST: Record<string, PremiumPodcastLanguageCode> =
  {
    af: "afr",
    ar: "ara",
    hy: "hye",
    az: "aze",
    be: "bel",
    bn: "ben",
    bg: "bul",
    ca: "cat",
    ceb: "ceb",
    hr: "hrv",
    cs: "ces",
    da: "dan",
    nl: "nld",
    en: "eng",
    et: "est",
    fil: "fil",
    fi: "fin",
    fr: "fra",
    gl: "glg",
    ka: "kat",
    de: "deu",
    el: "ell",
    gu: "guj",
    he: "heb",
    hi: "hin",
    hu: "hun",
    is: "isl",
    id: "ind",
    it: "ita",
    ja: "jpn",
    jv: "jav",
    kn: "kan",
    ko: "kor",
    lv: "lav",
    lt: "lit",
    lb: "ltz",
    mk: "mkd",
    ms: "msa",
    ml: "mal",
    cmn: "cmn",
    zh: "cmn",
    mr: "mar",
    ne: "nep",
    nb: "nor",
    nn: "nor",
    ps: "pus",
    fa: "fas",
    pl: "pol",
    pa: "pan",
    pt: "por",
    ro: "ron",
    ru: "rus",
    sr: "srp",
    sd: "snd",
    sk: "slk",
    sl: "slv",
    es: "spa",
    sw: "swa",
    sv: "swe",
    ta: "tam",
    te: "tel",
    th: "tha",
    tr: "tur",
    uk: "ukr",
    ur: "urd",
    vi: "vie",
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

export function getCustomPodcastLanguageOptions(isPremiumVoice: boolean) {
  return isPremiumVoice
    ? PREMIUM_PODCAST_LANGUAGE_OPTIONS
    : LANGUAGE_OPTIONS;
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
      podcastLocalizationRegion: input.podcastLocalizationRegion,
    };
  }

  const matchLocale = mapAppLanguageToPremiumPodcastLocale(input.language);
  if (!matchLocale) {
    const region = isPremiumPodcastLanguageCode(
      input.podcastLocalizationRegion,
    )
      ? input.podcastLocalizationRegion
      : "eng";
    return {
      podcastLocalizationMode: "custom",
      podcastLocalizationRegion: region,
    };
  }

  if (input.podcastLocalizationMode === "custom") {
    return {
      podcastLocalizationMode: "custom",
      podcastLocalizationRegion: isPremiumPodcastLanguageCode(
        input.podcastLocalizationRegion,
      )
        ? input.podcastLocalizationRegion
        : matchLocale,
    };
  }

  return {
    podcastLocalizationMode: "match-app",
    podcastLocalizationRegion: matchLocale,
  };
}

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

export function resolvePodcastLocale(input: {
  language: string;
  podcastLocalizationMode: PodcastLocalizationMode;
  podcastLocalizationRegion: string;
  isPremiumVoice?: boolean;
}): string {
  const isPremiumVoice = Boolean(input.isPremiumVoice);

  if (input.podcastLocalizationMode === "custom") {
    const region = input.podcastLocalizationRegion.trim().toLowerCase();
    if (isPremiumVoice && !isPremiumPodcastLanguageCode(region)) {
      return "eng";
    }
    return region;
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
    const appMapped = app ? mapAppLanguageToPremiumPodcastLocale(app) : null;

    if (!appMapped) {
      return {
        podcastLocalizationMode: "custom",
        podcastLocalizationRegion: asPremium,
      };
    }

    if (asPremium === appMapped) {
      return {
        podcastLocalizationMode: "match-app",
        podcastLocalizationRegion: asPremium,
      };
    }

    return {
      podcastLocalizationMode: "custom",
      podcastLocalizationRegion: asPremium,
    };
  }

  const directMatch = LANGUAGE_OPTIONS.find(
    (option) => option.value === normalized,
  );
  const legacyBase = normalized.includes("-")
    ? LANGUAGE_OPTIONS.find(
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

  if (!app || asLanguage === app) {
    return {
      podcastLocalizationMode: "match-app",
      podcastLocalizationRegion: asLanguage,
    };
  }

  return {
    podcastLocalizationMode: "custom",
    podcastLocalizationRegion: asLanguage,
  };
}

const LANGUAGE_REGIONAL_LABELS: Record<string, string> = {
  af: "Afrikaans",
  sq: "Albanian",
  am: "Amharic",
  ar: "Arabic",
  hy: "Armenian",
  az: "Azerbaijani",
  eu: "Basque",
  be: "Belarusian",
  bn: "Bengali",
  bg: "Bulgarian",
  my: "Burmese",
  ca: "Catalan",
  ceb: "Cebuano",
  hr: "Croatian",
  cs: "Czech",
  da: "Danish",
  nl: "Dutch",
  en: "English",
  et: "Estonian",
  fil: "Filipino",
  fi: "Finnish",
  fr: "French",
  gl: "Galician",
  ka: "Georgian",
  de: "German",
  el: "Greek",
  gu: "Gujarati",
  ht: "Haitian Creole",
  he: "Hebrew",
  hi: "Hindi",
  hu: "Hungarian",
  is: "Icelandic",
  id: "Indonesian",
  it: "Italian",
  ja: "Japanese",
  jv: "Javanese",
  kn: "Kannada",
  kok: "Konkani",
  ko: "Korean",
  lo: "Lao",
  la: "Latin",
  lv: "Latvian",
  lt: "Lithuanian",
  lb: "Luxembourgish",
  mk: "Macedonian",
  mai: "Maithili",
  mg: "Malagasy",
  ms: "Malay",
  ml: "Malayalam",
  cmn: "Mandarin Chinese",
  zh: "Mandarin Chinese",
  mr: "Marathi",
  mn: "Mongolian",
  ne: "Nepali",
  nb: "Norwegian Bokmål",
  nn: "Norwegian Nynorsk",
  or: "Odia",
  ps: "Pashto",
  fa: "Persian",
  pl: "Polish",
  pt: "Portuguese",
  pa: "Punjabi",
  ro: "Romanian",
  ru: "Russian",
  sr: "Serbian",
  sd: "Sindhi",
  si: "Sinhala",
  sk: "Slovak",
  sl: "Slovenian",
  es: "Spanish",
  sw: "Swahili",
  sv: "Swedish",
  ta: "Tamil",
  te: "Telugu",
  th: "Thai",
  tr: "Turkish",
  uk: "Ukrainian",
  ur: "Urdu",
  vi: "Vietnamese",
};

export function getLanguageRegionalLabel(value: string) {
  return (
    LANGUAGE_REGIONAL_LABELS[value] ??
    LANGUAGE_OPTIONS.find((option) => option.value === value)?.label ??
    PREMIUM_PODCAST_LANGUAGE_OPTIONS.find((option) => option.value === value)
      ?.label ??
    "English"
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
