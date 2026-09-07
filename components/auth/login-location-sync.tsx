"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { saveLoginLocation } from "@/lib/auth/save-login-location";

export function LoginLocationSync() {
  const { isLoaded, isSignedIn, userId } = useAuth({
    treatPendingAsSignedOut: false,
  });

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    void saveLoginLocation(userId);
  }, [isLoaded, isSignedIn, userId]);

  return null;
}
