"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { applyLoginLocationToLocalStorage } from "@/lib/auth/login-location";
import { saveStoredBackendUser } from "@/lib/backend-user-storage";
import type { IpLocation } from "@/lib/ipinfo";

function sessionKey(clerkUserId: string) {
  return `eilo-backend-user-provisioned:${clerkUserId}`;
}

type ProvisionResponse = {
  saved?: boolean;
  created?: boolean;
  userId?: string;
  clerkUserId?: string;
  location?: IpLocation;
};

export function UserProvisionSync() {
  const { isLoaded, isSignedIn, userId } = useAuth({
    treatPendingAsSignedOut: false,
  });

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    if (!userId || sessionStorage.getItem(sessionKey(userId)) === "1") {
      return;
    }

    void (async () => {
      try {
        const response = await fetch("/api/users/provision", {
          method: "POST",
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as ProvisionResponse;
        if (payload.userId && (payload.clerkUserId ?? userId)) {
          saveStoredBackendUser({
            clerkUserId: payload.clerkUserId ?? userId,
            newsReaderUserId: payload.userId,
          });
        }

        if (payload.location) {
          applyLoginLocationToLocalStorage(payload.location, userId);
        }

        sessionStorage.setItem(sessionKey(userId), "1");
      } catch (error) {
        console.error("Failed to provision backend user:", error);
      }
    })();
  }, [isLoaded, isSignedIn, userId]);

  return null;
}
