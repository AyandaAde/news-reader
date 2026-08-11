"use client";

import { useEffect, useState } from "react";
import { BriefingRoutineList } from "@/components/platform/briefing-routine-list";
import { PlatformSignOutButton } from "@/components/platform/platform-sign-out-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { profileShows } from "@/lib/platform-profile";
import {
  CONVERSATION_STYLES,
  DEFAULT_PLATFORM_SETTINGS,
  EMAIL_LOOKBACK_OPTIONS,
  EMAIL_MAX_ITEMS,
  LANGUAGE_OPTIONS,
  loadPlatformSettings,
  PLAYBACK_SKIP_OPTIONS,
  savePlatformSettings,
  SETTINGS_SECTIONS,
  type BriefingRoutineSlot,
  type ConversationStyle,
  type PlatformSettings,
  type SettingsSectionId,
  VOICE_ENGINES,
  VOICE_SPEAKERS,
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

function SettingsToggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-[#262626] bg-[#141414] px-4 py-4">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {description ? (
          <p className="mt-1 text-sm text-[#888888]">{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          checked ? "bg-[#34c759]" : "bg-[#2a2a2a]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-6 rounded-full bg-white transition-transform",
            checked ? "left-[22px]" : "left-0.5",
          )}
        />
      </button>
    </label>
  );
}

function ChipGrid<T extends string | number>({
  options,
  value,
  onChange,
  formatLabel,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  formatLabel?: (value: T) => string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={String(option)}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-xl border px-3 py-2.5 text-sm transition-colors",
              active
                ? "border-white bg-white text-black"
                : "border-[#262626] bg-[#141414] text-[#c4c7c8] hover:border-white/20",
            )}
          >
            {formatLabel ? formatLabel(option) : String(option)}
          </button>
        );
      })}
    </div>
  );
}

const speakerSelectTriggerClassName =
  "h-auto w-full justify-between rounded-xl border border-[#262626] bg-[#0d0d0d] px-4 py-3 text-sm text-white shadow-none focus-visible:border-white/20 focus-visible:ring-0 data-placeholder:text-[#666666] [&>svg]:text-[#888888]";

const speakerSelectContentClassName =
  "border border-[#262626] bg-[#141414] text-white ring-0";

function SpeakerSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 font-mono text-[11px] tracking-[0.08em] text-[#888888]">{label}</p>
      <Select
        value={value}
        onValueChange={(next) => {
          if (typeof next === "string") {
            onChange(next);
          }
        }}
      >
        <SelectTrigger aria-label={label} className={speakerSelectTriggerClassName}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger className={speakerSelectContentClassName}>
          {VOICE_SPEAKERS.map((speaker) => (
            <SelectItem
              key={speaker.id}
              value={speaker.id}
              className="rounded-lg text-white focus:bg-white/10 focus:text-white"
            >
              {speaker.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function VoiceStyleFields({
  prefix,
  settings,
  update,
}: {
  prefix: "email" | "news" | "";
  settings: PlatformSettings;
  update: (patch: Partial<PlatformSettings>) => void;
}) {
  const styleKey =
    prefix === "email"
      ? "emailConversationStyle"
      : prefix === "news"
        ? "newsConversationStyle"
        : "conversationStyle";
  const customKey =
    prefix === "email"
      ? "emailCustomPrompt"
      : prefix === "news"
        ? "newsCustomPrompt"
        : "customPrompt";
  const engineKey =
    prefix === "email"
      ? "emailVoiceEngine"
      : prefix === "news"
        ? "newsVoiceEngine"
        : "voiceEngine";
  const speakerAKey =
    prefix === "email" ? "emailSpeakerA" : prefix === "news" ? "newsSpeakerA" : "speakerA";
  const speakerBKey =
    prefix === "email" ? "emailSpeakerB" : prefix === "news" ? "newsSpeakerB" : "speakerB";

  const style = settings[styleKey] as ConversationStyle;
  const customPrompt = settings[customKey];
  const engine = settings[engineKey];
  const speakerA = settings[speakerAKey];
  const speakerB = settings[speakerBKey];

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-3 font-mono text-[11px] tracking-[0.08em] text-[#888888]">
          Conversation Style
        </p>
        <div className="space-y-2">
          {CONVERSATION_STYLES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => update({ [styleKey]: option.id })}
              className={cn(
                "flex w-full items-start justify-between rounded-2xl border px-4 py-4 text-left transition-colors",
                style === option.id
                  ? "border-white/30 bg-white/5"
                  : "border-[#262626] bg-[#141414] hover:border-white/20",
              )}
            >
              <div>
                <p className="font-medium text-white">{option.title}</p>
                <p className="mt-1 text-sm text-[#888888]">{option.description}</p>
              </div>
              {style === option.id ? (
                <MaterialIcon name="check_circle" filled className="text-[18px] text-white" />
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {style === "Custom" ? (
        <textarea
          value={customPrompt}
          onChange={(event) => update({ [customKey]: event.target.value })}
          placeholder="Describe how you want your briefings to sound..."
          rows={4}
          className="w-full rounded-xl border border-[#262626] bg-[#0d0d0d] px-4 py-3 text-sm text-white outline-none placeholder:text-[#666666] focus:border-white/20"
        />
      ) : null}

      <div>
        <p className="mb-3 font-mono text-[11px] tracking-[0.08em] text-[#888888]">
          Voice Engine
        </p>
        <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-1">
          {VOICE_ENGINES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => update({ [engineKey]: item.id })}
              className={cn(
                "w-36 shrink-0 rounded-2xl border px-4 py-4 text-left transition-colors",
                engine === item.id
                  ? "border-white bg-white text-black"
                  : "border-[#262626] bg-[#141414] text-white hover:border-white/20",
              )}
            >
              <p className="font-medium">{item.label}</p>
              <p
                className={cn(
                  "mt-1 text-xs",
                  engine === item.id ? "text-black/70" : "text-[#888888]",
                )}
              >
                {item.tier}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SpeakerSelect
          label="Speaker A"
          value={speakerA}
          onChange={(value) => update({ [speakerAKey]: value })}
        />
        <SpeakerSelect
          label="Speaker B"
          value={speakerB}
          onChange={(value) => update({ [speakerBKey]: value })}
        />
      </div>
    </div>
  );
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

  useEffect(() => {
    setSettings(loadPlatformSettings());
  }, []);

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

  function reorderRoutineSlots(next: BriefingRoutineSlot[]) {
    updateSettings({ briefingRoutine: next });
    showSaved("Routine saved.");
  }

  function removeRoutineSlot(id: string) {
    updateSettings({
      briefingRoutine: settings.briefingRoutine.filter((slot) => slot.id !== id),
    });
    showSaved("Routine saved.");
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
    showSaved("Routine saved.");
  }

  if (activeSection) {
    const section = SETTINGS_SECTIONS.find((item) => item.id === activeSection);

    return (
      <section className="mb-12">
        <SubScreenHeader
          title={section?.title ?? "Settings"}
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

        {activeSection === "voice-style" ? (
          <div className="space-y-5">
            <SettingsToggle
              checked={settings.useGlobalVoiceOverride}
              onChange={(checked) => {
                updateSettings({ useGlobalVoiceOverride: checked });
                showSaved();
              }}
              label="Apply to all podcasts"
              description="Override per-podcast voice and style settings with these global defaults."
            />
            <VoiceStyleFields
              prefix=""
              settings={settings}
              update={(patch) => saveSettings(patch)}
            />
          </div>
        ) : null}

        {activeSection === "email-brief" ? (
          <div className="space-y-6">
            <VoiceStyleFields
              prefix="email"
              settings={settings}
              update={(patch) => saveSettings(patch)}
            />
            <div className="space-y-4 border-t border-[#262626] pt-6">
              <div>
                <p className="mb-3 font-mono text-[11px] tracking-[0.08em] text-[#888888]">
                  Max emails per briefing
                </p>
                <ChipGrid
                  options={EMAIL_MAX_ITEMS}
                  value={settings.emailMaxItems}
                  onChange={(value) => {
                    updateSettings({ emailMaxItems: value });
                    showSaved();
                  }}
                />
              </div>
              <div>
                <p className="mb-3 font-mono text-[11px] tracking-[0.08em] text-[#888888]">
                  Search emails from the last
                </p>
                <ChipGrid
                  options={EMAIL_LOOKBACK_OPTIONS.map((option) => option.hours)}
                  value={settings.emailLookbackHours}
                  onChange={(value) => {
                    updateSettings({ emailLookbackHours: value });
                    showSaved();
                  }}
                  formatLabel={(hours) =>
                    EMAIL_LOOKBACK_OPTIONS.find((option) => option.hours === hours)?.label ??
                    `${hours} hours`
                  }
                />
              </div>
              <SettingsToggle
                checked={settings.emailSkipDuplicates}
                onChange={(checked) => {
                  updateSettings({ emailSkipDuplicates: checked });
                  showSaved();
                }}
                label="Skip duplicate emails"
              />
            </div>
          </div>
        ) : null}

        {activeSection === "news-pod" ? (
          <VoiceStyleFields
            prefix="news"
            settings={settings}
            update={(patch) => saveSettings(patch)}
          />
        ) : null}

        {activeSection === "playback" ? (
          <div className="space-y-6">
            <p className="text-sm text-[#888888]">
              Set how many seconds to skip backward and forward.
            </p>
            <div>
              <p className="mb-3 font-mono text-[11px] tracking-[0.08em] text-[#888888]">
                Skip back
              </p>
              <ChipGrid
                options={PLAYBACK_SKIP_OPTIONS}
                value={settings.skipBackSeconds}
                onChange={(value) => {
                  updateSettings({ skipBackSeconds: value });
                  showSaved();
                }}
                formatLabel={(value) => `${value}s`}
              />
            </div>
            <div>
              <p className="mb-3 font-mono text-[11px] tracking-[0.08em] text-[#888888]">
                Skip forward
              </p>
              <ChipGrid
                options={PLAYBACK_SKIP_OPTIONS}
                value={settings.skipForwardSeconds}
                onChange={(value) => {
                  updateSettings({ skipForwardSeconds: value });
                  showSaved();
                }}
                formatLabel={(value) => `${value}s`}
              />
            </div>
            <div>
              <label className="mb-2 block font-mono text-[11px] tracking-[0.08em] text-[#888888]">
                Fresh episode window (minutes)
              </label>
              <input
                type="number"
                min={5}
                max={1440}
                step={5}
                value={settings.freshEpisodeMinutes}
                onChange={(event) => {
                  updateSettings({
                    freshEpisodeMinutes: Number(event.target.value) || 60,
                  });
                  showSaved();
                }}
                className="w-full rounded-xl border border-[#262626] bg-[#0d0d0d] px-4 py-3 text-sm text-white outline-none focus:border-white/20"
              />
              <p className="mt-2 text-sm text-[#888888]">
                Reuse a recent episode during autoplay instead of generating a new one.
              </p>
            </div>
          </div>
        ) : null}

        {activeSection === "language" ? (
          <div className="space-y-2">
            <p className="mb-3 text-sm text-[#888888]">
              Choose the language for your app and content.
            </p>
            {LANGUAGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  updateSettings({ language: option.value });
                  showSaved();
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition-colors",
                  settings.language === option.value
                    ? "border-white/30 bg-white/5"
                    : "border-[#262626] bg-[#141414] hover:border-white/20",
                )}
              >
                <span className="text-white">{option.label}</span>
                {settings.language === option.value ? (
                  <MaterialIcon name="check_circle" filled className="text-[18px] text-white" />
                ) : null}
              </button>
            ))}
          </div>
        ) : null}

        {activeSection === "weather" ? (
          <div className="space-y-4">
            <p className="text-sm text-[#888888]">
              Enter your zip code to see local weather on your home screen. Leave blank to hide
              the weather strip.
            </p>
            <input
              value={settings.weatherZipCode}
              onChange={(event) => {
                updateSettings({ weatherZipCode: event.target.value });
                showSaved();
              }}
              placeholder="e.g. 15213"
              maxLength={10}
              className="w-full rounded-xl border border-[#262626] bg-[#0d0d0d] px-4 py-3 text-sm text-white outline-none placeholder:text-[#666666] focus:border-white/20"
            />
            {settings.weatherZipCode ? (
              <button
                type="button"
                onClick={() => {
                  updateSettings({ weatherZipCode: "" });
                  showSaved("Weather removed.");
                }}
                className="text-sm text-[#888888] transition-colors hover:text-white"
              >
                Remove weather
              </button>
            ) : null}
          </div>
        ) : null}

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

        {activeSection === "manage-account" ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#262626] bg-[#141414] p-4">
              <p className="font-mono text-[11px] tracking-[0.08em] text-[#888888]">
                Display name
              </p>
              <p className="mt-2 text-lg font-semibold text-white">{displayName}</p>
              <button
                type="button"
                onClick={onEditProfile}
                className="mt-4 rounded-full bg-white px-4 py-2 font-mono text-[12px] font-medium tracking-[0.05em] text-black transition-colors hover:bg-white/90"
              >
                Edit Profile
              </button>
            </div>
            <div className="rounded-2xl border border-[#262626] bg-[#141414] p-4">
              <p className="font-mono text-[11px] tracking-[0.08em] text-[#888888]">Email</p>
              <p className="mt-2 text-white">{emailAddress}</p>
            </div>
            <div className="rounded-2xl border border-[#262626] bg-[#141414] p-4">
              <p className="font-medium text-white">Sign out</p>
              <p className="mt-1 text-sm text-[#888888]">
                Sign out of your account on this device.
              </p>
              <PlatformSignOutButton className="mt-4 px-4 py-2" />
            </div>
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4">
              <p className="font-medium text-white">Delete account</p>
              <p className="mt-1 text-sm text-[#888888]">
                Permanently remove your account and all associated data.
              </p>
              <button
                type="button"
                className="mt-4 rounded-full border border-red-500/40 px-4 py-2 text-sm text-red-300 transition-colors hover:bg-red-500/10"
              >
                Delete Account
              </button>
            </div>
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="mb-12 overflow-hidden rounded-2xl border border-[#262626] bg-[#0d0d0d]">
      <div className="border-b border-[#262626] px-5 py-4">
        <h3 className="text-lg font-semibold text-white">Settings</h3>
      </div>
      <div className="divide-y divide-[#262626]">
        {SETTINGS_SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveSection(section.id)}
            className="flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#1f1f1f]">
              <MaterialIcon name={section.icon} className="text-[20px] text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium text-white">{section.title}</p>
              {section.subtitle ? (
                <p className="mt-0.5 text-xs text-[#888888]">{section.subtitle}</p>
              ) : null}
            </div>
            <MaterialIcon name="chevron_right" className="text-[18px] text-[#888888]" />
          </button>
        ))}
      </div>
    </section>
  );
}
