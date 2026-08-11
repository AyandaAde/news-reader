"use client";

import { useClerk } from "@clerk/nextjs";

import { cn } from "@/lib/utils";

type PlatformSignOutButtonProps = {
  className?: string;
};

export function PlatformSignOutButton({ className }: PlatformSignOutButtonProps) {
  const { signOut } = useClerk();

  return (
    <button
      type="button"
      onClick={() => signOut({ redirectUrl: "/sign-in" })}
      className={cn(
        "rounded-full border border-[#262626] bg-[#1f1f1f] px-6 py-2.5 font-mono text-[12px] font-medium tracking-[0.05em] text-white transition-colors hover:border-white/30 hover:bg-white/10",
        className,
      )}
    >
      Sign Out
    </button>
  );
}
