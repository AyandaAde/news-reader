export type VoiceEngineInfo = {
  id: string;
  label: string;
  tier: string;
  description: string;
};

export type VoiceInfo = {
  id: string;
  name: string;
  description: string;
  engine: string;
};

export const VOICE_ENGINES: VoiceEngineInfo[] = [
  {
    id: "KokoroTTS",
    label: "Kokoro",
    tier: "Free",
    description: "Slow, local text-to-speech",
  },
  {
    id: "ElevenTTS2_5",
    label: "ElevenLabs",
    tier: "Pro",
    description: "Fast, expressive voices",
  },
  {
    id: "GeminiTTS",
    label: "Gemini TTS",
    tier: "Pro",
    description: "Google AI voices with natural-language style control",
  },
  {
    id: "WavenetTTS",
    label: "Wavenet",
    tier: "Pro",
    description: "High-quality neural voices from Google",
  },
  {
    id: "ElevenTTS3",
    label: "ElevenLabs v3",
    tier: "Premium",
    description: "Expressive dialogue with emotional delivery",
  },
];

const elevenLabsVoices: Omit<VoiceInfo, "engine">[] = [
  { id: "XEQBC9sleaE3f5ff82UR", name: "Charlotte", description: "Podcasts & lifestyle" },
  { id: "Q1QcmfZPmFDVUWmzASdy", name: "Matt", description: "Dramatic radio host" },
  { id: "g6xIsTj2HwM6VR4iXFCw", name: "Jessica", description: "Chatty & friendly" },
  { id: "mkrzc6Zmz8alRK0wX5dd", name: "Jason Pike", description: "Friendly Australian" },
  { id: "3sfGn775ryaDXhFWHwBg", name: "Jason", description: "Warm & confident" },
];

const kokoroVoices: Omit<VoiceInfo, "engine">[] = [
  { id: "af_heart", name: "Heart", description: "Warm & expressive" },
  { id: "af_bella", name: "Bella", description: "Confident & clear" },
  { id: "af_jessica", name: "Jessica", description: "Female voice" },
  { id: "am_michael", name: "Michael", description: "Calm & conversational" },
  { id: "am_adam", name: "Adam", description: "Male voice" },
];

const geminiVoices: Omit<VoiceInfo, "engine">[] = [
  { id: "Zephyr", name: "Zephyr", description: "Bright" },
  { id: "Puck", name: "Puck", description: "Upbeat" },
  { id: "Charon", name: "Charon", description: "Informative" },
  { id: "Kore", name: "Kore", description: "Firm" },
  { id: "Sulafat", name: "Sulafat", description: "Warm" },
  { id: "Achird", name: "Achird", description: "Friendly" },
];

const wavenetVoices: Omit<VoiceInfo, "engine">[] = [
  { id: "en-US-Wavenet-A", name: "Wavenet A", description: "Male" },
  { id: "en-US-Wavenet-C", name: "Wavenet C", description: "Female" },
  { id: "en-US-Wavenet-D", name: "Wavenet D", description: "Male" },
  { id: "en-US-Wavenet-F", name: "Wavenet F", description: "Female" },
];

function withEngine(voices: Omit<VoiceInfo, "engine">[], engine: string): VoiceInfo[] {
  return voices.map((voice) => ({ ...voice, engine }));
}

export const VOICES: VoiceInfo[] = [
  ...withEngine(kokoroVoices, "KokoroTTS"),
  ...withEngine(elevenLabsVoices, "ElevenTTS2_5"),
  ...withEngine(elevenLabsVoices, "ElevenTTS3"),
  ...withEngine(geminiVoices, "GeminiTTS"),
  ...withEngine(wavenetVoices, "WavenetTTS"),
];

const LEGACY_SPEAKER_IDS: Record<string, string> = {
  charlotte: "XEQBC9sleaE3f5ff82UR",
  "jason-pike": "mkrzc6Zmz8alRK0wX5dd",
  "maya-chen": "g6xIsTj2HwM6VR4iXFCw",
  "samuel-reed": "Q1QcmfZPmFDVUWmzASdy",
};

export function normalizeSpeakerId(id: string | undefined, engine: string): string {
  if (!id) {
    return defaultSpeakersForEngine(engine).speakerA;
  }

  const legacy = LEGACY_SPEAKER_IDS[id];
  if (legacy) {
    return legacy;
  }

  const voices = voicesByEngine(engine);
  if (voices.some((voice) => voice.id === id)) {
    return id;
  }

  return defaultSpeakersForEngine(engine).speakerA;
}

export function voicesByEngine(engineId: string): VoiceInfo[] {
  return VOICES.filter((voice) => voice.engine === engineId);
}

export function defaultSpeakersForEngine(engineId: string) {
  const voices = voicesByEngine(engineId);
  return {
    speakerA: voices[0]?.id ?? "XEQBC9sleaE3f5ff82UR",
    speakerB: voices[1]?.id ?? voices[0]?.id ?? "mkrzc6Zmz8alRK0wX5dd",
  };
}

export function getVoiceLabel(voiceId: string, engineId: string) {
  const voice = voicesByEngine(engineId).find((item) => item.id === voiceId);
  return voice?.name ?? voiceId;
}
