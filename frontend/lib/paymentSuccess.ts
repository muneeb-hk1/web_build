/** URLs for post-checkout outcome pages (public, no /user prefix). */

export type PaymentOutcomeParams = {
  amountLabel?: string;
  /** Numeric USD order value for Google Ads conversion. */
  valueUsd?: number;
  /** Payment / transaction id for Google Ads conversion dedupe. */
  paymentId?: string;
  productLabel?: string;
  siteTitle?: string;
  provider?: string;
  reason?: string;
  continueUrl?: string;
};

type OutcomePath =
  | "/payment-success"
  | "/payment-failed"
  | "/payment-cancel"
  | "/payment-pending";

function buildOutcomeUrl(path: OutcomePath, params: PaymentOutcomeParams): string {
  const q = new URLSearchParams();
  if (params.amountLabel) q.set("amount", params.amountLabel);
  if (
    typeof params.valueUsd === "number" &&
    Number.isFinite(params.valueUsd) &&
    params.valueUsd >= 0
  ) {
    q.set("value", String(params.valueUsd));
  }
  if (params.paymentId?.trim()) q.set("txn", params.paymentId.trim());
  if (params.productLabel) q.set("product", params.productLabel);
  if (params.siteTitle) q.set("site", params.siteTitle);
  if (params.provider) q.set("provider", params.provider);
  if (params.reason) q.set("reason", params.reason);
  if (params.continueUrl) q.set("continue", params.continueUrl);
  const qs = q.toString();
  return qs ? `${path}?${qs}` : path;
}

export function buildPaymentSuccessUrl(params: PaymentOutcomeParams): string {
  return buildOutcomeUrl("/payment-success", params);
}

export function buildPaymentFailedUrl(params: PaymentOutcomeParams = {}): string {
  return buildOutcomeUrl("/payment-failed", {
    continueUrl: "/user/plan",
    ...params,
  });
}

export function buildPaymentCancelUrl(params: PaymentOutcomeParams = {}): string {
  return buildOutcomeUrl("/payment-cancel", {
    continueUrl: "/user/plan",
    ...params,
  });
}

export function buildPaymentPendingUrl(params: PaymentOutcomeParams = {}): string {
  return buildOutcomeUrl("/payment-pending", {
    continueUrl: "/user/plan",
    ...params,
  });
}
