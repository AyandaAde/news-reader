"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ExpandableCards,
  type ExpandableCardItem,
} from "@/components/platform/expandable-cards";
import { PlatformScrollSectionHeader } from "@/components/platform/platform-scroll-section-header";
import { usePlatformPlayback } from "@/components/platform/platform-playback-provider";
import { useHorizontalScroll } from "@/components/platform/use-horizontal-scroll";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { TOPIC_OPTIONS } from "@/lib/onboarding";
import { cn } from "@/lib/utils";

const discoverFilters = ["All", "My Casts", ...TOPIC_OPTIONS] as const;

const discoverSearchPlaceholders = [
  "Search podcasts and briefings...",
  "Try 'Nomad Notes' or 'Agent Era'",
  "Find topics, casts, and stories",
] as const;

const liveNowItems = [
  {
    id: "tech-today",
    title: "Tech Today",
    listeners: "1,247",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDNbzXrqk7DFV8zgvHF_wc77jA080lxYzabw7O9--WOxMTI2HbM3o2ptkF_95wrmGNGhd0ZT5aqCp8CdRW18K6ZOfrwdNcFAb0aaSSFlHKPWfbX0kZ6tTRv9hxNuN5YlpEQp1NdSRz8UQfaFkgRd5lfm7KBISerFgsoqEXci4MW5gZFiisTJ3pk7CbL-l3Lug6tQ5U5Wq1gMgIKHBDNE6QlQwBgwrhUaRnLH8J546q9b2IGuTJ5AkWF",
  },
  {
    id: "global-markets",
    title: "Global Markets",
    listeners: "856",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ2ECh6xZP-3cUmpDE3S9bYrBij_sAW-wh4UHoiH0Hyk3G9vPZKZA9RUk-ByQBefIJrRko08l2nd3BBKF9EfaLxRn8EFQl8Ml2WsHK439e_WdHtBDUDPLp97dG21T5kD-jVecjVQmqitgn_Zf37mVKrPreYb08AZv6y0-f1DWBAQdD_OLYVTn8E-JRE8ROB0lA0m72mOGhF12hW-dnZYHRoJ49HAanf5RfzJIbZRosHn9RMT4955nL",
  },
  {
    id: "design-dialogue",
    title: "Design Dialogue",
    listeners: "2,103",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6ROYL7cmvTys0xX48uBX5MNtXkMfS0HBPIw0sDY_7EvwkAUwLwbGHYsw2Hclt_5iPP70_lIS_J-EaJiI0pJW13uvJ5qAg4PrEHC_mj0gMG45mTjyuRY49fHpr1BFZjBclfdPnwWv56iSKUzbq3aXuZ8J5I7p7n4Xq0k2AELq_COs7vVZhF9E0ja_nt1bGq09HOMIAv0EW5AwZI5POw2-3NVOZrQaRkuobGfGGBmMaB_XDN1MVdHeD",
  },
] as const;

const trendingNowItems = [
  {
    id: "nomad-notes",
    title: "Nomad Notes",
    badge: "Editor's Choice",
    meta: "42 mins",
    description:
      "A deep dive into the philosophy of perpetual motion and the silence found in transit.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB0HfJNVCKC2oID1zTEPrgsk7ObF7In8ewug58fn1CGLI5ovz8plbAcvR8OCJiyYwQRiTukurlFGCm0RTCjf1G3M7wsCxi8lnEXjftRMVPOAKJiAqzdMIf_t0IQShacM2OJWHBawmgG5SYsiPc3nT4yc0OpRzY_IiHtmjegK5QJLGMaIQIQbqu7ylI0AGeJGcF_VJ0aMRwHMqN5UXA5j_DR2x36z5mUkT4aEmq8LTS_powCZjY5rfjR",
    duration: "42:00",
  },
  {
    id: "agent-era",
    title: "Agent Era",
    badge: "Technology",
    meta: "Dr. Aris V.",
    description:
      "How autonomous AI is reshaping our relationship with productivity.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC7D8aZEToDnXYGTNOTm2_CbEDVRwaBOpEMUsd_Z_hneGlV8h1a9ryhCP4IblZFZ4AwxuuWF4lSaX9ocrWQT_y_pmyXWieEgYu6nPHJjR4z1ygFcOG-hSaQkdGolR2SBbvIMgI_C1u6CChDazfGzUSZ2aU4_yMteqqUupMTvvo2MhNEw0DGRFfzM8imyxzjQs6KvEDCZG7Zzfqs2IEbm-9wpsQnDjFS1cJuzPu-qmSDt6-oHjD09Qkd",
    duration: "28:00",
  },
] as const;

const podcastRecommendations = [
  {
    id: "structure-of-silence",
    title: "The Structure of Silence",
    subtitle: "Brutalist Audio Collective",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6ROYL7cmvTys0xX48uBX5MNtXkMfS0HBPIw0sDY_7EvwkAUwLwbGHYsw2Hclt_5iPP70_lIS_J-EaJiI0pJW13uvJ5qAg4PrEHC_mj0gMG45mTjyuRY49fHpr1BFZjBclfdPnwWv56iSKUzbq3aXuZ8J5I7p7n4Xq0k2AELq_COs7vVZhF9E0ja_nt1bGq09HOMIAv0EW5AwZI5POw2-3NVOZrQaRkuobGfGGBmMaB_XDN1MVdHeD",
  },
  {
    id: "frequency-shift",
    title: "Frequency Shift",
    subtitle: "Aural History Dept.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCLSJJCImEmaESRf8h8FsTnVwbFhB4le8ajIMp3PkS9AsbCV6t3gAUsU7ZggUQUpcSUZBDtKpYhe8hjNwAqhvJgIYDHG7xafPDZ7qYMRlg99DE_iWJFK4ZWg48gBCjGM0HPRHWVfGwkKpAZfp5w7WV_i0E6hTOJ-zk6ImlgrNukjp2K1ufoVgXHKdkD4s2YEVjQS1jNAH3sWns7JTbhMaASFVEIIUrkTI1ahIxoliMv3Z8Bu7-VwZsy",
  },
  {
    id: "cyber-gastronomy",
    title: "Cyber Gastronomy",
    subtitle: "Future Plate",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXQ57JwMm3Bd8saXHV744_T8yrjeakSrKN6MvyngaRV1u7SdMoF1wb4XlWTiVp535YYe1vbj0ZELugOVRgfnYIRuo83pQ3MExyCN7eWnTdsyJpYJP9g7lvThKsJ31ENE0bZ6n0sCW5u66-OSvRkQwgqZBftj7lW5k46hMKNLj9PoHiRoXs7niW_Oynuryk9_ulaU_BUUZGzkpTUHs4uKilYDlSty-hBQn5G6uLXB6ZBcfwWCQrASNd",
  },
  {
    id: "climate-horizon",
    title: "Climate Horizon",
    subtitle: "Global Systems Pulse",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAL4_gQP4pbvc_70qfg1dr1vBQdSLA-Zj7FVSczh7lxGH4-RGP6FWQ_BhmMQKuprtLo5jXNCKuZMD_mHZpVMqB-epX0eRtLTtug4UtaM-l8sJK3LWlMw_-6zcVl09f5UQmD_kNGccUGTJSRwsdrdA6fQzN7IAzfg_wCEGUIrV41oQFMpx9j936xWGAkKtZXlHRk-wAIpC6MxUSDobEx2OmMZBH8GWyK90k5dDCZ1M038Zv-zvg1KTCg",
  },
] as const;

const noteworthyItems = [
  {
    id: "neural-echoes",
    tag: "AI",
    date: "18 Oct",
    title: "Neural Echoes: The Prompt Paradox",
    description: "Episode 42: How our language defines the limits of intelligence.",
    duration: "34:12",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDNbzXrqk7DFV8zgvHF_wc77jA080lxYzabw7O9--WOxMTI2HbM3o2ptkF_95wrmGNGhd0ZT5aqCp8CdRW18K6ZOfrwdNcFAb0aaSSFlHKPWfbX0kZ6tTRv9hxNuN5YlpEQp1NdSRz8UQfaFkgRd5lfm7KBISerFgsoqEXci4MW5gZFiisTJ3pk7CbL-l3Lug6tQ5U5Wq1gMgIKHBDNE6QlQwBgwrhUaRnLH8J546q9b2IGuTJ5AkWF",
  },
  {
    id: "the-margin",
    tag: "Books",
    date: "17 Oct",
    title: "The Margin: Lost Manuscripts",
    description: "Uncovering the unpublished notes of 20th-century philosophers.",
    duration: "56:04",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ2ECh6xZP-3cUmpDE3S9bYrBij_sAW-wh4UHoiH0Hyk3G9vPZKZA9RUk-ByQBefIJrRko08l2nd3BBKF9EfaLxRn8EFQl8Ml2WsHK439e_WdHtBDUDPLp97dG21T5kD-jVecjVQmqitgn_Zf37mVKrPreYb08AZv6y0-f1DWBAQdD_OLYVTn8E-JRE8ROB0lA0m72mOGhF12hW-dnZYHRoJ49HAanf5RfzJIbZRosHn9RMT4955nL",
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

function toPodcastCards(
  items: typeof podcastRecommendations,
): ExpandableCardItem[] {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.subtitle,
    src: item.image,
    ctaText: "Play",
    content: (
      <p>
        {item.title} — {item.subtitle}. A recommended podcast picked for your
        listening profile and current interests.
      </p>
    ),
  }));
}

function toNoteworthyCards(
  items: typeof noteworthyItems,
): ExpandableCardItem[] {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    description: `${item.duration} • ${item.tag} • ${item.date}`,
    badge: item.tag,
    src: item.image,
    ctaText: "Play",
    content: (
      <p>
        {item.title} — {item.description}
      </p>
    ),
  }));
}

export function PlatformDiscoverScreen() {
  const { play } = usePlatformPlayback();
  const [discoverFilter, setDiscoverFilter] =
    useState<(typeof discoverFilters)[number]>("All");
  const liveScroll = useHorizontalScroll(240);
  const trendingScroll = useHorizontalScroll(520);
  const podcastScroll = useHorizontalScroll(280);

  const podcastCards = useMemo(
    () => toPodcastCards(podcastRecommendations),
    [],
  );
  const noteworthyCards = useMemo(
    () => toNoteworthyCards(noteworthyItems),
    [],
  );

  return (
    <>
      <section className="mb-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="min-w-0 flex-1">
            <h1 className="mb-2 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl md:leading-[56px]">
              Discover
            </h1>
            <p className="max-w-2xl text-lg leading-7 text-[#888888]">
              Curated soundscapes and deep-dive narratives engineered for focused
              listening.
            </p>
          </div>

          <div className="w-full lg:w-[min(100%,22rem)] lg:shrink-0 lg:pt-2">
            <PlaceholdersAndVanishInput
              placeholders={[...discoverSearchPlaceholders]}
              onChange={() => {}}
              onSubmit={() => {}}
              className={cn(
                "mx-0 h-11 max-w-none !bg-[#1f1f1f] border border-[#262626] shadow-none",
                "has-[input:focus-visible]:border-white/30",
                "[&_input]:text-white [&_input]:placeholder:text-transparent",
                "[&_p]:text-[#888888]",
                "[&_button:not(:disabled)]:bg-white [&_button:not(:disabled)_svg]:text-black",
                "[&_button:disabled]:bg-[#2a2a2a] [&_button:disabled_svg]:text-[#666]",
              )}
            />
          </div>
        </div>
      </section>

      <section className="mb-10 overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-3">
          {discoverFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setDiscoverFilter(filter)}
              className={cn(
                "shrink-0 rounded-full px-6 py-2.5 text-[12px] font-medium tracking-[0.05em] transition-all active:scale-95",
                discoverFilter === filter
                  ? "bg-white font-bold text-black"
                  : "border border-[#262626] bg-[#1f1f1f] text-[#e2e2e2] hover:border-white/30",
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold leading-8 text-white">Live</h2>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={liveScroll.scrollPrevious}
              aria-label="Scroll Live left"
              className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-[#262626] bg-[#1f1f1f] text-white transition-colors hover:bg-white/10 active:scale-95"
            >
              <MaterialIcon name="chevron_left" className="text-[20px]" />
            </button>
            <button
              type="button"
              onClick={liveScroll.scrollNext}
              aria-label="Scroll Live right"
              className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-[#262626] bg-[#1f1f1f] text-white transition-colors hover:bg-white/10 active:scale-95"
            >
              <MaterialIcon name="chevron_right" className="text-[20px]" />
            </button>
          </div>
        </div>
        <ul
          ref={liveScroll.ref}
          className="hide-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0"
        >
          {liveNowItems.map((station) => (
            <li key={station.id} className="shrink-0">
              <Link
                href="/studio"
                className="group relative block w-56 overflow-hidden rounded-lg border border-[#262626] bg-[#1f1f1f] transition-colors hover:border-white/20"
              >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={station.image}
                  alt={station.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="224px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute left-2 top-2">
                  <span className="flex items-center gap-1 rounded bg-[#ffb4ab] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#690005]">
                    <span className="size-1 animate-pulse rounded-full bg-white" />
                    Live
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    play({
                      id: station.id,
                      title: station.title,
                      subtitle: "Live Broadcast",
                      image: station.image,
                      elapsed: "0:00",
                      duration: "Live",
                    });
                  }}
                  className="absolute bottom-2 right-2 flex size-8 items-center justify-center rounded-full bg-white text-black opacity-100 shadow-lg transition-opacity md:opacity-0 md:group-hover:opacity-100"
                  aria-label={`Play ${station.title}`}
                >
                  <MaterialIcon name="play_arrow" filled className="text-[18px]" />
                </button>
              </div>
              <div className="p-3">
                <h4 className="mb-0.5 text-sm font-bold text-white">{station.title}</h4>
                <div className="flex items-center gap-1.5 text-[#888888]">
                  <MaterialIcon name="group" className="text-[12px]" />
                  <span className="text-[11px] font-medium tracking-[0.05em]">
                    {station.listeners} listening
                  </span>
                </div>
              </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-baseline gap-3">
            <h2 className="text-2xl font-semibold leading-8 text-white">
              Trending Now
            </h2>
            <button
              type="button"
              className="shrink-0 text-[12px] font-medium tracking-[0.05em] text-[#888888] transition-colors hover:text-white"
            >
              View All
            </button>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={trendingScroll.scrollPrevious}
              aria-label="Scroll Trending Now left"
              className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-[#262626] bg-[#1f1f1f] text-white transition-colors hover:bg-white/10 active:scale-95"
            >
              <MaterialIcon name="chevron_left" className="text-[20px]" />
            </button>
            <button
              type="button"
              onClick={trendingScroll.scrollNext}
              aria-label="Scroll Trending Now right"
              className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-[#262626] bg-[#1f1f1f] text-white transition-colors hover:bg-white/10 active:scale-95"
            >
              <MaterialIcon name="chevron_right" className="text-[20px]" />
            </button>
          </div>
        </div>

        <ul
          ref={trendingScroll.ref}
          className="hide-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0"
        >
          {trendingNowItems.map((item) => (
            <li key={item.id} className="shrink-0">
              <article className="platform-trending-card group relative h-[280px] w-[480px] max-w-[85vw] overflow-hidden rounded-xl border border-[#262626]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="480px"
              />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 z-20 w-full p-4">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black">
                    {item.badge}
                  </span>
                  <span className="text-[11px] tracking-[0.05em] text-[#c4c7c8]">
                    {item.meta}
                  </span>
                </div>
                <h3 className="mb-1 text-lg font-bold leading-tight text-white">
                  {item.title}
                </h3>
                <p className="mb-3 line-clamp-2 text-xs leading-5 text-[#c4c7c8]">
                  {item.description}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    play({
                      id: item.id,
                      title: item.title,
                      subtitle: item.meta,
                      image: item.image,
                      elapsed: "0:00",
                      duration: item.duration,
                    })
                  }
                  className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-black transition-all hover:opacity-90 active:scale-95"
                >
                  <MaterialIcon
                    name="play_arrow"
                    filled
                    className="text-[16px]"
                  />
                  Listen
                </button>
              </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <PlatformScrollSectionHeader
          title="Curated for you"
          onPrevious={podcastScroll.scrollPrevious}
          onNext={podcastScroll.scrollNext}
        />
        <ExpandableCards
          cards={podcastCards}
          layout="scroll"
          scrollRef={podcastScroll.ref}
        />
      </section>

      <section className="mb-16">
        <h2 className="mb-3 text-2xl font-semibold leading-8 text-white">
          New &amp; Noteworthy
          {discoverFilter !== "All" ? ` · ${discoverFilter}` : ""}
        </h2>
        <ExpandableCards cards={noteworthyCards} />
      </section>
    </>
  );
}
