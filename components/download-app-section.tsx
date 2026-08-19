"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useState } from "react";
import {
  DownloadQrModal,
  DownloadQrTrigger,
  type DownloadQrPlatform,
} from "@/components/download-qr-modal";
import { useI18n } from "@/components/i18n-provider";
import { downloadAppImagePath } from "@/lib/app-links";
import { cn } from "@/lib/utils";

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.365 1.43c0 1.14-.42 2.2-1.18 3-.79.84-2.1 1.49-3.2 1.4-.14-1.1.42-2.26 1.17-3.05.8-.86 2.2-1.48 3.21-1.35ZM19.8 17.2c-.57 1.32-.84 1.9-1.57 3.06-1.02 1.6-2.46 3.59-4.25 3.61-1.58.02-1.99-1.03-4.15-1.02-2.16.01-2.61 1.05-4.2 1.03-1.78-.02-3.14-1.82-4.16-3.42C-.1 17.5-.9 12.1.98 8.84c.94-1.63 2.43-2.66 4.12-2.69 1.53-.03 2.97 1.03 4.14 1.03 1.17 0 2.99-1.27 5.04-1.08.86.04 3.27.35 4.82 2.61-4.23 2.32-3.55 8.35.7 8.49Z"
      />
    </svg>
  );
}

function GooglePlayIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3.609 1.814 13.792 12 3.61 22.186a1.003 1.003 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893 2.302 2.302-10.937 6.348 8.635-8.65zm3.199-3.198 2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658 16.802 8.99l-2.303 2.303-8.635-8.635z"
      />
    </svg>
  );
}

type StoreBadgeProps = {
  label: string;
  subtitle: string;
  icon: ReactNode;
  className?: string;
  "aria-label"?: string;
  onClick: () => void;
};

function StoreBadge({
  label,
  subtitle,
  icon,
  className,
  onClick,
  "aria-label": ariaLabel,
}: StoreBadgeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex min-w-[180px] items-center gap-3 rounded-2xl border border-on-surface/10 bg-on-surface px-4 py-3 text-left text-background transition-opacity hover:opacity-90 active:scale-[0.98]",
        className,
      )}
    >
      {icon}
      <span className="flex flex-col items-start leading-none">
        <span className="text-[10px] uppercase tracking-wide opacity-80">
          {subtitle}
        </span>
        <span className="mt-1 text-sm font-semibold">{label}</span>
      </span>
    </button>
  );
}

export function DownloadAppSection() {
  const { t } = useI18n();
  const [qrOpen, setQrOpen] = useState(false);
  const [qrPlatform, setQrPlatform] = useState<DownloadQrPlatform>("both");

  function openQr(platform: DownloadQrPlatform) {
    setQrPlatform(platform);
    setQrOpen(true);
  }

  return (
    <section
      id="download"
      className="scroll-mt-28 pt-section-padding-md pb-16 md:pb-20"
      data-purpose="download-app"
    >
      <div className="mx-auto max-w-container-max px-6">
        <div className="glass-card grid grid-cols-1 items-center gap-10 overflow-hidden rounded-[2rem] p-8 md:grid-cols-[1fr_auto] md:gap-12 md:rounded-[2.5rem] md:p-12">
          <div>
            <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-on-surface-variant">
              {t("download.eyebrow")}
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-on-surface md:text-4xl lg:text-5xl">
              {t("download.title")}
            </h2>
            <p className="mb-8 max-w-lg text-base leading-relaxed text-on-surface-variant md:text-lg">
              {t("download.description")}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <StoreBadge
                subtitle={t("download.appStoreLine1")}
                label={t("download.appStoreLine2")}
                icon={<AppleIcon className="h-5 w-5 shrink-0" />}
                aria-label={t("download.appStore")}
                onClick={() => openQr("ios")}
              />
              <StoreBadge
                subtitle={t("download.googlePlayLine1")}
                label={t("download.googlePlayLine2")}
                icon={<GooglePlayIcon />}
                aria-label={t("download.googlePlay")}
                onClick={() => openQr("android")}
              />
            </div>
          </div>

          <div className="mx-auto flex flex-col items-center gap-8 sm:flex-row sm:items-end md:mx-0 md:gap-6">
            <Image
              src={downloadAppImagePath}
              alt={t("download.appPreview")}
              width={1428}
              height={1101}
              sizes="(max-width: 768px) 300px, 420px"
              className="h-auto w-full max-w-[320px] object-contain sm:max-w-[360px] md:max-w-[420px]"
            />
            <DownloadQrTrigger onClick={() => openQr("both")} />
          </div>
        </div>
      </div>

      <DownloadQrModal
        open={qrOpen}
        onOpenChange={setQrOpen}
        platform={qrPlatform}
      />
    </section>
  );
}
