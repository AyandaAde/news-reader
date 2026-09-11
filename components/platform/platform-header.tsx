"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { EiloLogo } from "@/components/eilo-logo";
import { cn } from "@/lib/utils";

type PlatformHeaderProps = {
  mobileMenuOpen?: boolean;
  onMobileMenuOpen?: () => void;
};

export function PlatformHeader({
  mobileMenuOpen = false,
  onMobileMenuOpen,
}: PlatformHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-[60] flex h-14 shrink-0 items-center justify-between border-b px-4 backdrop-blur-xl md:hidden",
        "border-neutral-200 bg-white/95 text-neutral-900",
        "dark:border-[#262626] dark:bg-[#131313]/95 dark:text-white",
      )}
    >
      <Link href="/home" aria-label="Eilo home" className="flex items-center">
        <EiloLogo priority variant="wordmark" className="h-6 w-auto" />
      </Link>

      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={mobileMenuOpen}
        onClick={onMobileMenuOpen}
        className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-neutral-100 dark:hover:bg-white/10"
      >
        <Menu className="size-6" strokeWidth={2} aria-hidden />
      </button>
    </header>
  );
}
