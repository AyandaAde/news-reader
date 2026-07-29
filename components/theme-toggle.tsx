"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "my-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#9a9aa0] bg-[#ececef] text-[#3a3a40] transition-colors hover:bg-[#f5f5f7] hover:text-[#1a1a1c] dark:border-[#353437] dark:bg-[#1f1f21] dark:text-[#cdc2d8] dark:hover:bg-[#2a2a2c] dark:hover:text-[#e4e2e4]",
        className,
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
    </button>
  );
}
