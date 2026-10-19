export type PaymentStatusMailInput = {
  status: "success" | "failed" | "pending";
  productLabel: string;
  amountLabel?: string;
  reason?: string;
  retryUrl?: string;
  provider?: string;
  orderId?: string;
};

/** Fire-and-forget payment success/failed mail to user + admin. */
export function notifyPaymentStatusMail(input: PaymentStatusMailInput) {
  if (typeof window === "undefined") return;
  void fetch("/api/user/payments/payment-status-mail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  }).catch(() => undefined);
}

/** Track unpaid checkout for 24h / 48h / 7d follow-ups (no immediate fail mail). */
export function trackPendingPaymentOrder(input: {
  productLabel: string;
  amountLabel?: string;
  retryUrl?: string;
  provider?: string;
  orderId?: string;
}) {
  notifyPaymentStatusMail({
    status: "pending",
    productLabel: input.productLabel,
    amountLabel: input.amountLabel,
    retryUrl: input.retryUrl,
    provider: input.provider,
    orderId: input.orderId,
  });
}
