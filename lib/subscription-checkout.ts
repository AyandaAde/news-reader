export type BillingCycle = "monthly" | "annual";

export const PREMIUM_MONTHLY_PRICE = 40;
export const PREMIUM_ANNUAL_MONTHLY_PRICE = 32;
export const PREMIUM_ANNUAL_DISCOUNT =
  (PREMIUM_MONTHLY_PRICE - PREMIUM_ANNUAL_MONTHLY_PRICE) / PREMIUM_MONTHLY_PRICE;

export const PREMIUM_CHECKOUT_FEATURES = [
  {
    icon: "mail",
    titleKey: "platform.profile.checkoutFeatureDailyEmail",
    descKey: "platform.profile.checkoutFeatureDailyEmailDesc",
  },
  {
    icon: "podcasts",
    titleKey: "platform.profile.checkoutFeatureLocalisedPodcasts",
    descKey: "platform.profile.checkoutFeatureLocalisedPodcastsDesc",
  },
  {
    icon: "equalizer",
    titleKey: "platform.profile.checkoutFeatureHiFiVoices",
    descKey: "platform.profile.checkoutFeatureHiFiVoicesDesc",
  },
  {
    icon: "download",
    titleKey: "platform.profile.checkoutFeatureOffline",
    descKey: "platform.profile.checkoutFeatureOfflineDesc",
  },
  {
    icon: "block",
    titleKey: "platform.profile.checkoutFeatureAdFree",
    descKey: "platform.profile.checkoutFeatureAdFreeDesc",
  },
] as const;

export type PremiumCheckoutFeatureIcon =
  (typeof PREMIUM_CHECKOUT_FEATURES)[number]["icon"];

export function getPremiumDisplayPrice(cycle: BillingCycle) {
  if (cycle === "monthly") {
    return PREMIUM_MONTHLY_PRICE;
  }

  return PREMIUM_ANNUAL_MONTHLY_PRICE;
}

export function getPremiumAnnualTotal() {
  return getPremiumDisplayPrice("annual") * 12;
}

export function getPremiumAnnualSavings() {
  return PREMIUM_MONTHLY_PRICE * 12 - getPremiumAnnualTotal();
}

export function formatPremiumPrice(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export function getPremiumRenewalDate(cycle: BillingCycle) {
  const date = new Date();
  if (cycle === "annual") {
    date.setFullYear(date.getFullYear() + 1);
  } else {
    date.setMonth(date.getMonth() + 1);
  }

  return date.toISOString().slice(0, 10);
}

export function getBillingCycleLabel(cycle: BillingCycle) {
  return cycle === "annual" ? "Annual" : "Monthly";
}

export function formatPremiumPricePerMonth(cycle: BillingCycle) {
  const amount = getPremiumDisplayPrice(cycle);
  const formatted = formatPremiumPrice(amount).replace(/\.00$/, "");
  return `${formatted}/mo`;
}
