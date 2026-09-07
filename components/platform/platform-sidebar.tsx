"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { EiloLogo } from "@/components/eilo-logo";
import {
  DesktopSidebar,
  Sidebar,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", label: "Home", icon: "home" },
  { href: "/discover", label: "Discover", icon: "explore" },
  { href: "/live", label: "Live", icon: "sensors" },
  { href: "/profile", label: "Profile", icon: "person" },
] as const;

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}

function MaterialNavIcon({
  name,
  active,
}: {
  name: string;
  active: boolean;
}) {
  return (
    <span
      className={cn(
        "material-symbols-outlined shrink-0 text-[22px]",
        active
          ? "text-neutral-900 dark:text-white"
          : "text-neutral-500 dark:text-[#c4c7c8]",
      )}
      style={
        active
          ? {
              fontVariationSettings:
                "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
            }
          : undefined
      }
    >
      {name}
    </span>
  );
}

function PlatformSidebarLink({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
}) {
  const { open, animate } = useSidebar();
  const collapsed = animate && !open;

  return (
    <Link
      href={href}
      className={cn(
        "group/sidebar flex items-center transition-colors",
        collapsed
          ? "mx-auto size-10 justify-center rounded-full p-0"
          : "justify-start gap-3 rounded-lg px-2 py-2.5",
        active
          ? "bg-black/10 text-neutral-900 dark:bg-white/10 dark:text-white"
          : "text-neutral-600 hover:bg-black/5 hover:text-neutral-900 dark:text-[#c4c7c8] dark:hover:bg-white/5 dark:hover:text-white",
      )}
    >
      <MaterialNavIcon name={icon} active={active} />
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="font-mono text-[12px] font-medium tracking-[0.05em] whitespace-pre transition duration-150 group-hover/sidebar:translate-x-0.5"
      >
        {label}
      </motion.span>
    </Link>
  );
}

function SidebarLogo() {
  const { open, animate } = useSidebar();
  const collapsed = animate && !open;

  return (
    <Link
      href="/home"
      aria-label="Eilo home"
      className={cn(
        "relative z-20 flex items-center py-1",
        collapsed ? "mx-auto justify-center overflow-visible px-0" : "overflow-hidden px-1",
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center transition-all duration-200 ease-in-out",
          collapsed ? "size-10" : "w-[132px]",
        )}
      >
        <EiloLogo
          priority
          variant={collapsed ? "mark" : "wordmark"}
          className={
            collapsed ? "size-7 object-contain object-center" : "h-7 w-auto max-w-none"
          }
        />
      </div>
    </Link>
  );
}

function SidebarAccountProfile() {
  const { open, animate } = useSidebar();
  const { user } = useUser();
  const collapsed = animate && !open;

  const displayName =
    user?.fullName?.trim() ||
    user?.firstName?.trim() ||
    user?.username?.trim() ||
    "Your profile";
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress;
  const avatarUrl = user?.imageUrl;

  return (
    <Link
      href="/profile"
      className={cn(
        "flex min-w-0 items-center transition-colors",
        collapsed
          ? "mx-auto size-10 justify-center rounded-full p-0"
          : "gap-3 rounded-lg px-2 py-2",
        "hover:bg-black/5 dark:hover:bg-white/5",
      )}
    >
      <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 dark:border-[#262626] dark:bg-[#1f1f1f]">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            fill
            className="object-cover"
            sizes="32px"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-[11px] font-semibold text-neutral-900 dark:text-white">
            {getInitials(displayName)}
          </div>
        )}
      </div>

      <motion.div
        animate={{
          display: animate ? (open ? "flex" : "none") : "flex",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="min-w-0 flex-1 flex-col"
      >
        <span className="truncate text-sm font-medium text-neutral-900 dark:text-white">
          {displayName}
        </span>
        {email ? (
          <span className="truncate font-mono text-[11px] tracking-[0.04em] text-neutral-500 dark:text-[#888888]">
            {email}
          </span>
        ) : null}
      </motion.div>
    </Link>
  );
}

function SidebarThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { open, animate } = useSidebar();
  const collapsed = animate && !open;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";
  const label = isDark ? "Light mode" : "Dark mode";
  const icon = isDark ? "light_mode" : "dark_mode";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "flex items-center transition-colors",
        collapsed
          ? "mx-auto size-10 justify-center rounded-full p-0"
          : "w-full justify-start gap-3 rounded-lg px-2 py-2.5",
        "text-neutral-600 hover:bg-black/5 hover:text-neutral-900 dark:text-[#c4c7c8] dark:hover:bg-white/5 dark:hover:text-white",
      )}
    >
      <span className="material-symbols-outlined shrink-0 text-[22px]">{icon}</span>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="font-mono text-[12px] font-medium tracking-[0.05em] whitespace-pre"
      >
        {label}
      </motion.span>
    </button>
  );
}

function SidebarLogoutButton() {
  const { signOut } = useClerk();
  const { open, animate } = useSidebar();
  const collapsed = animate && !open;

  return (
    <button
      type="button"
      onClick={() => signOut({ redirectUrl: "/sign-in" })}
      className={cn(
        "flex items-center transition-colors",
        collapsed
          ? "mx-auto size-10 justify-center rounded-full p-0"
          : "w-full justify-start gap-3 rounded-lg px-2 py-2.5",
        "text-neutral-600 hover:bg-red-500/10 hover:text-red-600 dark:text-[#c4c7c8] dark:hover:bg-red-500/10 dark:hover:text-[#ff6b6b]",
      )}
    >
      <span className="material-symbols-outlined shrink-0 text-[22px]">logout</span>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="font-mono text-[12px] font-medium tracking-[0.05em] whitespace-pre"
      >
        Log out
      </motion.span>
    </button>
  );
}

export function PlatformSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const collapsed = !open;

  return (
    <div className="sticky top-0 flex h-svh shrink-0 flex-col">
      <Sidebar open={open} setOpen={setOpen}>
        <DesktopSidebar
          className={cn(
            "flex h-full min-h-svh flex-col justify-between gap-8 border-r border-neutral-200 bg-neutral-100 py-4 dark:border-[#262626] dark:bg-[#131313]",
            collapsed ? "px-2.5" : "px-4",
          )}
        >
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <SidebarLogo />
          <nav
            className={cn(
              "mt-8 flex flex-col gap-1",
              collapsed && "items-center",
            )}
          >
            {navItems.map(({ href, label, icon }) => {
              const active =
                pathname === href || pathname.startsWith(`${href}/`);

              return (
                <PlatformSidebarLink
                  key={href}
                  href={href}
                  label={label}
                  icon={icon}
                  active={active}
                />
              );
            })}
          </nav>
        </div>

        <div
          className={cn(
            "flex flex-col gap-1",
            collapsed && "items-center",
          )}
        >
          <SidebarThemeToggle />
          <SidebarAccountProfile />
          <SidebarLogoutButton />
        </div>
        </DesktopSidebar>
      </Sidebar>
    </div>
  );
}
