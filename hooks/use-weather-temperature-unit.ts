"use client";

import { useCallback, useEffect, useState } from "react";
import {
  loadPlatformSettings,
  savePlatformSettings,
  SETTINGS_STORAGE_KEY,
  type WeatherTemperatureUnit,
} from "@/lib/platform-settings";

export function useWeatherTemperatureUnit() {
  const [unit, setUnit] = useState<WeatherTemperatureUnit>("fahrenheit");

  useEffect(() => {
    setUnit(loadPlatformSettings().weatherTemperatureUnit);

    function syncFromSettings() {
      setUnit(loadPlatformSettings().weatherTemperatureUnit);
    }

    function onStorage(event: StorageEvent) {
      if (event.key === SETTINGS_STORAGE_KEY) {
        syncFromSettings();
      }
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener("eilo-platform-settings-changed", syncFromSettings);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("eilo-platform-settings-changed", syncFromSettings);
    };
  }, []);

  const setTemperatureUnit = useCallback((next: WeatherTemperatureUnit) => {
    setUnit(next);
    savePlatformSettings({
      ...loadPlatformSettings(),
      weatherTemperatureUnit: next,
    });
  }, []);

  const toggleTemperatureUnit = useCallback(() => {
    setUnit((current) => {
      const next = current === "fahrenheit" ? "celsius" : "fahrenheit";
      savePlatformSettings({
        ...loadPlatformSettings(),
        weatherTemperatureUnit: next,
      });
      return next;
    });
  }, []);

  return { unit, setTemperatureUnit, toggleTemperatureUnit };
}
