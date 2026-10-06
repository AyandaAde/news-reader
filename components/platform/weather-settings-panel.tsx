"use client";

import { useEffect, useState, type ReactNode } from "react";

import { useI18n } from "@/components/i18n-provider";
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
import { requestBrowserLocation } from "@/lib/auth/sync-home-location";
import {
  getPopularCities,
  searchCities,
  type CitySearchResult,
} from "@/lib/city-search";
import { cn } from "@/lib/utils";
import type {
  WeatherSavedLocation,
  WeatherTemperatureUnit,
} from "@/lib/platform-settings";
import { MAX_WEATHER_SAVED_LOCATIONS } from "@/lib/platform-settings";

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
  onAddLocation?: (locations: WeatherSavedLocation[]) => void;
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
  const { t } = useI18n();

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
            {unit === "fahrenheit"
              ? t("platform.profile.weatherFahrenheit")
              : t("platform.profile.weatherCelsius")}
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
          "relative h-5 w-9 shrink-0 rounded-full transition-colors",
          checked ? "bg-neutral-900 dark:bg-white" : "bg-neutral-300 dark:bg-[#39393d]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-4 rounded-full transition-[left,background-color]",
            checked ? "left-[18px] bg-white dark:bg-black" : "left-0.5 bg-white",
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
  const { t } = useI18n();
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
            <DialogTitle className="text-neutral-900 dark:text-white">
              {t("platform.profile.weatherDeliveryTime")}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-500 dark:text-[#888888]">
            {t("platform.profile.weatherDeliveryTimeHint")}
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
            {t("platform.profile.done")}
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}

function addNamedLocation(
  locations: WeatherSavedLocation[],
  city: string,
  options?: { prepend?: boolean; isHome?: boolean },
): WeatherSavedLocation[] | null {
  const trimmedCity = city.trim();
  if (!trimmedCity) {
    return null;
  }

  const existing = locations.find(
    (location) => location.city.toLowerCase() === trimmedCity.toLowerCase(),
  );
  const withoutExisting = locations.filter(
    (location) => location.city.toLowerCase() !== trimmedCity.toLowerCase(),
  );

  if (!existing && withoutExisting.length >= MAX_WEATHER_SAVED_LOCATIONS) {
    return null;
  }

  const setAsHome = Boolean(options?.isHome);
  const entry: WeatherSavedLocation = {
    id: existing?.id ?? `loc-${Date.now()}`,
    city: trimmedCity,
    isHome: setAsHome ? true : existing?.isHome,
  };

  const others = setAsHome
    ? withoutExisting.map((location) => ({ ...location, isHome: false }))
    : withoutExisting;

  if (options?.prepend || setAsHome) {
    return [entry, ...others];
  }

  if (existing && !setAsHome) {
    return locations;
  }

  return [...others, entry];
}

function setHomeLocation(
  locations: WeatherSavedLocation[],
  locationId: string,
): WeatherSavedLocation[] {
  const target = locations.find((location) => location.id === locationId);
  if (!target) {
    return locations;
  }

  if (target.isHome && locations[0]?.id === locationId) {
    return locations;
  }

  const others = locations
    .filter((location) => location.id !== locationId)
    .map((location) => ({ ...location, isHome: false }));

  return [{ ...target, isHome: true }, ...others];
}

function AddLocationDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (city: string, options?: { isHome?: boolean }) => void;
}) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setAsHome, setSetAsHome] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setQuery("");
    setResults([]);
    setError(null);
    setSetAsHome(false);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const trimmed = query.trim();
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError(null);

      void (async () => {
        try {
          const next =
            trimmed.length < 2
              ? await getPopularCities()
              : await searchCities(trimmed);
          if (!cancelled) {
            setResults(next);
          }
        } catch {
          if (!cancelled) {
            setError(
              trimmed.length < 2
                ? t("platform.profile.weatherCitiesLoadError")
                : t("platform.profile.weatherCitiesSearchError"),
            );
            setResults([]);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      })();
    }, trimmed.length < 2 ? 0 : 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [open, query]);

  function handleSelect(result: CitySearchResult) {
    onAdd(result.label, { isHome: setAsHome });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-neutral-200 bg-white text-neutral-900 sm:max-w-md dark:border-[#262626] dark:bg-[#141414] dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-neutral-900 dark:text-white">
            {t("platform.profile.weatherAddLocationTitle")}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-neutral-500 dark:text-[#888888]">
          {t("platform.profile.weatherAddLocationDesc")}
        </p>
        <div className="relative">
          <MaterialIcon
            name="search"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[18px] text-neutral-400 dark:text-[#666666]"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("platform.profile.weatherSearchCitiesPlaceholder")}
            autoFocus
            className="w-full rounded-[10px] border border-neutral-200 bg-neutral-50 py-3.5 pr-4 pl-10 text-base text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-white dark:placeholder:text-[#666666] dark:focus:border-white/20"
          />
        </div>

        <button
          type="button"
          onClick={() => setSetAsHome((current) => !current)}
          className="flex w-full items-center justify-between gap-3 rounded-[10px] border border-neutral-200 bg-neutral-50 px-4 py-3 text-left transition-colors hover:bg-neutral-100 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:hover:bg-white/[0.04]"
        >
          <span>
            <span className="block text-[15px] font-medium text-neutral-900 dark:text-white">
              {t("platform.profile.weatherSetHomeCity")}
            </span>
            <span className="mt-0.5 block text-[12px] text-neutral-500 dark:text-[#888888]">
              {t("platform.profile.weatherSetHomeCityHint")}
            </span>
          </span>
          <span
            role="switch"
            aria-checked={setAsHome}
            className={cn(
              "relative h-5 w-9 shrink-0 rounded-full transition-colors",
              setAsHome ? "bg-neutral-900 dark:bg-white" : "bg-neutral-300 dark:bg-[#39393d]",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-4 rounded-full transition-[left,background-color]",
                setAsHome ? "left-[18px] bg-white dark:bg-black" : "left-0.5 bg-white",
              )}
            />
          </span>
        </button>

        <div className="hide-scrollbar max-h-64 overflow-y-auto rounded-[10px] border border-neutral-200 dark:border-[#2a2a2a]">
          {loading ? (
            <p className="px-4 py-6 text-sm text-neutral-500 dark:text-[#888888]">
              {t("platform.profile.weatherSearching")}
            </p>
          ) : error ? (
            <p className="px-4 py-6 text-sm text-neutral-500 dark:text-[#888888]">{error}</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-6 text-sm text-neutral-500 dark:text-[#888888]">
              {query.trim().length < 2
                ? t("platform.profile.weatherPopularCitiesEmpty")
                : t("platform.profile.weatherNoCitiesMatch")}
            </p>
          ) : (
            results.map((result) => (
              <button
                key={result.id}
                type="button"
                onClick={() => handleSelect(result)}
                className="flex w-full items-start gap-3 border-b border-neutral-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-neutral-50 dark:border-[#1f1f1f] dark:hover:bg-white/[0.04]"
              >
                <MaterialIcon
                  name="location_on"
                  className="mt-0.5 text-[18px] text-neutral-400 dark:text-[#666666]"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] text-neutral-900 dark:text-white">
                    {result.label}
                  </span>
                  {result.country ? (
                    <span className="mt-0.5 block truncate text-[12px] text-neutral-500 dark:text-[#888888]">
                      {result.country}
                    </span>
                  ) : null}
                </span>
              </button>
            ))
          )}
        </div>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="w-full rounded-[10px] border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-100 dark:border-[#2a2a2a] dark:text-white dark:hover:bg-white/[0.04]"
        >
          {t("platform.profile.cancel")}
        </button>
      </DialogContent>
    </Dialog>
  );
}

export function WeatherSettingsPanel({
  draft,
  onChange,
  onSave,
  onAddLocation,
}: WeatherSettingsPanelProps) {
  const { t } = useI18n();
  const [addLocationOpen, setAddLocationOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const atLocationLimit =
    draft.weatherSavedLocations.length >= MAX_WEATHER_SAVED_LOCATIONS;
  const cityValue = draft.weatherSavedLocations[0]?.city ?? "";

  function handleAddLocation(
    city: string,
    options?: { prepend?: boolean; isHome?: boolean },
  ) {
    const nextLocations = addNamedLocation(draft.weatherSavedLocations, city, {
      prepend: options?.prepend || options?.isHome,
      isHome: options?.isHome,
    });
    if (!nextLocations) {
      return;
    }

    onChange({ weatherSavedLocations: nextLocations });
    onAddLocation?.(nextLocations);
  }

  function handleSetHomeLocation(locationId: string) {
    const nextLocations = setHomeLocation(
      draft.weatherSavedLocations,
      locationId,
    );
    if (nextLocations === draft.weatherSavedLocations) {
      return;
    }

    onChange({ weatherSavedLocations: nextLocations });
    onAddLocation?.(nextLocations);
  }

  async function handleUseCurrentLocation() {
    if (atLocationLimit || locating) {
      return;
    }

    setLocationError(null);
    setLocating(true);

    try {
      const coordinates = await requestBrowserLocation();
      if (!coordinates) {
        setLocationError(t("platform.profile.weatherLocationPermissionError"));
        return;
      }

      const response = await fetch(
        `/api/locations/reverse?lat=${encodeURIComponent(String(coordinates.lat))}&lon=${encodeURIComponent(String(coordinates.lon))}`,
        { cache: "no-store" },
      );
      const payload = (await response.json().catch(() => null)) as {
        label?: string;
        error?: string;
      } | null;

      if (!response.ok || !payload?.label?.trim()) {
        setLocationError(
          payload?.error ?? t("platform.profile.weatherResolveCityError"),
        );
        return;
      }

      handleAddLocation(payload.label.trim(), { prepend: true, isHome: true });
    } catch {
      setLocationError(t("platform.profile.weatherCurrentLocationError"));
    } finally {
      setLocating(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm leading-6 text-neutral-500 dark:text-[#888888]">
        {t("platform.profile.weatherIntro", { max: MAX_WEATHER_SAVED_LOCATIONS })}
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[14px] bg-neutral-50 p-4 dark:bg-[#141414]">
          <WeatherSectionLabel title={t("platform.profile.weatherCity")} />
          <input
            value={cityValue}
            readOnly
            placeholder={t("platform.profile.weatherCityPlaceholder")}
            className="w-full rounded-[10px] border border-neutral-200 bg-white px-4 py-3.5 text-base text-neutral-900 outline-none placeholder:text-neutral-400 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-white dark:placeholder:text-[#666666]"
          />
          <button
            type="button"
            onClick={() => void handleUseCurrentLocation()}
            disabled={atLocationLimit || locating}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-[10px] border border-neutral-200 bg-transparent px-4 py-3.5 text-[15px] font-medium text-neutral-900 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent dark:border-[#2a2a2a] dark:text-white dark:hover:bg-white/[0.04] dark:disabled:hover:bg-transparent"
          >
            <MaterialIcon name="my_location" className="text-[18px]" />
            {locating
              ? t("platform.profile.weatherLocating")
              : t("platform.profile.weatherUseCurrentLocation")}
          </button>
          {atLocationLimit ? (
            <p className="mt-2 text-[12px] text-neutral-500 dark:text-[#888888]">
              {t("platform.profile.weatherRemoveCityHint")}
            </p>
          ) : null}
          {locationError ? (
            <p className="mt-2 text-[12px] text-red-600 dark:text-red-400">{locationError}</p>
          ) : null}
        </div>

        <div className="rounded-[14px] bg-neutral-50 p-4 dark:bg-[#141414]">
          <WeatherSectionLabel
            title={t("platform.profile.weatherSavedLocations")}
            action={
              atLocationLimit ? (
                <span className="text-[13px] text-neutral-400 dark:text-[#666666]">
                  {t("platform.profile.weatherMaxBadge", {
                    max: MAX_WEATHER_SAVED_LOCATIONS,
                  })}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddLocationOpen(true)}
                  className="text-[13px] font-medium text-neutral-900 transition-opacity hover:opacity-80 dark:text-white"
                >
                  {t("platform.profile.weatherAddLocationButton")}
                </button>
              )
            }
          />
          <AddLocationDialog
            open={addLocationOpen}
            onOpenChange={setAddLocationOpen}
            onAdd={handleAddLocation}
          />
          {atLocationLimit && draft.weatherSavedLocations.length > 0 ? (
            <p className="mb-2 text-[12px] text-neutral-500 dark:text-[#888888]">
              {t("platform.profile.weatherMaxLocations", {
                max: MAX_WEATHER_SAVED_LOCATIONS,
              })}
            </p>
          ) : null}
          <div className="space-y-2">
            {draft.weatherSavedLocations.map((location) => (
              <div
                key={location.id}
                className="flex items-center gap-1 rounded-[10px] bg-white pr-2 dark:bg-[#1a1a1a]"
              >
                <button
                  type="button"
                  onClick={() => handleSetHomeLocation(location.id)}
                  aria-label={
                    location.isHome
                      ? t("platform.profile.weatherHomeCityLabel", {
                          city: location.city,
                        })
                      : t("platform.profile.weatherSetHomeAria", {
                          city: location.city,
                        })
                  }
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-[10px] px-3 py-3 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-white/[0.04]"
                >
                  <MaterialIcon
                    name={location.isHome ? "home" : "location_on"}
                    className="text-[18px] text-neutral-500 dark:text-[#888888]"
                  />
                  <p className="flex-1 truncate text-[15px] text-neutral-900 dark:text-white">
                    {location.city}
                    {location.isHome
                      ? ` ${t("platform.profile.weatherHomeSuffix")}`
                      : ""}
                  </p>
                </button>
                <button
                  type="button"
                  aria-label={t("platform.profile.weatherRemoveLocationAria", {
                    city: location.city,
                  })}
                  onClick={() =>
                    onChange({
                      weatherSavedLocations: draft.weatherSavedLocations.filter(
                        (item) => item.id !== location.id,
                      ),
                    })
                  }
                  className="shrink-0 rounded-md p-2 text-neutral-500 transition-colors hover:text-neutral-900 dark:text-[#888888] dark:hover:text-white"
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
            {t("platform.profile.weatherTemperatureUnit")}
          </p>
          <TemperatureUnitToggle
            value={draft.weatherTemperatureUnit}
            onChange={(weatherTemperatureUnit) => onChange({ weatherTemperatureUnit })}
          />
        </div>
        <WeatherToggle
          checked={draft.weatherDailyForecastAlerts}
          onChange={(weatherDailyForecastAlerts) => onChange({ weatherDailyForecastAlerts })}
          label={t("platform.profile.weatherDailyForecastAlerts")}
          description={t("platform.profile.weatherDailyForecastDesc")}
        />
        <WeatherToggle
          checked={draft.weatherSevereWeatherAlerts}
          onChange={(weatherSevereWeatherAlerts) => onChange({ weatherSevereWeatherAlerts })}
          label={t("platform.profile.weatherSevereAlerts")}
          description={t("platform.profile.weatherSevereAlertsDesc")}
        />
        <div className="flex items-center justify-between gap-4 border-t border-neutral-200 pt-4 dark:border-[#262626]">
          <div>
            <p className="text-[15px] font-medium text-neutral-900 dark:text-white">
              {t("platform.profile.weatherDeliveryTime")}
            </p>
            {!draft.weatherDailyForecastAlerts ? (
              <p className="mt-1 text-[13px] text-neutral-500 dark:text-[#888888]">
                {t("platform.profile.weatherDeliveryTimeDisabledHint")}
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
        {t("platform.profile.save")}
      </button>
    </div>
  );
}
