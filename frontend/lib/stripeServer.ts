import Stripe from "stripe";

export function getStripeSecretKey() {
  return process.env.STRIPE_SECRET_KEY?.trim() || "";
}

export function getStripePublishableKey() {
  return (
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ||
    process.env.STRIPE_PUBLISHABLE_KEY?.trim() ||
    ""
  );
}

export function isStripeConfigured() {
  return Boolean(getStripeSecretKey() && getStripePublishableKey());
}

/** Primary gateway: stripe | razorpay (default stripe when configured). */
export function getPrimaryPaymentProvider(): "stripe" | "razorpay" {
  const primary = (process.env.PAYMENT_PRIMARY || "stripe").trim().toLowerCase();
  if (primary === "razorpay") return "razorpay";
  if (isStripeConfigured()) return "stripe";
  return "razorpay";
}

export function getFallbackPaymentProvider(): "stripe" | "razorpay" {
  const fallback = (process.env.PAYMENT_FALLBACK || "razorpay")
    .trim()
    .toLowerCase();
  if (fallback === "stripe" && isStripeConfigured()) return "stripe";
  return "razorpay";
}

let stripeSingleton: Stripe | null = null;

export function getStripe(): Stripe {
  const key = getStripeSecretKey();
  if (!key) {
    throw new Error("Stripe secret key is not configured.");
  }
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(key, {
      apiVersion: "2026-08-26.dahlia",
    });
  }
  return stripeSingleton;
}

export function getAppBaseUrl(requestUrl?: string) {
  const fromEnv =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "";
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (requestUrl) {
    try {
      return new URL(requestUrl).origin;
    } catch {
      // ignore
    }
  }
  return "http://localhost:3000";
}
