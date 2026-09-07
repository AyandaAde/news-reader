"use client";

import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { UserProvisionSync } from "@/components/auth/user-provision-sync";
import { LoginLocationSync } from "@/components/auth/login-location-sync";
import { PlatformShell } from "@/components/platform/platform-shell";
import { googleSans } from "@/lib/fonts/google-sans";
import { cn } from "@/lib/utils";

const AUTH_ROUTES = ["/sign-in", "/sign-up", "/sso-callback"];

const PLATFORM_ROUTE_PREFIXES = [
  "/home",
  "/discover",
  "/live",
  "/profile",
  "/briefings",
  "/search",
  "/subscription",
  "/manage-account",
];

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isPlatformRoute(pathname: string) {
  return PLATFORM_ROUTE_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function AuthenticatedAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth({ treatPendingAsSignedOut: false });
  const onAuthRoute = isAuthRoute(pathname);

  if (onAuthRoute) {
    return children;
  }

  if (!isLoaded) {
    if (isPlatformRoute(pathname)) {
      return (
        <div className="flex min-h-svh items-center justify-center bg-black text-[#888888]">
          <Loader2 className="size-5 animate-spin" />
        </div>
      );
    }

    return children;
  }

  if (!isSignedIn) {
    return children;
  }

  return (
    <div
      className={cn(
        "platform-shell min-h-svh overflow-x-hidden bg-black text-[#e2e2e2] antialiased",
        googleSans.variable,
        googleSans.className,
      )}
    >
      <UserProvisionSync />
      <LoginLocationSync />
      <PlatformShell>{children}</PlatformShell>
    </div>
  );
}
