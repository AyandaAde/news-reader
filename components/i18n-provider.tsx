"use client";

import i18next from "i18next";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  defaultLanguage,
  isLanguage,
  isRtlLanguage,
  resources,
  type Language,
} from "@/lib/i18n";
import {
  loadPlatformSettings,
  savePlatformSettings,
} from "@/lib/platform-settings";

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);
const STORAGE_KEY = "eilo-language";

if (!i18next.isInitialized) {
  void i18next.init({
    resources,
    lng: defaultLanguage,
    fallbackLng: defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
  });
}

function resolveInitialLanguage(): Language {
  const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
  if (savedLanguage && isLanguage(savedLanguage)) {
    return savedLanguage;
  }

  const settingsLanguage = loadPlatformSettings().language;
  if (isLanguage(settingsLanguage)) {
    return settingsLanguage;
  }

  return defaultLanguage;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  useEffect(() => {
    const initial = resolveInitialLanguage();
    setLanguageState(initial);
    void i18next.changeLanguage(initial);
  }, []);

  useEffect(() => {
    function onSettingsChanged() {
      const next = loadPlatformSettings().language;
      if (isLanguage(next)) {
        setLanguageState(next);
        window.localStorage.setItem(STORAGE_KEY, next);
        void i18next.changeLanguage(next);
      }
    }

    window.addEventListener("eilo-platform-settings-changed", onSettingsChanged);
    return () => {
      window.removeEventListener(
        "eilo-platform-settings-changed",
        onSettingsChanged,
      );
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtlLanguage(language) ? "rtl" : "ltr";
  }, [language]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    void i18next.changeLanguage(nextLanguage);
    savePlatformSettings({
      ...loadPlatformSettings(),
      language: nextLanguage,
    });
  }, []);

  const t = useCallback(
    (key: string, options?: Record<string, unknown>) =>
      i18next.getFixedT(language)(key, options),
    [language],
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
