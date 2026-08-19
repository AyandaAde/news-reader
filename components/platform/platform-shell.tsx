"use client";

import { usePathname } from "next/navigation";
import { PlatformBottomNav } from "@/components/platform/platform-bottom-nav";
import { PlatformMiniPlayer } from "@/components/platform/platform-mini-player";
import { PlatformPlaybackProvider } from "@/components/platform/platform-playback-provider";
import { cn } from "@/lib/utils";

const CHROMELESS_ROUTES = new Set<string>();

export function PlatformShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = CHROMELESS_ROUTES.has(pathname);

  return (
    <PlatformPlaybackProvider>
      <main
        className={cn(
          "relative z-10 mx-auto min-h-0 w-full max-w-[1200px] px-4 pt-4 md:px-10 md:pt-6",
          hideChrome ? "pb-8" : "pb-32",
        )}
      >
        {children}
      </main>
      {!hideChrome ? <PlatformMiniPlayer /> : null}
      {!hideChrome ? <PlatformBottomNav /> : null}
    </PlatformPlaybackProvider>
  );
}
