"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/home", label: "Home", icon: "home" },
  { href: "/discover", label: "Discover", icon: "explore" },
  { href: "/studio", label: "Live", icon: "sensors" },
  { href: "/profile", label: "Profile", icon: "person" },
] as const;

export function PlatformBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-[#262626] bg-[#131313]/70 px-4 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      {items.map(({ href, label, icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center pt-2 transition-transform active:scale-90",
              active
                ? "border-t-2 border-white font-bold text-white"
                : "text-[#c4c7c8] hover:text-white",
            )}
          >
            <span
              className="material-symbols-outlined"
              style={
                active
                  ? {
                      fontVariationSettings:
                        "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                    }
                  : undefined
              }
            >
              {icon}
            </span>
            <span className="font-mono text-[12px] font-medium tracking-[0.05em]">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
