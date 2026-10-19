import { formatInrRupees, usdDollarsToInrRupees } from "@/lib/usdToInr";

export type ExportFormat = "html" | "nextjs";

export const EXPORT_MAX_DOWNLOADS = 5;

export const EXPORT_PACKAGES = {
  html: {
    format: "html" as const,
    label: "Export in HTML",
    description: "Static HTML + CSS + media ZIP",
    /** Whole USD for UI (field name kept for existing callers). */
    priceInr: 10,
    /** Stripe/Razorpay amount in USD cents */
    chargeAmount: 1_000,
    chargeCurrency: "INR" as const,
  },
  nextjs: {
    format: "nextjs" as const,
    label: "Export in Next.js",
    description: "Runnable Next.js project ZIP",
    /** Whole USD for UI (field name kept for existing callers). */
    priceInr: 25,
    /** Stripe/Razorpay amount in USD cents */
    chargeAmount: 2_500,
    chargeCurrency: "INR" as const,
  },
} as const;

export function getExportPackage(format: ExportFormat) {
  return EXPORT_PACKAGES[format];
}

/** Default label in USD (catalog currency). */
export function formatExportPrice(format: ExportFormat) {
  const usd = EXPORT_PACKAGES[format].priceInr;
  return `$${usd.toLocaleString("en-US")}`;
}

/** India checkout label (INR at current USD→INR rate). */
export function formatExportPriceInr(format: ExportFormat) {
  return formatInrRupees(usdDollarsToInrRupees(EXPORT_PACKAGES[format].priceInr));
}

export function isExportFormat(value: unknown): value is ExportFormat {
  return value === "html" || value === "nextjs";
}
