export type PlanCycle = "monthly" | "yearly";

export const RAZORPAY_PLANS = {
  monthly: {
    planId: "core-monthly",
    name: "Core Monthly",
    /** Main card price shown in UI (USD). */
    displayAmount: 9,
    displaySuffix: "/month",
    /** Stripe/Razorpay amount in smallest currency unit (cents). */
    chargeAmount: 900,
    chargeCurrency: "USD",
    /** Whole dollars for UI totals (alias kept as chargeDisplayInr for callers). */
    chargeDisplayInr: 9,
    note: "Billed monthly. Cancel anytime.",
  },
  yearly: {
    planId: "core-yearly",
    name: "Core Yearly",
    /** Monthly equivalent shown on the card (USD). */
    displayAmount: 7,
    displaySuffix: "/month",
    billed: "$84 billed yearly",
    chargeAmount: 8400,
    chargeCurrency: "USD",
    chargeDisplayInr: 84,
    note: "Save 22% with annual billing.",
  },
} as const;

/** Format a USD whole-dollar amount for UI. */
export function formatInr(amount: number) {
  return `$${Number(amount).toLocaleString("en-US")}`;
}

export function formatUsd(amount: number) {
  return formatInr(amount);
}

export function formatPlanChargeInr(cycle: PlanCycle) {
  return formatInr(RAZORPAY_PLANS[cycle].chargeDisplayInr);
}

export function formatPlanDisplayPrice(cycle: PlanCycle) {
  const plan = RAZORPAY_PLANS[cycle];
  return `${formatInr(plan.displayAmount)}${plan.displaySuffix}`;
}

export function getRazorpayPlan(cycle: PlanCycle) {
  return RAZORPAY_PLANS[cycle];
}
