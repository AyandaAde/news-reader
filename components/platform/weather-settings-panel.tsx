"use client";

import { useEffect, useState, type ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TimeWheelPicker,
  formatDeliveryTime,
  parseDeliveryTime,
  toDeliveryTime,
} from "@/components/platform/time-wheel-picker";
import { cn } from "@/lib/utils";
import type {
  WeatherSavedLocation,
  WeatherTemperatureUnit,
} from "@/lib/platform-settings";

function MaterialIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return <span className={cn("material-symbols-outlined", className)}>{name}</span>;
}

export type WeatherSettingsDraft = {
  weatherZipCode: string;
  weatherSavedLocations: WeatherSavedLocation[];
  weatherTemperatureUnit: WeatherTemperatureUnit;
  weatherDailyForecastAlerts: boolean;
  weatherSevereWeatherAlerts: boolean;
  weatherDeliveryTime: string;
};

type WeatherSettingsPanelProps = {
  draft: WeatherSettingsDraft;
  onChange: (patch: Partial<WeatherSettingsDraft>) => void;
  onSave: () => void;
};

function WeatherSectionLabel({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <p className="text-[13px] font-semibold tracking-[0.5px] text-neutral-500 uppercase dark:text-[#888888]">
        {title}
      </p>
      {action}
    </div>
  );
}

function TemperatureUnitToggle({
  value,
  onChange,
}: {
  value: WeatherTemperatureUnit;
  onChange: (unit: WeatherTemperatureUnit) => void;
}) {
  return (
    <div className="grid shrink-0 grid-cols-2 gap-1 rounded-[8px] bg-neutral-100 p-0.5 dark:bg-[#1a1a1a]">
      {(["fahrenheit", "celsius"] as const).map((unit) => {
        const selected = value === unit;

        return (
          <button
            key={unit}
            type="button"
            onClick={() => onChange(unit)}
            className={cn(
              "rounded-[6px] px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
              selected
                ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                : "text-neutral-500 hover:text-neutral-900 dark:text-[#888888] dark:hover:text-white",
            )}
          >
            {unit === "fahrenheit" ? "Fahrenheit" : "Celsius"}
          </button>
        );
      })}
    </div>
  );
}

function WeatherToggle({
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
    <div className="flex items-center justify-between gap-4 py-1">
      <div>
        <p className="text-[15px] font-medium text-neutral-900 dark:text-white">{label}</p>
        {description ? (
          <p className="mt-1 text-[13px] text-neutral-500 dark:text-[#888888]">{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors",
          checked ? "bg-neutral-900 dark:bg-white" : "bg-neutral-300 dark:bg-[#39393d]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-[27px] rounded-full transition-[left,background-color]",
            checked ? "left-[22px] bg-white dark:bg-black" : "left-0.5 bg-white",
          )}
        />
      </button>
    </div>
  );
}

function DeliveryTimePicker({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const parsed = parseDeliveryTime(value);
  const [pendingHours, setPendingHours] = useState(parsed.hours);
  const [pendingMinutes, setPendingMinutes] = useState(parsed.minutes);

  useEffect(() => {
    if (!open) {
      return;
    }

    const next = parseDeliveryTime(value);
    setPendingHours(next.hours);
    setPendingMinutes(next.minutes);
  }, [open, value]);

  function applySelection() {
    onChange(toDeliveryTime(pendingHours, pendingMinutes));
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-2 rounded-[10px] border border-neutral-200 bg-neutral-50 px-3 py-2.5 transition-colors dark:border-[#2a2a2a] dark:bg-[#1a1a1a]",
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:border-neutral-400 hover:bg-neutral-100 dark:hover:border-white/20 dark:hover:bg-[#222222]",
        )}
      >
        <span className="text-[14px] font-medium text-neutral-900 dark:text-white">
          {formatDeliveryTime(value)}
        </span>
        <MaterialIcon name="schedule" className="text-[16px] text-neutral-500 dark:text-[#888888]" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-neutral-200 bg-white text-neutral-900 sm:max-w-sm dark:border-[#262626] dark:bg-[#141414] dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-neutral-900 dark:text-white">Delivery Time</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-500 dark:text-[#888888]">
            Choose when your daily forecast alert should arrive.
          </p>
          <TimeWheelPicker
            hours={pendingHours}
            minutes={pendingMinutes}
            onChange={(hours, minutes) => {
              setPendingHours(hours);
              setPendingMinutes(minutes);
            }}
          />
          <button
            type="button"
            onClick={applySelection}
            className="mt-2 w-full rounded-[10px] bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
          >
            Done
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}

function addNamedLocation(
  locations: WeatherSavedLocation[],
  city: string,
): WeatherSavedLocation[] | null {
  const trimmedCity = city.trim();
  if (!trimmedCity) {
    return null;
  }

  if (
    locations.some(
      (location) => location.city.toLowerCase() === trimmedCity.toLowerCase(),
    )
  ) {
    return locations;
  }

  return [
    ...locations,
    {
      id: `loc-${Date.now()}`,
      city: trimmedCity,
    },
  ];
}

function AddLocationDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (city: string) => void;
}) {
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    if (open) {
      setLocationName("");
    }
  }, [open]);

  function handleSubmit() {
    const trimmedCity = locationName.trim();
    if (!trimmedCity) {
      return;
    }

    onAdd(trimmedCity);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-neutral-200 bg-white text-neutral-900 sm:max-w-sm dark:border-[#262626] dark:bg-[#141414] dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-neutral-900 dark:text-white">Add Location</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-neutral-500 dark:text-[#888888]">
          Enter a name for this saved location.
        </p>
        <input
          value={locationName}
          onChange={(event) => setLocationName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSubmit();
            }
          }}
          placeholder="e.g. Pittsburgh, PA"
          autoFocus
          className="w-full rounded-[10px] border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-base text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-white dark:placeholder:text-[#666666] dark:focus:border-white/20"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-[10px] border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-100 dark:border-[#2a2a2a] dark:text-white dark:hover:bg-white/[0.04]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!locationName.trim()}
            className="flex-1 rounded-[10px] bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
          >
            Add
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function WeatherSettingsPanel({
  draft,
  onChange,
  onSave,
}: WeatherSettingsPanelProps) {
  const [addLocationOpen, setAddLocationOpen] = useState(false);

  function handleAddLocation(city: string) {
    const nextLocations = addNamedLocation(draft.weatherSavedLocations, city);
    if (!nextLocations) {
      return;
    }

    onChange({ weatherSavedLocations: nextLocations });
  }
  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      onChange({ weatherZipCode: draft.weatherZipCode || "94102" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        onChange({ weatherZipCode: draft.weatherZipCode || "94102" });
      },
      () => {
        onChange({ weatherZipCode: draft.weatherZipCode || "94102" });
      },
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm leading-6 text-neutral-500 dark:text-[#888888]">
        Enter your zip code to see local weather on your home screen. Leave blank to hide
        the weather strip.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[14px] bg-neutral-50 p-4 dark:bg-[#141414]">
          <WeatherSectionLabel title="Zip Code" />
          <input
            value={draft.weatherZipCode}
            onChange={(event) => onChange({ weatherZipCode: event.target.value })}
            placeholder="e.g. 94102"
            maxLength={10}
            className="w-full rounded-[10px] border border-neutral-200 bg-white px-4 py-3.5 text-base text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-white dark:placeholder:text-[#666666] dark:focus:border-white/20"
          />
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-[10px] border border-neutral-200 bg-transparent px-4 py-3.5 text-[15px] font-medium text-neutral-900 transition-colors hover:bg-neutral-100 dark:border-[#2a2a2a] dark:text-white dark:hover:bg-white/[0.04]"
          >
            <MaterialIcon name="my_location" className="text-[18px]" />
            Use Current Location
          </button>
        </div>

        <div className="rounded-[14px] bg-neutral-50 p-4 dark:bg-[#141414]">
          <WeatherSectionLabel
            title="Saved Locations"
            action={
              <button
                type="button"
                onClick={() => setAddLocationOpen(true)}
                className="text-[13px] font-medium text-neutral-900 transition-opacity hover:opacity-80 dark:text-white"
              >
                + Add Location
              </button>
            }
          />
          <AddLocationDialog
            open={addLocationOpen}
            onOpenChange={setAddLocationOpen}
            onAdd={handleAddLocation}
          />
          <div className="space-y-2">
            {draft.weatherSavedLocations.map((location) => (
              <div
                key={location.id}
                className="flex items-center gap-3 rounded-[10px] bg-white px-3 py-3 dark:bg-[#1a1a1a]"
              >
                <MaterialIcon
                  name={location.isHome ? "home" : "location_on"}
                  className="text-[18px] text-neutral-500 dark:text-[#888888]"
                />
                <p className="flex-1 text-[15px] text-neutral-900 dark:text-white">
                  {location.city}
                  {location.isHome ? " (Home)" : ""}
                </p>
                <button
                  type="button"
                  aria-label={`Remove ${location.city}`}
                  onClick={() =>
                    onChange({
                      weatherSavedLocations: draft.weatherSavedLocations.filter(
                        (item) => item.id !== location.id,
                      ),
                    })
                  }
                  className="text-neutral-500 transition-colors hover:text-neutral-900 dark:text-[#888888] dark:hover:text-white"
                >
                  <MaterialIcon name="delete" className="text-[18px]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5 rounded-[14px] bg-neutral-50 p-4 dark:bg-[#141414]">
        <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-4 dark:border-[#262626]">
          <p className="text-[15px] font-medium text-neutral-900 dark:text-white">
            Temperature Unit
          </p>
          <TemperatureUnitToggle
            value={draft.weatherTemperatureUnit}
            onChange={(weatherTemperatureUnit) => onChange({ weatherTemperatureUnit })}
          />
        </div>
        <WeatherToggle
          checked={draft.weatherDailyForecastAlerts}
          onChange={(weatherDailyForecastAlerts) => onChange({ weatherDailyForecastAlerts })}
          label="Daily Forecast Alerts"
          description="Morning weather summary."
        />
        <WeatherToggle
          checked={draft.weatherSevereWeatherAlerts}
          onChange={(weatherSevereWeatherAlerts) => onChange({ weatherSevereWeatherAlerts })}
          label="Severe Weather Alerts"
          description="Real-time emergency warnings."
        />
        <div className="flex items-center justify-between gap-4 border-t border-neutral-200 pt-4 dark:border-[#262626]">
          <div>
            <p className="text-[15px] font-medium text-neutral-900 dark:text-white">
              Delivery Time
            </p>
            {!draft.weatherDailyForecastAlerts ? (
              <p className="mt-1 text-[13px] text-neutral-500 dark:text-[#888888]">
                Enable daily forecast alerts to set a delivery time.
              </p>
            ) : null}
          </div>
          <DeliveryTimePicker
            value={draft.weatherDeliveryTime}
            disabled={!draft.weatherDailyForecastAlerts}
            onChange={(weatherDeliveryTime) => onChange({ weatherDeliveryTime })}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onSave}
        className="w-full rounded-[14px] bg-neutral-900 px-4 py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
      >
        Save
      </button>
    </div>
  );
}
