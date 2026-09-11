"use client";

import { useState } from "react";
import { PremiumPurchaseSuccessModal } from "@/components/platform/premium-purchase-success-modal";
import {
  formatPremiumPrice,
  getPremiumDisplayPrice,
  getPremiumRenewalDate,
  PREMIUM_CHECKOUT_FEATURES,
  type BillingCycle,
} from "@/lib/subscription-checkout";
import {
  loadPlatformSettings,
  savePlatformSettings,
} from "@/lib/platform-settings";
import { cn } from "@/lib/utils";

function MaterialIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span className={cn("material-symbols-outlined", className)}>{name}</span>
  );
}

type SubscriptionCheckoutPanelProps = {
  onPurchaseComplete?: () => void;
};

export function SubscriptionCheckoutPanel({
  onPurchaseComplete,
}: SubscriptionCheckoutPanelProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [submitting, setSubmitting] = useState(false);
  const [successDetails, setSuccessDetails] = useState<{
    billingCycle: BillingCycle;
    renewsAt: string;
  } | null>(null);

  const displayPrice = getPremiumDisplayPrice(billingCycle);

  function handleGetStarted() {
    setSubmitting(true);

    const renewsAt = getPremiumRenewalDate(billingCycle);
    const current = loadPlatformSettings();
    savePlatformSettings({
      ...current,
      subscriptionPlan: "premium",
      subscriptionRenewsAt: renewsAt,
    });

    setSuccessDetails({ billingCycle, renewsAt });
    setSubmitting(false);
  }

  function handleContinueAfterPurchase() {
    setSuccessDetails(null);
    onPurchaseComplete?.();
  }

  return (
    <>
      <PremiumPurchaseSuccessModal
        open={successDetails !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSuccessDetails(null);
          }
        }}
        billingCycle={successDetails?.billingCycle ?? billingCycle}
        renewsAt={successDetails?.renewsAt ?? getPremiumRenewalDate(billingCycle)}
        onGetStarted={handleContinueAfterPurchase}
      />

      <div className="mx-auto w-full max-w-4xl space-y-8 pb-4">
        <div>
          <p className="mb-3 font-mono text-[11px] font-medium tracking-[0.22em] text-neutral-500 uppercase dark:text-[#888888]">
            Acoustic Noir
          </p>
          <h2 className="mb-3 text-[1.75rem] font-bold leading-[1.1] tracking-tight text-neutral-900 sm:text-[2rem] dark:text-white">
            Elevate Your Listening
          </h2>
          <p className="max-w-md text-base leading-7 text-neutral-500 dark:text-[#888888]">
            Experience pure, uncompromised audio focus.
          </p>
        </div>

        <div className="inline-flex w-full max-w-[320px] rounded-full border border-neutral-300 p-1 dark:border-[#333333]">
          {(["monthly", "annual"] as const).map((cycle) => {
            const active = billingCycle === cycle;

            return (
              <button
                key={cycle}
                type="button"
                onClick={() => setBillingCycle(cycle)}
                className={cn(
                  "relative flex flex-1 items-center justify-center rounded-full px-4 py-2.5 font-mono text-[12px] font-medium tracking-[0.08em] transition-colors",
                  active
                    ? "text-neutral-900 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-900 dark:text-[#888888] dark:hover:text-white",
                )}
              >
                {active ? (
                  <span className="absolute inset-0 rounded-full bg-neutral-100 dark:bg-[#1a1a1a]" />
                ) : null}
                <span className="relative z-10 capitalize">{cycle}</span>
                {cycle === "annual" ? (
                  <span className="relative z-10 ml-2 rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold tracking-[0.04em] text-white shadow-[0_0_12px_rgba(0,0,0,0.12)] dark:bg-white dark:text-black dark:shadow-[0_0_12px_rgba(255,255,255,0.35)]">
                    Save 20%
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="rounded-[1.35rem] border border-neutral-200 bg-neutral-50 p-6 sm:p-7 dark:border-[#333333] dark:bg-black">
          <div className="mb-5 flex items-center gap-2">
            <h3 className="text-[1.65rem] font-bold text-neutral-900 dark:text-white">
              Premium
            </h3>
            <MaterialIcon
              name="auto_awesome"
              className="text-[18px] text-neutral-900 dark:text-white"
            />
          </div>

          <div className="mb-6 flex items-end gap-1">
            <span className="text-[2.35rem] font-bold leading-none tracking-tight text-neutral-900 dark:text-white">
              {formatPremiumPrice(displayPrice)}
            </span>
            <span className="pb-1 text-lg font-medium text-neutral-500 dark:text-[#888888]">
              /mo
            </span>
          </div>

          {billingCycle === "annual" ? (
            <p className="mb-6 text-sm text-neutral-500 dark:text-[#888888]">
              Billed annually at {formatPremiumPrice(displayPrice * 12)}. Save 20%
              vs monthly.
            </p>
          ) : null}

          <ul className="mb-8 space-y-4">
            {PREMIUM_CHECKOUT_FEATURES.map(({ icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 text-[15px] text-neutral-900 dark:text-white"
              >
                <MaterialIcon
                  name={icon}
                  className="text-[20px] text-neutral-900 dark:text-white"
                />
                <span>{label}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={handleGetStarted}
            disabled={submitting}
            className="w-full rounded-[0.85rem] bg-neutral-900 px-4 py-4 text-sm font-bold tracking-[0.14em] text-white uppercase transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
          >
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}
