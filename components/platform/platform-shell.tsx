"use client";

import { usePathname } from "next/navigation";
import { PlatformMiniPlayer } from "@/components/platform/platform-mini-player";
import {
  PlatformPlaybackProvider,
  usePlatformPlayback,
} from "@/components/platform/platform-playback-provider";
import { PlatformSidebar } from "@/components/platform/platform-sidebar";
import { cn } from "@/lib/utils";

function PlatformShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { current } = usePlatformPlayback();
  const hasMiniPlayer = Boolean(current) && !pathname.startsWith("/briefings/");

  return (
    <div className="flex h-svh w-full flex-row overflow-hidden">
      <PlatformSidebar />
      <div className="relative flex h-svh min-w-0 flex-1 flex-col overflow-hidden">
        <main
          className={cn(
            "hide-scrollbar relative z-10 mx-auto min-h-0 w-full max-w-[1200px] flex-1 overflow-y-auto overscroll-y-contain px-4 pt-4 md:px-10 md:pt-6 [-webkit-overflow-scrolling:touch]",
            hasMiniPlayer ? "pb-24" : "pb-6",
          )}
        >
          {children}
        </main>
        <PlatformMiniPlayer />
      </div>
    </div>
  );
}

export function PlatformShell({ children }: { children: React.ReactNode }) {
  return (
    <PlatformPlaybackProvider>
      <PlatformShellContent>{children}</PlatformShellContent>
    </PlatformPlaybackProvider>
  );
}
