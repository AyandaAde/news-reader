"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { usePlatformPlayback } from "@/components/platform/platform-playback-provider";
import { cn } from "@/lib/utils";

function MaterialIcon({
  name,
  filled,
  className,
}: {
  name: string;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn("material-symbols-outlined", className)}
      style={
        filled
          ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
          : undefined
      }
    >
      {name}
    </span>
  );
}

export function PlatformMiniPlayer() {
  const pathname = usePathname();
  const { current, isPlaying, togglePlay, close } = usePlatformPlayback();
  const [progress, setProgress] = useState(40.4);

  const isBriefingPage = pathname.startsWith("/briefings/");

  if (!current || isBriefingPage) {
    return null;
  }

  const elapsed = current.elapsed ?? "0:00";
  const duration = current.duration ?? "3:28";

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40">
      <div className="platform-player-bar flex flex-col gap-2 rounded-2xl p-2.5">
        <div className="flex items-center gap-2.5">
          <div className="relative size-9 shrink-0 overflow-hidden rounded-lg bg-white/10">
            <Image
              src={current.image}
              alt={current.title}
              fill
              className="object-cover grayscale"
              sizes="36px"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-[12px] font-medium leading-tight tracking-[0.05em] text-white">
              {current.title}
            </p>
            <p className="mt-0.5 truncate font-mono text-[11px] tracking-[0.05em] text-[#888888]">
              {current.subtitle}
            </p>
          </div>

          <div className="flex shrink-0 items-center">
            <button
              type="button"
              className="flex size-8 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 active:scale-90"
              aria-label="Previous"
            >
              <MaterialIcon name="skip_previous" className="text-[20px]" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 active:scale-90"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              <MaterialIcon
                name={isPlaying ? "pause" : "play_arrow"}
                filled={isPlaying}
                className="text-[20px]"
              />
            </button>
            <button
              type="button"
              className="flex size-8 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 active:scale-90"
              aria-label="Next"
            >
              <MaterialIcon name="skip_next" className="text-[20px]" />
            </button>
            <button
              type="button"
              onClick={close}
              className="ml-0.5 flex size-8 cursor-pointer items-center justify-center rounded-full text-[#888888] transition-colors hover:bg-white/10 hover:text-white active:scale-90"
              aria-label="Close player"
            >
              <MaterialIcon name="close" className="text-[18px]" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-7 shrink-0 font-mono text-[10px] tracking-[0.05em] text-[#888888]">
            {elapsed}
          </span>
          <div className="relative h-1 flex-1 rounded-full bg-white/20">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white"
              style={{ width: `${progress}%` }}
            />
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={progress}
              onChange={(event) => setProgress(Number(event.target.value))}
              className="absolute inset-0 size-full cursor-pointer opacity-0"
              aria-label="Seek"
            />
          </div>
          <span className="w-7 shrink-0 text-right font-mono text-[10px] tracking-[0.05em] text-[#888888]">
            {duration}
          </span>
        </div>
      </div>
    </div>
  );
}
