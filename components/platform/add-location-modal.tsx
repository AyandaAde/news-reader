"use client";

import { ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SUPPORTED_CITIES } from "@/lib/supported-cities";
import { cn } from "@/lib/utils";

type AddLocationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (cityId: string) => Promise<void> | void;
  isSaving?: boolean;
};

export function AddLocationModal({
  open,
  onOpenChange,
  onSave,
  isSaving = false,
}: AddLocationModalProps) {
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [isCityListOpen, setIsCityListOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setSelectedCityId("");
      setIsCityListOpen(false);
      setSearchQuery("");
    }
  }, [open]);

  useEffect(() => {
    if (isCityListOpen) {
      searchInputRef.current?.focus();
    }
  }, [isCityListOpen]);

  const selectedCity =
    SUPPORTED_CITIES.find((city) => city.id === selectedCityId) ?? null;

  const filteredCities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return SUPPORTED_CITIES;
    }

    return SUPPORTED_CITIES.filter((city) => {
      const haystack = [
        city.label,
        city.city,
        city.region,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [searchQuery]);

  async function handleSave() {
    if (!selectedCityId) {
      return;
    }

    await onSave(selectedCityId);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[#262626] bg-[#141414] text-white sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white">Add your location</DialogTitle>
          <DialogDescription className="text-[#888888]">
            Select your city to see local weather on your daily brief.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label
            htmlFor="home-city-select"
            className="text-[13px] font-semibold tracking-[0.5px] text-[#888888] uppercase"
          >
            City
          </label>
          <div className="overflow-hidden rounded-[10px] border border-[#2a2a2a] bg-[#1a1a1a]">
            <button
              id="home-city-select"
              type="button"
              aria-expanded={isCityListOpen}
              aria-haspopup="listbox"
              onClick={() => {
                setIsCityListOpen((current) => {
                  if (!current) {
                    setSearchQuery("");
                  }
                  return !current;
                });
              }}
              className="flex h-12 w-full items-center justify-between gap-3 px-4 text-[15px] text-white transition-colors hover:bg-white/[0.03]"
            >
              <span className="min-w-0 flex-1 truncate text-left">
                {selectedCity?.label ?? "Choose a city"}
              </span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-[#888888] transition-transform",
                  isCityListOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>

            {isCityListOpen ? (
              <div className="border-t border-[#2a2a2a]">
                <label className="relative block border-b border-[#2a2a2a] px-3 py-3">
                  <Search
                    className="pointer-events-none absolute top-1/2 left-6 size-4 -translate-y-1/2 text-[#666666]"
                    aria-hidden
                  />
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search cities"
                    className="w-full rounded-[8px] border border-[#2a2a2a] bg-[#141414] py-2.5 pr-3 pl-9 text-sm text-white outline-none placeholder:text-[#666666] focus:border-white/20"
                  />
                </label>
                <div
                  role="listbox"
                  aria-label="Select your city"
                  className="hide-scrollbar max-h-48 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
                >
                  {filteredCities.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-[#888888]">
                      No cities match your search.
                    </p>
                  ) : (
                    filteredCities.map((city) => {
                      const isSelected = selectedCityId === city.id;

                      return (
                        <button
                          key={city.id}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setSelectedCityId(city.id);
                            setIsCityListOpen(false);
                            setSearchQuery("");
                          }}
                          className={cn(
                            "flex w-full items-center px-4 py-3 text-left text-[15px] text-white transition-colors hover:bg-white/10",
                            isSelected && "bg-white/10",
                          )}
                        >
                          {city.label}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            className="flex-1 rounded-[10px] border border-[#2a2a2a] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!selectedCityId || isSaving}
            className={cn(
              "flex-1 rounded-[10px] bg-white px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {isSaving ? "Saving..." : "Save location"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
