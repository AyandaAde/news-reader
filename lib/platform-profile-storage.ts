export type StoredPlatformProfile = {
  name: string;
  email: string;
};

const STORAGE_KEY = "eilo-platform-profile";

export function loadStoredPlatformProfile(): StoredPlatformProfile | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as StoredPlatformProfile;
    if (!parsed.name?.trim() || !parsed.email?.trim()) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveStoredPlatformProfile(profile: StoredPlatformProfile) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
