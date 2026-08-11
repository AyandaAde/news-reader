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
  weatherZipCode: string;
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

export const VOICE_ENGINES = [
  { id: "KokoroTTS", label: "Kokoro", tier: "Free" },
  { id: "ElevenTTS2_5", label: "ElevenLabs", tier: "Pro" },
  { id: "GeminiTTS", label: "Gemini TTS", tier: "Pro" },
  { id: "WavenetTTS", label: "Wavenet", tier: "Pro" },
  { id: "ElevenTTS3", label: "ElevenLabs v3", tier: "Premium" },
];

export const VOICE_SPEAKERS = [
  { id: "charlotte", label: "Charlotte" },
  { id: "jason-pike", label: "Jason Pike" },
  { id: "maya-chen", label: "Maya Chen" },
  { id: "samuel-reed", label: "Samuel Reed" },
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

export const PLAYBACK_SKIP_OPTIONS = [5, 10, 15, 20, 30, 45, 60, 90] as const;

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "it", label: "Italian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
  { value: "ru", label: "Russian" },
];

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
  speakerA: "charlotte",
  speakerB: "jason-pike",
  emailConversationStyle: "HostCohost",
  emailCustomPrompt: "",
  emailVoiceEngine: "ElevenTTS2_5",
  emailSpeakerA: "charlotte",
  emailSpeakerB: "jason-pike",
  emailMaxItems: 25,
  emailLookbackHours: 24,
  emailSkipDuplicates: true,
  newsConversationStyle: "ReporterAnalyst",
  newsCustomPrompt: "",
  newsVoiceEngine: "ElevenTTS2_5",
  newsSpeakerA: "charlotte",
  newsSpeakerB: "jason-pike",
  skipBackSeconds: 10,
  skipForwardSeconds: 30,
  freshEpisodeMinutes: 60,
  language: "en",
  weatherZipCode: "",
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

    return {
      ...DEFAULT_PLATFORM_SETTINGS,
      ...parsed,
      briefingRoutine: normalizeBriefingRoutine(parsed.briefingRoutine),
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
  | "email-brief"
  | "news-pod"
  | "playback"
  | "language"
  | "weather"
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
    id: "email-brief",
    title: "Email Brief",
    subtitle: "Voices, style & email settings",
    icon: "mail",
  },
  {
    id: "news-pod",
    title: "News Pod",
    subtitle: "Voices & style for news episodes",
    icon: "public",
  },
  {
    id: "playback",
    title: "Playback",
    subtitle: "Skip interval",
    icon: "replay_10",
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
    id: "connections",
    title: "Connections",
    subtitle: "Manage email & calendar",
    icon: "link",
  },
  {
    id: "manage-account",
    title: "Manage Account",
    subtitle: "Edit name & account settings",
    icon: "person",
  },
];
