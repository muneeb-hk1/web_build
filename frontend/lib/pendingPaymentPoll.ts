/** Stash checkout context while a bank/OTP payment is still pending. */

export type PendingPaymentPollContext = {
  paymentId: string;
  orderId?: string;
  siteId: string;
  siteTitle?: string;
  siteSlug?: string;
  cycle: "monthly" | "yearly";
  isSwitch?: boolean;
  addonIds?: string[];
  amountLabel?: string;
  productLabel?: string;
  paymentProvider?: "stripe" | "razorpay";
};

const KEY = "css-ai-pending-payment-poll";

export function stashPendingPaymentPoll(ctx: PendingPaymentPollContext) {
  if (typeof window === "undefined" || !ctx.paymentId || !ctx.siteId) return;
  const raw = JSON.stringify(ctx);
  sessionStorage.setItem(KEY, raw);
  localStorage.setItem(KEY, raw);
}

export function readPendingPaymentPoll(): PendingPaymentPollContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      sessionStorage.getItem(KEY) || localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingPaymentPollContext;
    if (!parsed?.paymentId || !parsed?.siteId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingPaymentPoll() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
  localStorage.removeItem(KEY);
}
