"use client";

import { useEffect, useState } from "react";
import type { NewsReaderWeather } from "@/lib/news-reader-api";

type WeatherResponse = {
  weather?: NewsReaderWeather;
  error?: string;
};

export function useHomeWeather(enabled: boolean) {
  const [weather, setWeather] = useState<NewsReaderWeather | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setWeather(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/weather", {
          method: "GET",
          cache: "no-store",
        });

        const payload = (await response.json().catch(() => null)) as
          | WeatherResponse
          | null;

        if (!response.ok) {
          throw new Error(payload?.error ?? "Failed to load weather");
        }

        if (!cancelled) {
          setWeather(payload?.weather ?? null);
        }
      } catch (fetchError) {
        console.error("Failed to load home weather:", fetchError);
        if (!cancelled) {
          setWeather(null);
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to load weather",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { weather, isLoading, error };
}
