"use client";

import { useClerk } from "@clerk/nextjs";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/components/i18n-provider";
import {
  DEFAULT_ACCOUNT_DEVICES,
  type AccountDevice,
} from "@/lib/account-sessions";
import { cn } from "@/lib/utils";

function MaterialIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span className={cn("material-symbols-outlined", className)}>{name}</span>
  );
}

function DeviceIcon({ name }: { name: string }) {
  const icon = name.toLowerCase().includes("iphone") ? "smartphone" : "laptop_mac";

  return (
    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-[#262626]">
      <MaterialIcon name={icon} className="text-[22px] text-neutral-900 dark:text-white" />
    </div>
  );
}

function DeviceCard({
  device,
  onLogout,
}: {
  device: AccountDevice;
  onLogout?: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="rounded-[1.1rem] border border-neutral-200 bg-white p-4 dark:border-[#262626] dark:bg-[#141414]">
      <div className="flex items-start gap-3.5">
        <DeviceIcon name={device.name} />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-neutral-900 dark:text-white">
            {device.name}
          </p>
          <p className="mt-1 text-sm text-neutral-500 dark:text-[#888888]">
            {device.location}
            {device.browser ? ` • ${device.browser}` : ""}
          </p>
          {device.isCurrent ? (
            <p className="mt-2 flex items-center gap-2 text-sm text-[#34c759]">
              <span className="size-2 rounded-full bg-[#34c759]" />
              {t("platform.profile.manageActiveNow")}
            </p>
          ) : (
            <p className="mt-2 text-sm text-neutral-500 dark:text-[#888888]">
              {device.lastActiveLabel}
            </p>
          )}
        </div>
        {!device.isCurrent && onLogout ? (
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-900 transition-colors hover:border-neutral-400 hover:bg-neutral-100 dark:border-[#333333] dark:text-white dark:hover:border-white/30 dark:hover:bg-white/5"
          >
            <MaterialIcon name="logout" className="text-[14px]" />
            {t("platform.profile.manageDeviceLogout")}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function ManageAccountPanel() {
  const { signOut } = useClerk();
  const { t } = useI18n();
  const [devices, setDevices] = useState(DEFAULT_ACCOUNT_DEVICES);

  const otherDevices = useMemo(
    () => devices.filter((device) => !device.isCurrent),
    [devices],
  );

  function removeDevice(deviceId: string) {
    setDevices((current) => current.filter((device) => device.id !== deviceId));
    toast.success(t("platform.profile.manageDeviceSignedOut"), {
      description: t("platform.profile.manageDeviceSignedOutDesc"),
    });
  }

  function handleSignOutOthers() {
    if (otherDevices.length === 0) {
      toast.info(t("platform.profile.manageNoOtherSessions"), {
        description: t("platform.profile.manageNoOtherSessionsDesc"),
      });
      return;
    }

    setDevices((current) => current.filter((device) => device.isCurrent));
    toast.success(t("platform.profile.manageSignedOutElsewhere"), {
      description: t("platform.profile.manageSignedOutElsewhereDesc"),
    });
  }

  function handleSignOutThisDevice() {
    signOut({ redirectUrl: "/sign-in" });
  }

  function handleAddPasskey() {
    toast.info(t("platform.profile.managePasskeysComingSoon"), {
      description: t("platform.profile.managePasskeysComingSoonDesc"),
    });
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          {t("platform.profile.manageDevicesTitle")}
        </h2>
        <p className="mt-0.5 text-sm leading-5 text-neutral-500 dark:text-[#888888]">
          {t("platform.profile.manageDevicesIntro")}
        </p>
        <div className="mt-2 space-y-2">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onLogout={
                device.isCurrent ? undefined : () => removeDevice(device.id)
              }
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          {t("platform.profile.manageSecurityTitle")}
        </h2>
        <p className="mt-0.5 text-sm leading-5 text-neutral-500 dark:text-[#888888]">
          {t("platform.profile.manageSecurityIntro")}
        </p>

        <div className="mt-2 rounded-[1.35rem] border border-neutral-200 bg-white px-4 py-5 text-center dark:border-[#262626] dark:bg-[#141414]">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-neutral-100 dark:bg-[#1f1f1f]">
            <MaterialIcon
              name="passkey"
              className="text-[28px] text-neutral-500 dark:text-[#888888]"
            />
          </div>
          <p className="text-base font-semibold text-neutral-900 dark:text-white">
            {t("platform.profile.manageNoPasskeys")}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-500 dark:text-[#888888]">
            {t("platform.profile.managePasskeysIntro")}
          </p>
          <button
            type="button"
            onClick={handleAddPasskey}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
          >
            <MaterialIcon name="add" className="text-[18px]" />
            {t("platform.profile.manageAddPasskey")}
          </button>
        </div>
      </section>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleSignOutOthers}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-300 px-4 py-3.5 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-400 hover:bg-neutral-100 dark:border-[#333333] dark:text-white dark:hover:border-white/30 dark:hover:bg-white/5"
        >
          <MaterialIcon name="phonelink_off" className="text-[18px]" />
          {t("platform.profile.manageSignOutOthers")}
        </button>
        <button
          type="button"
          onClick={handleSignOutThisDevice}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[#ff6b6b]/40 px-4 py-3.5 text-sm font-medium text-[#ff6b6b] transition-colors hover:border-[#ff6b6b]/60 hover:bg-[#ff6b6b]/10"
        >
          <MaterialIcon name="logout" className="text-[18px]" />
          {t("platform.profile.manageSignOutThisDevice")}
        </button>
      </div>
    </div>
  );
}
