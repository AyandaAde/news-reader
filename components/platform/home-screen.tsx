"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MapPin, Play, Plus } from "lucide-react";
import { AddLocationModal } from "@/components/platform/add-location-modal";
import { ConnectGoogleModal } from "@/components/platform/connect-google-modal";
import {
  ExpandableCards,
  type ExpandableCardItem,
} from "@/components/platform/expandable-cards";
import { PlatformScrollSectionHeader } from "@/components/platform/platform-scroll-section-header";
import { useHorizontalScroll } from "@/components/platform/use-horizontal-scroll";
import { usePlatformPlayback } from "@/components/platform/platform-playback-provider";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useHomeLocationLabel, useHomeUser } from "@/hooks/use-backend-user";
import { useHomePodcasts } from "@/hooks/use-home-podcasts";
import { useHomeWeather } from "@/hooks/use-home-weather";
import { useWeatherTemperatureUnit } from "@/hooks/use-weather-temperature-unit";
import { cn } from "@/lib/utils";
import {
  userHasStoredLocation,
} from "@/lib/location-label";
import { buildDisplayName } from "@/lib/auth/clerk-user";
import { formatTimeGreeting } from "@/lib/time-greeting";
import { getWeatherTemperatureValue } from "@/lib/weather-temperature";
import { getWeatherIcon } from "@/lib/weather-icon";
import { TOPIC_OPTIONS } from "@/lib/onboarding";
import { topBriefingsItems } from "@/lib/platform-briefings";
import {
  PODCAST_PLACEHOLDER_IMAGE,
  podcastsToForYouCards,
} from "@/lib/platform-podcasts";

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
    accent: true,
    content: (
      <p>
        {item.title} — {item.description}. A curated audio briefing pulled from
        your top stories, ready to play in one tap.
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
  const { user: clerkUser } = useUser();
  const [discoverFilter, setDiscoverFilter] =
    useState<(typeof discoverFilters)[number]>("All");
  const { play } = usePlatformPlayback();
  const topBriefingsScroll = useHorizontalScroll();
  const forYouScroll = useHorizontalScroll();
  const trendingScroll = useHorizontalScroll();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isGoogleConnectModalOpen, setIsGoogleConnectModalOpen] = useState(false);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [googleConnectError, setGoogleConnectError] = useState<string | null>(null);
  const {
    user: backendUser,
    isLoading: isBackendUserLoading,
    isLocating,
    saveCityLocation,
    refetchUser,
  } = useHomeUser();
  const isHomeReady = !isBackendUserLoading && !isLocating;
  const hasUserLocation = userHasStoredLocation(backendUser);
  const showLocationPrompt = isHomeReady && !hasUserLocation;
  const { weather, isLoading: isWeatherLoading } = useHomeWeather(
    isHomeReady && hasUserLocation,
  );
  const { unit: weatherTemperatureUnit, setTemperatureUnit } =
    useWeatherTemperatureUnit();
  const { label: homeLocationLabel } = useHomeLocationLabel(
    backendUser,
    isBackendUserLoading || isLocating,
  );
  const {
    podcasts: homePodcasts,
    isLoading: isPodcastsLoading,
  } = useHomePodcasts(isHomeReady);

  const weatherTemperatureValue =
    weather != null
      ? getWeatherTemperatureValue(weather.temperatureF, weatherTemperatureUnit)
      : null;
  const weatherCondition = weather?.condition ?? null;
  const WeatherIcon = getWeatherIcon(weather?.iconId ?? "i-cloud-sun");
  const weatherLocationLabel =
    weather?.location ?? homeLocationLabel ?? null;
  const showWeatherLoading = isHomeReady && isWeatherLoading && !weather;
  const hasBriefs = (backendUser?.briefCount ?? 0) > 0;
  const dailyBriefStoryCount = backendUser?.latestBriefStoryCount ?? 0;
  const dailyBriefSubtitle =
    dailyBriefStoryCount === 1
      ? "1 story curated for you"
      : dailyBriefStoryCount > 1
        ? `${dailyBriefStoryCount} stories curated for you`
        : "Your daily brief is ready";

  const topBriefingsCards = useMemo(
    () => toTopBriefingsCards(topBriefingsItems),
    [],
  );
  const forYouCards = useMemo(
    () => podcastsToForYouCards(homePodcasts),
    [homePodcasts],
  );
  const dailyBriefImage =
    homePodcasts[0]?.artworkUrl?.trim() || PODCAST_PLACEHOLDER_IMAGE;
  const trendingCards = useMemo(() => toTrendingCards(trendingItems), []);
  const discoverCards = useMemo(() => toDiscoverCards(madeForYouItems), []);

  const [briefDate, setBriefDate] = useState("");

  const displayName = useMemo(() => {
    const backendName = backendUser?.displayName?.trim();
    if (backendName) {
      return backendName;
    }

    if (clerkUser) {
      const clerkName = buildDisplayName(clerkUser);
      if (clerkName) {
        return clerkName;
      }
    }

    const email = backendUser?.email?.trim();
    if (email) {
      const localPart = email.split("@")[0]?.trim();
      if (localPart) {
        return localPart;
      }
    }

    return null;
  }, [backendUser?.displayName, backendUser?.email, clerkUser]);

  const greetingText = useMemo(
    () => formatTimeGreeting(displayName),
    [displayName],
  );

  useEffect(() => {
    setBriefDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    );
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const googleConnected = params.get("googleConnected");

    if (!googleConnected) {
      return;
    }

    if (googleConnected === "0") {
      setGoogleConnectError(
        "Google connection was cancelled or failed. Please try again.",
      );
      setIsGoogleConnectModalOpen(true);
    } else {
      void refetchUser();
    }

    router.replace("/home", { scroll: false });
  }, [refetchUser, router]);

  function handleNewBriefClick() {
    if (!backendUser?.hasGoogleAccessToken) {
      setGoogleConnectError(null);
      setIsConnectingGoogle(false);
      setIsGoogleConnectModalOpen(true);
      return;
    }

    router.push("/discover");
  }

  async function handleConnectGoogle() {
    setIsConnectingGoogle(true);
    setGoogleConnectError(null);

    try {
      const response = await fetch("/api/google/connect", {
        method: "POST",
        cache: "no-store",
      });

      const payload = (await response.json().catch(() => null)) as
        | { authUrl?: string; error?: string }
        | null;

      if (!response.ok || !payload?.authUrl) {
        throw new Error(
          payload?.error ?? "Failed to start Google connection. Please try again.",
        );
      }

      window.location.assign(payload.authUrl);
    } catch (connectError) {
      console.error("Failed to connect Google:", connectError);
      setGoogleConnectError(
        connectError instanceof Error
          ? connectError.message
          : "Failed to connect Google. Please try again.",
      );
      setIsConnectingGoogle(false);
    }
  }

  function handleGoogleConnectModalOpenChange(open: boolean) {
    setIsGoogleConnectModalOpen(open);

    if (!open) {
      setIsConnectingGoogle(false);
      setGoogleConnectError(null);
    }
  }

  return (
    <>
      <section className="mb-6 md:mb-8">
        <PlaceholdersAndVanishInput
          placeholders={[...homeSearchPlaceholders]}
          onChange={() => { }}
          onSubmit={(event) => {
            event.preventDefault();
            router.push("/discover");
          }}
          className={cn(
            "mx-0 h-11 max-w-none overflow-hidden !bg-[#1f1f1f] border border-[#262626] shadow-none",
            "has-[input:focus-visible]:border-white/30",
            "[&_input]:text-white [&_input]:placeholder:text-transparent",
            "[&_p]:text-[#888888]",
            "[&_button:not(:disabled)]:bg-white [&_button:not(:disabled)_svg]:text-black",
            "[&_button:disabled]:bg-[#2a2a2a] [&_button:disabled_svg]:text-[#666]",
          )}
        />
        <h1
          className="mt-4 text-2xl font-semibold leading-8 text-white md:mt-5 md:text-3xl md:leading-9"
          suppressHydrationWarning
        >
          {greetingText || "\u00A0"}
        </h1>
      </section>

      <AddLocationModal
        open={isLocationModalOpen}
        onOpenChange={setIsLocationModalOpen}
        isSaving={isLocating}
        onSave={async (cityId) => {
          const savedUser = await saveCityLocation(cityId);
          if (savedUser) {
            setIsLocationModalOpen(false);
          }
        }}
      />

      <ConnectGoogleModal
        open={isGoogleConnectModalOpen}
        onOpenChange={handleGoogleConnectModalOpenChange}
        isConnecting={isConnectingGoogle}
        error={googleConnectError}
        onConnect={handleConnectGoogle}
      />

      <section className="mb-8 md:mb-10">
        <h2 className="mb-3 text-2xl font-semibold leading-8 text-white">
          Your Daily Brief
        </h2>

        <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#1a2b4a] to-[#0a1428] p-5 shadow-2xl md:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-6">
            <div className="min-w-0 flex-1">
              <h3
                className="mb-1 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl"
                suppressHydrationWarning
              >
                {briefDate || "\u00A0"}
              </h3>
              <p className="mb-5 text-base leading-7 text-white/80 md:mb-6 md:text-lg">
                {!isHomeReady
                  ? "\u00A0"
                  : hasBriefs
                    ? dailyBriefSubtitle
                    : "Create a brief to start your daily listening routine"}
              </p>
              <div className="flex flex-wrap gap-3">
                {isHomeReady && hasBriefs ? (
                  <button
                    type="button"
                    onClick={() =>
                      play({
                        id: "daily-brief",
                        title: briefDate,
                        subtitle: dailyBriefSubtitle,
                        image: dailyBriefImage,
                        elapsed: "0:00",
                        duration: "12:00",
                      })
                    }
                    className="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 font-mono text-[12px] font-medium tracking-[0.05em] text-black transition-colors hover:bg-white/90"
                  >
                    <Play className="size-5 fill-current" aria-hidden />
                    Play
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={handleNewBriefClick}
                  className="flex items-center gap-2 rounded-full border border-white/30 px-6 py-2.5 font-mono text-[12px] font-medium tracking-[0.05em] text-white transition-colors hover:bg-white/10"
                >
                  <Plus className="size-5" aria-hidden />
                  New Brief
                </button>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-start md:items-end md:text-right">
              {!isHomeReady ? (
                <p className="font-mono text-[12px] tracking-[0.05em] text-white/60">
                  Loading...
                </p>
              ) : showLocationPrompt ? (
                <div className="flex max-w-xs flex-col items-start gap-3 md:items-end">
                  <p className="text-sm leading-6 text-white/80">
                    Add your location to see the weather in your city
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsLocationModalOpen(true)}
                    disabled={isLocating}
                    className="flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 font-mono text-[12px] font-medium tracking-[0.05em] text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <MapPin className="size-4 shrink-0" aria-hidden />
                    Add location
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-start md:items-end">
                    <div className="flex flex-wrap items-baseline justify-start gap-x-2 gap-y-1 md:justify-end">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-semibold leading-8 text-white">
                          {showWeatherLoading
                            ? "—"
                            : (weatherTemperatureValue ?? "—")}
                        </span>
                        {!showWeatherLoading && weatherTemperatureValue != null ? (
                          <span
                            className="inline-flex items-center gap-0.5 font-mono text-base leading-none tracking-[0.05em] md:text-lg"
                            role="group"
                            aria-label="Temperature unit"
                          >
                            <button
                              type="button"
                              onClick={() => setTemperatureUnit("celsius")}
                              className={cn(
                                "rounded px-1 py-0.5 transition-colors",
                                weatherTemperatureUnit === "celsius"
                                  ? "text-white"
                                  : "text-white/40 hover:text-white/70",
                              )}
                              aria-pressed={weatherTemperatureUnit === "celsius"}
                            >
                              °C
                            </button>
                            <span className="text-white/30">|</span>
                            <button
                              type="button"
                              onClick={() => setTemperatureUnit("fahrenheit")}
                              className={cn(
                                "rounded px-1 py-0.5 transition-colors",
                                weatherTemperatureUnit === "fahrenheit"
                                  ? "text-white"
                                  : "text-white/40 hover:text-white/70",
                              )}
                              aria-pressed={weatherTemperatureUnit === "fahrenheit"}
                            >
                              °F
                            </button>
                          </span>
                        ) : null}
                      </div>
                      <span className="font-mono text-[12px] tracking-[0.05em] text-white/80">
                        {showWeatherLoading
                          ? "Loading weather..."
                          : (weatherCondition ?? "Weather unavailable")}
                      </span>
                    </div>
                    <span
                      className="font-mono text-[12px] tracking-[0.05em] text-white/60"
                      suppressHydrationWarning
                    >
                      {weatherLocationLabel ?? "\u00A0"}
                    </span>
                  </div>
                  <WeatherIcon className="size-8 shrink-0 text-white" aria-hidden />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {isHomeReady && hasBriefs ? (
        <section className="mb-8 md:mb-10">
          <PlatformScrollSectionHeader
            title="Your Briefings"
            onPrevious={topBriefingsScroll.scrollPrevious}
            onNext={topBriefingsScroll.scrollNext}
            canScrollPrevious={topBriefingsScroll.canScrollPrevious}
            canScrollNext={topBriefingsScroll.canScrollNext}
          />
          <ExpandableCards
            cards={topBriefingsCards}
            layout="scroll"
            scrollRef={topBriefingsScroll.ref}
          />
        </section>
      ) : null}

      {isHomeReady ? (
        <section className="mb-8 md:mb-10">
          <PlatformScrollSectionHeader
            title="For You"
            onPrevious={forYouScroll.scrollPrevious}
            onNext={forYouScroll.scrollNext}
            canScrollPrevious={forYouScroll.canScrollPrevious}
            canScrollNext={forYouScroll.canScrollNext}
          />
          {isPodcastsLoading ? (
            <p className="font-mono text-[12px] tracking-[0.05em] text-[#888888]">
              Loading your podcasts...
            </p>
          ) : forYouCards.length > 0 ? (
            <ExpandableCards
              cards={forYouCards}
              layout="scroll"
              scrollRef={forYouScroll.ref}
            />
          ) : (
            <p className="text-sm leading-6 text-[#888888]">
              Your podcasts will appear here once you create a brief.
            </p>
          )}
        </section>
      ) : null}

      <section className="mb-8 md:mb-10">
        <PlatformScrollSectionHeader
          title="Trending"
          onPrevious={trendingScroll.scrollPrevious}
          onNext={trendingScroll.scrollNext}
          canScrollPrevious={trendingScroll.canScrollPrevious}
          canScrollNext={trendingScroll.canScrollNext}
        />
        <ExpandableCards
          cards={trendingCards}
          layout="scroll"
          scrollRef={trendingScroll.ref}
        />
      </section>

      <section className="mb-8 md:mb-10">
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

      <section className="mb-0">
        <h2 className="mb-3 text-2xl font-semibold leading-8 text-white">
          {discoverFilter}
        </h2>
        <ExpandableCards cards={discoverCards} layout="grid" size="medium" />
      </section>
    </>
  );
}
