"use client";

import { useCallback, useMemo } from "react";
import {
  CONVERSATION_STYLES,
  type ConversationStyle,
} from "@/lib/platform-settings";
import { voicesByEngine } from "@/lib/voice-catalog";
import { cn } from "@/lib/utils";
import { VoiceWheelPicker } from "@/components/platform/voice-wheel-picker";

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
  return (
    <button
      type="button"
      aria-label={`Preview ${label}`}
      className="flex size-7 items-center justify-center rounded-full bg-white text-black transition-opacity hover:opacity-85"
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
  const voices = useMemo(
    () => voicesByEngine(draft.voiceEngine),
    [draft.voiceEngine],
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
        <p className="mb-2.5 px-1 text-[13px] font-semibold tracking-[0.5px] text-[#888888] uppercase">
          Conversation Style
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
                  "flex items-center gap-3.5 rounded-[14px] border bg-[#141414] p-3.5 text-left transition-colors",
                  selected ? "border-[#4ade80]" : "border-transparent hover:border-white/10",
                )}
              >
                <div className="flex-1">
                  <p className="text-[15px] font-semibold text-white">{option.title}</p>
                  <p className="text-xs text-[#888888]">{option.description}</p>
                </div>
                <div
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full",
                    selected ? "bg-[#4ade80]" : "border-2 border-[#313131]",
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
            placeholder="Describe how Speaker A and Speaker B should interact..."
            rows={5}
            className="mt-2 w-full resize-y rounded-[14px] border border-[#313131] bg-[#141414] p-3.5 text-sm text-white outline-none placeholder:text-[#666666] focus:border-white/20"
          />
        ) : null}
      </div>

      <div className="flex gap-4 rounded-[14px] bg-[#141414] px-4 py-6">
        <div className="flex-1 text-center">
          <div className="mb-3 flex items-center justify-center gap-1.5 text-[13px] text-[#888888]">
            <MaterialIcon name="mic" className="text-[14px]" />
            <span>Speaker A</span>
            <PlayPreviewButton label="Speaker A" />
          </div>
          <VoiceWheelPicker
            voices={voices}
            value={draft.speakerA}
            onChange={handleSpeakerAChange}
          />
        </div>

        <div className="mx-1 w-px self-stretch bg-[#2a2a2a]" />

        <div className="flex-1 text-center">
          <div className="mb-3 flex items-center justify-center gap-1.5 text-[13px] text-[#888888]">
            <MaterialIcon name="graphic_eq" className="text-[14px]" />
            <span>Speaker B</span>
            <PlayPreviewButton label="Speaker B" />
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
        Save Settings
      </button>
    </div>
  );
}
