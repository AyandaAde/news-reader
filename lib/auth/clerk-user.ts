import type { IpLocation } from "@/lib/ipinfo";

export type ClerkLoginLocation = IpLocation & {
  updatedAt?: string;
};

export function readLoginLocation(metadata: Record<string, unknown> | undefined) {
  const value = metadata?.loginLocation;
  if (!value || typeof value !== "object") {
    return null;
  }

  return value as ClerkLoginLocation;
}

export function buildDisplayName(user: {
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  username: string | null;
}) {
  const joined = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  if (joined) {
    return joined;
  }

  if (user.fullName?.trim()) {
    return user.fullName.trim();
  }

  if (user.username?.trim()) {
    return user.username.trim();
  }

  return undefined;
}

export function readNewsReaderUserId(metadata: Record<string, unknown> | undefined) {
  const value = metadata?.newsReaderUserId;
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
