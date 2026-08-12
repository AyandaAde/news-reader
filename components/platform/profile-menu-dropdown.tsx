"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type ProfileMenuDropdownProps = {
  onEditProfile: () => void;
  profileName: string;
};

function DropdownMenuIcon() {
  return (
    <span className="flex h-[14px] w-[18px] flex-col items-center justify-between">
      <span className="h-[2.5px] w-[18px] rounded-full bg-white" />
      <span className="h-[2.5px] w-[12px] rounded-full bg-white" />
      <span className="h-[2.5px] w-[7px] rounded-full bg-white" />
    </span>
  );
}

export function ProfileMenuDropdown({
  onEditProfile,
  profileName,
}: ProfileMenuDropdownProps) {
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
      title: `${profileName} on Eilo`,
      text: `Check out ${profileName}'s profile on Eilo`,
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
        aria-label="Profile options"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex size-10 items-center justify-center rounded-full border border-[#262626] bg-[#1f1f1f] text-white transition-colors hover:border-white/30 hover:bg-white/10"
      >
        <DropdownMenuIcon />
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-[min(calc(100vw-2rem),196px)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[#262626] bg-[#1f1f1f] shadow-xl">
          <button
            type="button"
            onClick={handleEditProfile}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-[15px] text-white transition-colors hover:bg-white/5"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Profile
          </button>

          <div className="h-px bg-[#262626]" />

          <button
            type="button"
            onClick={handleShare}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-[15px] text-white transition-colors hover:bg-white/5"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            Share
          </button>

          <div className="h-px bg-[#262626]" />

          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-3.5 text-left text-[15px] text-[#ff6b6b] transition-colors hover:bg-white/5",
            )}
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );
}
