"use client";

import { Mic2, Sparkles, Timer } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

export function PodcastCreationSection() {
  const { t } = useI18n();

  return (
    <section
      id="podcast-creation"
      className="scroll-mt-28 pt-section-padding-md"
      data-purpose="podcast-creation"
    >
      <div className="mx-auto max-w-container-max px-6">
        <div className="mb-16 md:mb-24">
          <div className="mb-12 max-w-2xl">
            <span className="mb-4 block text-sm font-bold uppercase tracking-[0.12em] text-on-surface-variant">
              {t("podcastCreation.eyebrow")}
            </span>
            <h2 className="mb-4 text-balance text-4xl font-bold text-on-surface md:text-5xl">
              {t("podcastCreation.title")}
              <br />
              <span className="text-on-surface-variant">
                {t("podcastCreation.titleAccent")}
              </span>
            </h2>
            <p className="max-w-xl text-pretty text-on-surface-variant md:text-lg">
              {t("podcastCreation.description")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div
              id="podcast-creation-topics"
              className="glass-card scroll-mt-28 rounded-xl p-4"
            >
              <h3 className="mb-2 text-base font-bold text-on-surface">
                {t("podcastCreation.topics.title")}
              </h3>
              <p className="mb-3 text-sm text-on-surface-variant">
                {t("podcastCreation.topics.description")}
              </p>
              <div className="inline-flex w-fit max-w-full flex-wrap content-start gap-2 rounded-lg bg-surface-bright p-3">
                <span className="rounded bg-on-surface/10 px-2 py-1 text-[11px] text-on-surface">
                  {t("podcastCreation.tags.news")}
                </span>
                <span className="rounded bg-on-surface/10 px-2 py-1 text-[11px] text-on-surface">
                  {t("podcastCreation.tags.tech")}
                </span>
                <span className="rounded bg-on-surface/10 px-2 py-1 text-[11px] text-on-surface">
                  {t("podcastCreation.tags.markets")}
                </span>
              </div>
            </div>

            <div
              id="podcast-creation-length"
              className="glass-card scroll-mt-28 rounded-xl p-4"
            >
              <h3 className="mb-2 text-base font-bold text-on-surface">
                {t("podcastCreation.length.title")}
              </h3>
              <p className="mb-3 text-sm text-on-surface-variant">
                {t("podcastCreation.length.description")}
              </p>
              <div className="flex h-20 items-center justify-center">
                <Timer className="size-12 text-on-surface opacity-20" />
              </div>
            </div>

            <div
              id="podcast-creation-voices"
              className="glass-card scroll-mt-28 rounded-xl p-4"
            >
              <h3 className="mb-2 text-base font-bold text-on-surface">
                {t("podcastCreation.voices.title")}
              </h3>
              <p className="mb-3 text-sm text-on-surface-variant">
                {t("podcastCreation.voices.description")}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded bg-white/5 px-2 py-1 text-xs text-on-surface">
                  {t("podcastCreation.tags.hostCohost")}
                </span>
                <span className="rounded bg-white/5 px-2 py-1 text-xs text-on-surface">
                  {t("podcastCreation.tags.customStyle")}
                </span>
              </div>
            </div>

            <div
              id="podcast-creation-generate"
              className="glass-card scroll-mt-28 rounded-xl p-4"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded bg-white/10">
                <Sparkles className="size-4 text-on-surface" />
              </div>
              <h4 className="mb-1 text-base font-bold text-on-surface">
                {t("podcastCreation.generate.title")}
              </h4>
              <p className="text-sm text-on-surface-variant">
                {t("podcastCreation.generate.description")}
              </p>
            </div>
          </div>

          <div
            id="podcast-creation-library"
            className="glass-card mt-4 scroll-mt-28 rounded-xl p-5 md:mt-6 md:p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10 text-on-surface">
                <Mic2 className="size-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="mb-2 text-lg font-bold text-on-surface">
                  {t("podcastCreation.library.title")}
                </h4>
                <p className="mb-4 text-sm leading-relaxed text-on-surface-variant md:text-base">
                  {t("podcastCreation.library.description")}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded bg-white/5 px-3 py-1 text-xs font-medium text-on-surface">
                    {t("podcastCreation.tags.yourShows")}
                  </span>
                  <span className="rounded bg-white/5 px-3 py-1 text-xs font-medium text-on-surface">
                    {t("podcastCreation.tags.replayAnytime")}
                  </span>
                  <span className="rounded bg-white/5 px-3 py-1 text-xs font-medium text-on-surface">
                    {t("podcastCreation.tags.shareReady")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
