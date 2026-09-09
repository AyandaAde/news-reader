"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { EiloLogo } from "@/components/eilo-logo";

type PlatformHeaderProps = {
  mobileMenuOpen?: boolean;
  onMobileMenuOpen?: () => void;
};

export function PlatformHeader({
  mobileMenuOpen = false,
  onMobileMenuOpen,
}: PlatformHeaderProps) {
  return (
    <header className="sticky top-0 z-[60] flex h-14 shrink-0 items-center justify-between border-b border-[#262626] bg-[#131313]/95 px-4 backdrop-blur-xl md:hidden">
      <Link href="/home" aria-label="Eilo home" className="flex items-center">
        <EiloLogo priority variant="wordmark" className="h-6 w-auto" />
      </Link>

      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={mobileMenuOpen}
        onClick={onMobileMenuOpen}
        className="flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
      >
        <Menu className="size-6" strokeWidth={2} aria-hidden />
      </button>
    </header>
  );
}
