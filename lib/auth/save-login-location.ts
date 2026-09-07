import { applyLoginLocationToLocalStorage } from "@/lib/auth/login-location";
import type { IpLocation } from "@/lib/ipinfo";

const SESSION_KEY = "eilo-login-location-saved";

type LocationResponse = {
  location?: IpLocation;
  saved?: boolean;
};

export async function saveLoginLocation(userId?: string | null) {
  if (typeof window === "undefined") return;

  if (sessionStorage.getItem(SESSION_KEY) === "1") return;

  try {
    const response = await fetch("/api/auth/location", {
      method: "POST",
    });

    if (!response.ok) return;

    const payload = (await response.json()) as LocationResponse;
    if (!payload.location) return;

    applyLoginLocationToLocalStorage(payload.location, userId);
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch (error) {
    console.error("Failed to save login location:", error);
  }
}
