import type { PlanCycle } from "@/lib/razorpayPlans";

export type PaidPagePlanId =
  | "starter"
  | "professional"
  | "business"
  | "enterprise";

export type PagePlanId = "free" | PaidPagePlanId;

export type PagePlanDef = {
  id: PagePlanId;
  name: string;
  description: string;
  monthly: number;
  annual: number;
  /** Paid plans: monthly AI assist tokens (0 on Free). */
  aiTokensMonthly: number;
  includes: string;
  features: string[];
  cta: string;
  featured: boolean;
};

/** Monthly AI assist tokens by paid page plan. */
export const PAGE_PLAN_AI_TOKENS: Record<PaidPagePlanId, number> = {
  starter: 100,
  professional: 250,
  business: 750,
  enterprise: 2500,
};

export const PAGE_PLANS: PagePlanDef[] = [
  {
    id: "free",
    name: "Free",
    description:
      "Build and publish on a shared URL. You stay on Free until you upgrade — Starter is the paid plan for up to 25 pages.",
    monthly: 0,
    annual: 0,
    aiTokensMonthly: 0,
    includes: "",
    features: [
      "Website builder and editor access",
      "Publish on a shared URL",
      "Browse themes before you pay",
      "No custom domain",
      "Limited AI assist (5 tokens)",
      "Free forever until you upgrade",
    ],
    cta: "Current Free",
    featured: false,
  },
  {
    id: "starter",
    name: "Starter",
    description:
      "Paid plan for themes with up to 25 pages — ideal for small business sites.",
    monthly: 8,
    annual: 6,
    aiTokensMonthly: 100,
    includes: "Everything in Free, plus:",
    features: [
      "Themes up to 25 pages",
      "Hosting included (free)",
      "100 AI tokens / month",
      "Multi-page site templates",
      "Full editor and publishing",
      "Per website billing",
    ],
    cta: "Choose Starter",
    featured: false,
  },
  {
    id: "professional",
    name: "Professional",
    description: "Themes with up to 50 pages — services, blog, and portfolio ready.",
    monthly: 18,
    annual: 14,
    aiTokensMonthly: 250,
    includes: "Everything in Starter, plus:",
    features: [
      "Themes up to 50 pages",
      "Hosting included (free)",
      "250 AI tokens / month",
      "Larger multi-page templates",
      "Custom domain ready",
      "Per website billing",
    ],
    cta: "Choose Professional",
    featured: true,
  },
  {
    id: "business",
    name: "Business",
    description: "Themes with up to 100 pages — for growing brands and catalogs.",
    monthly: 48,
    annual: 38,
    aiTokensMonthly: 750,
    includes: "Everything in Professional, plus:",
    features: [
      "Themes up to 100 pages",
      "Hosting included (free)",
      "750 AI tokens / month",
      "Advanced multi-page layouts",
      "Custom domain + SSL",
      "Per website billing",
    ],
    cta: "Choose Business",
    featured: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Themes with up to 125 pages — largest templates for complex sites.",
    monthly: 98,
    annual: 78,
    aiTokensMonthly: 2500,
    includes: "Everything in Business, plus:",
    features: [
      "Themes up to 125 pages",
      "Hosting included (free)",
      "2,500 AI tokens / month",
      "Largest template library access",
      "Custom domain + SSL",
      "Per website billing",
    ],
    cta: "Choose Enterprise",
    featured: false,
  },
];

export function isPaidPagePlanId(value: unknown): value is PaidPagePlanId {
  return (
    value === "starter" ||
    value === "professional" ||
    value === "business" ||
    value === "enterprise"
  );
}

export function resolvePaidPagePlan(
  value: unknown,
  fallback: PaidPagePlanId = "professional",
): PaidPagePlanId {
  return isPaidPagePlanId(value) ? value : fallback;
}

export function getPagePlanDef(id: PagePlanId) {
  return PAGE_PLANS.find((plan) => plan.id === id) || PAGE_PLANS[0];
}

/** Smallest paid plan that covers a theme/site page count. */
export function recommendPaidPlanForPages(pages: number): PaidPagePlanId {
  const n = Math.max(1, Math.floor(Number(pages) || 1));
  if (n <= 25) return "starter";
  if (n <= 50) return "professional";
  if (n <= 100) return "business";
  return "enterprise";
}

export function pagePlanMaxPages(planId: PaidPagePlanId): number {
  if (planId === "starter") return 25;
  if (planId === "professional") return 50;
  if (planId === "business") return 100;
  return 125;
}

export function pagePlanAiTokensMonthly(planId: PaidPagePlanId): number {
  return PAGE_PLAN_AI_TOKENS[planId];
}

/** Charge amounts for a paid page plan (USD cents + display dollars). */
export function getPagePlanCharge(planId: PaidPagePlanId, cycle: PlanCycle) {
  const plan = getPagePlanDef(planId);
  if (cycle === "yearly") {
    const yearlyTotal = plan.annual * 12;
    return {
      planId: `${planId}-yearly`,
      name: `${plan.name} Yearly`,
      displayAmount: plan.annual,
      displaySuffix: "/month",
      billed: `$${yearlyTotal.toLocaleString("en-US")} billed yearly`,
      chargeAmount: yearlyTotal * 100,
      chargeCurrency: "USD" as const,
      chargeDisplayInr: yearlyTotal,
      note: "Save with annual billing.",
    };
  }
  return {
    planId: `${planId}-monthly`,
    name: `${plan.name} Monthly`,
    displayAmount: plan.monthly,
    displaySuffix: "/month",
    chargeAmount: plan.monthly * 100,
    chargeCurrency: "USD" as const,
    chargeDisplayInr: plan.monthly,
    note: "Billed monthly. Cancel anytime.",
  };
}
