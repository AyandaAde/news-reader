"use client";

import { useMemo, useState } from "react";

import {
  appLanguageSupportsPremiumPodcastMatch,
  getCustomPodcastLanguageOptions,
  getLanguageRegionalLabel,
  LANGUAGE_OPTIONS,
  type PodcastLocalizationMode,
} from "@/lib/platform-settings";
import { cn } from "@/lib/utils";

function MaterialIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span className={cn("material-symbols-outlined", className)}>{name}</span>
  );
}

export type LanguageSettingsDraft = {
  language: string;
  podcastLocalizationMode: PodcastLocalizationMode;
  podcastLocalizationRegion: string;
};

type LanguageSettingsPanelProps = {
  draft: LanguageSettingsDraft;
  isPremiumVoice?: boolean;
  onChange: (patch: Partial<LanguageSettingsDraft>) => void;
  onSave: () => void;
};

function SelectionCheck({ selected }: { selected: boolean }) {
  return (
    <div
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full transition-[background-color,border-color] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
        selected
          ? "bg-[#4ade80]"
          : "border-2 border-neutral-300 dark:border-[#313131]",
      )}
    >
      {selected ? (
        <MaterialIcon name="check" className="text-[12px] text-black" />
      ) : null}
    </div>
  );
}

export function LanguageSettingsPanel({
  draft,
  isPremiumVoice = false,
  onChange,
  onSave,
}: LanguageSettingsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [regionSearchQuery, setRegionSearchQuery] = useState("");
  const [customOpen, setCustomOpen] = useState(
    draft.podcastLocalizationMode === "custom",
  );

  const matchAppAllowed =
    !isPremiumVoice || appLanguageSupportsPremiumPodcastMatch(draft.language);
  const matchAppSelected =
    matchAppAllowed && draft.podcastLocalizationMode === "match-app";
  const customSelected =
    !matchAppAllowed || draft.podcastLocalizationMode === "custom";
  const customLanguageOptions = getCustomPodcastLanguageOptions(isPremiumVoice);

  const filteredLanguages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return LANGUAGE_OPTIONS;

    return LANGUAGE_OPTIONS.filter((option) => {
      const regionalLabel = getLanguageRegionalLabel(option.value).toLowerCase();
      return (
        regionalLabel.includes(query) ||
        option.label.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const filteredCustomLanguages = useMemo(() => {
    const query = regionSearchQuery.trim().toLowerCase();
    if (!query) return [...customLanguageOptions];

    return customLanguageOptions.filter((option) => {
      const regionalLabel = getLanguageRegionalLabel(option.value).toLowerCase();
      return (
        regionalLabel.includes(query) ||
        option.label.toLowerCase().includes(query)
      );
    });
  }, [customLanguageOptions, regionSearchQuery]);

  function selectLanguage(language: string) {
    const nextPatch: Partial<LanguageSettingsDraft> = { language };
    if (isPremiumVoice && !appLanguageSupportsPremiumPodcastMatch(language)) {
      nextPatch.podcastLocalizationMode = "custom";
      nextPatch.podcastLocalizationRegion =
        draft.podcastLocalizationMode === "custom" &&
        draft.podcastLocalizationRegion.length === 3
          ? draft.podcastLocalizationRegion
          : "eng";
      setCustomOpen(true);
    }
    onChange(nextPatch);
    setLanguageOpen(false);
    setSearchQuery("");
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="px-1 text-[15px] leading-6 text-pretty text-neutral-500 dark:text-[#888888]">
        Choose the language for menus, briefings, and notifications across the
        app.
      </p>

      <div>
        <p className="mb-2.5 px-1 text-[13px] font-semibold tracking-[0.5px] text-neutral-500 uppercase dark:text-[#888888]">
          App Language
        </p>

        <div className="overflow-hidden rounded-[16px] bg-neutral-50 p-2 dark:bg-[#141414]">
          <button
            type="button"
            aria-expanded={languageOpen}
            aria-label="App language"
            onClick={() => setLanguageOpen((open) => !open)}
            className="flex w-full items-center gap-3 rounded-[12px] border border-transparent bg-white px-3.5 py-3.5 text-left transition-[border-color,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] active:scale-[0.98] dark:bg-[#1a1a1a]"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-neutral-900 dark:text-white">
                {getLanguageRegionalLabel(draft.language)}
              </p>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-[#888888]">
                Tap to change language
              </p>
            </div>
            <MaterialIcon
              name={languageOpen ? "expand_less" : "expand_more"}
              className="text-[22px] text-neutral-500 dark:text-[#888888]"
            />
          </button>

          {languageOpen ? (
            <div className="mt-2 flex flex-col gap-2">
              <label className="relative block">
                <MaterialIcon
                  name="search"
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[18px] text-neutral-400 dark:text-[#666666]"
                />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search languages"
                  autoFocus
                  className="w-full rounded-[10px] border border-transparent bg-white py-2.5 pr-3.5 pl-10 text-sm text-neutral-900 outline-none transition-[border-color,background-color] duration-200 ease-[cubic-bezier(0.2,0,0,1)] placeholder:text-neutral-400 focus:border-neutral-300 dark:bg-[#1a1a1a] dark:text-white dark:placeholder:text-[#666666] dark:focus:border-white/15"
                />
              </label>

              <div className="hide-scrollbar flex max-h-[280px] flex-col gap-1.5 overflow-y-auto overscroll-contain">
                {filteredLanguages.map((option) => {
                  const selected = draft.language === option.value;
                  const regional = getLanguageRegionalLabel(option.value);

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => selectLanguage(option.value)}
                      className={cn(
                        "flex items-center gap-3.5 rounded-[12px] border p-3.5 text-left transition-[border-color,background-color,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] active:scale-[0.98]",
                        selected
                          ? "border-[#4ade80] bg-white dark:bg-[#1a1a1a]"
                          : "border-transparent bg-transparent hover:bg-white/80 dark:hover:bg-white/[0.04]",
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-semibold text-balance text-neutral-900 dark:text-white">
                          {regional}
                        </p>
                        {regional !== option.label ? (
                          <p className="mt-0.5 text-xs text-neutral-500 dark:text-[#888888]">
                            {option.label}
                          </p>
                        ) : null}
                      </div>
                      <SelectionCheck selected={selected} />
                    </button>
                  );
                })}
                {filteredLanguages.length === 0 ? (
                  <p className="px-2 py-4 text-sm text-neutral-500 dark:text-[#888888]">
                    No languages match your search.
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <p className="mb-1 px-1 text-[13px] font-semibold tracking-[0.5px] text-neutral-500 uppercase dark:text-[#888888]">
          Podcast & Briefing
        </p>
        <p className="mb-2.5 px-1 text-sm text-pretty text-neutral-500 dark:text-[#888888]">
          Prioritize audio content in this language.
          {!matchAppAllowed
            ? " Your app language isn’t available for Premium voice, so choose a podcast language below (English by default)."
            : null}
        </p>

        <div className="flex flex-col gap-2.5">
          {matchAppAllowed ? (
            <button
              type="button"
              onClick={() => {
                onChange({ podcastLocalizationMode: "match-app" });
                setCustomOpen(false);
                setRegionSearchQuery("");
              }}
              className={cn(
                "flex items-center gap-3.5 rounded-[14px] border bg-neutral-50 p-3.5 text-left transition-[border-color,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] active:scale-[0.98] dark:bg-[#141414]",
                matchAppSelected
                  ? "border-[#4ade80]"
                  : "border-transparent hover:border-neutral-300 dark:hover:border-white/10",
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-neutral-900 dark:text-white">
                  Match App Language
                </p>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-[#888888]">
                  Currently {getLanguageRegionalLabel(draft.language)}
                </p>
              </div>
              <SelectionCheck selected={matchAppSelected} />
            </button>
          ) : null}

          <div
            className={cn(
              "rounded-[14px] border bg-neutral-50 transition-[border-color] duration-200 ease-[cubic-bezier(0.2,0,0,1)] dark:bg-[#141414]",
              customSelected
                ? "border-[#4ade80] p-2"
                : "border-transparent p-0",
            )}
          >
            <button
              type="button"
              aria-expanded={customSelected && customOpen}
              onClick={() => {
                if (customSelected) {
                  setCustomOpen((open) => !open);
                  if (customOpen) {
                    setRegionSearchQuery("");
                  }
                  return;
                }

                onChange({
                  podcastLocalizationMode: "custom",
                  ...(isPremiumVoice
                    ? {
                        podcastLocalizationRegion:
                          draft.podcastLocalizationRegion.length === 3
                            ? draft.podcastLocalizationRegion
                            : "eng",
                      }
                    : {}),
                });
                setCustomOpen(true);
              }}
              className={cn(
                "flex w-full items-center gap-3.5 text-left transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)] active:scale-[0.98]",
                customSelected ? "rounded-[10px] p-2.5" : "rounded-[14px] p-3.5",
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-neutral-900 dark:text-white">
                  Custom Selection
                </p>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-[#888888]">
                  {customSelected
                    ? getLanguageRegionalLabel(draft.podcastLocalizationRegion)
                    : "Select a specific language"}
                </p>
              </div>
              <SelectionCheck selected={customSelected} />
            </button>

            {customSelected && customOpen ? (
              <div className="mt-1.5 space-y-2 px-0.5 pb-0.5">
                <label className="relative block">
                  <MaterialIcon
                    name="search"
                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[16px] text-neutral-400 dark:text-[#666666]"
                  />
                  <input
                    value={regionSearchQuery}
                    onChange={(event) =>
                      setRegionSearchQuery(event.target.value)
                    }
                    placeholder="Search languages"
                    className="w-full rounded-[10px] border border-transparent bg-white py-2 pr-3 pl-9 text-sm text-neutral-900 outline-none transition-[border-color] duration-200 ease-[cubic-bezier(0.2,0,0,1)] placeholder:text-neutral-400 focus:border-neutral-300 dark:bg-[#1a1a1a] dark:text-white dark:placeholder:text-[#666666] dark:focus:border-white/15"
                  />
                </label>

                <div className="hide-scrollbar flex max-h-[240px] flex-col gap-1 overflow-y-auto overscroll-contain">
                  {filteredCustomLanguages.map((option) => {
                    const selected =
                      draft.podcastLocalizationRegion === option.value;
                    const regional = getLanguageRegionalLabel(option.value);

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          onChange({
                            podcastLocalizationMode: "custom",
                            podcastLocalizationRegion: option.value,
                          });
                          setCustomOpen(false);
                          setRegionSearchQuery("");
                        }}
                        className={cn(
                          "flex items-center gap-3 rounded-[10px] border px-3 py-2.5 text-left transition-[border-color,background-color,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] active:scale-[0.98]",
                          selected
                            ? "border-[#4ade80] bg-white dark:bg-[#1a1a1a]"
                            : "border-transparent hover:bg-white/70 dark:hover:bg-white/[0.04]",
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <span className="block truncate text-[14px] font-medium text-neutral-900 dark:text-white">
                            {regional}
                          </span>
                          {regional !== option.label ? (
                            <span className="mt-0.5 block text-xs text-neutral-500 dark:text-[#888888]">
                              {option.label}
                            </span>
                          ) : null}
                        </div>
                        <SelectionCheck selected={selected} />
                      </button>
                    );
                  })}
                  {filteredCustomLanguages.length === 0 ? (
                    <p className="px-2 py-3 text-sm text-neutral-500 dark:text-[#888888]">
                      No languages match your search.
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onSave}
        className="mb-1 w-full rounded-[14px] bg-[#4ade80] p-3.5 text-[15px] font-semibold text-black transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:opacity-90 active:scale-[0.96]"
      >
        Save Settings
      </button>
    </div>
  );
}
