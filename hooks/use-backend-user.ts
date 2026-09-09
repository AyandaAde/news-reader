"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { applyLoginLocationToLocalStorage } from "@/lib/auth/login-location";
import {
  resolveHomeLocation,
  syncHomeLocation,
  syncHomeLocationByCity,
  type UserCoordinates,
} from "@/lib/auth/sync-home-location";
import { saveStoredBackendUser } from "@/lib/backend-user-storage";
import {
  formatNewsReaderUserLocation,
  readSavedHomeLocationLabel,
} from "@/lib/location-label";
import type { NewsReaderUser } from "@/lib/news-reader-api";

type GetUserResponse = {
  user?: NewsReaderUser;
  error?: string;
};

function applyBackendUser(
  payload: NewsReaderUser,
  userId: string,
  setUser: (user: NewsReaderUser) => void,
) {
  setUser(payload);
  saveStoredBackendUser({
    clerkUserId: payload.clerkUserId,
    newsReaderUserId: payload.id,
  });

  const locationLabel = formatNewsReaderUserLocation(payload);
  if (
    locationLabel &&
    payload.locationLatitude != null &&
    payload.locationLongitude != null
  ) {
    applyLoginLocationToLocalStorage(
      {
        ip: "",
        city: payload.locationCity ?? "",
        region: payload.locationRegion ?? "",
        country: payload.locationCountry ?? "",
        label: locationLabel,
        lat: payload.locationLatitude,
        lon: payload.locationLongitude,
      },
      userId,
    );
  }
}

export function useBackendUser() {
  const { isLoaded, isSignedIn, userId } = useAuth({
    treatPendingAsSignedOut: false,
  });
  const [user, setUser] = useState<NewsReaderUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    const response = await fetch("/api/user/get", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | GetUserResponse
        | null;
      throw new Error(payload?.error ?? "Failed to load user");
    }

    const payload = (await response.json()) as GetUserResponse;
    if (!payload.user) {
      throw new Error("Failed to load user");
    }

    return payload.user;
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn || !userId) {
      setUser(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextUser = await fetchUser();
        if (!cancelled) {
          applyBackendUser(nextUser, userId, setUser);
        }
      } catch (fetchError) {
        console.error("Failed to load backend user:", fetchError);
        if (!cancelled) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to load user",
          );
          setUser(null);
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
  }, [fetchUser, isLoaded, isSignedIn, userId]);

  return { user, isLoading, error, refetch: fetchUser, setUser };
}

export function useHomeUser() {
  const { isLoaded, isSignedIn, userId } = useAuth({
    treatPendingAsSignedOut: false,
  });
  const [user, setUser] = useState<NewsReaderUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn || !userId) {
      setUser(null);
      setError(null);
      setIsLoading(false);
      setIsLocating(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      setIsLocating(true);
      setError(null);

      try {
        const payload = await resolveHomeLocation();
        if (cancelled) {
          return;
        }

        if (payload?.user) {
          applyBackendUser(payload.user, userId, setUser);
        } else {
          const response = await fetch("/api/user/get", {
            method: "GET",
            cache: "no-store",
          });

          if (response.ok) {
            const fallback = (await response.json()) as GetUserResponse;
            if (fallback.user && !cancelled) {
              applyBackendUser(fallback.user, userId, setUser);
            }
          }
        }
      } catch (fetchError) {
        console.error("Failed to resolve home location:", fetchError);

        if (!cancelled) {
          try {
            const response = await fetch("/api/user/get", {
              method: "GET",
              cache: "no-store",
            });

            if (response.ok) {
              const fallback = (await response.json()) as GetUserResponse;
              if (fallback.user) {
                applyBackendUser(fallback.user, userId, setUser);
              }
            } else {
              setError("Failed to load user");
              setUser(null);
            }
          } catch {
            setError("Failed to load user");
            setUser(null);
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsLocating(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, userId]);

  const syncLocation = useCallback(
    async (coordinates?: UserCoordinates | null) => {
      if (!userId) {
        return null;
      }

      setIsLocating(true);
      setError(null);

      try {
        const payload = coordinates
          ? await syncHomeLocation(coordinates)
          : await resolveHomeLocation();

        if (payload?.user) {
          applyBackendUser(payload.user, userId, setUser);
          return payload.user;
        }

        return null;
      } catch (syncError) {
        console.error("Failed to sync location:", syncError);
        setError(
          syncError instanceof Error
            ? syncError.message
            : "Failed to sync location",
        );
        return null;
      } finally {
        setIsLocating(false);
      }
    },
    [userId],
  );

  const refetchUser = useCallback(async () => {
    if (!userId) {
      return null;
    }

    try {
      const response = await fetch("/api/user/get", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        return null;
      }

      const payload = (await response.json()) as GetUserResponse;
      if (payload.user) {
        applyBackendUser(payload.user, userId, setUser);
        return payload.user;
      }

      return null;
    } catch (fetchError) {
      console.error("Failed to refetch backend user:", fetchError);
      return null;
    }
  }, [userId]);

  const saveCityLocation = useCallback(
    async (cityId: string) => {
      if (!userId) {
        return null;
      }

      setIsLocating(true);
      setError(null);

      try {
        const payload = await syncHomeLocationByCity(cityId);

        if (payload?.user) {
          applyBackendUser(payload.user, userId, setUser);
          return payload.user;
        }

        return null;
      } catch (saveError) {
        console.error("Failed to save city location:", saveError);
        setError(
          saveError instanceof Error
            ? saveError.message
            : "Failed to save location",
        );
        return null;
      } finally {
        setIsLocating(false);
      }
    },
    [userId],
  );

  return {
    user,
    isLoading,
    isLocating,
    error,
    syncLocation,
    saveCityLocation,
    refetchUser,
  };
}

export function useHomeLocationLabel(
  backendUser: NewsReaderUser | null,
  isLoading: boolean,
) {
  const [savedLocationLabel, setSavedLocationLabel] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setSavedLocationLabel(readSavedHomeLocationLabel());
  }, [backendUser?.id, backendUser?.locationLabel]);

  const backendLocationLabel = formatNewsReaderUserLocation(backendUser);

  if (isLoading) {
    return { label: "Locating...", isLoading: true };
  }

  return {
    label: backendLocationLabel ?? savedLocationLabel,
    isLoading: false,
  };
}
