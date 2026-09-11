"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const EILO_LOGO_LIGHT = "/images/logo.png";
export const EILO_LOGO_DARK = "/images/logo-dark.png";
export const EILO_MARK_LIGHT = "/images/e-mark-light.png";
export const EILO_MARK_DARK = "/images/e-mark-dark.png";

const wordmarkDimensions = {
  light: { width: 668, height: 315 },
  dark: { width: 671, height: 446 },
} as const;

const markDimensions = {
  width: 360,
  height: 360,
} as const;

const fullDimensions = {
  light: { width: 120, height: 40 },
  dark: { width: 120, height: 40 },
} as const;

export function EiloLogo({
  className,
  priority = false,
  variant = "full",
  forceTheme,
}: {
  className?: string;
  priority?: boolean;
  variant?: "full" | "wordmark" | "mark";
  /** Force a logo color independent of the app theme (e.g. always light on dark chrome). */
  forceTheme?: "light" | "dark";
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark =
    forceTheme === "dark"
      ? true
      : forceTheme === "light"
        ? false
        : !mounted || resolvedTheme === "dark";

  if (variant === "mark") {
    // mark-dark = white glyph for dark backgrounds; mark-light = dark glyph for light backgrounds
    const markSrc = isDark ? EILO_MARK_DARK : EILO_MARK_LIGHT;

    return (
      <Image
        src={markSrc}
        alt="Eilo"
        width={markDimensions.width}
        height={markDimensions.height}
        priority={priority}
        className={cn("block object-contain object-center", className)}
      />
    );
  }

  // logo-dark = white wordmark for dark backgrounds; logo.png = dark wordmark for light backgrounds
  const src = isDark ? EILO_LOGO_DARK : EILO_LOGO_LIGHT;
  const dimensions =
    variant === "wordmark"
      ? wordmarkDimensions[isDark ? "dark" : "light"]
      : fullDimensions[isDark ? "dark" : "light"];

  return (
    <Image
      src={src}
      alt="Eilo"
      width={dimensions.width}
      height={dimensions.height}
      priority={priority}
      className={cn(
        variant === "wordmark"
          ? "h-6 w-auto max-w-none object-contain"
          : "h-6 w-auto object-contain sm:h-7 dark:sm:h-8",
        className,
      )}
    />
  );
}
