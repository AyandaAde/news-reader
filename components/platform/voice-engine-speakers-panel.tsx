"use client";

import { useCallback, useMemo } from "react";

import { useI18n } from "@/components/i18n-provider";
import {
  CONVERSATION_STYLES,
  type ConversationStyle,
} from "@/lib/platform-settings";
import {
  VOICE_ENGINE_TIERS,
  defaultSpeakersForEngine,
  providerIdForVoiceEngineTier,
  voiceEngineTierFromProvider,
  voicesByEngine,
  type VoiceEngineTierId,
} from "@/lib/voice-catalog";
import { cn } from "@/lib/utils";
import { VoiceWheelPicker } from "@/components/platform/voice-wheel-picker";

const VOICE_ENGINE_TIER_LABEL_KEYS = {
  standard: "platform.profile.voiceEngineStandard",
  premium: "platform.profile.voiceEnginePremium",
} as const satisfies Record<VoiceEngineTierId, string>;

const VOICE_ENGINE_TIER_DESC_KEYS = {
  standard: "platform.profile.voiceEngineStandardDesc",
  premium: "platform.profile.voiceEnginePremiumDesc",
} as const satisfies Record<VoiceEngineTierId, string>;

const CONVERSATION_STYLE_TITLE_KEYS = {
  HostCohost: "platform.profile.styleHostCohost",
  ReporterAnalyst: "platform.profile.styleReporterAnalyst",
  AssistantHuman: "platform.profile.styleAssistantHuman",
  Custom: "platform.profile.styleCustom",
} as const satisfies Record<ConversationStyle, string>;

const CONVERSATION_STYLE_DESC_KEYS = {
  HostCohost: "platform.profile.styleHostCohostDesc",
  ReporterAnalyst: "platform.profile.styleReporterAnalystDesc",
  AssistantHuman: "platform.profile.styleAssistantHumanDesc",
  Custom: "platform.profile.styleCustomDesc",
} as const satisfies Record<ConversationStyle, string>;

function MaterialIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return <span className={cn("material-symbols-outlined", className)}>{name}</span>;
}

function PlayPreviewButton({ label }: { label: string }) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      aria-label={t("platform.profile.previewVoice", { label })}
      className="flex size-7 items-center justify-center rounded-full bg-neutral-900 text-white transition-opacity hover:opacity-85 dark:bg-white dark:text-black"
    >
      <MaterialIcon name="play_arrow" className="text-[16px]" />
    </button>
  );
}

export type VoiceEngineSpeakersDraft = {
  conversationStyle: ConversationStyle;
  customPrompt: string;
  voiceEngine: string;
  speakerA: string;
  speakerB: string;
};

type VoiceEngineSpeakersPanelProps = {
  draft: VoiceEngineSpeakersDraft;
  onChange: (patch: Partial<VoiceEngineSpeakersDraft>) => void;
  onSave: () => void;
  disabled?: boolean;
};

export function VoiceEngineSpeakersPanel({
  draft,
  onChange,
  onSave,
  disabled = false,
}: VoiceEngineSpeakersPanelProps) {
  const { t } = useI18n();
  const speakerALabel = t("platform.profile.speakerA");
  const speakerBLabel = t("platform.profile.speakerB");
  const voices = useMemo(
    () => voicesByEngine(draft.voiceEngine),
    [draft.voiceEngine],
  );
  const selectedTier = voiceEngineTierFromProvider(draft.voiceEngine);

  const handleVoiceEngineTierChange = useCallback(
    (tierId: VoiceEngineTierId) => {
      if (voiceEngineTierFromProvider(draft.voiceEngine) === tierId) {
        return;
      }
      const voiceEngine = providerIdForVoiceEngineTier(tierId);
      const speakers = defaultSpeakersForEngine(voiceEngine);
      onChange({
        voiceEngine,
        speakerA: speakers.speakerA,
        speakerB: speakers.speakerB,
      });
    },
    [draft.voiceEngine, onChange],
  );

  const handleSpeakerAChange = useCallback(
    (speakerA: string) => onChange({ speakerA }),
    [onChange],
  );

  const handleSpeakerBChange = useCallback(
    (speakerB: string) => onChange({ speakerB }),
    [onChange],
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2.5 px-1 text-[13px] font-semibold tracking-[0.5px] text-neutral-500 uppercase dark:text-[#888888]">
          {t("platform.profile.voiceEngineSection")}
        </p>
        <div className="flex flex-col gap-2.5">
          {VOICE_ENGINE_TIERS.map((option) => {
            const selected = selectedTier === option.id;

            return (
              <button
                key={option.id}
                type="button"
                disabled={disabled}
                onClick={() => handleVoiceEngineTierChange(option.id)}
                className={cn(
                  "flex items-center gap-3.5 rounded-[14px] border bg-neutral-50 p-3.5 text-left transition-colors dark:bg-[#141414]",
                  selected
                    ? "border-[#4ade80]"
                    : "border-transparent hover:border-neutral-300 dark:hover:border-white/10",
                )}
              >
                <div className="flex-1">
                  <p className="text-[15px] font-semibold text-neutral-900 dark:text-white">
                    {t(VOICE_ENGINE_TIER_LABEL_KEYS[option.id])}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-[#888888]">
                    {t(VOICE_ENGINE_TIER_DESC_KEYS[option.id])}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full",
                    selected
                      ? "bg-[#4ade80]"
                      : "border-2 border-neutral-300 dark:border-[#313131]",
                  )}
                >
                  {selected ? (
                    <MaterialIcon name="check" className="text-[12px] text-black" />
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2.5 px-1 text-[13px] font-semibold tracking-[0.5px] text-neutral-500 uppercase dark:text-[#888888]">
          {t("platform.profile.conversationStyleSection")}
        </p>
        <div className="flex flex-col gap-2.5">
          {CONVERSATION_STYLES.map((option) => {
            const selected = draft.conversationStyle === option.id;

            return (
              <button
                key={option.id}
                type="button"
                disabled={disabled}
                onClick={() => onChange({ conversationStyle: option.id })}
                className={cn(
                  "flex items-center gap-3.5 rounded-[14px] border bg-neutral-50 p-3.5 text-left transition-colors dark:bg-[#141414]",
                  selected
                    ? "border-[#4ade80]"
                    : "border-transparent hover:border-neutral-300 dark:hover:border-white/10",
                )}
              >
                <div className="flex-1">
                  <p className="text-[15px] font-semibold text-neutral-900 dark:text-white">
                    {t(CONVERSATION_STYLE_TITLE_KEYS[option.id])}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-[#888888]">
                    {t(CONVERSATION_STYLE_DESC_KEYS[option.id])}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full",
                    selected
                      ? "bg-[#4ade80]"
                      : "border-2 border-neutral-300 dark:border-[#313131]",
                  )}
                >
                  {selected ? (
                    <MaterialIcon name="check" className="text-[12px] text-black" />
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        {draft.conversationStyle === "Custom" ? (
          <textarea
            value={draft.customPrompt}
            disabled={disabled}
            onChange={(event) => onChange({ customPrompt: event.target.value })}
            placeholder={t("platform.profile.customPromptPlaceholder")}
            rows={5}
            className="mt-2 w-full resize-y rounded-[14px] border border-neutral-200 bg-white p-3.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400 dark:border-[#313131] dark:bg-[#141414] dark:text-white dark:placeholder:text-[#666666] dark:focus:border-white/20"
          />
        ) : null}
      </div>

      <div className="flex gap-4 rounded-[14px] bg-neutral-50 px-4 py-6 dark:bg-[#141414]">
        <div className="flex-1 text-center">
          <div className="mb-3 flex items-center justify-center gap-1.5 text-[13px] text-neutral-500 dark:text-[#888888]">
            <MaterialIcon name="mic" className="text-[14px]" />
            <span>{speakerALabel}</span>
            <PlayPreviewButton label={speakerALabel} />
          </div>
          <VoiceWheelPicker
            voices={voices}
            value={draft.speakerA}
            onChange={handleSpeakerAChange}
          />
        </div>

        <div className="mx-1 w-px self-stretch bg-neutral-200 dark:bg-[#2a2a2a]" />

        <div className="flex-1 text-center">
          <div className="mb-3 flex items-center justify-center gap-1.5 text-[13px] text-neutral-500 dark:text-[#888888]">
            <MaterialIcon name="graphic_eq" className="text-[14px]" />
            <span>{speakerBLabel}</span>
            <PlayPreviewButton label={speakerBLabel} />
          </div>
          <VoiceWheelPicker
            voices={voices}
            value={draft.speakerB}
            onChange={handleSpeakerBChange}
          />
        </div>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onSave}
        className="mb-1 w-full rounded-[14px] bg-[#4ade80] p-3.5 text-[15px] font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {t("platform.profile.saveSettings")}
      </button>
    </div>
  );
}
