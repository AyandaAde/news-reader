import type { Language } from "@/lib/i18n";

export async function saveVerificationLocale(email: string, locale: Language) {
  try {
    await fetch("/api/auth/verification-locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, locale }),
    });
  } catch (error) {
    console.error("Failed to save verification locale:", error);
  }
}
