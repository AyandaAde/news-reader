"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BriefingRoutineList } from "@/components/platform/briefing-routine-list";
import { BriefingRoutineAddSelect } from "@/components/platform/briefing-routine-add-select";
import {
  VoiceEngineSpeakersPanel,
  type VoiceEngineSpeakersDraft,
} from "@/components/platform/voice-engine-speakers-panel";
import {
  LanguageSettingsPanel,
  type LanguageSettingsDraft,
} from "@/components/platform/language-settings-panel";
import { ManageAccountPanel } from "@/components/platform/manage-account-panel";
import {
  NotificationsSettingsPanel,
  type NotificationsSettingsDraft,
} from "@/components/platform/notifications-settings-panel";
import { SubscriptionCheckoutPanel } from "@/components/platform/subscription-checkout-panel";
import {
  WeatherSettingsPanel,
  type WeatherSettingsDraft,
} from "@/components/platform/weather-settings-panel";
import { PlatformSignOutButton } from "@/components/platform/platform-sign-out-button";
import { useI18n } from "@/components/i18n-provider";
import { isLanguage } from "@/lib/i18n";
import { profileShows } from "@/lib/platform-profile";
import {
  DEFAULT_PLATFORM_SETTINGS,
  LANGUAGE_OPTIONS,
  MAX_BRIEFING_ROUTINE_ITEMS,
  getSubscriptionLabel,
  loadPlatformSettings,
  mapApiBriefingRoutine,
  podcastLocalizationFromLocale,
  resolvePodcastLocale,
  ensurePodcastLocalizationForVoice,
  savePlatformSettings,
  SETTINGS_SECTIONS,
  type BriefingRoutineSlot,
  type ConversationStyle,
  type PlatformSettings,
  type SettingsSectionId,
} from "@/lib/platform-settings";
import { voiceEngineTierFromProvider } from "@/lib/voice-catalog";
import type { NewsReaderUser } from "@/lib/news-reader-api";
import { cn } from "@/lib/utils";

const SETTINGS_SECTION_I18N: Record<
  SettingsSectionId,
  { title: string; subtitle?: string }
> = {
  "briefing-routine": {
    title: "platform.profile.sectionBriefingRoutine",
    subtitle: "platform.profile.sectionBriefingRoutineSub",
  },
  "voice-style": {
    title: "platform.profile.sectionVoiceStyle",
    subtitle: "platform.profile.sectionVoiceStyleSub",
  },
  language: {
    title: "platform.profile.sectionLanguage",
  },
  weather: {
    title: "platform.profile.sectionWeather",
    subtitle: "platform.profile.sectionWeatherSub",
  },
  notifications: {
    title: "platform.profile.sectionNotifications",
    subtitle: "platform.profile.sectionNotificationsSub",
  },
  subscription: {
    title: "platform.profile.sectionSubscription",
    subtitle: "platform.profile.sectionSubscriptionSub",
  },
  connections: {
    title: "platform.profile.sectionConnections",
    subtitle: "platform.profile.sectionConnectionsSub",
  },
  "manage-account": {
    title: "platform.profile.sectionManageAccount",
    subtitle: "platform.profile.sectionManageAccountSub",
  },
};

function MaterialIcon({
  name,
  filled,
  className,
}: {
  name: string;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn("material-symbols-outlined", className)}
      style={
        filled
          ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
          : undefined
      }
    >
      {name}
    </span>
  );
}

function SubScreenHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="mb-4 flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-neutral-900 transition-colors hover:text-neutral-600 dark:text-white dark:hover:text-white/80"
      >
        {t("platform.profile.back")}
      </button>
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
        {title}
      </h3>
      <div className="w-10" />
    </div>
  );
}

function getLanguageLabel(value: string) {
  return LANGUAGE_OPTIONS.find((option) => option.value === value)?.label ?? "English";
}

type ProfileSettingsPanelProps = {
  displayName: string;
  emailAddress: string;
  onEditProfile: () => void;
};

export function ProfileSettingsPanel({
  displayName,
  emailAddress,
  onEditProfile,
}: ProfileSettingsPanelProps) {
  const { t, setLanguage } = useI18n();
  const [activeSection, setActiveSection] = useState<SettingsSectionId | null>(null);
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_PLATFORM_SETTINGS);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [voiceDraft, setVoiceDraft] = useState<VoiceEngineSpeakersDraft | null>(null);
  const [weatherDraft, setWeatherDraft] = useState<WeatherSettingsDraft | null>(null);
  const [languageDraft, setLanguageDraft] = useState<LanguageSettingsDraft | null>(null);
  const [notificationsDraft, setNotificationsDraft] = useState<NotificationsSettingsDraft | null>(
    null,
  );
  const previousSectionRef = useRef<SettingsSectionId | null>(null);

  useEffect(() => {
    const local = loadPlatformSettings();
    setSettings(local);

    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch("/api/user/get", {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as {
          user?: NewsReaderUser;
        };
        if (!payload.user || cancelled) {
          return;
        }

        const fromApi = mapApiBriefingRoutine(payload.user.briefingRoutine);
        const weatherLocations = payload.user.weatherSavedLocations;
        const weatherZipCode = payload.user.weatherZipCode;

        if (cancelled) {
          return;
        }

        if (fromApi !== null) {
          if (fromApi.length === 0 && local.briefingRoutine.length > 0) {
            const synced = await persistBriefingRoutine(local.briefingRoutine);
            if (synced && !cancelled) {
              setSettings((current) => {
                const next = { ...current, briefingRoutine: synced };
                savePlatformSettings(next);
                return next;
              });
            }
          } else {
            setSettings((current) => {
              const next = {
                ...current,
                briefingRoutine:
                  fromApi.length > 0 ? fromApi : current.briefingRoutine,
              };
              savePlatformSettings(next);
              return next;
            });
          }
        }

        if (
          (Array.isArray(weatherLocations) && weatherLocations.length > 0) ||
          typeof weatherZipCode === "string"
        ) {
          setSettings((current) => {
            const next = {
              ...current,
              ...(typeof weatherZipCode === "string"
                ? { weatherZipCode }
                : {}),
              ...(Array.isArray(weatherLocations) && weatherLocations.length > 0
                ? {
                    weatherSavedLocations: weatherLocations.map((location) => ({
                      id: location.id,
                      city: location.city,
                      isHome: Boolean(location.isHome),
                    })),
                  }
                : {}),
            };
            savePlatformSettings(next);
            return next;
          });
        }

        const voice = payload.user.voiceSettings;
        if (voice?.conversationStyle) {
          const style = voice.conversationStyle as ConversationStyle;
          const allowed: ConversationStyle[] = [
            "HostCohost",
            "ReporterAnalyst",
            "AssistantHuman",
            "Custom",
          ];
          if (allowed.includes(style)) {
            setSettings((current) => {
              const next = {
                ...current,
                conversationStyle: style,
                customPrompt: voice.conversationStyleCustom ?? "",
                voiceEngine: voice.ttsProviderName || current.voiceEngine,
                speakerA: voice.hostVoice || current.speakerA,
                speakerB: voice.hostVoiceB || current.speakerB,
                useGlobalVoiceOverride: voice.useGlobalVoiceOverride,
              };
              savePlatformSettings(next);
              return next;
            });
          }
        }

        const apiLanguage =
          typeof payload.user.locale === "string"
            ? payload.user.locale.trim().toLowerCase()
            : typeof payload.user.language === "string"
              ? payload.user.language.trim().toLowerCase()
              : "";
        if (
          apiLanguage &&
          LANGUAGE_OPTIONS.some((option) => option.value === apiLanguage)
        ) {
          setSettings((current) => {
            const next = {
              ...current,
              language: apiLanguage,
            };
            savePlatformSettings(next);
            return next;
          });
          if (isLanguage(apiLanguage)) {
            setLanguage(apiLanguage);
          }
        }

        const apiPodcastLocale =
          typeof payload.user.podcastLocale === "string"
            ? payload.user.podcastLocale.trim().toLowerCase()
            : "";
        const isPremiumVoice =
          voiceEngineTierFromProvider(
            payload.user.voiceSettings?.ttsProviderName ||
              settings.voiceEngine,
          ) === "premium";
        if (apiPodcastLocale) {
          const localization = podcastLocalizationFromLocale(
            apiPodcastLocale,
            apiLanguage || undefined,
            isPremiumVoice,
          );
          const ensured = ensurePodcastLocalizationForVoice({
            language: apiLanguage || settings.language,
            podcastLocalizationMode: localization.podcastLocalizationMode,
            podcastLocalizationRegion: localization.podcastLocalizationRegion,
            isPremiumVoice,
          });
          setSettings((current) => {
            const next = {
              ...current,
              podcastLocalizationMode: ensured.podcastLocalizationMode,
              podcastLocalizationRegion: ensured.podcastLocalizationRegion,
            };
            savePlatformSettings(next);
            return next;
          });
        } else if (isPremiumVoice) {
          const ensured = ensurePodcastLocalizationForVoice({
            language: apiLanguage || settings.language,
            podcastLocalizationMode: settings.podcastLocalizationMode,
            podcastLocalizationRegion: settings.podcastLocalizationRegion,
            isPremiumVoice: true,
          });
          setSettings((current) => {
            const next = {
              ...current,
              ...ensured,
            };
            savePlatformSettings(next);
            return next;
          });
        }

        if (typeof payload.user.briefReadyNotifications === "boolean") {
          setSettings((current) => {
            const next = {
              ...current,
              notifyNewBrief: payload.user!.briefReadyNotifications!,
            };
            savePlatformSettings(next);
            return next;
          });
        }

        if (typeof payload.user.newEpisodeNotifications === "boolean") {
          setSettings((current) => {
            const next = {
              ...current,
              notifyNewEpisode: payload.user!.newEpisodeNotifications!,
            };
            savePlatformSettings(next);
            return next;
          });
        }
      } catch (error) {
        console.error("Failed to hydrate briefing routine:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function persistBriefingRoutine(
    routine: BriefingRoutineSlot[],
  ): Promise<BriefingRoutineSlot[] | null> {
    try {
      const response = await fetch("/api/user/briefing-routine", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          briefingRoutine: routine.map((slot) => ({
            id: slot.id,
            type: slot.type,
            label: slot.label,
            podcastId: slot.podcastId ?? null,
          })),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        toast.error(payload?.error ?? "Failed to save briefing routine");
        return null;
      }

      const payload = (await response.json()) as { user?: NewsReaderUser };
      return (
        mapApiBriefingRoutine(payload.user?.briefingRoutine) ?? routine
      );
    } catch (error) {
      console.error("Failed to persist briefing routine:", error);
      toast.error("Failed to save briefing routine");
      return null;
    }
  }

  async function persistWeatherSettings(
    draft: WeatherSettingsDraft,
  ): Promise<boolean> {
    updateSettings({
      weatherZipCode: draft.weatherZipCode,
      weatherSavedLocations: draft.weatherSavedLocations,
      weatherTemperatureUnit: draft.weatherTemperatureUnit,
      weatherDailyForecastAlerts: draft.weatherDailyForecastAlerts,
      weatherSevereWeatherAlerts: draft.weatherSevereWeatherAlerts,
      weatherDeliveryTime: draft.weatherDeliveryTime,
    });

    try {
      const response = await fetch("/api/user/weather-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weatherZipCode: draft.weatherZipCode,
          weatherSavedLocations: draft.weatherSavedLocations.map((location) => ({
            id: location.id,
            city: location.city,
            isHome: Boolean(location.isHome),
          })),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        toast.error(payload?.error ?? "Failed to save weather location");
        return false;
      }

      const payload = (await response.json()) as { user?: NewsReaderUser };
      const savedLocations = payload.user?.weatherSavedLocations;
      if (savedLocations && savedLocations.length > 0) {
        const nextLocations = savedLocations.map((location) => ({
          id: location.id,
          city: location.city,
          isHome: Boolean(location.isHome),
        }));
        updateSettings({ weatherSavedLocations: nextLocations });
        setWeatherDraft((current) =>
          current
            ? {
                ...current,
                weatherZipCode:
                  payload.user?.weatherZipCode ?? current.weatherZipCode,
                weatherSavedLocations: nextLocations,
              }
            : current,
        );
      }

      return true;
    } catch (error) {
      console.error("Failed to persist weather settings:", error);
      toast.error("Failed to save weather location");
      return false;
    }
  }

  useEffect(() => {
    if (activeSection === "voice-style") {
      if (previousSectionRef.current !== "voice-style") {
        setVoiceDraft({
          conversationStyle: settings.conversationStyle,
          customPrompt: settings.customPrompt,
          voiceEngine: settings.voiceEngine,
          speakerA: settings.speakerA,
          speakerB: settings.speakerB,
        });
      }
      setWeatherDraft(null);
      setLanguageDraft(null);
      setNotificationsDraft(null);
      previousSectionRef.current = activeSection;
      return;
    }

    if (activeSection === "weather") {
      if (previousSectionRef.current !== "weather") {
        setWeatherDraft({
          weatherZipCode: settings.weatherZipCode,
          weatherSavedLocations: settings.weatherSavedLocations,
          weatherTemperatureUnit: settings.weatherTemperatureUnit,
          weatherDailyForecastAlerts: settings.weatherDailyForecastAlerts,
          weatherSevereWeatherAlerts: settings.weatherSevereWeatherAlerts,
          weatherDeliveryTime: settings.weatherDeliveryTime,
        });
      }
      setVoiceDraft(null);
      setLanguageDraft(null);
      setNotificationsDraft(null);
      previousSectionRef.current = activeSection;
      return;
    }

    if (activeSection === "language") {
      if (previousSectionRef.current !== "language") {
        const isPremiumVoice =
          voiceEngineTierFromProvider(settings.voiceEngine) === "premium";
        const localization = ensurePodcastLocalizationForVoice({
          language: settings.language,
          podcastLocalizationMode: settings.podcastLocalizationMode,
          podcastLocalizationRegion: settings.podcastLocalizationRegion,
          isPremiumVoice,
        });
        setLanguageDraft({
          language: settings.language,
          podcastLocalizationMode: localization.podcastLocalizationMode,
          podcastLocalizationRegion: localization.podcastLocalizationRegion,
        });
        if (
          localization.podcastLocalizationMode !==
            settings.podcastLocalizationMode ||
          localization.podcastLocalizationRegion !==
            settings.podcastLocalizationRegion
        ) {
          updateSettings(localization);
        }
      }
      setVoiceDraft(null);
      setWeatherDraft(null);
      setNotificationsDraft(null);
      previousSectionRef.current = activeSection;
      return;
    }

    if (activeSection === "notifications") {
      if (previousSectionRef.current !== "notifications") {
        setNotificationsDraft({
          notifyNewBrief: settings.notifyNewBrief,
          notifyLiveStation: settings.notifyLiveStation,
          notifyNewEpisode: settings.notifyNewEpisode,
        });
      }
      setVoiceDraft(null);
      setWeatherDraft(null);
      setLanguageDraft(null);
      previousSectionRef.current = activeSection;
      return;
    }

    setVoiceDraft(null);
    setWeatherDraft(null);
    setLanguageDraft(null);
    setNotificationsDraft(null);
    previousSectionRef.current = activeSection;
  }, [activeSection, settings]);

  function updateSettings(patch: Partial<PlatformSettings>) {
    setSettings((current) => {
      const next = { ...current, ...patch };
      savePlatformSettings(next);
      return next;
    });
  }

  function saveSettings(patch: Partial<PlatformSettings>, message = "Settings saved.") {
    updateSettings(patch);
    showSaved(message);
  }

  function showSaved(message = "Settings saved.") {
    setSavedMessage(message);
    window.setTimeout(() => setSavedMessage(null), 2000);
  }

  function showRoutineSaved() {
    toast.success("Success", { description: "Routine Saved" });
  }

  async function persistVoiceSettings(
    draft: VoiceEngineSpeakersDraft,
  ): Promise<boolean> {
    updateSettings({
      conversationStyle: draft.conversationStyle,
      customPrompt: draft.customPrompt,
      voiceEngine: draft.voiceEngine,
      speakerA: draft.speakerA,
      speakerB: draft.speakerB,
      useGlobalVoiceOverride: true,
    });

    try {
      const response = await fetch("/api/user/voice-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          useGlobalVoiceOverride: true,
          conversationStyle: draft.conversationStyle,
          conversationStyleCustom:
            draft.conversationStyle === "Custom"
              ? draft.customPrompt.trim() || null
              : null,
          ttsProviderName: draft.voiceEngine,
          hostVoice: draft.speakerA,
          hostVoiceB: draft.speakerB,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        toast.error(payload?.error ?? "Failed to save voice settings");
        return false;
      }

      const payload = (await response.json()) as { user?: NewsReaderUser };
      const voice = payload.user?.voiceSettings;
      if (voice?.conversationStyle) {
        const style = voice.conversationStyle as ConversationStyle;
        const allowed: ConversationStyle[] = [
          "HostCohost",
          "ReporterAnalyst",
          "AssistantHuman",
          "Custom",
        ];
        if (allowed.includes(style)) {
          updateSettings({
            conversationStyle: style,
            customPrompt: voice.conversationStyleCustom ?? "",
            voiceEngine: voice.ttsProviderName || draft.voiceEngine,
            speakerA: voice.hostVoice || draft.speakerA,
            speakerB: voice.hostVoiceB || draft.speakerB,
            useGlobalVoiceOverride: voice.useGlobalVoiceOverride,
          });
          setVoiceDraft((current) =>
            current
              ? {
                  ...current,
                  conversationStyle: style,
                  customPrompt: voice.conversationStyleCustom ?? "",
                  voiceEngine: voice.ttsProviderName || current.voiceEngine,
                  speakerA: voice.hostVoice || current.speakerA,
                  speakerB: voice.hostVoiceB || current.speakerB,
                }
              : current,
          );
        }
      }

      const nextVoiceEngine =
        voice?.ttsProviderName || draft.voiceEngine || settings.voiceEngine;
      if (voiceEngineTierFromProvider(nextVoiceEngine) === "premium") {
        const ensured = ensurePodcastLocalizationForVoice({
          language: settings.language,
          podcastLocalizationMode: settings.podcastLocalizationMode,
          podcastLocalizationRegion: settings.podcastLocalizationRegion,
          isPremiumVoice: true,
        });
        if (
          ensured.podcastLocalizationMode !==
            settings.podcastLocalizationMode ||
          ensured.podcastLocalizationRegion !==
            settings.podcastLocalizationRegion
        ) {
          await persistLanguageSettings({
            language: settings.language,
            ...ensured,
          });
        }
      }

      return true;
    } catch (error) {
      console.error("Failed to persist voice settings:", error);
      toast.error("Failed to save voice settings");
      return false;
    }
  }

  function saveVoiceStyleDraft() {
    if (!voiceDraft) {
      return;
    }

    void (async () => {
      const saved = await persistVoiceSettings(voiceDraft);
      if (saved) {
        toast.success("Success", { description: "Settings Saved" });
      }
    })();
  }

  function saveWeatherDraft() {
    if (!weatherDraft) {
      return;
    }

    void (async () => {
      const saved = await persistWeatherSettings(weatherDraft);
      if (saved) {
        toast.success("Success", { description: "Settings Saved" });
      }
    })();
  }

  function handleWeatherLocationAdded(
    weatherSavedLocations: WeatherSettingsDraft["weatherSavedLocations"],
  ) {
    if (!weatherDraft) {
      return;
    }

    const nextDraft = { ...weatherDraft, weatherSavedLocations };
    setWeatherDraft(nextDraft);
    void (async () => {
      const saved = await persistWeatherSettings(nextDraft);
      if (saved) {
        toast.success("Success", { description: "Location Saved" });
      }
    })();
  }

  async function persistLanguageSettings(
    draft: LanguageSettingsDraft,
  ): Promise<boolean> {
    const isPremiumVoice =
      voiceEngineTierFromProvider(settings.voiceEngine) === "premium";
    const ensured = ensurePodcastLocalizationForVoice({
      language: draft.language,
      podcastLocalizationMode: draft.podcastLocalizationMode,
      podcastLocalizationRegion: draft.podcastLocalizationRegion,
      isPremiumVoice,
    });
    const nextDraft = { ...draft, ...ensured };
    const podcastLocale = resolvePodcastLocale({
      ...nextDraft,
      isPremiumVoice,
    });

    updateSettings({
      language: nextDraft.language,
      podcastLocalizationMode: nextDraft.podcastLocalizationMode,
      podcastLocalizationRegion: nextDraft.podcastLocalizationRegion,
    });
    setLanguageDraft(nextDraft);

    if (isLanguage(nextDraft.language)) {
      setLanguage(nextDraft.language);
    }

    try {
      const response = await fetch("/api/user/language-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: nextDraft.language,
          language: nextDraft.language,
          podcastLocale,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        toast.error(payload?.error ?? "Failed to save language settings");
        return false;
      }

      const payload = (await response.json()) as { user?: NewsReaderUser };
      const apiLanguage =
        typeof payload.user?.locale === "string"
          ? payload.user.locale.trim().toLowerCase()
          : typeof payload.user?.language === "string"
            ? payload.user.language.trim().toLowerCase()
            : "";
      if (
        apiLanguage &&
        LANGUAGE_OPTIONS.some((option) => option.value === apiLanguage)
      ) {
        updateSettings({ language: apiLanguage });
        setLanguageDraft((current) =>
          current ? { ...current, language: apiLanguage } : current,
        );
        if (isLanguage(apiLanguage)) {
          setLanguage(apiLanguage);
        }
      }

      const apiPodcastLocale =
        typeof payload.user?.podcastLocale === "string"
          ? payload.user.podcastLocale.trim().toLowerCase()
          : "";
      if (apiPodcastLocale) {
        const localization = podcastLocalizationFromLocale(
          apiPodcastLocale,
          apiLanguage || nextDraft.language,
          isPremiumVoice,
        );
        const ensuredLocalization = ensurePodcastLocalizationForVoice({
          language: apiLanguage || nextDraft.language,
          podcastLocalizationMode: localization.podcastLocalizationMode,
          podcastLocalizationRegion: localization.podcastLocalizationRegion,
          isPremiumVoice,
        });
        updateSettings({
          podcastLocalizationMode: ensuredLocalization.podcastLocalizationMode,
          podcastLocalizationRegion:
            ensuredLocalization.podcastLocalizationRegion,
        });
        setLanguageDraft((current) =>
          current
            ? {
                ...current,
                podcastLocalizationMode:
                  ensuredLocalization.podcastLocalizationMode,
                podcastLocalizationRegion:
                  ensuredLocalization.podcastLocalizationRegion,
              }
            : current,
        );
      }

      return true;
    } catch (error) {
      console.error("Failed to persist language settings:", error);
      toast.error("Failed to save language settings");
      return false;
    }
  }

  function saveLanguageDraft() {
    if (!languageDraft) return;

    void (async () => {
      const saved = await persistLanguageSettings(languageDraft);
      if (saved) {
        toast.success("Success", { description: "Settings Saved" });
      }
    })();
  }

  async function persistBriefReadyNotifications(
    enabled: boolean,
  ): Promise<boolean> {
    updateSettings({ notifyNewBrief: enabled });
    setNotificationsDraft((current) =>
      current ? { ...current, notifyNewBrief: enabled } : current,
    );

    try {
      const response = await fetch("/api/user/notification-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefReadyNotifications: enabled }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        toast.error(payload?.error ?? "Failed to save notification settings");
        return false;
      }

      const payload = (await response.json()) as { user?: NewsReaderUser };
      if (typeof payload.user?.briefReadyNotifications === "boolean") {
        const next = payload.user.briefReadyNotifications;
        updateSettings({ notifyNewBrief: next });
        setNotificationsDraft((current) =>
          current ? { ...current, notifyNewBrief: next } : current,
        );
      }

      return true;
    } catch (error) {
      console.error("Failed to persist notification settings:", error);
      toast.error("Failed to save notification settings");
      return false;
    }
  }

  async function persistNewEpisodeNotifications(
    enabled: boolean,
  ): Promise<boolean> {
    updateSettings({ notifyNewEpisode: enabled });
    setNotificationsDraft((current) =>
      current ? { ...current, notifyNewEpisode: enabled } : current,
    );

    try {
      const response = await fetch("/api/user/notification-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEpisodeNotifications: enabled }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        toast.error(payload?.error ?? "Failed to save notification settings");
        return false;
      }

      const payload = (await response.json()) as { user?: NewsReaderUser };
      if (typeof payload.user?.newEpisodeNotifications === "boolean") {
        const next = payload.user.newEpisodeNotifications;
        updateSettings({ notifyNewEpisode: next });
        setNotificationsDraft((current) =>
          current ? { ...current, notifyNewEpisode: next } : current,
        );
      }

      return true;
    } catch (error) {
      console.error("Failed to persist notification settings:", error);
      toast.error("Failed to save notification settings");
      return false;
    }
  }

  function saveNotificationsDraft() {
    if (!notificationsDraft) {
      return;
    }

    updateSettings({
      notifyNewBrief: notificationsDraft.notifyNewBrief,
      notifyLiveStation: notificationsDraft.notifyLiveStation,
      notifyNewEpisode: notificationsDraft.notifyNewEpisode,
    });

    void (async () => {
      const [briefSaved, episodeSaved] = await Promise.all([
        persistBriefReadyNotifications(notificationsDraft.notifyNewBrief),
        persistNewEpisodeNotifications(notificationsDraft.notifyNewEpisode),
      ]);
      if (briefSaved && episodeSaved) {
        toast.success("Success", { description: "Settings Saved" });
      }
    })();
  }

  function reorderRoutineSlots(next: BriefingRoutineSlot[]) {
    const clipped = next.slice(0, MAX_BRIEFING_ROUTINE_ITEMS);
    updateSettings({ briefingRoutine: clipped });
    showRoutineSaved();
    void persistBriefingRoutine(clipped);
  }

  function removeRoutineSlot(id: string) {
    const next = settings.briefingRoutine.filter((slot) => slot.id !== id);
    updateSettings({ briefingRoutine: next });
    showRoutineSaved();
    void persistBriefingRoutine(next);
  }

  function addRoutineSlot(slot: Omit<BriefingRoutineSlot, "id">) {
    if (settings.briefingRoutine.length >= MAX_BRIEFING_ROUTINE_ITEMS) {
      toast.error(
        `You can add up to ${MAX_BRIEFING_ROUTINE_ITEMS} items to your routine.`,
      );
      return;
    }

    if (settings.briefingRoutine.some((item) => item.type === slot.type && slot.type !== "podcast")) {
      return;
    }

    if (
      slot.type === "podcast" &&
      settings.briefingRoutine.some((item) => item.podcastId === slot.podcastId)
    ) {
      return;
    }

    const next = [
      ...settings.briefingRoutine,
      { ...slot, id: `${slot.type}-${Date.now()}` },
    ].slice(0, MAX_BRIEFING_ROUTINE_ITEMS);

    updateSettings({ briefingRoutine: next });
    showRoutineSaved();
    void persistBriefingRoutine(next);
  }

  if (activeSection) {
    const section = SETTINGS_SECTIONS.find((item) => item.id === activeSection);
    const sectionCopy = activeSection
      ? SETTINGS_SECTION_I18N[activeSection]
      : null;

    const weatherLabel = t("platform.profile.weatherBrief");
    const newsLabel = t("platform.profile.worldNews");
    const atRoutineLimit =
      settings.briefingRoutine.length >= MAX_BRIEFING_ROUTINE_ITEMS;

    return (
      <section>
        <SubScreenHeader
          title={
            activeSection === "voice-style"
              ? t("platform.profile.voiceEngineSpeakers")
              : sectionCopy
                ? t(sectionCopy.title)
                : (section?.title ?? t("platform.profile.settings"))
          }
          onBack={() => setActiveSection(null)}
        />

        {savedMessage ? (
          <div className="mb-4 rounded-xl border border-[#34c759]/30 bg-[#34c759]/10 px-4 py-3 text-sm text-[#34c759]">
            {savedMessage}
          </div>
        ) : null}

        {activeSection === "briefing-routine" ? (
          <div className="space-y-5">
            <p className="text-sm text-neutral-500 dark:text-[#888888]">
              {t("platform.profile.routineIntro")}
            </p>

            <BriefingRoutineList
              slots={settings.briefingRoutine}
              onReorder={reorderRoutineSlots}
              onRemove={removeRoutineSlot}
            />

            <div>
              <p className="mb-2 text-[13px] text-neutral-500 dark:text-[#888888]">
                {t("platform.profile.addToRoutine")}
              </p>
              <BriefingRoutineAddSelect
                routine={settings.briefingRoutine}
                weatherLabel={weatherLabel}
                newsLabel={newsLabel}
                podcasts={profileShows}
                atLimit={atRoutineLimit}
                placeholder={t("platform.profile.selectToAdd")}
                searchPlaceholder={t("platform.profile.searchRoutine")}
                emptyLabel={
                  atRoutineLimit
                    ? t("platform.profile.routineMax")
                    : t("platform.profile.routineFull")
                }
                noMatchesLabel={t("platform.profile.noRoutineMatch")}
                onAdd={addRoutineSlot}
              />
            </div>
          </div>
        ) : null}

        {activeSection === "voice-style" && voiceDraft ? (
          <VoiceEngineSpeakersPanel
            draft={voiceDraft}
            onChange={(patch) => {
              setVoiceDraft((current) => {
                if (!current) {
                  return current;
                }
                return { ...current, ...patch };
              });

              if (
                (patch.conversationStyle || patch.voiceEngine) &&
                voiceDraft
              ) {
                const nextDraft = { ...voiceDraft, ...patch };
                void (async () => {
                  const saved = await persistVoiceSettings(nextDraft);
                  if (saved) {
                    toast.success("Success", {
                      description: patch.voiceEngine
                        ? "Voice engine saved"
                        : "Conversation style saved",
                    });
                  }
                })();
              }
            }}
            onSave={saveVoiceStyleDraft}
          />
        ) : null}

        {activeSection === "weather" && weatherDraft ? (
          <WeatherSettingsPanel
            draft={weatherDraft}
            onChange={(patch) =>
              setWeatherDraft((current) => (current ? { ...current, ...patch } : current))
            }
            onSave={saveWeatherDraft}
            onAddLocation={handleWeatherLocationAdded}
          />
        ) : null}

        {activeSection === "language" && languageDraft ? (
          <LanguageSettingsPanel
            draft={languageDraft}
            isPremiumVoice={
              voiceEngineTierFromProvider(settings.voiceEngine) === "premium"
            }
            onChange={(patch) => {
              setLanguageDraft((current) =>
                current ? { ...current, ...patch } : current,
              );

              if (
                languageDraft &&
                (typeof patch.language === "string" ||
                  typeof patch.podcastLocalizationMode === "string" ||
                  typeof patch.podcastLocalizationRegion === "string")
              ) {
                const nextDraft = { ...languageDraft, ...patch };
                void persistLanguageSettings(nextDraft);
              }
            }}
            onSave={saveLanguageDraft}
          />
        ) : null}

        {activeSection === "notifications" && notificationsDraft ? (
          <NotificationsSettingsPanel
            draft={notificationsDraft}
            onChange={(patch) => {
              setNotificationsDraft((current) =>
                current ? { ...current, ...patch } : current,
              );

              if (
                typeof patch.notifyNewBrief === "boolean" &&
                notificationsDraft
              ) {
                void persistBriefReadyNotifications(patch.notifyNewBrief);
              }

              if (
                typeof patch.notifyNewEpisode === "boolean" &&
                notificationsDraft
              ) {
                void persistNewEpisodeNotifications(patch.notifyNewEpisode);
              }
            }}
            onSave={saveNotificationsDraft}
          />
        ) : null}

        {activeSection === "subscription" ? (
          <SubscriptionCheckoutPanel
            onPurchaseComplete={() => {
              setSettings(loadPlatformSettings());
              setActiveSection(null);
            }}
          />
        ) : null}

        {activeSection === "manage-account" ? <ManageAccountPanel /> : null}

        {activeSection === "connections" ? (
          <div className="space-y-4">
            <p className="text-sm text-neutral-500 dark:text-[#888888]">
              {t("platform.profile.connectionsIntro")}
            </p>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-[#262626] dark:bg-[#141414]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">
                    {emailAddress}
                  </p>
                  <p className="mt-1 text-sm text-[#34c759]">
                    {settings.gmailConnected
                      ? t("platform.profile.gmailConnected")
                      : t("platform.profile.gmailNotConnected")}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.gmailConnected}
                  onClick={() =>
                    saveSettings({ gmailConnected: !settings.gmailConnected })
                  }
                  className={cn(
                    "relative h-7 w-12 shrink-0 rounded-full transition-colors",
                    settings.gmailConnected
                      ? "bg-[#34c759]"
                      : "bg-neutral-300 dark:bg-[#2a2a2a]",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 size-6 rounded-full bg-white transition-transform",
                      settings.gmailConnected ? "left-[22px]" : "left-0.5",
                    )}
                  />
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                updateSettings({ gmailConnected: true });
                showSaved(t("platform.profile.gmailConnected"));
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 transition-colors hover:border-neutral-500 hover:text-neutral-900 dark:border-[#333333] dark:text-[#c4c7c8] dark:hover:border-white/30 dark:hover:text-white"
            >
              <MaterialIcon name="add" className="text-[18px]" />
              {t("platform.profile.addGmailAccount")}
            </button>
            <div className="space-y-2 opacity-50">
              {["Google Calendar", "Outlook Mail"].map((name) => (
                <div
                  key={name}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 dark:border-[#262626] dark:bg-[#141414]"
                >
                  <p className="font-medium text-neutral-900 dark:text-white">{name}</p>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-[#888888]">
                    {t("platform.profile.comingSoon")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-[#262626] dark:bg-[#0d0d0d]">
      <div className="border-b border-neutral-200 px-5 py-4 dark:border-[#262626]">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          {t("platform.profile.settings")}
        </h3>
      </div>
      <div className="divide-y divide-neutral-200 dark:divide-[#262626]">
        {SETTINGS_SECTIONS.map((section) => {
          const sectionCopy = SETTINGS_SECTION_I18N[section.id];
          const rowClassName =
            "flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-white/[0.03]";

          const rowContent = (
            <>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-neutral-100 dark:bg-[#1f1f1f]">
                <MaterialIcon
                  name={section.icon}
                  className="text-[20px] text-neutral-900 dark:text-white"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-medium text-neutral-900 dark:text-white">
                  {t(sectionCopy.title)}
                </p>
                {sectionCopy.subtitle ? (
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-[#888888]">
                    {t(sectionCopy.subtitle)}
                  </p>
                ) : null}
              </div>
              {section.id === "language" ? (
                <span className="shrink-0 text-sm text-neutral-500 dark:text-[#888888]">
                  {getLanguageLabel(settings.language)}
                </span>
              ) : null}
              {section.id === "subscription" ? (
                <span className="shrink-0 text-sm text-neutral-500 dark:text-[#888888]">
                  {getSubscriptionLabel(settings.subscriptionPlan)}
                </span>
              ) : null}
              <MaterialIcon
                name="chevron_right"
                className="text-[18px] text-neutral-500 dark:text-[#888888]"
              />
            </>
          );

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={rowClassName}
            >
              {rowContent}
            </button>
          );
        })}
      </div>
      <div className="h-px bg-neutral-200 dark:bg-[#262626]" />
      <PlatformSignOutButton variant="row" />
    </section>
  );
}
