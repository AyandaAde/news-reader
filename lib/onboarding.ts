export const ONBOARDING_STORAGE_KEY = "eilo-onboarding";

export const ONBOARDING_STEPS = [
  "name",
  "integration",
  "topics",
  "location",
  "notifications",
  "customize",
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export const TOPIC_OPTIONS = [
  "World News",
  "Business",
  "Science",
  "Sports",
  "Entertainment",
  "Technology",
  "Health",
  "Finance",
  "Music",
  "Food",
  "AI",
  "Travel",
  "Books",
  "Gaming",
  "Climate",
] as const;

export const BRIEF_ITEMS = [
  {
    id: "headlines",
    label: "Headlines",
    description: "Top news stories curated for you",
  },
  {
    id: "email",
    label: "Email summary",
    description: "Key emails from your inbox",
  },
  {
    id: "calendar",
    label: "Calendar",
    description: "Today's meetings and events",
  },
  {
    id: "weather",
    label: "Weather",
    description: "Local forecast for your day",
  },
  {
    id: "custom-topics",
    label: "Custom topics",
    description: "Stories from your chosen topics",
  },
] as const;

export type OnboardingData = {
  completed: boolean;
  name: string;
  topics: string[];
  lat: number | null;
  lon: number | null;
  gmailConnected: boolean;
  notificationsEnabled: boolean;
  briefItems: string[];
};

export const defaultOnboardingData = (): OnboardingData => ({
  completed: false,
  name: "",
  topics: [],
  lat: null,
  lon: null,
  gmailConnected: false,
  notificationsEnabled: false,
  briefItems: BRIEF_ITEMS.map((item) => item.id),
});

export function readOnboardingData(userId?: string | null): OnboardingData {
  if (typeof window === "undefined") {
    return defaultOnboardingData();
  }

  try {
    const raw = window.localStorage.getItem(
      userId ? `${ONBOARDING_STORAGE_KEY}:${userId}` : ONBOARDING_STORAGE_KEY,
    );
    if (!raw) {
      return defaultOnboardingData();
    }
    return { ...defaultOnboardingData(), ...JSON.parse(raw) };
  } catch {
    return defaultOnboardingData();
  }
}

export function writeOnboardingData(
  data: OnboardingData,
  userId?: string | null,
) {
  if (typeof window === "undefined") {
    return;
  }

  const key = userId
    ? `${ONBOARDING_STORAGE_KEY}:${userId}`
    : ONBOARDING_STORAGE_KEY;
  window.localStorage.setItem(key, JSON.stringify(data));
}

export function isOnboardingComplete(userId?: string | null): boolean {
  return readOnboardingData(userId).completed;
}

export function stepIndex(step: OnboardingStep): number {
  return ONBOARDING_STEPS.indexOf(step) + 1;
}

export function nextStep(step: OnboardingStep): OnboardingStep | null {
  const index = ONBOARDING_STEPS.indexOf(step);
  return ONBOARDING_STEPS[index + 1] ?? null;
}

export function splitDisplayName(name: string): {
  firstName: string;
  lastName: string;
} {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}
