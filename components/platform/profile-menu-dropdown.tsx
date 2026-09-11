"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";

import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";

type ProfileMenuDropdownProps = {
  onEditProfile: () => void;
  profileName: string;
};

function DropdownMenuIcon() {
  return (
    <span className="flex h-[14px] w-[18px] flex-col items-center justify-between">
      <span className="h-[2.5px] w-[18px] rounded-full bg-neutral-900 dark:bg-white" />
      <span className="h-[2.5px] w-[12px] rounded-full bg-neutral-900 dark:bg-white" />
      <span className="h-[2.5px] w-[7px] rounded-full bg-neutral-900 dark:bg-white" />
    </span>
  );
}

export function ProfileMenuDropdown({
  onEditProfile,
  profileName,
}: ProfileMenuDropdownProps) {
  const { t } = useI18n();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const closeMenu = () => setOpen(false);

  const handleEditProfile = () => {
    closeMenu();
    onEditProfile();
  };

  const handleShare = async () => {
    closeMenu();

    const shareData = {
      title: t("platform.profile.shareTitle", { name: profileName }),
      text: t("platform.profile.shareText", { name: profileName }),
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User dismissed the share sheet.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
    } catch {
      // Clipboard unavailable.
    }
  };

  const handleLogout = () => {
    closeMenu();
    signOut({ redirectUrl: "/sign-in" });
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label={t("platform.profile.menuOptions")}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 transition-colors hover:border-neutral-400 hover:bg-neutral-100 dark:border-[#262626] dark:bg-[#1f1f1f] dark:text-white dark:hover:border-white/30 dark:hover:bg-white/10"
      >
        <DropdownMenuIcon />
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-[min(calc(100vw-2rem),196px)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-[#262626] dark:bg-[#1f1f1f]">
          <button
            type="button"
            onClick={handleEditProfile}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-[15px] text-neutral-900 transition-colors hover:bg-neutral-100 dark:text-white dark:hover:bg-white/5"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            {t("platform.profile.editProfile")}
          </button>

          <div className="h-px bg-neutral-200 dark:bg-[#262626]" />

          <button
            type="button"
            onClick={handleShare}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-[15px] text-neutral-900 transition-colors hover:bg-neutral-100 dark:text-white dark:hover:bg-white/5"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            {t("platform.profile.share")}
          </button>

          <div className="h-px bg-neutral-200 dark:bg-[#262626]" />

          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-3.5 text-left text-[15px] text-[#ff6b6b] transition-colors hover:bg-neutral-100 dark:hover:bg-white/5",
            )}
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            {t("platform.profile.logOut")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
