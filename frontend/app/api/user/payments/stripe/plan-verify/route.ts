import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { USER_TOKEN_COOKIE } from "@/lib/backend";
import { resolveAddonIds } from "@/lib/planAddons";
import type { PlanCycle } from "@/lib/razorpayPlans";
import { fetchAuthUser } from "@/lib/razorpayServer";
import { getStripe, isStripeConfigured } from "@/lib/stripeServer";

type VerifyPayload = {
  sessionId?: string;
};

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

  let body: VerifyPayload;
  try {
    body = (await request.json()) as VerifyPayload;
  } catch {
    return NextResponse.json({ message: "Invalid request payload" }, { status: 400 });
  }

  const sessionId = body.sessionId?.trim();
  if (!sessionId) {
    return NextResponse.json(
      { message: "Missing Stripe session id." },
      { status: 400 },
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid" && session.status !== "complete") {
      return NextResponse.json(
        { message: "Payment not completed yet." },
        { status: 400 },
      );
    }

    const meta = session.metadata || {};
    if (meta.kind !== "plan") {
      return NextResponse.json(
        { message: "This Stripe session is not a plan purchase." },
        { status: 400 },
      );
    }
    if (meta.userId && meta.userId !== user.id) {
      return NextResponse.json(
        { message: "Payment session does not match this account." },
        { status: 403 },
      );
    }

    const siteId = (meta.siteId || "").trim();
    if (!siteId) {
      return NextResponse.json(
        { message: "Missing website for plan activation." },
        { status: 400 },
      );
    }

    const cycle: PlanCycle = meta.cycle === "yearly" ? "yearly" : "monthly";
    const switched = meta.switchToYearly === "1";
    const pagePlanRaw = (meta.pagePlan || "").trim();
    const pagePlan =
      pagePlanRaw === "starter" ||
      pagePlanRaw === "professional" ||
      pagePlanRaw === "business" ||
      pagePlanRaw === "enterprise"
        ? pagePlanRaw
        : undefined;
    const addonIds = resolveAddonIds(
      (meta.addonIds || "")
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean),
    );
    const addonNote =
      addonIds.length > 0 ? ` Add-ons activated: ${addonIds.length}.` : "";
    const paymentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.id;

    return NextResponse.json({
      ok: true,
      provider: "stripe",
      planId: "core",
      pagePlan,
      cycle,
      siteId,
      siteTitle: meta.siteTitle || undefined,
      siteSlug: meta.siteSlug || undefined,
      addonIds,
      orderId: session.id,
      paymentId,
      message: switched
        ? `Payment verified. Switched to yearly billing for this website.${addonNote}`
        : `Payment verified. Paid plan activated for this website.${addonNote}`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to verify Stripe payment.",
      },
      { status: 502 },
    );
  }
}
