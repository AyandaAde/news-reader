export type StoredBackendUser = {
  clerkUserId: string;
  newsReaderUserId: string;
};

const STORAGE_KEY = "eilo-backend-user";

export function loadStoredBackendUser(): StoredBackendUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as StoredBackendUser;
    if (!parsed.clerkUserId?.trim() || !parsed.newsReaderUserId?.trim()) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveStoredBackendUser(user: StoredBackendUser) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}
