"use client";

import {
  SUBSCRIPTION_PLANS,
  formatSubscriptionRenewalDate,
  type SubscriptionPlan,
} from "@/lib/platform-settings";
import { cn } from "@/lib/utils";

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
          ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
          : undefined
      }
    >
      {name}
    </span>
  );
}

type SubscriptionSettingsPanelProps = {
  plan: SubscriptionPlan;
  renewsAt: string;
  onManageBilling: () => void;
  onUpgrade: () => void;
};

export function SubscriptionSettingsPanel({
  plan,
  renewsAt,
  onManageBilling,
  onUpgrade,
}: SubscriptionSettingsPanelProps) {
  const planDetails = SUBSCRIPTION_PLANS[plan];
  const isPremium = plan === "premium";

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm leading-6 text-[#888888]">
        View your current plan, renewal date, and billing options.
      </p>

      <div className="overflow-hidden rounded-[14px] border border-[#262626] bg-[#141414]">
        <div className="border-b border-[#262626] px-4 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#EBB800]/30 bg-[#EBB800]/10 px-3 py-1">
                {isPremium ? (
                  <MaterialIcon name="star" filled className="text-[14px] text-[#EBB800]" />
                ) : null}
                <span
                  className={cn(
                    "font-mono text-[10px] font-medium tracking-[0.12em]",
                    isPremium ? "text-[#EBB800]" : "text-[#888888]",
                  )}
                >
                  {planDetails.title.toUpperCase()}
                  {isPremium ? " MEMBER" : " PLAN"}
                </span>
              </div>
              <p className="text-[22px] font-semibold text-white">{planDetails.title}</p>
              <p className="mt-1 text-sm text-[#888888]">{planDetails.priceLabel}</p>
            </div>
            {isPremium ? (
              <span className="rounded-full bg-[#34c759]/10 px-3 py-1 text-xs font-medium text-[#34c759]">
                Active
              </span>
            ) : null}
          </div>
          {isPremium ? (
            <p className="mt-4 text-sm text-[#888888]">
              Renews on{" "}
              <span className="font-medium text-white">
                {formatSubscriptionRenewalDate(renewsAt)}
              </span>
            </p>
          ) : null}
        </div>

        <div className="px-4 py-4">
          <p className="mb-3 text-[13px] font-semibold tracking-[0.5px] text-[#888888] uppercase">
            Included
          </p>
          <ul className="space-y-3">
            {planDetails.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-white">
                <MaterialIcon name="check_circle" className="mt-0.5 text-[18px] text-[#34c759]" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isPremium ? (
        <button
          type="button"
          onClick={onManageBilling}
          className="w-full rounded-[10px] border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-white/20 hover:bg-[#222222]"
        >
          Manage Subscription
        </button>
      ) : (
        <button
          type="button"
          onClick={onUpgrade}
          className="w-full rounded-[10px] bg-white px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          View Premium Plans
        </button>
      )}
    </div>
  );
}
