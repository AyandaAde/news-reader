"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ExpandableCards,
  type ExpandableCardItem,
} from "@/components/platform/expandable-cards";
import { PlatformScrollSectionHeader } from "@/components/platform/platform-scroll-section-header";
import { useHorizontalScroll } from "@/components/platform/use-horizontal-scroll";
import { usePlatformPlayback } from "@/components/platform/platform-playback-provider";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { cn } from "@/lib/utils";
import { TOPIC_OPTIONS } from "@/lib/onboarding";
import { topBriefingsItems } from "@/lib/platform-briefings";

const forYouItems = [
  {
    title: "Echoes of Tomorrow",
    description: "Futuristic soundscapes and ambient textures.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAogK2hZgKLLZlRizvLE-Rk5uKBjXBcmhkmQ8nkPT8niwK-4jf8Ld1TdxvuLymnV4Ihi2ZZUyChPFHoGqBZHYlYX4fuXo8DLaE_0EbHYMCo-na2UKLratjAx95zlSDc4IwV4rJMJ2df9Q6d7Ws-0WzsWfYSB_Ts1dLbfnZPg1Rd2tzPNl6AuXHSGqwUNXSa4j4RvQ22feFu1GiIV1-u5661WYN2Q_KDwA9Qd2NQBsfubbWfc28Am5Kw",
  },
  {
    title: "Midnight Pulse",
    description: "Deep bass and rhythmic patterns for focus.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCidp2f8SewIj2wChLAH9YpBkbgrbMX5_JLX20wxIwC8PtZ5iG4AEexWEwznGt_cS_ztnyBeQ-dhZtRxCj25uskeQLCC1XXkcWAuCmCRYC70BA5l60ksNrSZ0E4zyBwj6HtXeDVZvspL2XZZO-58Tq2Y9qgFuXT9TRLsi1OnPh3Ktv1K8Z459lgP6_SZ4GYQ-TBqorVuxF3uCFr3xgMGND9OGAjd8c8RxXK8ObhbskcMd_WIBHvuoh7",
  },
] as const;

const trendingItems = [
  {
    title: "The AI Pulse",
    meta: "Trending in Tech • 5m ago",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400",
  },
  {
    title: "Global Markets",
    meta: "Business • 12m ago",
    image: null,
  },
  {
    title: "Cyber Security",
    meta: "Tech • 1h ago",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400",
  },
] as const;

const madeForYouItems = [
  {
    tag: "AI",
    episode: "EP 42",
    title: "Neural Networks & The Creative Class",
    meta: "12 mins • Just now",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB1IEj9IZoAPbJe2obW53DgD_dCNh2x6NfUD8pxrSyboLrSWwbsi2WuoZNqKgTDPbQRf05xDUUI5ikWVy5U_AQxtE_Y7PYBKsmLkU1P_o7aKq5fC0Aqj72UJbOtGL8_xwaV6L8_ok1WtY_KX-SJaBb4iftkVjETFsXbykYcjw6sSeusnf1-1c_2v9FWc-cz_nm3fTFny2jQCSBYbnafLonfTRQP1Y9eNhbsu4Zrfk8qzLI9nOLJbTAS",
  },
  {
    tag: "BUSINESS",
    episode: "EP 128",
    title: "The Decentralized Economy: 2024 Outlook",
    meta: "24 mins • 2 hours ago",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMYazcSqDs6uLyQJ95RDBDX28UQ8HLnqNyGjZK0yU-azssgC3JJHLawktaCcJ_YZ2LLodTnDPKmdpkDHOX_UFZdNQ4Ee_8TGiy-xRoRE_pUO0dnprCZGgluydAwTOUMyVCpAdu_gj2ONAReUMsW7i6Uy5xYmrgXCpeZ73XI1Vuk-ibm4RSOby8EesjuFDbmDv_SHE3kyTYQVk8VJLZd7RtFeaAoiU89YnsWaFBlewfRkPTXBXdCxWy",
  },
  {
    tag: "AUDIO",
    episode: "EP 05",
    title: "Designing Silence: A Studio Guide",
    meta: "18 mins • Yesterday",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA1ZXXm7BYxcvHo3VLNOVW9TVGrWqv7EokIFMK4C2pAkr522u0vnbrTmVvZCy9M8yU-37iAydQtpKHHowTHQz-ieJXsWYWlTazXT9AdtNKLh4hV5VzvlQxq2KoCnv7M89ka1Sy_N5V56fRJJ98dv7MBp6oBnMBch13qOgQS9IWxXRrC9G4GrujOnJ3-y-2NcXKL8KRkTxuEHBgtTnk-4bdbCKBDEhQgPh0HR1CyIxcX6ofIUFMSN85b",
  },
] as const;

const discoverFilters = ["All", "My Casts", ...TOPIC_OPTIONS] as const;

const homeSearchPlaceholders = [
  "Search briefings, stories, and topics...",
  "Try 'Morning Markets' or 'Tech & AI Digest'",
  "Find podcasts and news briefings",
] as const;

const trendingPlaceholderImage =
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=400";

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

function toTopBriefingsCards(
  items: typeof topBriefingsItems,
): ExpandableCardItem[] {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    src: item.image,
    ctaText: "Play",
    viewHref: `/briefings/${item.id}`,
    viewLabel: "View Briefing",
    content: (
      <p>
        {item.title} — {item.description}. A curated audio briefing pulled from
        your top stories, ready to play in one tap.
      </p>
    ),
  }));
}

function toForYouCards(
  items: typeof forYouItems,
): ExpandableCardItem[] {
  return items.map((item) => ({
    id: item.title,
    title: item.title,
    description: item.description,
    src: item.image,
    ctaText: "Play",
    content: (
      <p>
        {item.description} Tap play to start listening to this curated briefing
        — a calm two-voice conversation built around your interests and routine.
      </p>
    ),
  }));
}

function toTrendingCards(
  items: typeof trendingItems,
): ExpandableCardItem[] {
  return items.map((item) => ({
    id: item.title,
    title: item.title,
    description: item.meta,
    badge: "Trending",
    src: item.image ?? trendingPlaceholderImage,
    ctaText: "Play",
    content: (
      <p>
        {item.title} — {item.meta}. This story is trending across the platform
        right now. Tap play for a quick audio briefing on what happened and why
        it matters.
      </p>
    ),
  }));
}

function toDiscoverCards(
  items: typeof madeForYouItems,
): ExpandableCardItem[] {
  return items.map((item) => ({
    id: item.title,
    title: item.title,
    description: item.meta,
    badge: `${item.tag} • ${item.episode}`,
    src: item.image,
    ctaText: "Play",
    content: (
      <p>
        {item.title} — {item.meta}. This episode is part of your personalized
        daily brief, shaped by the topics you follow and the stories that matter
        most right now.
      </p>
    ),
  }));
}

export function PlatformHomeScreen() {
  const router = useRouter();
  const [discoverFilter, setDiscoverFilter] =
    useState<(typeof discoverFilters)[number]>("All");
  const { play } = usePlatformPlayback();
  const topBriefingsScroll = useHorizontalScroll();
  const trendingScroll = useHorizontalScroll();

  const topBriefingsCards = useMemo(
    () => toTopBriefingsCards(topBriefingsItems),
    [],
  );
  const forYouCards = useMemo(() => toForYouCards(forYouItems), []);
  const trendingCards = useMemo(() => toTrendingCards(trendingItems), []);
  const discoverCards = useMemo(() => toDiscoverCards(madeForYouItems), []);

  const briefDate = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    [],
  );

  return (
    <>
      <section className="mb-10">
        <PlaceholdersAndVanishInput
          placeholders={[...homeSearchPlaceholders]}
          onChange={() => {}}
          onSubmit={(event) => {
            event.preventDefault();
            router.push("/discover");
          }}
          className={cn(
            "mx-0 h-11 max-w-none !bg-[#1f1f1f] border border-[#262626] shadow-none",
            "has-[input:focus-visible]:border-white/30",
            "[&_input]:text-white [&_input]:placeholder:text-transparent",
            "[&_p]:text-[#888888]",
            "[&_button:not(:disabled)]:bg-white [&_button:not(:disabled)_svg]:text-black",
            "[&_button:disabled]:bg-[#2a2a2a] [&_button:disabled_svg]:text-[#666]",
          )}
        />
      </section>

      <section className="mb-10">
        <h2 className="mb-2 text-2xl font-semibold leading-8 text-white">
          Your Daily Brief
        </h2>

        <div className="mx-auto w-full rounded-xl border border-white/10 bg-gradient-to-br from-[#1a2b4a] to-[#0a1428] p-6 shadow-2xl">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full flex-grow flex-col items-center text-center md:items-start md:text-left">
              <h3 className="mb-1 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl md:leading-[56px]">
                {briefDate}
              </h3>
              <p className="mb-6 text-lg leading-7 text-white/80">
                11 stories curated for you
              </p>
              <div className="flex justify-center gap-3 md:justify-start">
                <button
                  type="button"
                  onClick={() =>
                    play({
                      id: "daily-brief",
                      title: briefDate,
                      subtitle: "11 stories curated for you",
                      image: forYouItems[0].image,
                      elapsed: "0:00",
                      duration: "12:00",
                    })
                  }
                  className="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 font-mono text-[12px] font-medium tracking-[0.05em] text-black transition-colors hover:bg-white/90"
                >
                  <MaterialIcon name="play_arrow" filled className="text-[20px]" />
                  Play
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-white/30 px-6 py-2.5 font-mono text-[12px] font-medium tracking-[0.05em] text-white transition-colors hover:bg-white/10"
                >
                  <MaterialIcon name="mic" className="text-[20px]" />
                  New Brief
                </button>
              </div>
            </div>

            <div className="flex w-full flex-col items-center text-center md:w-auto md:items-end md:text-right">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center md:items-end">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold leading-8 text-white">
                      70°F
                    </span>
                    <span className="font-mono text-[12px] tracking-[0.05em] text-white/80">
                      Partly Cloudy
                    </span>
                  </div>
                  <span className="font-mono text-[12px] tracking-[0.05em] text-white/60">
                    Pittsburgh, Pennsylvania
                  </span>
                </div>
                <MaterialIcon
                  name="partly_cloudy_day"
                  className="text-[32px] text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <PlatformScrollSectionHeader
          title="Your Briefings"
          onPrevious={topBriefingsScroll.scrollPrevious}
          onNext={topBriefingsScroll.scrollNext}
        />
        <ExpandableCards
          cards={topBriefingsCards}
          layout="scroll"
          scrollRef={topBriefingsScroll.ref}
        />
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-2xl font-semibold leading-8 text-white">
          For You
        </h2>
        <ExpandableCards cards={forYouCards} />
      </section>

      <section className="mb-10">
        <PlatformScrollSectionHeader
          title="Trending"
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
        <h2 className="mb-3 text-2xl font-semibold leading-8 text-white">
          Discover
        </h2>
        <div className="hide-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
          {discoverFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setDiscoverFilter(filter)}
              className={cn(
                "shrink-0 rounded-full px-6 py-2.5 font-mono text-[12px] font-medium tracking-[0.05em] transition-colors",
                discoverFilter === filter
                  ? "bg-white text-black"
                  : "border border-[#262626] bg-[#1f1f1f] text-[#c4c7c8] hover:bg-white/10",
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-3 text-2xl font-semibold leading-8 text-white">
          {discoverFilter}
        </h2>
        <ExpandableCards cards={discoverCards} />
      </section>
    </>
  );
}
