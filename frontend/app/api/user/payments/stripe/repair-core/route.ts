import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl, USER_TOKEN_COOKIE } from "@/lib/backend";
import { fetchAuthUser } from "@/lib/razorpayServer";
import { getStripe, isStripeConfigured } from "@/lib/stripeServer";

type RepairPayload = {
  siteId?: string;
};

/**
 * Recover Core for a website after a paid Stripe Checkout when local unlock
 * failed (wrong siteId / sync race). Never charges again — only reads paid sessions.
 */
export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { message: "Stripe is not configured." },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(USER_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Login required" }, { status: 401 });
  }

  const user = await fetchAuthUser(token);
  if (!user) {
    return NextResponse.json({ message: "Login required" }, { status: 401 });
  }

  let body: RepairPayload;
  try {
    body = (await request.json()) as RepairPayload;
  } catch {
    return NextResponse.json({ message: "Invalid request payload" }, { status: 400 });
  }

  const siteId = body.siteId?.trim() || "";
  if (!siteId) {
    return NextResponse.json({ message: "Missing website id." }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const sessions = await stripe.checkout.sessions.list({ limit: 100 });
    const paidPlanSessions = sessions.data.filter((session) => {
      const meta = session.metadata || {};
      if (meta.kind !== "plan") return false;
      if (meta.userId && meta.userId !== user.id) return false;
      return (
        session.payment_status === "paid" || session.status === "complete"
      );
    });
    const exact = paidPlanSessions.find(
      (session) => (session.metadata?.siteId || "").trim() === siteId,
    );
    // Only unlock the exact website from Stripe metadata — never apply another
    // site's payment (that wrongly marked unrelated websites as Core).
    const match = exact;

    if (!match) {
      return NextResponse.json(
        {
          ok: false,
          message: "No paid Core checkout found for this website.",
        },
        { status: 404 },
      );
    }

    const meta = match.metadata || {};
    const cycle = meta.cycle === "yearly" ? "yearly" : "monthly";
    const paymentId =
      typeof match.payment_intent === "string"
        ? match.payment_intent
        : match.id;
    const orderId = match.id;
    const siteTitle = meta.siteTitle || undefined;
    const siteSlug = meta.siteSlug || undefined;

    const upgradedAt = new Date();
    const expiresAt = new Date(upgradedAt);
    if (cycle === "yearly") {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    const subscription = {
      siteId,
      siteTitle,
      siteSlug,
      planId: "core" as const,
      cycle,
      paymentId,
      orderId,
      paymentProvider: "stripe" as const,
      upgradedAt: upgradedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    // Persist on backend user-state so hydrate keeps Core.
    try {
      const getRes = await fetch(`${getBackendUrl()}/user-state`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const current = (await getRes.json().catch(() => ({}))) as {
        siteSubscriptions?: Record<string, unknown>;
        purchasedAddons?: unknown[];
        purchasedDomains?: unknown[];
        domainConnections?: unknown[];
      };
      const siteSubscriptions = {
        ...(current.siteSubscriptions &&
        typeof current.siteSubscriptions === "object"
          ? current.siteSubscriptions
          : {}),
        [siteId]: subscription,
      };
      await fetch(`${getBackendUrl()}/user-state`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteSubscriptions,
          purchasedAddons: Array.isArray(current.purchasedAddons)
            ? current.purchasedAddons
            : [],
          purchasedDomains: Array.isArray(current.purchasedDomains)
            ? current.purchasedDomains
            : [],
          domainConnections: Array.isArray(current.domainConnections)
            ? current.domainConnections
            : [],
        }),
        cache: "no-store",
      });
    } catch {
      /* client will still save locally */
    }

    return NextResponse.json({
      ok: true,
      repaired: true,
      siteId,
      siteTitle,
      siteSlug,
      cycle,
      paymentId,
      orderId,
      message: "Core restored for this website from your paid Stripe checkout.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to repair Core from Stripe.",
      },
      { status: 502 },
    );
  }
}
