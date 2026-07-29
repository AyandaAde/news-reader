"use client";

import Image from "next/image";
import { Pause } from "lucide-react";

export function PlatformMiniPlayer() {
  return (
    <div className="fixed bottom-24 left-4 right-4 z-40">
      <div className="platform-glass flex h-14 items-center gap-3 rounded-full pl-2 pr-4 shadow-2xl">
        <div className="relative size-10 overflow-hidden rounded-full border border-[#262626] bg-[#2a2a2a]">
          <Image
            src="/images/headphones.png"
            alt="Now playing"
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-[12px] font-medium leading-tight tracking-[0.05em] text-white">
            Morning Brief: The Future of AI
          </p>
          <div className="mt-1 h-[2px] w-full overflow-hidden rounded-full bg-[#262626]">
            <div className="h-full w-1/3 bg-white" />
          </div>
        </div>
        <button
          type="button"
          className="flex size-8 items-center justify-center active:scale-90"
          aria-label="Pause"
        >
          <Pause className="size-5 fill-white text-white" />
        </button>
      </div>
    </div>
  );
}
