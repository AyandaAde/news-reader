"use client";

import Image from "next/image";
import {
  Bell,
  Globe,
  Headphones,
  LockOpen,
  Play,
  Podcast,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { usePlatformPlayback } from "@/components/platform/platform-playback-provider";
import { cn } from "@/lib/utils";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCsiqDWSHRRfolUgLijT6oSxxsMOPhjj8jlVRxmmcbWyb_xHumnGjEk4nAxYKq9ll8J8DiXHX8w4VZ5_LFN8b44-s94Bwd5UmVTA_tyIZI5j2OY96DW3jyPxb2hgfNgh-BnXNOEcrQF1_VB_IAkoxbBs0_zhgxOBlh1MTKL0larS1wFL3Zug10Xc9KExcZRmyewD8VTOKY8WSp5G1970vodDcdn0PPTFxAWrYsqFyUtq6D4KgCnFxFI";

const ACOUSTIC_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDpEUXkz72tSMUpwKdxBAr9verPIdpILS7J6_EhPTD2eJn-N1PHEIijkkksUkwjcm2349N8rrvGJemp0TbayUYZFswJHyXBZKt897B-fTu3pbx2fbpvGitzPvInj8yajSpi47y9Pqjhx16R4uYYe5SPwxrON53CFZSsu68UPuxtUxlnNRkXakcKLSGshr1rWH4imLRDcjX3qPtIbZB2HjNQ0D8PntVpZZoqhCZwb3eWqV5XnZPfYec7";

const liveStations = [
  {
    id: "tech-today",
    title: "Tech Today",
    description: "Silicon Valley updates & hardware reviews",
    icon: Podcast,
    iconGradient: "from-blue-900/40 to-indigo-900/40",
    status: "live" as const,
    meta: "Current: AI Ethics",
    metaSub: "42:15",
    image: HERO_IMAGE,
  },
  {
    id: "world-report",
    title: "World Report",
    description: "Breaking global news and field reporting",
    icon: Globe,
    iconGradient: "from-orange-900/40 to-red-900/40",
    status: "live" as const,
    meta: "Host: Sarah Chen",
    metaSub: "812 listeners",
    image: HERO_IMAGE,
  },
  {
    id: "market-watch",
    title: "Market Watch",
    description: "Live analysis of global financial markets",
    icon: TrendingUp,
    iconGradient: "from-emerald-900/40 to-teal-900/40",
    status: "upcoming" as const,
    meta: "Market: Nasdaq Open",
    metaSub: "2,401 listeners",
    image: HERO_IMAGE,
  },
] as const;

const featuredStations = [
  {
    id: "midnight-jazz-loft",
    title: "Midnight Jazz Loft",
    description: "Continuous high-fidelity jazz curation",
    badge: "Curated Noir",
    image: HERO_IMAGE,
    actionIcon: Play,
    iconFilled: true,
    grayscale: false,
  },
  {
    id: "acoustic-sessions",
    title: "The Acoustic Sessions",
    description: "Pure audio storytelling with no distractions",
    badge: "Exclusive",
    image: ACOUSTIC_IMAGE,
    actionIcon: LockOpen,
    iconFilled: false,
    grayscale: true,
  },
] as const;

function LiveBadge({
  pulse = true,
  compact = false,
}: {
  pulse?: boolean;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "rounded-full border border-[#ffb4ab]/30 bg-[#ffb4ab]/10 font-mono text-[10px] tracking-[0.2em] text-[#ffb4ab]",
        compact ? "px-3 py-1" : "px-4 py-1.5",
        pulse && "platform-live-pulse",
      )}
    >
      LIVE
    </span>
  );
}

function StationIcon({
  icon: Icon,
  className,
  filled = false,
}: {
  icon: LucideIcon;
  className?: string;
  filled?: boolean;
}) {
  return (
    <Icon
      className={cn(filled && "fill-current", className)}
      strokeWidth={1.5}
      aria-hidden
    />
  );
}

export function PlatformLiveScreen() {
  const { play } = usePlatformPlayback();

  function playStation(
    id: string,
    title: string,
    subtitle: string,
    image: string,
  ) {
    play({
      id,
      title,
      subtitle,
      image,
      elapsed: "0:00",
      duration: "Live",
    });
  }

  return (
    <>
      <div className="platform-ambient-bg pointer-events-none fixed inset-0 -z-10" aria-hidden />

      <div className="mb-12 md:mb-16">
        <h1 className="mb-6 text-5xl font-light tracking-tight text-white md:text-6xl">
          Live
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-[#c8c6c5]">
          Experience real-time news, market insights, and deep-dive discussions
          from the world&apos;s leading audio curators.
        </p>
      </div>

      <section className="group relative mb-16 aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl sm:aspect-[16/9] md:mb-24 md:aspect-[21/9]">
        <button
          type="button"
          className="absolute inset-0 z-20"
          aria-label="Play Tech Today live broadcast"
          onClick={() =>
            playStation(
              "tech-today",
              "Tech Today",
              "Live Broadcast",
              HERO_IMAGE,
            )
          }
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          src={HERO_IMAGE}
          className="absolute inset-0 size-full object-cover opacity-60 transition-transform duration-1000 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end p-5 pb-8 text-center sm:justify-center sm:p-6 md:p-8">
          <div className="platform-glass-panel mb-4 inline-flex items-center gap-2 rounded-full border-white/20 px-4 py-1.5 sm:mb-8 sm:gap-3 sm:px-5 sm:py-2">
            <span className="platform-live-pulse size-2 rounded-full bg-[#ffb4ab] shadow-[0_0_8px_rgba(255,180,171,0.8)]" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white sm:text-[11px]">
              Live Broadcast
            </span>
          </div>
          <h2 className="mb-2 text-4xl font-medium text-white transition-all duration-700 ease-out group-hover:tracking-wider sm:mb-4 sm:text-5xl md:text-7xl">
            Tech Today
          </h2>
          <p className="mb-6 max-w-xl text-base font-light text-[#c8c6c5] sm:mb-10 sm:text-xl md:text-2xl">
            Live tech news & discussion with leading industry experts
          </p>
          <div className="platform-glass-panel flex max-w-full items-center gap-3 rounded-full px-4 py-2 sm:gap-6 sm:px-6 sm:py-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-white/10 transition-colors duration-300 group-hover:bg-white sm:size-9">
              <Headphones className="size-4 text-white transition-colors duration-300 group-hover:text-black sm:size-[18px]" strokeWidth={1.5} aria-hidden />
            </div>
            <div className="hidden h-4 w-px bg-white/20 sm:block" />
            <span className="font-mono text-xs tracking-wider text-white sm:text-sm">
              1,247{" "}
              <span className="text-[#c8c6c5]/70">LISTENING</span>
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 z-10 h-0.5 w-full bg-white/10">
          <div className="h-full w-2/3 bg-gradient-to-r from-white to-white/50 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </div>
      </section>

      <section>
        <h3 className="mb-6 border-b border-white/5 pb-4 text-3xl font-light text-white">
          Active Stations
        </h3>

        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {liveStations.map((station) => (
            <div
              key={station.id}
              className="platform-glass-panel flex items-center gap-3 rounded-2xl p-3.5 sm:justify-between sm:gap-4 sm:p-6"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-8">
                <div
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br text-white shadow-2xl sm:size-14 md:size-16",
                    station.iconGradient,
                  )}
                >
                  <StationIcon
                    icon={station.icon}
                    className="size-6 sm:size-7"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="mb-0.5 text-lg text-white/90 sm:mb-1 sm:text-xl md:text-2xl">
                    {station.title}
                  </h4>
                  <p className="line-clamp-2 text-sm leading-snug text-[#c8c6c5]/70 sm:truncate sm:text-base">
                    {station.description}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-8">
                <div className="hidden flex-col items-end md:flex">
                  <span className="font-mono text-sm tracking-wide text-white">
                    {station.meta}
                  </span>
                  <span className="mt-1 text-xs text-[#c8c6c5]/50">
                    {station.metaSub}
                  </span>
                </div>

                {station.status === "live" ? (
                  <LiveBadge compact />
                ) : (
                  <span className="whitespace-nowrap rounded-full border border-white/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[#c8c6c5] sm:px-4 sm:py-1.5 sm:text-[10px] sm:tracking-[0.2em]">
                    Starts in 5m
                  </span>
                )}

                {station.status === "live" ? (
                  <button
                    type="button"
                    onClick={() =>
                      playStation(
                        station.id,
                        station.title,
                        "Live Broadcast",
                        station.image,
                      )
                    }
                    className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10 text-white transition-all duration-300 hover:bg-white hover:text-black active:scale-95 sm:size-12 md:size-14"
                    aria-label={`Play ${station.title}`}
                  >
                    <Play className="size-5 fill-current sm:size-6" strokeWidth={1.5} aria-hidden />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#c8c6c5] transition-all duration-300 hover:bg-white hover:text-black active:scale-95 sm:size-12 md:size-14"
                    aria-label={`Notify me for ${station.title}`}
                  >
                    <Bell className="size-5 sm:size-6" strokeWidth={1.5} aria-hidden />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 md:mt-24">
        <h3 className="mb-6 border-b border-white/5 pb-4 text-3xl font-light text-white">
          Recommended Podcasts
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {featuredStations.map((station) => (
            <div
              key={station.id}
              className="group relative h-72 cursor-pointer overflow-hidden rounded-2xl border border-white/10 sm:h-80"
            >
              <Image
                src={station.image}
                alt={station.title}
                fill
                className={cn(
                  "object-cover transition-transform duration-1000 ease-out group-hover:scale-105",
                  station.grayscale && "grayscale group-hover:grayscale-0",
                )}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 flex w-full items-end justify-between p-6 sm:p-8">
                <div className="min-w-0 pr-4">
                  <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-md">
                    {station.badge}
                  </span>
                  <h5 className="mb-2 text-2xl font-light text-white sm:text-3xl">
                    {station.title}
                  </h5>
                  <p className="text-sm font-light text-[#c8c6c5]/60">
                    {station.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    playStation(
                      station.id,
                      station.title,
                      station.badge,
                      station.image,
                    )
                  }
                  className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-transparent text-white transition-all duration-300 group-hover:bg-white group-hover:text-black"
                  aria-label={`Play ${station.title}`}
                >
                  <StationIcon
                    icon={station.actionIcon}
                    filled={station.iconFilled}
                    className="size-5"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
