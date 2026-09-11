"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { formatSubscriptionRenewalDate } from "@/lib/platform-settings";
import {
  formatPremiumPricePerMonth,
  getBillingCycleLabel,
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

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-neutral-900/40 p-6 backdrop-blur-sm dark:bg-[#121212]/95">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="premium-success-title"
        aria-describedby="premium-success-description"
        className="relative mx-auto flex w-full max-w-md flex-col items-center rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-xl dark:border-[#262626] dark:bg-[#141414]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-8 left-1/2 size-56 -translate-x-1/2 rounded-full bg-neutral-900/[0.04] blur-3xl dark:bg-white/[0.06]"
        />

        <div className="relative mb-6 flex size-16 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
          <span className="material-symbols-outlined text-[30px] text-neutral-900 dark:text-white">
            check
          </span>
        </div>

        <h2
          id="premium-success-title"
          className="mb-3 text-[1.75rem] font-bold tracking-tight text-neutral-900 sm:text-[2rem] dark:text-white"
        >
          Welcome to Premium
        </h2>

        <p
          id="premium-success-description"
          className="mb-8 max-w-sm text-base leading-7 text-neutral-500 dark:text-[#8e8e8e]"
        >
          Your subscription is now active. Make your inbox something worth
          listening to.
        </p>

        <div className="mb-8 w-full rounded-[1.15rem] border border-neutral-200 bg-neutral-50 px-5 py-4 text-left dark:border-[#262626] dark:bg-[#1a1a1a]">
          <div className="flex items-center justify-between gap-4 py-1">
            <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-neutral-500 uppercase dark:text-[#8e8e8e]">
              Active plan
            </span>
            <span className="text-[15px] font-semibold text-neutral-900 dark:text-white">
              {getBillingCycleLabel(billingCycle)}
            </span>
          </div>

          <div className="my-3 h-px bg-neutral-200 dark:bg-[#262626]" />

          <div className="flex items-start justify-between gap-4 py-1">
            <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-neutral-500 uppercase dark:text-[#8e8e8e]">
              Next billing
            </span>
            <div className="text-right">
              <p className="text-[15px] font-semibold text-neutral-900 dark:text-white">
                {formatPremiumPricePerMonth(billingCycle)}
              </p>
              <p className="mt-1 text-sm text-neutral-500 dark:text-[#8e8e8e]">
                {formatSubscriptionRenewalDate(renewsAt)}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onGetStarted}
          className="w-full rounded-[0.85rem] bg-neutral-900 px-4 py-4 text-sm font-bold tracking-[0.14em] text-white uppercase transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
        >
          Get Started
        </button>
      </div>
    </div>,
    document.body,
  );
}
