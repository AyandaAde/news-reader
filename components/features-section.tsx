"use client";

import { AudioLines, Headphones, History } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

export function FeaturesSection() {
  const { t } = useI18n();

  return (
    <section
      id="features"
      className="mt-8 min-h-[100vh] scroll-mt-28 py-8"
      data-purpose="core-features"
    >
      <div
        className="mx-auto flex max-w-container-max flex-col px-6"
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col items-start justify-start lg:pt-2">
            <span className="mb-3 block text-sm font-bold uppercase tracking-[0.12em] text-on-surface-variant">
              {t("core.eyebrow")}
            </span>
            <h2 className="mb-4 max-w-md text-3xl font-bold leading-tight text-on-surface md:text-4xl lg:text-5xl">
              {t("core.title")}
            </h2>
            <p className="max-w-md text-base leading-relaxed text-on-surface-variant md:text-lg">
              {t("core.description")}
            </p>
          </div>

          <div className="grid grid-cols-2 content-start gap-3">
            <div
              id="feature-daily-brief"
              className="glass-card scroll-mt-28 rounded-xl p-4"
            >
              <h3 className="mb-2 text-base font-bold text-on-surface">
                {t("core.dailyBrief.title")}
              </h3>
              <p className="mb-3 line-clamp-3 text-sm text-on-surface-variant">
                {t("core.dailyBrief.description")}
              </p>
              <div className="h-20 overflow-hidden rounded-lg bg-surface-bright p-3">
                <div className="mb-1.5 h-3 w-3/4 rounded bg-on-surface/10" />
                <div className="mb-1.5 h-3 w-1/2 rounded bg-on-surface/10" />
                <div className="h-3 w-2/3 rounded bg-on-surface/10" />
              </div>
            </div>

            <div
              id="feature-conversation-recall"
              className="glass-card scroll-mt-28 rounded-xl p-4"
            >
              <h3 className="mb-2 text-base font-bold text-on-surface">
                {t("core.conversationRecall.title")}
              </h3>
              <p className="mb-3 line-clamp-3 text-sm text-on-surface-variant">
                {t("core.conversationRecall.description")}
              </p>
              <div className="flex h-20 items-center justify-center">
                <History className="size-12 text-on-surface opacity-20" />
              </div>
            </div>

            <div
              id="feature-email-briefings"
              className="glass-card scroll-mt-28 rounded-xl p-4"
            >
              <h3 className="mb-2 text-base font-bold text-on-surface">
                {t("core.emailBriefings.title")}
              </h3>
              <p className="mb-3 text-sm text-on-surface-variant">
                {t("core.emailBriefings.description")}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded bg-white/5 px-2 py-1 text-xs text-on-surface">
                  {t("core.tags.private")}
                </span>
                <span className="rounded bg-white/5 px-2 py-1 text-xs text-on-surface">
                  {t("core.tags.automated")}
                </span>
              </div>
            </div>

            <div
              id="feature-listen-anywhere"
              className="glass-card scroll-mt-28 rounded-xl p-4"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded bg-white/10">
                <Headphones className="size-4 text-on-surface" />
              </div>
              <h4 className="mb-1 text-base font-bold text-on-surface">
                {t("core.listenAnywhere.title")}
              </h4>
              <p className="text-sm text-on-surface-variant">
                {t("core.listenAnywhere.description")}
              </p>
            </div>
          </div>
        </div>

        <div
          id="feature-live-stations"
          className="glass-card mt-6 shrink-0 scroll-mt-28 rounded-xl p-5 md:p-6"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10 text-on-surface">
              <AudioLines className="size-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="mb-2 text-lg font-bold text-on-surface">
                {t("core.liveStations.title")}
              </h4>
              <p className="mb-4 text-sm leading-relaxed text-on-surface-variant md:text-base">
                {t("core.liveStations.description")}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded bg-white/5 px-3 py-1 text-xs font-medium text-on-surface">
                  {t("core.tags.discover")}
                </span>
                <span className="rounded bg-white/5 px-3 py-1 text-xs font-medium text-on-surface">
                  {t("core.tags.liveStations")}
                </span>
                <span className="rounded bg-white/5 px-3 py-1 text-xs font-medium text-on-surface">
                  {t("core.tags.personalTopics")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
