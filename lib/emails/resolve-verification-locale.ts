import { coerceLanguage, defaultLanguage, type Language } from "@/lib/i18n";

type ClerkEmailUserMetadata = {
  unsafe_metadata?: { locale?: string | null } | null;
  public_metadata?: { locale?: string | null } | null;
};

function normalizeLocale(value: string | null | undefined): Language | null {
  if (!value?.trim()) {
    return null;
  }

  const normalized = value.trim().toLowerCase().replace("_", "-");
  const direct = coerceLanguage(normalized);
  if (direct) {
    return direct;
  }

  const primary = normalized.split("-", 1)[0];
  return primary ? coerceLanguage(primary) : null;
}

export function getLocaleFromClerkMetadata(user?: ClerkEmailUserMetadata | null) {
  return (
    normalizeLocale(user?.unsafe_metadata?.locale) ??
    normalizeLocale(user?.public_metadata?.locale)
  );
}

export function resolveVerificationLocale({
  clerkUser,
}: {
  clerkUser?: ClerkEmailUserMetadata | null;
}): Language {
  return getLocaleFromClerkMetadata(clerkUser) ?? defaultLanguage;
}
