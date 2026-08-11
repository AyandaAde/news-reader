"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePlatformPlayback } from "@/components/platform/platform-playback-provider";
import { PlatformAskAiChat } from "@/components/platform/platform-ask-ai-chat";
import { PlatformStoriesList } from "@/components/platform/stories-list";
import type { PlatformBriefing } from "@/lib/platform-briefings";
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

function parseBriefingDuration(description: string) {
  const match = description.match(/(\d+)\s*mins?/i);
  if (!match) {
    return "0:00";
  }

  return `${match[1]}:00`;
}

export function PlatformBriefingScreen({ briefing }: { briefing: PlatformBriefing }) {
  const { play, isPlaying, togglePlay, current } = usePlatformPlayback();
  const [progress, setProgress] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [speed, setSpeed] = useState("1x");

  const isActive = current?.id === briefing.id;
  const playing = isActive && isPlaying;
  const duration = parseBriefingDuration(briefing.description);

  const briefDate = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    [],
  );

  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  function handlePlayToggle() {
    if (isActive) {
      togglePlay();
      return;
    }

    play({
      id: briefing.id,
      title: briefing.title,
      subtitle: briefing.description,
      image: briefing.image,
      elapsed: "0:00",
      duration,
    });
  }

  function cycleSpeed() {
    setSpeed((value) => {
      if (value === "1x") return "1.5x";
      if (value === "1.5x") return "2x";
      return "1x";
    });
  }

  return (
    <div className="pb-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList className="text-[#888888]">
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/home" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-[#888888]" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-white">Your Briefings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="-mx-4 mb-10 md:-mx-10">
        <div className="relative min-h-[420px] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
          <Image
            src={briefing.image}
            alt={briefing.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
          />
          <div className="absolute inset-0 bg-black/25 backdrop-blur-md" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end px-5 pb-6 pt-4 text-center md:px-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                {briefing.title}
              </h1>
              <p className="mt-1.5 text-sm text-white/80 md:text-base">{briefDate}</p>

              <div className="mt-5 flex items-center justify-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  className="flex size-9 items-center justify-center text-white transition-colors hover:text-white/80"
                  aria-label="Previous"
                >
                  <MaterialIcon name="skip_previous" className="text-[24px]" />
                </button>
                <button
                  type="button"
                  className="font-mono text-sm text-white transition-colors hover:text-white/80"
                  aria-label="Rewind 10 seconds"
                >
                  -10
                </button>
                <button
                  type="button"
                  onClick={handlePlayToggle}
                  className="flex size-14 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform hover:scale-105 active:scale-95"
                  aria-label={playing ? "Pause" : "Play"}
                >
                  <MaterialIcon
                    name={playing ? "pause" : "play_arrow"}
                    filled
                    className="text-[28px]"
                  />
                </button>
                <button
                  type="button"
                  className="font-mono text-sm text-white transition-colors hover:text-white/80"
                  aria-label="Forward 30 seconds"
                >
                  +30
                </button>
                <button
                  type="button"
                  className="flex size-9 items-center justify-center text-white transition-colors hover:text-white/80"
                  aria-label="Next"
                >
                  <MaterialIcon name="skip_next" className="text-[24px]" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  aria-label="Replay"
                >
                  <MaterialIcon name="replay" className="text-[18px]" />
                </button>
                <button
                  type="button"
                  onClick={cycleSpeed}
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 font-mono text-[11px] text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  aria-label="Playback speed"
                >
                  {speed}
                </button>
                <label className="flex items-center gap-2 text-xs text-white/80 sm:text-sm">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoplay}
                    onClick={() => setAutoplay((value) => !value)}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors",
                      autoplay ? "bg-[#34c759]" : "bg-white/20",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
                        autoplay ? "left-[22px]" : "left-0.5",
                      )}
                    />
                  </button>
                  Autoplay
                </label>
              </div>

              <div className="mt-4 w-full">
                <div className="relative h-1 rounded-full bg-white/30">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-white"
                    style={{ width: `${progress}%` }}
                  />
                  <span
                    className="absolute top-1/2 size-3 rounded-full bg-white shadow-sm"
                    style={{ left: `${progress}%`, transform: "translate(-50%, -50%)" }}
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
                <div className="mt-1.5 flex justify-between font-mono text-[11px] text-white/80">
                  <span>0:00</span>
                  <span>{duration}</span>
                </div>
              </div>

              <p className="mt-3 flex items-center justify-center gap-2 text-xs text-white/80 sm:text-sm">
                <MaterialIcon name="format_list_bulleted" className="text-[16px]" />
                {briefing.emails.length} stories in this briefing
              </p>
            </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold leading-8 text-white">Stories</h2>
          <PlatformAskAiChat context="briefing" briefing={briefing} />
        </div>
        <div className="hide-scrollbar max-h-[280px] overflow-y-auto overscroll-y-contain rounded-2xl bg-[#1a1a1a] px-5 py-2 touch-pan-y md:max-h-[min(420px,50vh)] [-webkit-overflow-scrolling:touch]">
          <PlatformStoriesList
            briefingId={briefing.id}
            stories={briefing.emails}
            variant="panel"
          />
        </div>
      </section>
    </div>
  );
}
