"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BriefingRoutineList } from "@/components/platform/briefing-routine-list";
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
import { profileShows } from "@/lib/platform-profile";
import {
  DEFAULT_PLATFORM_SETTINGS,
  LANGUAGE_OPTIONS,
  getSubscriptionLabel,
  loadPlatformSettings,
  savePlatformSettings,
  SETTINGS_SECTIONS,
  type BriefingRoutineSlot,
  type PlatformSettings,
  type SettingsSectionId,
} from "@/lib/platform-settings";
import { cn } from "@/lib/utils";

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
  return (
    <div className="mb-4 flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-white transition-colors hover:text-white/80"
      >
        ‹ Back
      </button>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
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
    setSettings(loadPlatformSettings());
  }, []);

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
        setLanguageDraft({
          language: settings.language,
          podcastLocalizationMode: settings.podcastLocalizationMode,
          podcastLocalizationRegion: settings.podcastLocalizationRegion,
        });
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

  function saveVoiceStyleDraft() {
    if (!voiceDraft) {
      return;
    }

    updateSettings({
      conversationStyle: voiceDraft.conversationStyle,
      customPrompt: voiceDraft.customPrompt,
      speakerA: voiceDraft.speakerA,
      speakerB: voiceDraft.speakerB,
    });
    toast.success("Success", { description: "Settings Saved" });
  }

  function saveWeatherDraft() {
    if (!weatherDraft) {
      return;
    }

    updateSettings({
      weatherZipCode: weatherDraft.weatherZipCode,
      weatherSavedLocations: weatherDraft.weatherSavedLocations,
      weatherTemperatureUnit: weatherDraft.weatherTemperatureUnit,
      weatherDailyForecastAlerts: weatherDraft.weatherDailyForecastAlerts,
      weatherSevereWeatherAlerts: weatherDraft.weatherSevereWeatherAlerts,
      weatherDeliveryTime: weatherDraft.weatherDeliveryTime,
    });
    toast.success("Success", { description: "Settings Saved" });
  }

  function saveLanguageDraft() {
    if (!languageDraft) return;

    updateSettings({
      language: languageDraft.language,
      podcastLocalizationMode: languageDraft.podcastLocalizationMode,
      podcastLocalizationRegion: languageDraft.podcastLocalizationRegion,
    });
    toast.success("Success", { description: "Settings Saved" });
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
    toast.success("Success", { description: "Settings Saved" });
  }

  function reorderRoutineSlots(next: BriefingRoutineSlot[]) {
    updateSettings({ briefingRoutine: next });
    showRoutineSaved();
  }

  function removeRoutineSlot(id: string) {
    updateSettings({
      briefingRoutine: settings.briefingRoutine.filter((slot) => slot.id !== id),
    });
    showRoutineSaved();
  }

  function addRoutineSlot(slot: Omit<BriefingRoutineSlot, "id">) {
    if (settings.briefingRoutine.some((item) => item.type === slot.type && slot.type !== "podcast")) {
      return;
    }

    if (
      slot.type === "podcast" &&
      settings.briefingRoutine.some((item) => item.podcastId === slot.podcastId)
    ) {
      return;
    }

    updateSettings({
      briefingRoutine: [
        ...settings.briefingRoutine,
        { ...slot, id: `${slot.type}-${Date.now()}` },
      ],
    });
    showRoutineSaved();
  }

  if (activeSection) {
    const section = SETTINGS_SECTIONS.find((item) => item.id === activeSection);

    return (
      <section>
        <SubScreenHeader
          title={
            activeSection === "voice-style"
              ? "Voice Engine & Speakers"
              : (section?.title ?? "Settings")
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
            <p className="text-sm text-[#888888]">
              Choose what plays when you generate a daily brief, and in what order. Drag
              to reorder.
            </p>

            <BriefingRoutineList
              slots={settings.briefingRoutine}
              onReorder={reorderRoutineSlots}
              onRemove={removeRoutineSlot}
            />

            <div>
              <p className="mb-2 text-[13px] text-[#888888]">Add to routine</p>
              <div className="flex flex-wrap gap-2">
                {!settings.briefingRoutine.some((slot) => slot.type === "email") ? (
                  <button
                    type="button"
                    onClick={() => addRoutineSlot({ type: "email", label: "Email Brief" })}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-[#c4c7c8] transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <MaterialIcon name="mail" className="text-[16px]" />
                    Email Brief
                  </button>
                ) : null}
                {!settings.briefingRoutine.some((slot) => slot.type === "news") ? (
                  <button
                    type="button"
                    onClick={() => addRoutineSlot({ type: "news", label: "World News" })}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-[#c4c7c8] transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <MaterialIcon name="public" className="text-[16px]" />
                    World News
                  </button>
                ) : null}
                {profileShows.map((podcast) =>
                  settings.briefingRoutine.some((slot) => slot.podcastId === podcast.id) ? null : (
                    <button
                      key={podcast.id}
                      type="button"
                      onClick={() =>
                        addRoutineSlot({
                          type: "podcast",
                          label: podcast.title,
                          podcastId: podcast.id,
                        })
                      }
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-[#c4c7c8] transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <MaterialIcon name="headphones" className="text-[16px]" />
                      {podcast.title}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        ) : null}

        {activeSection === "voice-style" && voiceDraft ? (
          <VoiceEngineSpeakersPanel
            draft={voiceDraft}
            onChange={(patch) => setVoiceDraft((current) => (current ? { ...current, ...patch } : current))}
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
          />
        ) : null}

        {activeSection === "language" && languageDraft ? (
          <LanguageSettingsPanel
            draft={languageDraft}
            onChange={(patch) =>
              setLanguageDraft((current) => (current ? { ...current, ...patch } : current))
            }
            onSave={saveLanguageDraft}
          />
        ) : null}

        {activeSection === "notifications" && notificationsDraft ? (
          <NotificationsSettingsPanel
            draft={notificationsDraft}
            onChange={(patch) =>
              setNotificationsDraft((current) =>
                current ? { ...current, ...patch } : current,
              )
            }
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
            <p className="text-sm text-[#888888]">
              Connect your Gmail accounts to personalize your Daily Brief with emails and
              newsletters.
            </p>
            <div className="rounded-2xl border border-[#262626] bg-[#141414] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-white">{emailAddress}</p>
                  <p className="mt-1 text-sm text-[#34c759]">
                    {settings.gmailConnected ? "Gmail connected" : "Gmail not connected"}
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
                    settings.gmailConnected ? "bg-[#34c759]" : "bg-[#2a2a2a]",
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
                showSaved("Gmail connected.");
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#333333] px-4 py-4 text-sm text-[#c4c7c8] transition-colors hover:border-white/30 hover:text-white"
            >
              <MaterialIcon name="add" className="text-[18px]" />
              Add Gmail Account
            </button>
            <div className="space-y-2 opacity-50">
              {["Google Calendar", "Outlook Mail"].map((name) => (
                <div
                  key={name}
                  className="rounded-2xl border border-[#262626] bg-[#141414] px-4 py-4"
                >
                  <p className="font-medium text-white">{name}</p>
                  <p className="mt-1 text-sm text-[#888888]">Coming soon</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#262626] bg-[#0d0d0d]">
      <div className="border-b border-[#262626] px-5 py-4">
        <h3 className="text-lg font-semibold text-white">Settings</h3>
      </div>
      <div className="divide-y divide-[#262626]">
        {SETTINGS_SECTIONS.map((section) => {
          const rowClassName =
            "flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]";

          const rowContent = (
            <>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#1f1f1f]">
                <MaterialIcon name={section.icon} className="text-[20px] text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-medium text-white">{section.title}</p>
                {section.subtitle ? (
                  <p className="mt-0.5 text-xs text-[#888888]">{section.subtitle}</p>
                ) : null}
              </div>
              {section.id === "language" ? (
                <span className="shrink-0 text-sm text-[#888888]">
                  {getLanguageLabel(settings.language)}
                </span>
              ) : null}
              {section.id === "subscription" ? (
                <span className="shrink-0 text-sm text-[#888888]">
                  {getSubscriptionLabel(settings.subscriptionPlan)}
                </span>
              ) : null}
              <MaterialIcon name="chevron_right" className="text-[18px] text-[#888888]" />
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
      <div className="h-px bg-[#262626]" />
      <PlatformSignOutButton variant="row" />
    </section>
  );
}
