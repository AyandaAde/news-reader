export type BillingCycle = "monthly" | "annual";

export const PREMIUM_MONTHLY_PRICE = 37.5;
export const PREMIUM_ANNUAL_DISCOUNT = 0.2;

export const PREMIUM_CHECKOUT_FEATURES = [
  { icon: "mail", label: "Daily Email Briefings" },
  { icon: "podcasts", label: "Localised Podcasts" },
  { icon: "graphic_eq", label: "Ultra Hi-Fi Voices" },
  { icon: "download_done", label: "Offline Localization" },
  { icon: "block", label: "Ad-Free Experience" },
] as const;

export function getPremiumDisplayPrice(cycle: BillingCycle) {
  if (cycle === "monthly") {
    return PREMIUM_MONTHLY_PRICE;
  }

  return PREMIUM_MONTHLY_PRICE * (1 - PREMIUM_ANNUAL_DISCOUNT);
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
