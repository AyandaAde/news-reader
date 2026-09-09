"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Home,
  LogOut,
  Moon,
  Radio,
  Sun,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EiloLogo } from "@/components/eilo-logo";
import {
  DesktopSidebar,
  Sidebar,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/live", label: "Live", icon: Radio },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export type PlatformSidebarProps = {
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}

function SidebarNavIcon({
  icon: Icon,
  active,
}: {
  icon: LucideIcon;
  active: boolean;
}) {
  return (
    <Icon
      className={cn(
        "size-[18px] shrink-0",
        active
          ? "text-neutral-900 dark:text-white"
          : "text-neutral-500 dark:text-[#c4c7c8]",
      )}
      strokeWidth={active ? 2.5 : 2}
      aria-hidden
    />
  );
}

function PlatformSidebarLink({
  href,
  label,
  icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  onNavigate?: () => void;
}) {
  const { open, animate } = useSidebar();
  const collapsed = animate && !open;

  return (
    <Link
      href={href}
      onClick={() => onNavigate?.()}
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
      <SidebarNavIcon icon={icon} active={active} />
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

function SidebarLogo({ onNavigate }: { onNavigate?: () => void }) {
  const { open, animate } = useSidebar();
  const collapsed = animate && !open;

  return (
    <Link
      href="/home"
      aria-label="Eilo home"
      onClick={() => onNavigate?.()}
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

function SidebarAccountProfile({ onNavigate }: { onNavigate?: () => void }) {
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
      onClick={() => onNavigate?.()}
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
  const ThemeIcon = isDark ? Sun : Moon;

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
      <ThemeIcon className="size-[18px] shrink-0" strokeWidth={2} aria-hidden />
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
      <LogOut className="size-[18px] shrink-0" strokeWidth={2} aria-hidden />
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

function PlatformSidebarPanel({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { open, animate } = useSidebar();
  const collapsed = animate && !open;

  return (
    <>
      <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
        <SidebarLogo onNavigate={onNavigate} />
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
                onNavigate={onNavigate}
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
        <SidebarAccountProfile onNavigate={onNavigate} />
        <SidebarLogoutButton />
      </div>
    </>
  );
}

export function PlatformSidebar({
  mobileOpen = false,
  onMobileOpenChange,
}: PlatformSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const collapsed = !open;

  useEffect(() => {
    onMobileOpenChange?.(false);
  }, [pathname, onMobileOpenChange]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  function closeMobileMenu() {
    onMobileOpenChange?.(false);
  }

  return (
    <>
      <div className="sticky top-0 hidden h-svh shrink-0 flex-col md:flex">
        <Sidebar open={open} setOpen={setOpen}>
          <DesktopSidebar
            className={cn(
              "flex h-full min-h-svh flex-col justify-between gap-8 border-r border-neutral-200 bg-neutral-100 py-4 dark:border-[#262626] dark:bg-[#131313]",
              collapsed ? "px-2.5" : "px-4",
            )}
          >
            <PlatformSidebarPanel />
          </DesktopSidebar>
        </Sidebar>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[70] bg-black/60 md:hidden"
              onClick={closeMobileMenu}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-[80] flex w-[min(300px,85vw)] flex-col border-r border-[#262626] bg-[#131313] px-4 py-4 pb-[env(safe-area-inset-bottom)] md:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-[0.08em] text-[#888888] uppercase">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={closeMobileMenu}
                  aria-label="Close menu"
                  className="flex size-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                >
                  <X className="size-5" strokeWidth={2} aria-hidden />
                </button>
              </div>

              <Sidebar open setOpen={() => {}} animate={false}>
                <div className="flex min-h-0 flex-1 flex-col justify-between gap-8 overflow-y-auto">
                  <PlatformSidebarPanel onNavigate={closeMobileMenu} />
                </div>
              </Sidebar>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
