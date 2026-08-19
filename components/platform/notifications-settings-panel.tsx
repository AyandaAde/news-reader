"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type NotificationsSettingsDraft = {
  notifyNewBrief: boolean;
  notifyLiveStation: boolean;
  notifyNewEpisode: boolean;
};

type NotificationsSettingsPanelProps = {
  draft: NotificationsSettingsDraft;
  onChange: (patch: Partial<NotificationsSettingsDraft>) => void;
  onSave: () => void;
};

function NotificationToggle({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4">
      <div>
        <p className="text-[15px] font-semibold text-white">{label}</p>
        {description ? (
          <p className="mt-1 text-[13px] text-[#888888]">{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors",
          checked ? "bg-white" : "bg-[#39393d]",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-[27px] rounded-full transition-[left,background-color]",
            checked ? "left-[22px] bg-black" : "left-0.5 bg-white",
          )}
        />
      </button>
    </div>
  );
}

export function NotificationsSettingsPanel({
  draft,
  onChange,
  onSave,
}: NotificationsSettingsPanelProps) {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
    "default",
  );

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

  const togglesDisabled = permission === "denied" || permission === "unsupported";

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm leading-6 text-[#888888]">
        Choose which notifications you&apos;d like to receive.
      </p>

      {permission === "denied" ? (
        <div className="rounded-[14px] border border-[#262626] bg-[#141414] px-4 py-3 text-sm text-[#888888]">
          Notifications are blocked in your browser. Enable them in your browser settings
          to receive alerts.
        </div>
      ) : null}

      {permission === "unsupported" ? (
        <div className="rounded-[14px] border border-[#262626] bg-[#141414] px-4 py-3 text-sm text-[#888888]">
          Push notifications are not supported in this browser. Your preferences will still
          be saved.
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[14px] border border-[#262626] bg-[#141414]">
        <div className="divide-y divide-[#262626]">
          <NotificationToggle
            checked={draft.notifyNewBrief}
            disabled={togglesDisabled}
            onChange={(checked) => void handleToggle("notifyNewBrief", checked)}
            label="New Brief Ready"
            description="When your Daily Brief is generated"
          />
          <NotificationToggle
            checked={draft.notifyLiveStation}
            disabled={togglesDisabled}
            onChange={(checked) => void handleToggle("notifyLiveStation", checked)}
            label="Live Station Starting"
            description="When a live broadcast begins"
          />
          <NotificationToggle
            checked={draft.notifyNewEpisode}
            disabled={togglesDisabled}
            onChange={(checked) => void handleToggle("notifyNewEpisode", checked)}
            label="New Episode"
            description="From shows you follow"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onSave}
        className="w-full rounded-[10px] bg-white px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
      >
        Save
      </button>
    </div>
  );
}
