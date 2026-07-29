"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/library", label: "Library", icon: Library },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export function PlatformBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex h-20 w-full items-center justify-around border-t border-[#262626] bg-[#131313]/70 px-4 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center transition-transform active:scale-90",
              active
                ? "font-bold text-white"
                : "text-[#c4c7c8] hover:text-white",
            )}
          >
            <Icon
              className="size-6"
              strokeWidth={active ? 2.25 : 1.75}
              fill={active ? "currentColor" : "none"}
            />
            <span className="mt-0.5 font-mono text-[12px] font-medium uppercase tracking-[0.05em]">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
