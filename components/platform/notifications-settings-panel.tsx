"use client";

import { useEffect, useMemo, useState } from "react";

import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";

export type NotificationsSettingsDraft = {
  notifyNewBrief: boolean;
  notifyLiveStation: boolean;
  notifyNewEpisode: boolean;
};

type NotificationsSettingsPanelProps = {
  draft: NotificationsSettingsDraft;
  onChange: (patch: Partial<NotificationsSettingsDraft>) => void;
  /** Disables toggles while a notification-settings API call is in flight. */
  saving?: boolean;
};

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
          ? { fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24" }
          : undefined
      }
    >
      {name}
    </span>
  );
}

function NotificationToggle({
  checked,
  onChange,
  label,
  description,
  icon,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description: string;
  icon: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "group flex w-full items-center gap-3.5 rounded-[16px] border p-3.5 text-left transition-[border-color,background-color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.2,0,0,1)] active:scale-[0.98]",
        checked
          ? "border-[#4ade80]/40 bg-white shadow-[0_1px_0_oklch(0_0_0_/_0.04)] dark:border-[#4ade80]/35 dark:bg-[#1a1a1a] dark:shadow-none"
          : "border-transparent bg-neutral-50 hover:border-neutral-200 dark:bg-[#141414] dark:hover:border-white/10",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <div
        className={cn(
          "relative flex size-11 shrink-0 items-center justify-center rounded-[12px] transition-[background-color,color] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
          checked
            ? "bg-[#4ade80]/15 text-[#16a34a] dark:text-[#4ade80]"
            : "bg-neutral-200/80 text-neutral-500 dark:bg-white/[0.06] dark:text-[#888888]",
        )}
      >
        <MaterialIcon
          name={icon}
          filled={checked}
          className="text-[22px] transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)] group-active:scale-[0.96]"
        />
        <span
          className={cn(
            "absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[#4ade80] shadow-[0_0_0_2px_white] transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] dark:shadow-[0_0_0_2px_#1a1a1a]",
            checked ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-balance text-neutral-900 dark:text-white">
          {label}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-pretty text-neutral-500 dark:text-[#888888]">
          {description}
        </p>
      </div>

      <span
        aria-hidden
        className={cn(
          "relative h-[22px] w-[38px] shrink-0 rounded-full transition-[background-color] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
          checked ? "bg-[#4ade80]" : "bg-neutral-300 dark:bg-[#39393d]",
        )}
      >
        <span
          className={cn(
            "absolute top-[2px] size-[18px] rounded-full bg-white shadow-sm transition-[left] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
            checked ? "left-[18px]" : "left-[2px]",
          )}
        />
      </span>
    </button>
  );
}

export function NotificationsSettingsPanel({
  draft,
  onChange,
  saving = false,
}: NotificationsSettingsPanelProps) {
  const { t } = useI18n();
  const [permission, setPermission] = useState<
    NotificationPermission | "unsupported"
  >("default");

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return;
    }

    setPermission(Notification.permission);
  }, []);

  async function handleToggle(
    key: keyof NotificationsSettingsDraft,
    nextChecked: boolean,
  ) {
    if (
      nextChecked &&
      permission === "default" &&
      typeof window !== "undefined" &&
      "Notification" in window
    ) {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== "granted") {
        onChange({ [key]: false });
        return;
      }
    }

    if (nextChecked && permission === "denied") {
      onChange({ [key]: false });
      return;
    }

    onChange({ [key]: nextChecked });
  }

  const togglesDisabled =
    saving || permission === "denied" || permission === "unsupported";

  const enabledCount = useMemo(() => {
    return [
      draft.notifyNewBrief,
      draft.notifyLiveStation,
      draft.notifyNewEpisode,
    ].filter(Boolean).length;
  }, [draft]);

  const status = (() => {
    if (permission === "denied") {
      return {
        icon: "notifications_off",
        tone: "warn" as const,
        title: t("platform.profile.notificationsBlockedTitle"),
        body: t("platform.profile.notificationsBlocked"),
      };
    }
    if (permission === "unsupported") {
      return {
        icon: "phonelink_off",
        tone: "muted" as const,
        title: t("platform.profile.notificationsUnsupportedTitle"),
        body: t("platform.profile.notificationsUnsupported"),
      };
    }
    if (permission === "granted") {
      return {
        icon: "notifications_active",
        tone: "ok" as const,
        title: t("platform.profile.notificationsPermissionOn"),
        body: t("platform.profile.notificationsEnabledOf", {
          enabled: enabledCount,
          total: 3,
        }),
      };
    }
    return {
      icon: "notifications",
      tone: "idle" as const,
      title: t("platform.profile.notificationsPermissionAsk"),
      body: t("platform.profile.notificationsPermissionAskHint"),
    };
  })();

  return (
    <div className="flex flex-col gap-5">
      <p className="px-1 text-[15px] leading-6 text-pretty text-neutral-500 dark:text-[#888888]">
        {t("platform.profile.notificationsIntro")}
      </p>

      <div
        className={cn(
          "relative overflow-hidden rounded-[18px] border p-4 transition-[border-color,background-color] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
          status.tone === "ok" &&
            "border-[#4ade80]/30 bg-gradient-to-br from-[#4ade80]/12 via-neutral-50 to-neutral-50 dark:from-[#4ade80]/10 dark:via-[#141414] dark:to-[#141414]",
          status.tone === "warn" &&
            "border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-neutral-50 to-neutral-50 dark:from-amber-500/10 dark:via-[#141414] dark:to-[#141414]",
          status.tone === "muted" &&
            "border-neutral-200 bg-neutral-50 dark:border-[#262626] dark:bg-[#141414]",
          status.tone === "idle" &&
            "border-neutral-200/80 bg-neutral-50 dark:border-white/10 dark:bg-[#141414]",
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute -top-10 -right-8 size-28 rounded-full blur-2xl transition-opacity duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
            status.tone === "ok"
              ? "bg-[#4ade80]/20 opacity-100"
              : "bg-[#4ade80]/10 opacity-40",
          )}
        />
        <div className="relative flex items-start gap-3.5">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-[12px] transition-[background-color,color] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
              status.tone === "ok" &&
                "bg-[#4ade80]/20 text-[#16a34a] dark:text-[#4ade80]",
              status.tone === "warn" &&
                "bg-amber-500/15 text-amber-700 dark:text-amber-400",
              (status.tone === "muted" || status.tone === "idle") &&
                "bg-neutral-200/80 text-neutral-600 dark:bg-white/[0.06] dark:text-[#aaaaaa]",
            )}
          >
            <MaterialIcon
              name={status.icon}
              filled={status.tone === "ok"}
              className="text-[22px]"
            />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[15px] font-semibold text-balance text-neutral-900 dark:text-white">
              {status.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-pretty text-neutral-500 dark:text-[#888888]">
              {status.body}
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2.5 flex items-end justify-between gap-3 px-1">
          <p className="text-[13px] font-semibold tracking-[0.5px] text-neutral-500 uppercase dark:text-[#888888]">
            {t("platform.profile.notificationsAlertsSection")}
          </p>
          <p className="text-[11px] font-medium tabular-nums text-neutral-400 dark:text-[#666666]">
            {t("platform.profile.notificationsEnabledOf", {
              enabled: enabledCount,
              total: 3,
            })}
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <NotificationToggle
            checked={draft.notifyNewBrief}
            disabled={togglesDisabled}
            onChange={(checked) => void handleToggle("notifyNewBrief", checked)}
            icon="auto_awesome"
            label={t("platform.profile.notificationsNewBrief")}
            description={t("platform.profile.notificationsNewBriefDesc")}
          />
          <NotificationToggle
            checked={draft.notifyLiveStation}
            disabled={togglesDisabled}
            onChange={(checked) =>
              void handleToggle("notifyLiveStation", checked)
            }
            icon="sensors"
            label={t("platform.profile.notificationsLiveStation")}
            description={t("platform.profile.notificationsLiveStationDesc")}
          />
          <NotificationToggle
            checked={draft.notifyNewEpisode}
            disabled={togglesDisabled}
            onChange={(checked) =>
              void handleToggle("notifyNewEpisode", checked)
            }
            icon="library_music"
            label={t("platform.profile.notificationsNewEpisode")}
            description={t("platform.profile.notificationsNewEpisodeDesc")}
          />
        </div>
      </div>
    </div>
  );
}
