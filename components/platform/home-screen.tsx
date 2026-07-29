"use client";

import { useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  CirclePlus,
  Headphones,
  Mail,
  Mic,
  Play,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const filters = ["For You", "Discover", "Trending"] as const;

const feed = [
  {
    title: "Your Previous Briefings",
    meta: "1 episode • Updated yesterday",
    description: "FWD:Re: UGC - Recap of your most important messages...",
    time: "10:45 AM",
    icon: Mail,
    accent: "#00E5FF",
  },
  {
    title: "Stock Market Updates",
    meta: "Business • 1 episode",
    description:
      "The latest on stock market tickers and global financial trends.",
    time: "LIVE",
    icon: Mic,
    accent: "#EAB308",
  },
  {
    title: "Ambient Focus Loop",
    meta: "Relaxation • Daily Refresh",
    description:
      "Curated soundscape for deep concentration and creative work.",
    time: "45m",
    icon: Headphones,
    accent: "#EC4899",
  },
] as const;

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function PlatformHomeScreen() {
  const { user } = useUser();
  const [filter, setFilter] = useState<(typeof filters)[number]>("For You");

  const firstName =
    user?.firstName || user?.fullName?.split(" ")[0] || "there";

  const { greeting, briefDate } = useMemo(() => {
    const now = new Date();
    return {
      greeting: greetingForHour(now.getHours()),
      briefDate: now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    };
  }, []);

  return (
    <div>
      <section className="mb-6">
        <p className="text-base leading-6 text-[#c4c7c8] opacity-80">
          {greeting}, {firstName}
        </p>
        <h2 className="mt-1 text-2xl font-semibold leading-8 text-white">
          Welcome Home
        </h2>
      </section>

      <section className="mb-12">
        <div className="platform-glass group relative overflow-hidden rounded-xl p-6">
          <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-white/5 blur-[80px]" />
          <div className="relative z-10">
            <p className="mb-2 font-mono text-[12px] font-medium uppercase tracking-[0.05em] text-[#c4c7c8]">
              Your daily brief
            </p>
            <h3 className="mb-2 text-4xl font-bold tracking-tight text-white">
              {briefDate}
            </h3>
            <p className="mb-6 text-base leading-6 text-[#c4c7c8]">
              25 stories curated for you
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                className="flex h-12 items-center gap-2 rounded-full bg-white px-8 font-bold text-[#131313] transition-all hover:shadow-lg hover:shadow-white/10 active:scale-95"
              >
                <Play className="size-5 fill-current" />
                Play
              </button>
              <button
                type="button"
                className="flex h-12 items-center gap-2 rounded-full border border-[#262626] bg-transparent px-6 text-white transition-all hover:bg-white/5 active:scale-95"
              >
                <CirclePlus className="size-5" />
                New Brief
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-6 flex items-center justify-between gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex shrink-0 gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={cn(
                "rounded-full px-4 py-2 font-mono text-[12px] font-medium uppercase tracking-[0.05em] transition-colors active:scale-95",
                filter === item
                  ? "bg-white text-[#131313]"
                  : "border border-[#262626] bg-[#1f1f1f] text-[#c4c7c8] hover:text-white",
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="flex shrink-0 items-center gap-1 rounded-full bg-[#22C55E] px-4 py-2 font-mono text-[12px] font-medium uppercase tracking-[0.05em] text-white transition-all hover:brightness-110 active:scale-95"
        >
          <Plus className="size-[18px]" />
          Create
        </button>
      </section>

      <section className="space-y-4">
        {feed.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              type="button"
              className="platform-glass group flex w-full cursor-pointer items-start gap-4 rounded-xl p-4 text-left transition-transform hover:border-white/30 active:scale-[0.98]"
            >
              <div
                className="flex size-16 shrink-0 items-center justify-center rounded-lg border"
                style={{
                  background: `linear-gradient(to bottom right, ${item.accent}33, ${item.accent}14)`,
                  borderColor: `${item.accent}33`,
                }}
              >
                <Icon className="size-8" style={{ color: item.accent }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-lg font-bold leading-7 text-white">
                    {item.title}
                  </h4>
                  <span className="shrink-0 text-[12px] text-[#c4c7c8] opacity-60">
                    {item.time}
                  </span>
                </div>
                <p className="mb-1 font-mono text-[12px] font-medium tracking-[0.05em] text-[#c4c7c8]">
                  {item.meta}
                </p>
                <p className="line-clamp-1 text-base leading-6 text-[#c4c7c8] opacity-80">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </section>

      <div className="h-8" />
    </div>
  );
}
