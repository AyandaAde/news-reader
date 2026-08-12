"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PlatformEditProfileModal } from "@/components/platform/platform-edit-profile-modal";
import { ProfileMenuDropdown } from "@/components/platform/profile-menu-dropdown";
import { ProfileSettingsPanel } from "@/components/platform/profile-settings-panel";
import {
  listeningByDay,
  profileShows,
  recentItems,
  savedItems,
} from "@/lib/platform-profile";
import { topBriefingsItems } from "@/lib/platform-briefings";
import { loadStoredPlatformProfile } from "@/lib/platform-profile-storage";
import { cn } from "@/lib/utils";

const profileTabs = ["My Briefings", "Podcasts", "Saved", "Recent", "Settings"] as const;

const defaultAvatar =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400";

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

function ShowCard({
  title,
  meta,
  image,
  href,
  onClick,
}: {
  title: string;
  meta: string;
  image: string;
  href?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#1a1a1a]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="180px"
        />
      </div>
      <h3 className="mt-3 truncate text-base font-semibold text-white">{title}</h3>
      <p className="mt-1 truncate text-sm text-[#888888]">{meta}</p>
    </>
  );

  const className =
    "group w-[180px] shrink-0 text-left transition-transform active:scale-[0.98]";

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

export function PlatformProfileScreen() {
  const { user } = useUser();
  const [activeTab, setActiveTab] =
    useState<(typeof profileTabs)[number]>("My Briefings");
  const [editOpen, setEditOpen] = useState(false);
  const [localProfile, setLocalProfile] = useState<{
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    setLocalProfile(loadStoredPlatformProfile());
  }, []);

  const displayName =
    user?.fullName ||
    user?.firstName ||
    localProfile?.name ||
    "Nick Ricardo";
  const emailAddress =
    user?.primaryEmailAddress?.emailAddress ||
    localProfile?.email ||
    "you@eilo.app";
  const avatarUrl = user?.imageUrl || defaultAvatar;
  const maxListeningHours = useMemo(
    () => Math.max(...listeningByDay.map((entry) => entry.hours)),
    [],
  );

  return (
    <div className="pb-8">
      <section className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <div className="relative size-28 shrink-0 overflow-hidden rounded-full border-2 border-[#262626] sm:size-32">
            <Image
              src={avatarUrl}
              alt={displayName}
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>

          <div className="text-center sm:text-left">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#EBB800]/30 bg-[#EBB800]/10 px-3 py-1">
              <MaterialIcon name="star" filled className="text-[14px] text-[#EBB800]" />
              <span className="font-mono text-[10px] font-medium tracking-[0.12em] text-[#EBB800]">
                PREMIUM MEMBER
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {displayName}
            </h1>
            <p className="mt-1 text-sm text-[#888888]">{emailAddress}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-[#888888] sm:justify-start">
              <button
                type="button"
                onClick={() => setActiveTab("Podcasts")}
                className="transition-opacity hover:opacity-80"
              >
                <span className="font-semibold text-white">182</span> Following
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("My Briefings")}
                className="transition-opacity hover:opacity-80"
              >
                <span className="font-semibold text-white">12</span> Briefings
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 sm:justify-end">
          <ProfileMenuDropdown
            profileName={displayName}
            onEditProfile={() => setEditOpen(true)}
          />
        </div>
      </section>

      <PlatformEditProfileModal
        open={editOpen}
        onOpenChange={setEditOpen}
        initialName={displayName}
        initialEmail={emailAddress}
        onSaved={(profile) => setLocalProfile(profile)}
      />

      <section className="mb-8 border-b border-[#262626]">
        <div className="flex flex-col gap-3 pb-3 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-4 md:gap-y-3">
          <div className="hide-scrollbar -mx-4 flex gap-4 overflow-x-auto overscroll-x-contain px-4 touch-pan-x md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
            {profileTabs.map((tab) => {
              const active = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "shrink-0 whitespace-nowrap text-sm font-medium transition-colors md:shrink",
                    active ? "text-white" : "text-[#888888] hover:text-white",
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="flex shrink-0 items-center gap-2 rounded-full border border-[#262626] bg-[#1f1f1f] px-4 py-2 font-mono text-[12px] font-medium tracking-[0.05em] text-white transition-colors hover:border-white/30 hover:bg-white/10"
          >
            <MaterialIcon name="add" className="text-[16px]" />
            Create New Briefing
          </button>
        </div>
      </section>

      {activeTab === "My Briefings" ? (
        <section className="mb-12">
          <div className="hide-scrollbar -mx-4 flex gap-4 overflow-x-auto overscroll-x-contain px-4 pb-2 touch-pan-x md:mx-0 md:px-0 [-webkit-overflow-scrolling:touch]">
            {topBriefingsItems.map((briefing) => (
              <ShowCard
                key={briefing.id}
                href={`/briefings/${briefing.id}`}
                title={briefing.title}
                meta={`${briefing.emails.length} stories · ${briefing.description}`}
                image={briefing.image}
              />
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "Podcasts" ? (
        <section className="mb-12">
          <div className="hide-scrollbar -mx-4 flex gap-4 overflow-x-auto overscroll-x-contain px-4 pb-2 touch-pan-x md:mx-0 md:px-0 [-webkit-overflow-scrolling:touch]">
            {profileShows.map((podcast) => (
              <ShowCard
                key={podcast.id}
                title={podcast.title}
                meta={`${podcast.episodes} episodes`}
                image={podcast.image}
              />
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "Saved" ? (
        <section className="mb-12">
          <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto overscroll-x-contain px-4 pb-2 touch-pan-x md:mx-0 md:px-0 [-webkit-overflow-scrolling:touch]">
            {savedItems.map((item) => (
              <ShowCard
                key={item.id}
                title={item.title}
                meta={item.meta}
                image={item.image}
              />
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "Recent" ? (
        <section className="mb-12">
          <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto overscroll-x-contain px-4 pb-2 touch-pan-x md:mx-0 md:px-0 [-webkit-overflow-scrolling:touch]">
            {recentItems.map((item) => (
              <ShowCard
                key={item.id}
                title={item.title}
                meta={item.listenedAt}
                image={item.image}
              />
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "Settings" ? (
        <ProfileSettingsPanel
          displayName={displayName}
          emailAddress={emailAddress}
          onEditProfile={() => setEditOpen(true)}
        />
      ) : null}

      {activeTab !== "Settings" ? (
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-6">
        <div className="rounded-2xl border border-[#262626] bg-[#131313] p-5 md:p-6">
          <h2 className="mb-6 text-lg font-semibold text-white">Listening Statistics</h2>
          <div className="flex h-48 items-end justify-between gap-2 sm:gap-3">
            {listeningByDay.map((entry) => {
              const height = (entry.hours / maxListeningHours) * 100;
              const isPeak = entry.hours === maxListeningHours;

              return (
                <div
                  key={entry.day}
                  className="flex min-w-0 flex-1 flex-col items-center gap-3"
                >
                  <div className="flex h-full w-full items-end">
                    <div
                      className={cn(
                        "w-full rounded-t-md transition-colors",
                        isPeak ? "bg-white" : "bg-[#2a2a2a]",
                      )}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] tracking-[0.05em] text-[#888888]">
                    {entry.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-2xl border border-[#262626] bg-[#131313] p-5 md:p-6">
            <p className="font-mono text-[11px] tracking-[0.08em] text-[#888888]">
              Total Listen Time
            </p>
            <p className="mt-2 text-4xl font-bold tracking-tight text-white">428h</p>
            <p className="mt-2 flex items-center gap-1 text-sm text-[#34c759]">
              <MaterialIcon name="trending_up" className="text-[16px]" />
              +12% from last month
            </p>
          </div>

          <div className="rounded-2xl border border-[#262626] bg-[#131313] p-5 md:p-6">
            <p className="font-mono text-[11px] tracking-[0.08em] text-[#888888]">
              Global Ranking
            </p>
            <p className="mt-2 text-4xl font-bold tracking-tight text-white">Top 2%</p>
            <p className="mt-2 text-sm text-[#888888]">Among 1.5M listeners</p>
          </div>
        </div>
      </section>
      ) : null}
    </div>
  );
}
