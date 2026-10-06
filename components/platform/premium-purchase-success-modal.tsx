"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { useI18n } from "@/components/i18n-provider";
import { formatSubscriptionRenewalDate } from "@/lib/platform-settings";
import {
  formatPremiumPrice,
  getPremiumDisplayPrice,
  type BillingCycle,
} from "@/lib/subscription-checkout";

type PremiumPurchaseSuccessModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  billingCycle: BillingCycle;
  renewsAt: string;
  onGetStarted: () => void;
};

export function PremiumPurchaseSuccessModal({
  open,
  onOpenChange,
  billingCycle,
  renewsAt,
  onGetStarted,
}: PremiumPurchaseSuccessModalProps) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  if (!mounted || !open) {
    return null;
  }

  const billingCycleLabel =
    billingCycle === "annual"
      ? t("platform.profile.billingCycleAnnual")
      : t("platform.profile.billingCycleMonthly");
  const pricePerMonth = formatPremiumPrice(getPremiumDisplayPrice(billingCycle)).replace(
    /\.00$/,
    "",
  );

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[rgba(15,15,15,0.45)] p-6 backdrop-blur-sm dark:bg-[rgba(0,0,0,0.7)]">
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="premium-success-title"
        aria-describedby="premium-success-description"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.32, ease: [0.2, 0, 0, 1] }}
        className="relative mx-auto flex w-full max-w-md flex-col items-center overflow-hidden rounded-[20px] border border-[#e5e5e5] bg-white p-6 text-center shadow-[0_16px_28px_rgba(0,0,0,0.12)] dark:border-[#262626] dark:bg-[#141414] dark:shadow-[0_16px_28px_rgba(0,0,0,0.45)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 left-1/2 size-56 -translate-x-1/2 rounded-full bg-black/[0.04] blur-3xl dark:bg-white/[0.06]"
        />

        <div className="relative mb-6 flex size-16 items-center justify-center rounded-full border border-[#34c759]/35 bg-[#34c759]/12">
          <span className="material-symbols-outlined text-[30px] text-[#34c759]">
            check
          </span>
        </div>

        <h2
          id="premium-success-title"
          className="relative mb-3 text-[1.75rem] font-bold tracking-tight text-[#171717] sm:text-[2rem] dark:text-white"
        >
          {t("platform.profile.premiumWelcomeTitle")}
        </h2>

        <p
          id="premium-success-description"
          className="relative mb-8 max-w-sm text-pretty text-base leading-7 text-[#737373] dark:text-[#888888]"
        >
          {t("platform.profile.premiumWelcomeDesc")}
        </p>

        <div className="relative mb-8 w-full rounded-[18px] border border-[#e5e5e5] bg-[#fafafa] px-5 py-4 text-left dark:border-[#262626] dark:bg-[#1a1a1a]">
          <div className="flex items-center justify-between gap-4 py-1">
            <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-[#737373] uppercase dark:text-[#888888]">
              {t("platform.profile.premiumActivePlan")}
            </span>
            <span className="text-[15px] font-semibold text-[#171717] dark:text-white">
              {billingCycleLabel}
            </span>
          </div>

          <div className="my-3 h-px bg-[#e5e5e5] dark:bg-[#262626]" />

          <div className="flex items-start justify-between gap-4 py-1">
            <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-[#737373] uppercase dark:text-[#888888]">
              {t("platform.profile.premiumNextBilling")}
            </span>
            <div className="text-right">
              <p className="text-[15px] font-semibold tabular-nums text-[#171717] dark:text-white">
                {pricePerMonth}
                {t("platform.profile.checkoutPerMonth")}
              </p>
              <p className="mt-1 text-sm text-[#737373] dark:text-[#888888]">
                {formatSubscriptionRenewalDate(renewsAt)}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onGetStarted}
          className="relative w-full rounded-full bg-[#34c759] px-4 py-4 text-sm font-bold tracking-[0.12em] text-black uppercase transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:opacity-95 active:scale-[0.96]"
        >
          {t("platform.profile.checkoutGetStarted")}
        </button>
      </motion.div>
    </div>,
    document.body,
  );
}
