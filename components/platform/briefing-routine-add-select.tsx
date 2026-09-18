"use client";

import { useMemo, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  ROUTINE_ADD_CATEGORIES,
  getRoutinePodcastCategory,
  type RoutineAddCategory,
  type RoutineAddOption,
} from "@/lib/briefing-routine-options";
import type { BriefingRoutineSlot } from "@/lib/platform-settings";
import { cn } from "@/lib/utils";

type BriefingRoutineAddSelectProps = {
  routine: BriefingRoutineSlot[];
  weatherLabel: string;
  newsLabel: string;
  podcasts: Array<{ id: string; title: string }>;
  atLimit: boolean;
  placeholder: string;
  searchPlaceholder: string;
  emptyLabel: string;
  noMatchesLabel: string;
  onAdd: (slot: Omit<BriefingRoutineSlot, "id">) => void;
};

function MaterialIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return <span className={cn("material-symbols-outlined", className)}>{name}</span>;
}

export function BriefingRoutineAddSelect({
  routine,
  weatherLabel,
  newsLabel,
  podcasts,
  atLimit,
  placeholder,
  searchPlaceholder,
  emptyLabel,
  noMatchesLabel,
  onAdd,
}: BriefingRoutineAddSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<RoutineAddCategory | null>(null);

  const options = useMemo(() => {
    if (atLimit) {
      return [] as RoutineAddOption[];
    }

    const next: RoutineAddOption[] = [];

    if (!routine.some((slot) => slot.type === "weather")) {
      next.push({
        key: "weather",
        label: weatherLabel,
        category: "Weather",
        type: "weather",
      });
    }

    if (!routine.some((slot) => slot.type === "news")) {
      next.push({
        key: "news",
        label: newsLabel,
        category: "Business",
        type: "news",
      });
    }

    for (const podcast of podcasts) {
      if (routine.some((slot) => slot.podcastId === podcast.id)) {
        continue;
      }

      next.push({
        key: `podcast:${podcast.id}`,
        label: podcast.title,
        category: getRoutinePodcastCategory(podcast.title),
        type: "podcast",
        podcastId: podcast.id,
      });
    }

    return next;
  }, [atLimit, newsLabel, podcasts, routine, weatherLabel]);

  const filteredOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return options.filter((option) => {
      if (category && option.category !== category) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        option.label.toLowerCase().includes(query) ||
        option.category.toLowerCase().includes(query)
      );
    });
  }, [category, options, searchQuery]);

  function handleAdd(key: string) {
    const option = options.find((item) => item.key === key);
    if (!option) {
      return;
    }

    onAdd({
      type: option.type,
      label: option.label,
      podcastId: option.podcastId,
    });
    setOpen(false);
    setSearchQuery("");
    setCategory(null);
  }

  if (options.length === 0) {
    return <p className="text-sm text-neutral-500 dark:text-[#888888]">{emptyLabel}</p>;
  }

  return (
    <Select
      value={undefined}
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setSearchQuery("");
          setCategory(null);
        }
      }}
      onValueChange={(value) => {
        if (typeof value === "string") {
          handleAdd(value);
        }
      }}
    >
      <SelectTrigger
        aria-label={placeholder}
        className="h-14 w-full justify-between rounded-[12px] border border-neutral-200 bg-neutral-50 px-5 text-base text-neutral-900 shadow-none focus-visible:border-neutral-400 focus-visible:ring-0 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-white dark:focus-visible:border-white/20 data-[size=default]:h-14"
      >
        <span className="min-w-0 flex-1 truncate text-left text-[15px] text-neutral-500 dark:text-[#888888]">
          {placeholder}
        </span>
      </SelectTrigger>
      <SelectContent
        alignItemWithTrigger={false}
        sideOffset={6}
        className="hide-scrollbar z-[110] w-[var(--anchor-width)] min-w-[min(100%,28rem)] max-h-96 overflow-x-hidden overflow-y-auto rounded-[12px] border border-neutral-200 bg-white p-0 text-neutral-900 shadow-xl dark:border-[#262626] dark:bg-[#141414] dark:text-white [&_[data-slot=select-scroll-up-button]]:hidden [&_[data-slot=select-scroll-down-button]]:hidden"
      >
        <div
          className="sticky top-0 z-10 space-y-3 border-b border-neutral-200 bg-white p-4 dark:border-[#262626] dark:bg-[#141414]"
          onPointerDown={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <div className="relative">
            <MaterialIcon
              name="search"
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[20px] text-neutral-400 dark:text-[#666666]"
            />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-12 w-full rounded-[10px] border border-neutral-200 bg-neutral-50 py-2.5 pr-3 pl-11 text-[15px] text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-white dark:placeholder:text-[#666666] dark:focus:border-white/20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {ROUTINE_ADD_CATEGORIES.map((item) => {
              const selected = category === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setCategory((current) => (current === item ? null : item))
                  }
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    selected
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-white/10 dark:text-[#cccccc] dark:hover:bg-white/15",
                  )}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {filteredOptions.length === 0 ? (
          <p className="px-5 py-8 text-[15px] text-neutral-500 dark:text-[#888888]">
            {noMatchesLabel}
          </p>
        ) : (
          filteredOptions.map((option) => (
            <SelectItem
              key={option.key}
              value={option.key}
              className="min-h-14 rounded-none px-5 py-3.5 text-[15px] text-neutral-900 focus:bg-neutral-100 focus:text-neutral-900 dark:text-white dark:focus:bg-white/10 dark:focus:text-white"
            >
              <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                <span className="truncate">{option.label}</span>
                <span className="shrink-0 text-xs text-neutral-400 dark:text-[#666666]">
                  {option.category}
                </span>
              </span>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
