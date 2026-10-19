import type { PlanCycle } from "@/lib/razorpayPlans";
import { formatInr } from "@/lib/razorpayPlans";

export type PlanAddonId =
  | "google-my-business"
  | "priority-support"
  | "remove-branding";

export type PlanAddonBilling = PlanCycle;

export type PlanAddonPrice = {
  /** Whole USD for UI */
  displayAmount: number;
  /** Cents for Stripe/Razorpay */
  chargeAmount: number;
  displaySuffix: string;
};

export type PlanAddon = {
  id: PlanAddonId;
  name: string;
  description: string;
  features: string[];
  pricing: Record<PlanCycle, PlanAddonPrice>;
};

export const PLAN_ADDONS: Record<PlanAddonId, PlanAddon> = {
  "google-my-business": {
    id: "google-my-business",
    name: "Google My Business Setup",
    description:
      "Get your business listed and optimized on Google Search & Maps.",
    features: [
      "Google Business Profile setup",
      "Business name, address & phone (NAP)",
      "Photos, hours & category setup",
      "Basic local SEO optimization",
    ],
    pricing: {
      monthly: {
        displayAmount: 5,
        chargeAmount: 500,
        displaySuffix: "/month",
      },
      yearly: {
        displayAmount: 40,
        chargeAmount: 4000,
        displaySuffix: "/year",
      },
    },
  },
  "priority-support": {
    id: "priority-support",
    name: "Priority Support",
    description: "Faster replies and priority help for your account.",
    features: [
      "Priority email support",
      "Faster response SLA",
      "Billing & domain help",
      "Cancel anytime",
    ],
    pricing: {
      monthly: {
        displayAmount: 3,
        chargeAmount: 300,
        displaySuffix: "/month",
      },
      yearly: {
        displayAmount: 30,
        chargeAmount: 3000,
        displaySuffix: "/year",
      },
    },
  },
  "remove-branding": {
    id: "remove-branding",
    name: "Remove Branding",
    description: "Remove the locked Lestow copyright from your website footer.",
    features: [
      "Hide “Powered by Lestow” in the footer",
      "Cleaner client-facing sites",
      "Applies to the selected website",
      "Matches your Core billing cycle",
    ],
    pricing: {
      monthly: {
        displayAmount: 2,
        chargeAmount: 200,
        displaySuffix: "/month",
      },
      yearly: {
        displayAmount: 10,
        chargeAmount: 1000,
        displaySuffix: "/year",
      },
    },
  },
};

export function listPlanAddons(): PlanAddon[] {
  return Object.values(PLAN_ADDONS);
}

export function getPlanAddon(id: string): PlanAddon | null {
  if (id in PLAN_ADDONS) {
    return PLAN_ADDONS[id as PlanAddonId];
  }
  return null;
}

export function resolveAddonIds(ids: unknown): PlanAddonId[] {
  if (!Array.isArray(ids)) return [];
  const unique = new Set<PlanAddonId>();
  for (const value of ids) {
    if (typeof value !== "string") continue;
    const addon = getPlanAddon(value);
    if (addon) unique.add(addon.id);
  }
  return [...unique];
}

export function getAddonPrice(addon: PlanAddon, cycle: PlanCycle): PlanAddonPrice {
  return addon.pricing[cycle];
}

export function formatAddonPrice(addon: PlanAddon, cycle: PlanCycle) {
  const price = getAddonPrice(addon, cycle);
  return `${formatInr(price.displayAmount)}${price.displaySuffix}`;
}

export function sumAddonChargeAmount(addonIds: PlanAddonId[], cycle: PlanCycle) {
  return addonIds.reduce((total, id) => {
    const addon = getPlanAddon(id);
    if (!addon) return total;
    return total + getAddonPrice(addon, cycle).chargeAmount;
  }, 0);
}

export function sumAddonDisplayAmount(addonIds: PlanAddonId[], cycle: PlanCycle) {
  return addonIds.reduce((total, id) => {
    const addon = getPlanAddon(id);
    if (!addon) return total;
    return total + getAddonPrice(addon, cycle).displayAmount;
  }, 0);
}

export function formatAddonBundleLabel(
  addonIds: PlanAddonId[],
  cycle: PlanCycle,
) {
  if (addonIds.length === 0) return "";
  return addonIds
    .map((id) => getPlanAddon(id)?.name)
    .filter(Boolean)
    .join(" + ");
}
