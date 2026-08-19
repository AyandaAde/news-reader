"use client";

import { useMemo, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  getLanguageRegionalLabel,
  LANGUAGE_OPTIONS,
  PODCAST_LOCALIZATION_REGIONS,
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
  return <span className={cn("material-symbols-outlined", className)}>{name}</span>;
}

export type LanguageSettingsDraft = {
  language: string;
  podcastLocalizationMode: PodcastLocalizationMode;
  podcastLocalizationRegion: string;
};

type LanguageSettingsPanelProps = {
  draft: LanguageSettingsDraft;
  onChange: (patch: Partial<LanguageSettingsDraft>) => void;
  onSave: () => void;
};

const settingsSelectWrapperClassName = "my-3 block w-full";

const settingsSelectTriggerClassName =
  "h-20 w-full justify-between rounded-[10px] border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-5 text-[15px] text-white shadow-none focus-visible:border-white/20 focus-visible:ring-0 data-placeholder:text-[#666666] [&>svg]:text-[#888888]";

const settingsSelectContentClassName =
  "hide-scrollbar max-h-64 overflow-x-hidden overflow-y-auto overscroll-contain rounded-[10px] border border-[#262626] bg-[#141414] p-0 text-white shadow-none ring-0 [-webkit-overflow-scrolling:touch] [&_[data-slot=select-scroll-up-button]]:hidden [&_[data-slot=select-scroll-down-button]]:hidden";

const settingsSelectItemClassName =
  "min-h-20 rounded-none px-4 py-4 text-[15px] text-white focus:bg-white/10 focus:text-white";

const settingsSelectContentProps = {
  alignItemWithTrigger: false,
  sideOffset: 0,
  className: settingsSelectContentClassName,
} as const;

function getPodcastRegionLabel(value: string) {
  return (
    PODCAST_LOCALIZATION_REGIONS.find((region) => region.value === value)?.label ??
    "Select region"
  );
}

function RadioIndicator({ selected }: { selected: boolean }) {
  return (
    <span
      className={cn(
        "mt-0.5 size-5 shrink-0 rounded-full border-2",
        selected ? "border-white" : "border-[#666666]",
      )}
    />
  );
}

export function LanguageSettingsPanel({
  draft,
  onChange,
  onSave,
}: LanguageSettingsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const matchAppSelected = draft.podcastLocalizationMode === "match-app";
  const customSelected = draft.podcastLocalizationMode === "custom";

  const filteredLanguages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return LANGUAGE_OPTIONS;

    return LANGUAGE_OPTIONS.filter((option) => {
      const regionalLabel = getLanguageRegionalLabel(option.value).toLowerCase();
      return (
        regionalLabel.includes(query) || option.label.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm leading-6 text-[#888888]">
        Choose the language for menus, briefings, and notifications across the app.
      </p>

      <div className="overflow-hidden rounded-[14px] bg-[#141414] px-4 pt-4 pb-0">
        <p className="mb-3 text-[13px] font-semibold tracking-[0.5px] text-[#888888] uppercase">
          App Language
        </p>
        <label className="relative block">
          <MaterialIcon
            name="search"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[18px] text-[#666666]"
          />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search languages"
            className="w-full rounded-[10px] border border-[#2a2a2a] bg-[#1a1a1a] py-3 pr-4 pl-10 text-sm text-white outline-none placeholder:text-[#666666] focus:border-white/20"
          />
        </label>
        <div className={settingsSelectWrapperClassName}>
          <Select
            value={draft.language}
            onValueChange={(next) => {
              if (typeof next === "string") {
                onChange({ language: next });
              }
            }}
          >
            <SelectTrigger
              aria-label="App language"
              className={settingsSelectTriggerClassName}
            >
              <span className="min-w-0 flex-1 truncate text-left">
                {getLanguageRegionalLabel(draft.language)}
              </span>
            </SelectTrigger>
            <SelectContent {...settingsSelectContentProps}>
              {filteredLanguages.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={settingsSelectItemClassName}
                >
                  {getLanguageRegionalLabel(option.value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {filteredLanguages.length === 0 ? (
          <p className="mt-2 mb-3 text-sm text-[#888888]">No languages match your search.</p>
        ) : null}
      </div>

      <div>
        <h4 className="text-[15px] font-semibold text-white">Podcast and Briefing localisation</h4>
        <p className="mt-1 text-sm text-[#888888]">
          Prioritize audio content in this language.
        </p>
        <div className="mt-3 rounded-[14px] border border-[#262626] p-1">
          <button
            type="button"
            onClick={() => onChange({ podcastLocalizationMode: "match-app" })}
            className={cn(
              "flex w-full items-start gap-3 rounded-[10px] px-3 py-3 text-left transition-colors",
              matchAppSelected ? "bg-[#2c2c2e]" : "bg-transparent hover:bg-white/[0.03]",
            )}
          >
            <RadioIndicator selected={matchAppSelected} />
            <div>
              <p className="text-[15px] font-semibold text-white">Match App Language</p>
              <p className="mt-1 text-sm text-[#888888]">
                Currently {getLanguageRegionalLabel(draft.language)}
              </p>
            </div>
          </button>

          <div
            className={cn(
              "rounded-[10px] px-3 transition-colors",
              customSelected ? "bg-[#2c2c2e] pt-3 pb-0" : "bg-transparent py-3",
            )}
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => onChange({ podcastLocalizationMode: "custom" })}
                className="mt-0.5 shrink-0"
                aria-label="Custom selection"
              >
                <RadioIndicator selected={customSelected} />
              </button>
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => onChange({ podcastLocalizationMode: "custom" })}
                  className="w-full text-left"
                >
                  <p className="text-[15px] font-medium text-white">Custom Selection</p>
                  {!customSelected ? (
                    <p className="mt-1 text-sm text-[#888888]">Select specific locale</p>
                  ) : null}
                </button>
                {customSelected ? (
                  <div className={settingsSelectWrapperClassName}>
                    <Select
                      value={draft.podcastLocalizationRegion}
                      onValueChange={(next) => {
                        if (typeof next === "string") {
                          onChange({ podcastLocalizationRegion: next });
                        }
                      }}
                    >
                      <SelectTrigger
                        aria-label="Podcast region"
                        className={settingsSelectTriggerClassName}
                      >
                        <span className="min-w-0 flex-1 truncate text-left">
                          {getPodcastRegionLabel(draft.podcastLocalizationRegion)}
                        </span>
                      </SelectTrigger>
                      <SelectContent {...settingsSelectContentProps}>
                        {PODCAST_LOCALIZATION_REGIONS.map((region) => (
                          <SelectItem
                            key={region.value}
                            value={region.value}
                            className={settingsSelectItemClassName}
                          >
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onSave}
        className="w-full rounded-[14px] bg-white px-4 py-3.5 text-[15px] font-semibold text-black transition-opacity hover:opacity-90"
      >
        Save
      </button>
    </div>
  );
}
