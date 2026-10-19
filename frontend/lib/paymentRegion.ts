export type PaymentGateway = "razorpay" | "stripe";
export type PaymentCurrency = "INR" | "USD";

type RegionResponse = {
  gateway?: PaymentGateway;
  isIndia?: boolean;
  country?: string;
  message?: string;
};

export type PaymentRegion = {
  gateway: PaymentGateway;
  isIndia: boolean;
  currency: PaymentCurrency;
};

/** India → Razorpay/INR, otherwise Stripe/USD. Falls back to Stripe on detection failure. */
export async function resolvePaymentRegion(): Promise<PaymentRegion> {
  try {
    const res = await fetch("/api/user/payments/region", {
      credentials: "include",
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as RegionResponse;
    if (res.ok && data.gateway === "razorpay") {
      return { gateway: "razorpay", isIndia: true, currency: "INR" };
    }
    if (res.ok && data.gateway === "stripe") {
      return { gateway: "stripe", isIndia: false, currency: "USD" };
    }
    if (data.isIndia === true) {
      return { gateway: "razorpay", isIndia: true, currency: "INR" };
    }
  } catch {
    /* ignore */
  }
  return { gateway: "stripe", isIndia: false, currency: "USD" };
}

/** India → Razorpay, otherwise Stripe. Falls back to Stripe on detection failure. */
export async function resolvePaymentGateway(): Promise<PaymentGateway> {
  const region = await resolvePaymentRegion();
  return region.gateway;
}
