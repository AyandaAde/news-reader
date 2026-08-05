"use client";

import { PlatformBottomNav } from "@/components/platform/platform-bottom-nav";
import { PlatformMiniPlayer } from "@/components/platform/platform-mini-player";
import { PlatformPlaybackProvider } from "@/components/platform/platform-playback-provider";

export function PlatformShell({ children }: { children: React.ReactNode }) {
  return (
    <PlatformPlaybackProvider>
      <main className="relative z-10 mx-auto max-w-[1200px] px-4 pb-32 pt-8 md:px-10">
        {children}
      </main>
      <PlatformMiniPlayer />
      <PlatformBottomNav />
    </PlatformPlaybackProvider>
  );
}
