"use client";

import { useClerk } from "@clerk/nextjs";
import { useMemo, useState } from "react";
import { toast } from "sonner";
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
    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#262626]">
      <MaterialIcon name={icon} className="text-[22px] text-white" />
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
  return (
    <div className="rounded-[1.1rem] border border-[#262626] bg-[#141414] p-4">
      <div className="flex items-start gap-3.5">
        <DeviceIcon name={device.name} />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-white">{device.name}</p>
          <p className="mt-1 text-sm text-[#888888]">
            {device.location}
            {device.browser ? ` • ${device.browser}` : ""}
          </p>
          {device.isCurrent ? (
            <p className="mt-2 flex items-center gap-2 text-sm text-[#34c759]">
              <span className="size-2 rounded-full bg-[#34c759]" />
              Active now • This device
            </p>
          ) : (
            <p className="mt-2 text-sm text-[#888888]">{device.lastActiveLabel}</p>
          )}
        </div>
        {!device.isCurrent && onLogout ? (
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#333333] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:border-white/30 hover:bg-white/5"
          >
            <MaterialIcon name="logout" className="text-[14px]" />
            Log out
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function ManageAccountPanel() {
  const { signOut } = useClerk();
  const [devices, setDevices] = useState(DEFAULT_ACCOUNT_DEVICES);

  const otherDevices = useMemo(
    () => devices.filter((device) => !device.isCurrent),
    [devices],
  );

  function removeDevice(deviceId: string) {
    setDevices((current) => current.filter((device) => device.id !== deviceId));
    toast.success("Device signed out", {
      description: "That session has been removed from your account.",
    });
  }

  function handleSignOutOthers() {
    if (otherDevices.length === 0) {
      toast.info("No other sessions", {
        description: "You are only signed in on this device.",
      });
      return;
    }

    setDevices((current) => current.filter((device) => device.isCurrent));
    toast.success("Signed out everywhere else", {
      description: "All other devices have been signed out.",
    });
  }

  function handleSignOutThisDevice() {
    signOut({ redirectUrl: "/sign-in" });
  }

  function handleAddPasskey() {
    toast.info("Passkeys coming soon", {
      description: "Face ID, Touch ID, and hardware key support will be available soon.",
    });
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <section>
        <h2 className="text-lg font-semibold text-white">Devices & Sessions</h2>
        <p className="mt-0.5 text-sm leading-5 text-[#888888]">
          Manage the devices actively logged into your account.
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
        <h2 className="text-lg font-semibold text-white">Security & Passkeys</h2>
        <p className="mt-0.5 text-sm leading-5 text-[#888888]">
          Secure your account with biometric or hardware keys.
        </p>

        <div className="mt-2 rounded-[1.35rem] border border-[#262626] bg-[#141414] px-4 py-5 text-center">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-[#1f1f1f]">
            <MaterialIcon name="passkey" className="text-[28px] text-[#888888]" />
          </div>
          <p className="text-base font-semibold text-white">No passkeys added yet</p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#888888]">
            Sign in faster and more securely using Face ID, Touch ID, or a hardware
            security key.
          </p>
          <button
            type="button"
            onClick={handleAddPasskey}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            <MaterialIcon name="add" className="text-[18px]" />
            Add Passkey
          </button>
        </div>
      </section>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleSignOutOthers}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[#333333] px-4 py-3.5 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/5"
        >
          <MaterialIcon name="phonelink_off" className="text-[18px]" />
          Sign out of all other devices
        </button>
        <button
          type="button"
          onClick={handleSignOutThisDevice}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[#ff6b6b]/40 px-4 py-3.5 text-sm font-medium text-[#ff6b6b] transition-colors hover:border-[#ff6b6b]/60 hover:bg-[#ff6b6b]/10"
        >
          <MaterialIcon name="logout" className="text-[18px]" />
          Sign out of this device
        </button>
      </div>
    </div>
  );
}
