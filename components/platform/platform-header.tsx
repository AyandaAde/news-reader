"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Menu, Search } from "lucide-react";

export function PlatformHeader() {
  return (
    <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[#262626] bg-[#131313]/70 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="transition-opacity hover:opacity-80 active:scale-95"
          aria-label="Open menu"
        >
          <Menu className="size-6 text-white" strokeWidth={1.75} />
        </button>
        <Link
          href="/home"
          className="text-2xl font-bold tracking-tighter text-white sm:text-3xl"
        >
          EILO
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="transition-opacity hover:opacity-80 active:scale-95"
          aria-label="Search"
        >
          <Search className="size-6 text-white" strokeWidth={1.75} />
        </button>
        <div className="flex size-8 items-center justify-center overflow-hidden rounded-full border border-[#262626] bg-[#2a2a2a] active:scale-95">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-8",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
