"use client";

import Image from "next/image";
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
    icon: "podcasts",
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
    icon: "public",
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
    icon: "trending_up",
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
    actionIcon: "play_arrow",
    grayscale: false,
  },
  {
    id: "acoustic-sessions",
    title: "The Acoustic Sessions",
    description: "Pure audio storytelling with no distractions",
    badge: "Exclusive",
    image: ACOUSTIC_IMAGE,
    actionIcon: "lock_open",
    grayscale: true,
  },
] as const;

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

function LiveBadge({ pulse = true }: { pulse?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full border border-[#ffb4ab]/30 bg-[#ffb4ab]/10 px-4 py-1.5 font-mono text-[10px] tracking-[0.2em] text-[#ffb4ab]",
        pulse && "platform-live-pulse",
      )}
    >
      LIVE
    </span>
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

      <section className="group relative mb-16 aspect-[16/9] cursor-pointer overflow-hidden rounded-2xl md:mb-24 md:aspect-[21/9]">
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

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center md:p-8">
          <div className="platform-glass-panel mb-8 inline-flex items-center gap-3 rounded-full border-white/20 px-5 py-2">
            <span className="platform-live-pulse size-2 rounded-full bg-[#ffb4ab] shadow-[0_0_8px_rgba(255,180,171,0.8)]" />
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-white">
              Live Broadcast
            </span>
          </div>
          <h2 className="mb-4 text-5xl font-medium text-white transition-all duration-700 ease-out group-hover:tracking-wider md:text-7xl">
            Tech Today
          </h2>
          <p className="mb-10 max-w-xl text-xl font-light text-[#c8c6c5] md:text-2xl">
            Live tech news & discussion with leading industry experts
          </p>
          <div className="platform-glass-panel flex items-center gap-6 rounded-full px-6 py-3">
            <div className="flex -space-x-3">
              {["S", "M", "J"].map((initial, index) => (
                <div
                  key={initial}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 border-[#181818] text-[10px] font-medium text-white shadow-lg",
                    index === 0 && "bg-gradient-to-br from-blue-500 to-indigo-600",
                    index === 1 && "bg-gradient-to-br from-red-400 to-pink-600",
                    index === 2 && "bg-gradient-to-br from-green-400 to-emerald-600",
                  )}
                >
                  {initial}
                </div>
              ))}
            </div>
            <div className="h-4 w-px bg-white/20" />
            <span className="font-mono text-sm tracking-wider text-white">
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

        <div className="grid grid-cols-1 gap-4">
          {liveStations.map((station) => (
            <div
              key={station.id}
              className="platform-glass-panel flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-8">
                <div
                  className={cn(
                    "flex size-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br text-white shadow-2xl sm:size-16",
                    station.iconGradient,
                  )}
                >
                  <MaterialIcon name={station.icon} className="text-3xl font-light" />
                </div>
                <div className="min-w-0">
                  <h4 className="mb-1 truncate text-xl text-white/90 sm:text-2xl">
                    {station.title}
                  </h4>
                  <p className="truncate text-[#c8c6c5]/70">{station.description}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end sm:gap-8">
                <div className="hidden flex-col items-end md:flex">
                  <span className="font-mono text-sm tracking-wide text-white">
                    {station.meta}
                  </span>
                  <span className="mt-1 text-xs text-[#c8c6c5]/50">
                    {station.metaSub}
                  </span>
                </div>

                {station.status === "live" ? (
                  <LiveBadge />
                ) : (
                  <span className="rounded-full border border-white/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#c8c6c5]">
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
                    className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/10 transition-all duration-300 hover:border-white/30 hover:bg-white hover:text-black active:scale-95 sm:size-14"
                    aria-label={`Play ${station.title}`}
                  >
                    <MaterialIcon name="play_arrow" filled className="text-2xl" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#c8c6c5] transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-95 sm:size-14"
                    aria-label={`Notify me for ${station.title}`}
                  >
                    <MaterialIcon name="notifications" className="text-2xl" />
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
                  className="platform-glass-panel flex size-12 shrink-0 items-center justify-center rounded-full text-white transition-all duration-300 group-hover:bg-white group-hover:text-black"
                  aria-label={`Play ${station.title}`}
                >
                  <MaterialIcon name={station.actionIcon} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
