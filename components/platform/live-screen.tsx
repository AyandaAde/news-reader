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
import { useI18n } from "@/components/i18n-provider";
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
    iconGradient: "from-blue-200 to-indigo-200 dark:from-blue-900/40 dark:to-indigo-900/40",
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
    iconGradient: "from-orange-200 to-red-200 dark:from-orange-900/40 dark:to-red-900/40",
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
    iconGradient: "from-emerald-200 to-teal-200 dark:from-emerald-900/40 dark:to-teal-900/40",
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
  label,
  pulse = true,
  compact = false,
}: {
  label: string;
  pulse?: boolean;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "rounded-full border border-[#ffb4ab]/30 bg-[#ffb4ab]/10 font-mono text-[10px] tracking-[0.2em] text-[#c62828] dark:text-[#ffb4ab]",
        compact ? "px-2 py-0.5 text-[9px] tracking-[0.16em]" : "px-4 py-1.5",
        pulse && "platform-live-pulse",
      )}
    >
      {label}
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
  const { t } = useI18n();

  const liveTitle = t("platform.live.title");
  const liveBroadcast = t("platform.live.liveBroadcast");
  const liveBadgeLabel = liveTitle.toUpperCase();

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
      duration: liveTitle,
    });
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-light tracking-tight text-neutral-900 md:text-4xl dark:text-white">
          {liveTitle}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-[#c8c6c5]">
          {t("platform.live.subtitle")}
        </p>
      </div>

      <section className="group relative mb-10 h-52 cursor-pointer overflow-hidden rounded-xl border border-neutral-200 sm:h-60 md:mb-12 md:h-64 dark:border-transparent">
        <button
          type="button"
          className="absolute inset-0 z-20"
          aria-label={t("platform.live.playHero")}
          onClick={() =>
            playStation(
              "tech-today",
              t("platform.live.heroTitle"),
              liveBroadcast,
              HERO_IMAGE,
            )
          }
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          src={HERO_IMAGE}
          className="absolute inset-0 size-full object-cover opacity-60 transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center sm:p-5">
          <div className="platform-glass-panel mb-2 inline-flex items-center gap-2 rounded-full border-white/20 px-3 py-1 sm:mb-3">
            <span className="platform-live-pulse size-1.5 rounded-full bg-[#ffb4ab] shadow-[0_0_8px_rgba(255,180,171,0.8)]" />
            <span className="font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-white">
              {liveBroadcast}
            </span>
          </div>
          <h2 className="mb-1 text-2xl font-medium text-white transition-all duration-500 ease-out group-hover:tracking-wider sm:text-3xl md:text-4xl">
            {t("platform.live.heroTitle")}
          </h2>
          <p className="mb-3 max-w-lg text-sm font-light text-[#c8c6c5] sm:mb-4 sm:text-base">
            {t("platform.live.heroDescription")}
          </p>
          <div className="platform-glass-panel flex max-w-full items-center gap-2.5 rounded-full px-3 py-1.5 sm:gap-4 sm:px-4">
            <div className="flex size-7 items-center justify-center rounded-full bg-white/10 transition-colors duration-300 group-hover:bg-white">
              <Headphones className="size-3.5 text-white transition-colors duration-300 group-hover:text-black" strokeWidth={1.5} aria-hidden />
            </div>
            <div className="hidden h-3.5 w-px bg-white/20 sm:block" />
            <span className="font-mono text-[11px] tracking-wider text-white">
              1,247{" "}
              <span className="text-[#c8c6c5]/70">
                {t("platform.live.listening")}
              </span>
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 z-10 h-0.5 w-full bg-white/10">
          <div className="h-full w-2/3 bg-gradient-to-r from-white to-white/50 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </div>
      </section>

      <section>
        <h3 className="mb-6 border-b border-neutral-200 pb-4 text-3xl font-light text-neutral-900 dark:border-white/5 dark:text-white">
          {t("platform.live.activeStations")}
        </h3>

        <div className="grid grid-cols-1 gap-2">
          {liveStations.map((station) => (
            <div
              key={station.id}
              className="platform-glass-panel flex items-center gap-3 rounded-xl p-3 sm:gap-4"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-neutral-200 bg-gradient-to-br text-neutral-800 shadow-sm dark:border-white/10 dark:text-white dark:shadow-none",
                    station.iconGradient,
                  )}
                >
                  <StationIcon icon={station.icon} className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-[15px] font-medium text-neutral-900 dark:text-white/90">
                    {station.title}
                  </h4>
                  <p className="truncate text-xs leading-4 text-neutral-500 dark:text-[#c8c6c5]/70">
                    {station.description}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <div className="hidden flex-col items-end md:flex">
                  <span className="font-mono text-xs tracking-wide text-neutral-900 dark:text-white">
                    {station.meta}
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-[#c8c6c5]/50">
                    {station.metaSub}
                  </span>
                </div>

                {station.status === "live" ? (
                  <LiveBadge label={liveBadgeLabel} compact />
                ) : (
                  <span className="whitespace-nowrap rounded-full border border-neutral-200 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-500 dark:border-white/10 dark:text-[#c8c6c5]">
                    {t("platform.live.startsIn5m")}
                  </span>
                )}

                {station.status === "live" ? (
                  <button
                    type="button"
                    onClick={() =>
                      playStation(
                        station.id,
                        station.title,
                        liveBroadcast,
                        station.image,
                      )
                    }
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white active:scale-95 dark:border-white/10 dark:text-white dark:hover:bg-white dark:hover:text-black"
                    aria-label={t("platform.discover.playStation", {
                      title: station.title,
                    })}
                  >
                    <Play className="size-4 fill-current" strokeWidth={1.5} aria-hidden />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-900 hover:text-white active:scale-95 dark:border-white/10 dark:text-[#c8c6c5] dark:hover:bg-white dark:hover:text-black"
                    aria-label={t("platform.live.notifyMe", {
                      title: station.title,
                    })}
                  >
                    <Bell className="size-4" strokeWidth={1.5} aria-hidden />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 md:mt-14">
        <h3 className="mb-4 border-b border-neutral-200 pb-3 text-2xl font-light text-neutral-900 dark:border-white/5 dark:text-white">
          {t("platform.live.recommendedPodcasts")}
        </h3>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {featuredStations.map((station) => (
            <div
              key={station.id}
              className="group relative h-44 cursor-pointer overflow-hidden rounded-xl border border-neutral-200 dark:border-white/10 sm:h-52"
            >
              <Image
                src={station.image}
                alt={station.title}
                fill
                className={cn(
                  "object-cover transition-transform duration-700 ease-out group-hover:scale-105",
                  station.grayscale && "grayscale group-hover:grayscale-0",
                )}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 flex w-full items-end justify-between p-4">
                <div className="min-w-0 pr-3">
                  <span className="mb-2 inline-block rounded-full border border-white/10 bg-white/10 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-white backdrop-blur-md">
                    {station.badge}
                  </span>
                  <h5 className="mb-1 text-lg font-light text-white">
                    {station.title}
                  </h5>
                  <p className="line-clamp-1 text-xs font-light text-[#c8c6c5]/60">
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
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-transparent text-white transition-colors group-hover:bg-white group-hover:text-black"
                  aria-label={t("platform.discover.playStation", {
                    title: station.title,
                  })}
                >
                  <StationIcon
                    icon={station.actionIcon}
                    filled={station.iconFilled}
                    className="size-4"
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
