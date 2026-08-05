"use client";

import { useMemo, useState } from "react";
import {
  ExpandableCards,
  type ExpandableCardItem,
} from "@/components/platform/expandable-cards";
import { PlatformScrollSectionHeader } from "@/components/platform/platform-scroll-section-header";
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

const trendingNowItems = [
  {
    id: "nomad-notes",
    title: "Nomad Notes",
    description: "Editor's Choice • 42 mins",
    badge: "Trending",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB0HfJNVCKC2oID1zTEPrgsk7ObF7In8ewug58fn1CGLI5ovz8plbAcvR8OCJiyYwQRiTukurlFGCm0RTCjf1G3M7wsCxi8lnEXjftRMVPOAKJiAqzdMIf_t0IQShacM2OJWHBawmgG5SYsiPc3nT4yc0OpRzY_IiHtmjegK5QJLGMaIQIQbqu7ylI0AGeJGcF_VJ0aMRwHMqN5UXA5j_DR2x36z5mUkT4aEmq8LTS_powCZjY5rfjR",
    content:
      "A deep dive into the philosophy of perpetual motion and the silence found in transit.",
  },
  {
    id: "agent-era",
    title: "Agent Era",
    description: "Technology • Dr. Aris V. • 28 mins",
    badge: "Trending",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC7D8aZEToDnXYGTNOTm2_CbEDVRwaBOpEMUsd_Z_hneGlV8h1a9ryhCP4IblZFZ4AwxuuWF4lSaX9ocrWQT_y_pmyXWieEgYu6nPHJjR4z1ygFcOG-hSaQkdGolR2SBbvIMgI_C1u6CChDazfGzUSZ2aU4_yMteqqUupMTvvo2MhNEw0DGRFfzM8imyxzjQs6KvEDCZG7Zzfqs2IEbm-9wpsQnDjFS1cJuzPu-qmSDt6-oHjD09Qkd",
    content:
      "How autonomous AI is reshaping our relationship with productivity.",
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

function toTrendingCards(
  items: typeof trendingNowItems,
): ExpandableCardItem[] {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    badge: item.badge,
    src: item.image,
    ctaText: "Play",
    content: <p>{item.content}</p>,
  }));
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
  const [discoverFilter, setDiscoverFilter] =
    useState<(typeof discoverFilters)[number]>("All");
  const trendingScroll = useHorizontalScroll();
  const podcastScroll = useHorizontalScroll(280);

  const trendingCards = useMemo(() => toTrendingCards(trendingNowItems), []);
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

      <section className="mb-10">
        <div className="hide-scrollbar -mx-4 flex flex-wrap gap-3 px-4 md:mx-0 md:px-0">
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
        <PlatformScrollSectionHeader
          title="Trending Now"
          onPrevious={trendingScroll.scrollPrevious}
          onNext={trendingScroll.scrollNext}
        />
        <ExpandableCards
          cards={trendingCards}
          layout="scroll"
          scrollRef={trendingScroll.ref}
        />
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
