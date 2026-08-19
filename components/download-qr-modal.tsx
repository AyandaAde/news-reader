"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/components/i18n-provider";
import { appLinks } from "@/lib/app-links";
import { cn } from "@/lib/utils";

export type DownloadQrPlatform = "ios" | "android" | "both";

type DownloadQrModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform?: DownloadQrPlatform;
};

type PlatformQrProps = {
  label: string;
  url: string;
};

type QrCodeFrameProps = {
  value: string;
  size: number;
  label?: string;
  className?: string;
};

function QrCodeFrame({ value, size, label, className }: QrCodeFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden border border-outline-variant/20 bg-white p-3 shadow-sm",
        className,
      )}
    >
      <QRCode
        value={value}
        size={size}
        bgColor="#ffffff"
        fgColor="#131315"
        aria-label={label}
      />
    </div>
  );
}

function PlatformQr({ label, url }: PlatformQrProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <QrCodeFrame
        value={url}
        size={180}
        label={label}
        className="rounded-2xl"
      />
      <p className="text-sm font-semibold text-on-surface">{label}</p>
    </div>
  );
}

export function DownloadQrModal({
  open,
  onOpenChange,
  platform = "both",
}: DownloadQrModalProps) {
  const { t } = useI18n();

  const description =
    platform === "ios"
      ? t("download.qrModal.iosDescription")
      : platform === "android"
        ? t("download.qrModal.androidDescription")
        : t("download.qrModal.description");

  const showIos = platform === "ios" || platform === "both";
  const showAndroid = platform === "android" || platform === "both";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-lg", platform !== "both" && "sm:max-w-sm")}
      >
        <DialogHeader>
          <DialogTitle>{t("download.qrModal.title")}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            "grid gap-8",
            platform === "both"
              ? "grid-cols-1 sm:grid-cols-2"
              : "grid-cols-1 place-items-center",
          )}
        >
          {showIos ? (
            <PlatformQr
              label={t("download.qrModal.ios")}
              url={appLinks.appStore}
            />
          ) : null}
          {showAndroid ? (
            <PlatformQr
              label={t("download.qrModal.android")}
              url={appLinks.googlePlay}
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

type DownloadQrTriggerProps = {
  onClick: () => void;
  className?: string;
};

export function DownloadQrTrigger({ onClick, className }: DownloadQrTriggerProps) {
  const { t } = useI18n();
  const [qrUrl, setQrUrl] = useState("https://eilo.app/#download");

  useEffect(() => {
    setQrUrl(`${window.location.origin}/#download`);
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center rounded-3xl transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        className,
      )}
      aria-label={t("download.scanQr")}
    >
      <QrCodeFrame
        value={qrUrl}
        size={176}
        label={t("download.scanQr")}
        className="rounded-3xl transition-shadow group-hover:shadow-md"
      />
      <p className="mt-4 text-center text-sm font-medium text-on-surface-variant underline-offset-4 group-hover:text-on-surface group-hover:underline">
        {t("download.scanQr")}
      </p>
    </button>
  );
}
