"use client";

/**
 * Explicit Stripe / Razorpay checkout helpers (no auto-fallback).
 * User picks a gateway in the UI.
 */

export async function startStripePlanCheckout(payload: {
  cycle: "monthly" | "yearly";
  switchToYearly?: boolean;
  siteId: string;
  siteTitle?: string;
  siteSlug?: string;
  addonIds?: string[];
  pagePlan?: "starter" | "professional" | "business" | "enterprise";
  returnPath?: string;
}): Promise<{ url: string }> {
  const res = await fetch("/api/user/payments/stripe/plan-checkout", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json().catch(() => ({}))) as {
    url?: string;
    message?: string;
  };
  if (!res.ok || !data.url) {
    throw new Error(data.message || "Unable to start Stripe checkout.");
  }
  return { url: data.url };
}

export async function startStripeChatCreditsCheckout(payload: {
  packId: string;
  returnPath?: string;
}): Promise<{ url: string }> {
  const res = await fetch(
    "/api/user/payments/stripe/create-ai-chat-credits-checkout",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  const data = (await res.json().catch(() => ({}))) as {
    url?: string;
    message?: string;
  };
  if (!res.ok || !data.url) {
    throw new Error(data.message || "Unable to start Stripe checkout.");
  }
  return { url: data.url };
}

export async function verifyStripePlanSession(sessionId: string) {
  const res = await fetch("/api/user/payments/stripe/plan-verify", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    message?: string;
    cycle?: "monthly" | "yearly";
    siteId?: string;
    siteTitle?: string;
    siteSlug?: string;
    addonIds?: string[];
    orderId?: string;
    paymentId?: string;
    pagePlan?: "starter" | "professional" | "business" | "enterprise";
  };
  if (!res.ok || !data.ok) {
    throw new Error(data.message || "Stripe plan verification failed.");
  }
  return data;
}

export async function verifyStripeChatCreditsSession(
  sessionId: string,
  packId?: string,
) {
  const res = await fetch(
    "/api/user/payments/stripe/create-ai-chat-credits-verify",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, packId }),
    },
  );
  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    message?: string;
    packId?: string;
    credits?: number;
    paymentId?: string;
    orderId?: string;
  };
  if (!res.ok || !data.ok) {
    throw new Error(data.message || "Stripe credit verification failed.");
  }
  return data;
}
