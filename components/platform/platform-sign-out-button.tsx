"use client";

import { useClerk } from "@clerk/nextjs";

import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";

type PlatformSignOutButtonProps = {
  className?: string;
  variant?: "button" | "row";
};

export function PlatformSignOutButton({
  className,
  variant = "button",
}: PlatformSignOutButtonProps) {
  const { signOut } = useClerk();
  const { t } = useI18n();

  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={() => signOut({ redirectUrl: "/sign-in" })}
        className={cn(
          "flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-white/[0.03]",
          className,
        )}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-red-500/10">
          <span className="material-symbols-outlined text-[20px] text-[#ff6b6b]">logout</span>
        </div>
        <p className="flex-1 text-[15px] font-medium text-[#ff6b6b]">
          {t("platform.profile.logOut")}
        </p>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signOut({ redirectUrl: "/sign-in" })}
      className={cn(
        "rounded-full border border-neutral-200 bg-white px-6 py-2.5 font-mono text-[12px] font-medium tracking-[0.05em] text-neutral-900 transition-colors hover:border-neutral-400 hover:bg-neutral-100 dark:border-[#262626] dark:bg-[#1f1f1f] dark:text-white dark:hover:border-white/30 dark:hover:bg-white/10",
        className,
      )}
    >
      {t("platform.profile.logOut")}
    </button>
  );
}
