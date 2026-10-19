/** Convert catalog USD amounts to Razorpay INR (paise) for India/UPI. */

const DEFAULT_USD_TO_INR = 85;

export function getUsdToInrRate(): number {
  const raw = Number(
    process.env.USD_TO_INR_RATE || process.env.NEXT_PUBLIC_USD_TO_INR_RATE || "",
  );
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_USD_TO_INR;
}

/** USD cents (e.g. 900 for $9) → INR paise (integer, Razorpay amount). */
export function usdCentsToInrPaise(usdCents: number): number {
  const cents = Number(usdCents);
  if (!Number.isFinite(cents) || cents <= 0) return 100;
  const rupees = (cents / 100) * getUsdToInrRate();
  return Math.max(100, Math.round(rupees * 100));
}

/** Whole USD dollars (e.g. 9) → whole INR rupees for labels. */
export function usdDollarsToInrRupees(dollars: number): number {
  const d = Number(dollars);
  if (!Number.isFinite(d) || d < 0) return 0;
  return Math.round(d * getUsdToInrRate());
}

export function formatInrRupees(rupees: number): string {
  return `₹${Math.round(rupees).toLocaleString("en-IN")}`;
}
