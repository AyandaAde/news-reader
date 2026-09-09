"use client";

import { useEffect, useState } from "react";
import type { NewsReaderPodcast } from "@/lib/news-reader-api";

type PodcastsResponse = {
  podcasts?: NewsReaderPodcast[];
  error?: string;
};

export function useHomePodcasts(enabled: boolean) {
  const [podcasts, setPodcasts] = useState<NewsReaderPodcast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setPodcasts([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/podcasts", {
          method: "GET",
          cache: "no-store",
        });

        const payload = (await response.json().catch(() => null)) as
          | PodcastsResponse
          | null;

        if (!response.ok) {
          throw new Error(payload?.error ?? "Failed to load podcasts");
        }

        if (!cancelled) {
          setPodcasts(payload?.podcasts ?? []);
        }
      } catch (fetchError) {
        console.error("Failed to load home podcasts:", fetchError);
        if (!cancelled) {
          setPodcasts([]);
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to load podcasts",
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

  return { podcasts, isLoading, error };
}
