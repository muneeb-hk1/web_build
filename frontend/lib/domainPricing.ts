import type { PlanCycle } from "@/lib/razorpayPlans";
import { formatInr } from "@/lib/razorpayPlans";
import { getPagePlanCharge } from "@/lib/pagePlans";
import {
  formatAddonBundleLabel,
  resolveAddonIds,
  sumAddonChargeAmount,
  sumAddonDisplayAmount,
  type PlanAddonId,
} from "@/lib/planAddons";
import {
  formatInrRupees,
  getUsdToInrRate,
  usdCentsToInrPaise,
  usdDollarsToInrRupees,
} from "@/lib/usdToInr";

/**
 * INR charge for 1 year domain registration (catalog / Razorpay India).
 */
export const DOMAIN_YEARLY_CHARGE_INR = 1200;

/** Domain checkout always bundles Starter (not Core / other tiers). */
export const DOMAIN_BUNDLE_PAGE_PLAN = "starter" as const;

export type DomainPriceCurrency = "INR" | "USD";

export type DomainBundleOptions = {
  cycle?: PlanCycle;
  addonIds?: PlanAddonId[] | string[];
  /** India IP → INR (₹); other countries → USD ($). Default USD. */
  currency?: DomainPriceCurrency;
};

function domainYearlyUsd() {
  return Math.max(1, Math.round(DOMAIN_YEARLY_CHARGE_INR / getUsdToInrRate()));
}

export function getDomainBundlePricing(options: DomainBundleOptions = {}) {
  const cycle: PlanCycle = options.cycle === "yearly" ? "yearly" : "monthly";
  const currency: DomainPriceCurrency =
    options.currency === "INR" ? "INR" : "USD";
  const addonIds = resolveAddonIds(options.addonIds);
  const plan = getPagePlanCharge(DOMAIN_BUNDLE_PAGE_PLAN, cycle);
  const planUsd = plan.chargeDisplayInr;
  const addonsUsd = sumAddonDisplayAmount(addonIds, cycle);
  const addonChargeUsdCents = sumAddonChargeAmount(addonIds, cycle);
  const planPeriodLabel = cycle === "yearly" ? "1 year" : "1 month";
  const planSuffix = cycle === "yearly" ? "/year" : "/month";
  const addonLabel = formatAddonBundleLabel(addonIds, cycle);

  const domainInr = DOMAIN_YEARLY_CHARGE_INR;
  const planInr = usdDollarsToInrRupees(planUsd);
  const addonsInr = usdDollarsToInrRupees(addonsUsd);
  const totalInr = domainInr + planInr + addonsInr;

  const domainUsd = domainYearlyUsd();
  const totalUsd = domainUsd + planUsd + addonsUsd;

  const fmt =
    currency === "INR"
      ? (n: number) => formatInrRupees(n)
      : (n: number) => formatInr(n);

  const domainDisplay = currency === "INR" ? domainInr : domainUsd;
  const planDisplay = currency === "INR" ? planInr : planUsd;
  const addonsDisplay = currency === "INR" ? addonsInr : addonsUsd;
  const totalDisplay = currency === "INR" ? totalInr : totalUsd;

  // Razorpay India: domain already INR; Starter/add-ons catalog is USD cents.
  const chargeAmount =
    domainInr * 100 +
    usdCentsToInrPaise(plan.chargeAmount + addonChargeUsdCents);

  return {
    cycle,
    addonIds,
    currency,
    pagePlan: DOMAIN_BUNDLE_PAGE_PLAN,
    planName: "Starter",
    domainInr,
    planInr,
    addonsInr,
    totalInr,
    domainUsd,
    planUsd,
    addonsUsd,
    totalUsd,
    domainDisplay,
    planDisplay,
    addonsDisplay,
    totalDisplay,
    /** Razorpay amount in INR paise */
    chargeAmount,
    chargeCurrency: "INR" as const,
    domainLabel: `${fmt(domainDisplay)}/year`,
    planLabel: `${fmt(planDisplay)}${planSuffix}`,
    planPeriodLabel,
    addonsLabel: addonLabel
      ? `${addonLabel} (${fmt(addonsDisplay)})`
      : "",
    resultPriceLabel: addonLabel
      ? `${fmt(domainDisplay)}/year + Starter ${fmt(planDisplay)} (${planPeriodLabel}) + ${addonLabel}`
      : `${fmt(domainDisplay)}/year + Starter ${fmt(planDisplay)} (${planPeriodLabel})`,
    breakdownLabel: addonLabel
      ? `Domain ${fmt(domainDisplay)}/year + Starter ${fmt(planDisplay)}${planSuffix} + add-ons`
      : `Domain ${fmt(domainDisplay)}/year + Starter ${fmt(planDisplay)}${planSuffix}`,
    checkoutLabel: `${fmt(totalDisplay)} (domain + Starter${addonIds.length ? " + add-ons" : ""})`,
    shortResultLabel: `${fmt(domainDisplay)}/yr + Starter ${planPeriodLabel}`,
    totalLabel: fmt(totalDisplay),
  };
}
