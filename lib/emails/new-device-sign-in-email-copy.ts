import { defaultLanguage, isLanguage, type Language } from "@/lib/i18n";
import { interpolateCopy } from "@/lib/emails/verification-email-copy";

export type NewDeviceSignInEmailCopy = {
  htmlLang: string;
  dir: "ltr" | "rtl";
  subject: string;
  title: string;
  intro: string;
  signInTypeLabel: string;
  deviceLabel: string;
  locationLabel: string;
  ipLabel: string;
  timeLabel: string;
  unrecognizedTitle: string;
  unrecognizedBody: string;
  signOutButton: string;
  signOutFallback: string;
  supportBody: string;
  privacyPolicy: string;
  termsOfService: string;
  copyright: string;
  footerReason: string;
  textIntro: string;
  textDetailsHeader: string;
  textUnrecognized: string;
  textSignOut: string;
  textSupport: string;
  unknownValue: string;
};

const englishCopy: NewDeviceSignInEmailCopy = {
  htmlLang: "en",
  dir: "ltr",
  subject: "New device signed in to your Eilo account",
  title: "New sign in to your account",
  intro:
    "A new device just signed in to your Eilo account. If you don't recognize this device, review your account for unauthorized activity and make sure the sign-in method used is secure.",
  signInTypeLabel: "Sign in type",
  deviceLabel: "Device",
  locationLabel: "Location",
  ipLabel: "IP address",
  timeLabel: "Time",
  unrecognizedTitle: "Don't recognize this activity?",
  unrecognizedBody:
    "To immediately sign out of this device, use the button below.",
  signOutButton: "Sign out of this device",
  signOutFallback: "If the button doesn't work, use this link:",
  supportBody:
    "If you have questions or need help, contact us at {{supportEmail}} as soon as possible.",
  privacyPolicy: "Privacy Policy",
  termsOfService: "Terms of Service",
  copyright: "© {{year}} Eilo. All rights reserved.",
  footerReason:
    "You received this email because a new device signed in to your Eilo account.",
  textIntro:
    "A new device just signed in to your Eilo account. Details are below.",
  textDetailsHeader: "Sign-in details",
  textUnrecognized: "If you don't recognize this activity, sign out of the device:",
  textSignOut: "Sign out link: {{url}}",
  textSupport: "Need help? Contact {{supportEmail}}.",
  unknownValue: "Unknown",
};

export function getNewDeviceSignInEmailCopy(locale: string): NewDeviceSignInEmailCopy {
  if (isLanguage(locale) && locale === "en") {
    return englishCopy;
  }

  if (isLanguage(locale)) {
    return {
      ...englishCopy,
      htmlLang: locale === "cmn" ? "zh-CN" : locale,
      dir:
        locale === "ar" ||
        locale === "he" ||
        locale === "fa" ||
        locale === "ur" ||
        locale === "ps" ||
        locale === "sd"
          ? "rtl"
          : "ltr",
    };
  }

  return englishCopy;
}

export function getNewDeviceSignInEmailSubject(locale: Language) {
  return getNewDeviceSignInEmailCopy(locale).subject;
}

export function getDefaultNewDeviceSignInLocale(): Language {
  return defaultLanguage;
}

export { interpolateCopy };
