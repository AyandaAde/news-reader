import { defaultLanguage, isLanguage, type Language } from "@/lib/i18n";

export type VerificationEmailFlow = "sign-in" | "sign-up";

export type VerificationEmailCopy = {
  htmlLang: string;
  dir: "ltr" | "rtl";
  subject: string;
  title: string;
  introWithName: string;
  introWithoutName: string;
  expiryNote: string;
  privacyPolicy: string;
  termsOfService: string;
  copyright: string;
  footerReasonSignIn: string;
  footerReasonSignUp: string;
  textCodeLabel: string;
  textIntro: string;
  textExpiry: string;
  textIgnore: string;
  flowSignIn: string;
  flowSignUp: string;
};

const englishCopy: VerificationEmailCopy = {
  htmlLang: "en",
  dir: "ltr",
  subject: "Verify your email | Eilo",
  title: "Verify your email",
  introWithName:
    "Hi {{name}}, enter the following 6-digit code to complete your {{flow}} process.",
  introWithoutName: "Enter the following 6-digit code to complete your {{flow}} process.",
  expiryNote:
    "This code will expire in <strong>{{minutes}} minutes</strong>. If you didn't request this, please ignore this email.",
  privacyPolicy: "Privacy Policy",
  termsOfService: "Terms of Service",
  copyright: "© {{year}} Eilo. All rights reserved.",
  footerReasonSignIn: "You received this email because you are signing in to Eilo.",
  footerReasonSignUp: "You received this email because you are signing up for Eilo.",
  textCodeLabel: "Your verification code is: {{code}}",
  textIntro: "Enter this code to complete your {{flow}} process.",
  textExpiry: "This code will expire in {{minutes}} minutes.",
  textIgnore: "If you didn't request this, please ignore this email.",
  flowSignIn: "sign-in",
  flowSignUp: "sign-up",
};

export function getVerificationEmailCopy(locale: string): VerificationEmailCopy {
  if (isLanguage(locale) && locale === "en") {
    return englishCopy;
  }

  if (isLanguage(locale)) {
    return {
      ...englishCopy,
      htmlLang: locale === "zh" ? "zh-CN" : locale,
      dir: locale === "ar" ? "rtl" : "ltr",
    };
  }

  return englishCopy;
}

export function interpolateCopy(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    String(values[key] ?? ""),
  );
}

export function getDefaultVerificationLocale(): Language {
  return defaultLanguage;
}
