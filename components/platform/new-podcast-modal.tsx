"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useI18n } from "@/components/i18n-provider";
import { TOPIC_OPTIONS } from "@/lib/onboarding";
import {
  DEFAULT_PODCAST_DURATION_ID,
  PODCAST_DURATION_OPTIONS,
  type NewPodcastConfig,
  type PodcastDurationId,
} from "@/lib/new-podcast";
import { LANGUAGE_OPTIONS } from "@/lib/platform-settings";
import { TOPIC_LABEL_KEYS } from "@/lib/platform-topic-labels";
import { cn } from "@/lib/utils";

type NewPodcastModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultLanguage?: string;
  isCreating?: boolean;
  errorMessage?: string | null;
  onCreate: (config: NewPodcastConfig) => void | Promise<void>;
};

export function NewPodcastModal({
  open,
  onOpenChange,
  defaultLanguage = "en",
  isCreating = false,
  errorMessage = null,
  onCreate,
}: NewPodcastModalProps) {
  const { t, language } = useI18n();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const [durationId, setDurationId] = useState<PodcastDurationId>(
    DEFAULT_PODCAST_DURATION_ID,
  );
  const [showTopicError, setShowTopicError] = useState(false);

  const resolvedDefaultLanguage = useMemo(() => {
    const candidate = defaultLanguage || language || "en";
    return LANGUAGE_OPTIONS.some((option) => option.value === candidate)
      ? candidate
      : "en";
  }, [defaultLanguage, language]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedTopics([]);
    setSelectedLanguage(resolvedDefaultLanguage);
    setDurationId(DEFAULT_PODCAST_DURATION_ID);
    setShowTopicError(false);
  }, [open, resolvedDefaultLanguage]);

  const selectedLanguageLabel =
    LANGUAGE_OPTIONS.find((option) => option.value === selectedLanguage)
      ?.label ?? selectedLanguage;

  function toggleTopic(topic: string) {
    setSelectedTopics((current) => {
      if (current.includes(topic)) {
        return current.filter((item) => item !== topic);
      }
      return [...current, topic];
    });
    setShowTopicError(false);
  }

  async function handleCreate() {
    if (isCreating) {
      return;
    }

    if (selectedTopics.length === 0) {
      setShowTopicError(true);
      return;
    }

    await onCreate({
      topics: selectedTopics,
      language: selectedLanguage,
      durationId,
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isCreating && !nextOpen) {
          return;
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent
        className="hide-scrollbar max-h-[90vh] overflow-y-auto border-neutral-200 bg-white text-neutral-900 sm:max-w-md dark:border-[#262626] dark:bg-[#141414] dark:text-white"
        onPointerDownOutside={(event) => {
          const target = event.target as HTMLElement | null;
          if (
            target?.closest("[data-slot='select-content']") ||
            target?.closest("[data-slot='select-trigger']")
          ) {
            event.preventDefault();
          }
        }}
        onInteractOutside={(event) => {
          const target = event.target as HTMLElement | null;
          if (
            target?.closest("[data-slot='select-content']") ||
            target?.closest("[data-slot='select-trigger']")
          ) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-neutral-900 dark:text-white">
            {t("platform.home.newPodcastTitle")}
          </DialogTitle>
          <DialogDescription className="text-neutral-500 dark:text-[#888888]">
            {t("platform.home.newPodcastDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <p className="mb-2 text-[13px] font-semibold tracking-[0.04em] text-neutral-500 uppercase dark:text-[#888888]">
              {t("platform.home.topicsLabel")}
            </p>
            <div className="flex flex-wrap gap-2">
              {TOPIC_OPTIONS.map((topic) => {
                const selected = selectedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors",
                      selected
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-white/10 dark:text-[#cccccc] dark:hover:bg-white/15",
                    )}
                  >
                    {t(TOPIC_LABEL_KEYS[topic])}
                  </button>
                );
              })}
            </div>
            {showTopicError ? (
              <p className="mt-2 text-sm text-red-500">
                {t("platform.home.selectTopicRequired")}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="new-podcast-language"
              className="mb-2 block text-[13px] font-semibold tracking-[0.04em] text-neutral-500 uppercase dark:text-[#888888]"
            >
              {t("platform.home.languageLabel")}
            </label>
            <Select
              value={selectedLanguage}
              onValueChange={(value) => {
                if (typeof value === "string") {
                  setSelectedLanguage(value);
                }
              }}
              disabled={isCreating}
            >
              <SelectTrigger
                id="new-podcast-language"
                aria-label={t("platform.home.languageLabel")}
                className="h-11 w-full rounded-[10px] border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-900 shadow-none focus-visible:border-neutral-400 focus-visible:ring-0 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-white dark:focus-visible:border-white/20"
              >
                <span className="min-w-0 flex-1 truncate text-left">
                  {selectedLanguageLabel}
                </span>
              </SelectTrigger>
              <SelectContent
                alignItemWithTrigger={false}
                className="hide-scrollbar z-[110] border-neutral-200 bg-white text-neutral-900 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-white"
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg focus:bg-neutral-100 focus:text-neutral-900 dark:focus:bg-white/10 dark:focus:text-white"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-semibold tracking-[0.04em] text-neutral-500 uppercase dark:text-[#888888]">
              {t("platform.home.durationLabel")}
            </p>
            <div className="space-y-2">
              {PODCAST_DURATION_OPTIONS.map((option) => {
                const selected = durationId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setDurationId(option.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-[10px] border px-4 py-3 text-left text-sm transition-colors",
                      selected
                        ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                        : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-[#cccccc] dark:hover:bg-white/10",
                    )}
                  >
                    <span>{t(`platform.home.${option.labelKey}`)}</span>
                    {option.optimum ? (
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] uppercase",
                          selected
                            ? "bg-white/20 text-white dark:bg-neutral-900/10 dark:text-neutral-900"
                            : "bg-[#34c759]/15 text-[#34c759]",
                        )}
                      >
                        {t("platform.home.durationOptimum")}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {errorMessage ? (
            <p className="text-sm text-red-500">{errorMessage}</p>
          ) : null}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              disabled={isCreating}
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-[10px] border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 disabled:opacity-60 dark:border-[#2a2a2a] dark:text-white dark:hover:bg-white/[0.04]"
            >
              {t("platform.profile.cancel")}
            </button>
            <button
              type="button"
              disabled={isCreating}
              onClick={() => {
                void handleCreate();
              }}
              className="flex-1 rounded-[10px] bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-neutral-900"
            >
              {isCreating
                ? t("platform.home.creatingPodcast")
                : t("platform.home.createPodcast")}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
