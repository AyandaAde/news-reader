"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { PremiumPurchaseSuccessModal } from "@/components/platform/premium-purchase-success-modal";
import {
  formatPremiumPrice,
  getPremiumAnnualSavings,
  getPremiumAnnualTotal,
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

const easeOut = [0.2, 0, 0, 1] as const;

function MaterialIcon({
  name,
  filled,
  className,
}: {
  name: string;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn("material-symbols-outlined", className)}
      style={
        filled
          ? { fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24" }
          : undefined
      }
    >
      {name}
    </span>
  );
}

const FAQ_ITEMS = [
  {
    questionKey: "platform.profile.checkoutFaqChangeQ",
    answerKey: "platform.profile.checkoutFaqChangeA",
  },
  {
    questionKey: "platform.profile.checkoutFaqBriefingsQ",
    answerKey: "platform.profile.checkoutFaqBriefingsA",
  },
  {
    questionKey: "platform.profile.checkoutFaqVoicesQ",
    answerKey: "platform.profile.checkoutFaqVoicesA",
  },
] as const;

type SubscriptionCheckoutPanelProps = {
  onPurchaseComplete?: () => void;
};

export function SubscriptionCheckoutPanel({
  onPurchaseComplete,
}: SubscriptionCheckoutPanelProps) {
  const { t } = useI18n();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [successDetails, setSuccessDetails] = useState<{
    billingCycle: BillingCycle;
    renewsAt: string;
  } | null>(null);

  const displayPrice = getPremiumDisplayPrice(billingCycle);
  const billingNote =
    billingCycle === "annual"
      ? t("platform.profile.checkoutBilledAnnuallyFull", {
          amount: formatPremiumPrice(getPremiumAnnualTotal()),
          savings: formatPremiumPrice(getPremiumAnnualSavings()),
        })
      : t("platform.profile.checkoutBilledMonthly");

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

      <div className="relative mx-auto flex w-full max-w-[420px] flex-col gap-[26px] pb-9 sm:max-w-md">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-6 left-1/2 h-[180px] w-[320px] -translate-x-1/2 rounded-full bg-gradient-to-b from-black/[0.08] to-transparent blur-2xl dark:from-white/14"
        />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: easeOut }}
          className="relative flex flex-col items-center gap-[22px] py-1"
        >
          <div className="flex flex-col items-center gap-2.5 px-2 text-center">
            <div className="mb-0.5 inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-[#f5f5f5] px-3 py-1.5 dark:border-[#262626] dark:bg-[#1f1f1f]">
              <span className="relative flex size-2.5 items-center justify-center">
                <span className="absolute size-1.5 animate-ping rounded-full bg-[#34c759]/50" />
                <span className="size-1.5 rounded-full bg-[#34c759]" />
              </span>
              <span className="font-mono text-[10px] font-medium tracking-[0.12em] text-[#525252] uppercase dark:text-[#888888]">
                {t("platform.profile.checkoutEyebrow")}
              </span>
            </div>
            <h2 className="max-w-[300px] text-balance text-[32px] leading-[38px] font-bold tracking-[-0.02em] text-[#171717] dark:text-white">
              {t("platform.profile.checkoutTitle")}
            </h2>
            <p className="max-w-[300px] text-pretty text-[15px] leading-[22px] text-[#737373] dark:text-[#888888]">
              {t("platform.profile.checkoutSubtitle")}
            </p>
          </div>

          <div className="relative flex items-center gap-0.5 rounded-full border border-[#e5e5e5] bg-[#fafafa] p-1 dark:border-[#262626] dark:bg-[#1b1b1b]">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "relative isolate min-h-9 rounded-full px-3.5 py-1.5 font-mono text-[11px] font-medium tracking-[0.07em] transition-[color] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                billingCycle === "monthly"
                  ? "text-white dark:text-black"
                  : "text-[#737373] hover:text-[#171717] dark:text-[#888888] dark:hover:text-white",
              )}
            >
              {billingCycle === "monthly" ? (
                <motion.span
                  layoutId="billing-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-[#171717] dark:bg-white"
                  transition={{ type: "spring", duration: 0.35, bounce: 0 }}
                />
              ) : null}
              <span className="relative">{t("platform.profile.checkoutMonthly")}</span>
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={cn(
                "relative isolate flex min-h-9 items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[11px] font-medium tracking-[0.07em] transition-[color] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                billingCycle === "annual"
                  ? "text-white dark:text-black"
                  : "text-[#737373] hover:text-[#171717] dark:text-[#888888] dark:hover:text-white",
              )}
            >
              {billingCycle === "annual" ? (
                <motion.span
                  layoutId="billing-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-[#171717] dark:bg-white"
                  transition={{ type: "spring", duration: 0.35, bounce: 0 }}
                />
              ) : null}
              <span className="relative">{t("platform.profile.checkoutAnnual")}</span>
              <span
                className={cn(
                  "relative rounded-full px-1.5 py-0.5 text-[9px] tracking-[0.07em] uppercase transition-colors duration-200",
                  billingCycle === "annual"
                    ? "bg-white/15 text-white dark:bg-black/10 dark:text-black"
                    : "bg-[#34c759]/15 text-[#1f8f3f] dark:bg-[#34c759]/15 dark:text-[#34c759]",
                )}
              >
                {t("platform.profile.checkoutSavePercent")}
              </span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: easeOut }}
          className="relative overflow-hidden rounded-[20px] border border-[#e5e5e5] bg-white px-[18px] pt-[22px] pb-[18px] shadow-[0_16px_28px_rgba(0,0,0,0.08)] dark:border-white/[0.08] dark:bg-[#0D0D0D] dark:shadow-[0_16px_28px_rgba(0,0,0,0.45)]"
        >
          <div
            aria-hidden
            className="absolute top-0 right-7 left-7 h-[1.5px] bg-gradient-to-r from-transparent via-[#34c759]/55 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#34c759]/[0.03] to-transparent dark:from-[#34c759]/[0.04]"
          />

          <div className="relative mb-[18px] flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-center gap-2">
                <h3 className="text-[21px] leading-[26px] font-semibold tracking-[-0.02em] text-[#171717] dark:text-white">
                  {t("platform.profile.subscriptionPlanPremium")}
                </h3>
                <span className="flex size-6 items-center justify-center rounded-full bg-[#f5f5f5] dark:bg-[#1f1f1f]">
                  <MaterialIcon
                    name="auto_awesome"
                    filled
                    className="text-[14px] text-[#171717] dark:text-white"
                  />
                </span>
              </div>
              <p className="text-[12px] leading-[17px] tracking-[0.02em] text-[#737373] dark:text-[#888888]">
                {t("platform.profile.checkoutPlanTagline")}
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-[#e5e5e5] bg-[#f5f5f5] px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] text-[#171717] uppercase dark:border-[#262626] dark:bg-[#1f1f1f] dark:text-white">
              {t("platform.profile.checkoutTier")}
            </span>
          </div>

          <div className="relative mb-4">
            <div className="mb-1.5 flex items-baseline gap-1.5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={billingCycle}
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                  transition={{ duration: 0.22, ease: easeOut }}
                  className="text-[42px] leading-[46px] font-bold tracking-[-0.03em] text-[#171717] tabular-nums dark:text-white"
                >
                  {formatPremiumPrice(displayPrice)}
                </motion.span>
              </AnimatePresence>
              <span className="text-sm text-[#737373] dark:text-[#888888]">
                {t("platform.profile.checkoutPerMonthLong")}
              </span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={billingNote}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="text-[12px] leading-[17px] text-[#a3a3a3] dark:text-[#666666]"
              >
                {billingNote}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="relative mb-3.5 h-px bg-[#e5e5e5] dark:bg-[#262626]" />

          <div className="relative mb-[18px]">
            <p className="mb-1.5 px-0.5 font-mono text-[10px] tracking-[0.14em] text-[#a3a3a3] uppercase dark:text-[#666666]">
              {t("platform.profile.checkoutFeaturesLabel")}
            </p>
            {PREMIUM_CHECKOUT_FEATURES.map((feature, index) => (
              <div
                key={feature.icon}
                className={cn(
                  "flex items-center gap-3 px-0.5 py-2.5",
                  index < PREMIUM_CHECKOUT_FEATURES.length - 1 &&
                    "border-b border-[#e5e5e5] dark:border-[#262626]",
                )}
              >
                <div className="flex size-[34px] shrink-0 items-center justify-center rounded-full border border-[#e5e5e5] bg-[#f5f5f5] dark:border-[#262626] dark:bg-[#1f1f1f]">
                  <MaterialIcon
                    name={feature.icon}
                    className="text-[15px] text-[#171717] dark:text-white"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-5 font-semibold text-[#171717] dark:text-white">
                    {t(feature.titleKey)}
                  </p>
                  <p className="text-[12px] leading-4 text-[#a3a3a3] dark:text-[#666666]">
                    {t(feature.descKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative mb-1 flex justify-center">
            <button
              type="button"
              onClick={handleGetStarted}
              disabled={submitting}
              className="group inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-[#34c759] px-[18px] py-2.5 text-[13px] font-semibold tracking-[0.04em] text-black shadow-[0_6px_12px_rgba(0,0,0,0.12)] transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:opacity-95 active:scale-[0.96] disabled:opacity-55"
            >
              <span>{t("platform.profile.checkoutSelectPremium")}</span>
              <MaterialIcon
                name="arrow_forward"
                className="text-[14px] transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)] group-hover:translate-x-0.5"
              />
            </button>
          </div>

          <div className="relative mt-4 flex gap-1.5 border-t border-[#e5e5e5] pt-3.5 dark:border-[#262626]">
            {(
              [
                ["auto_awesome", "platform.profile.checkoutTrial"],
                ["cancel", "platform.profile.checkoutCancelAnytime"],
                ["lock", "platform.profile.checkoutSecure"],
              ] as const
            ).map(([icon, key]) => (
              <div
                key={key}
                className="flex flex-1 flex-col items-center gap-1.5 text-center"
              >
                <span className="flex size-[26px] items-center justify-center rounded-full bg-[#f5f5f5] dark:bg-[#1f1f1f]">
                  <MaterialIcon
                    name={icon}
                    className="text-[13px] text-[#525252] dark:text-[#888888]"
                  />
                </span>
                <span className="text-[10px] leading-[13px] text-[#737373] dark:text-[#888888]">
                  {t(key)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, delay: 0.16, ease: easeOut }}
          className="flex flex-col gap-3.5"
        >
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="font-mono text-[10px] tracking-[0.14em] text-[#a3a3a3] uppercase dark:text-[#666666]">
              {t("platform.profile.checkoutFaqEyebrow")}
            </span>
            <h3 className="text-[20px] leading-[26px] font-semibold tracking-[-0.02em] text-[#171717] dark:text-white">
              {t("platform.profile.checkoutFaqTitle")}
            </h3>
          </div>

          <div className="flex flex-col gap-2">
            {FAQ_ITEMS.map((item, index) => {
              const open = openFaq === index;
              return (
                <div
                  key={item.questionKey}
                  className="overflow-hidden rounded-[16px] border border-[#e5e5e5] bg-[#fafafa] dark:border-white/[0.08] dark:bg-[#1b1b1b]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : index)}
                    className="flex w-full items-center justify-between gap-3 px-3.5 py-3.5 text-left transition-opacity duration-200 active:opacity-90"
                  >
                    <span className="flex-1 text-sm leading-5 font-semibold text-[#171717] dark:text-white">
                      {t(item.questionKey)}
                    </span>
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                        open
                          ? "bg-[#34c759] text-black"
                          : "bg-[#f5f5f5] text-[#a3a3a3] dark:bg-[#1f1f1f] dark:text-[#666666]",
                      )}
                    >
                      <MaterialIcon
                        name="expand_more"
                        className={cn(
                          "text-[16px] transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                          open && "rotate-180",
                        )}
                      />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: easeOut }}
                        className="overflow-hidden"
                      >
                        <p className="px-3.5 pb-3.5 text-sm leading-[21px] text-pretty text-[#737373] dark:text-[#888888]">
                          {t(item.answerKey)}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </>
  );
}
