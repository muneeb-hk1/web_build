import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { USER_TOKEN_COOKIE } from "@/lib/backend";
import {
  formatAddonBundleLabel,
  resolveAddonIds,
  sumAddonChargeAmount,
  sumAddonDisplayAmount,
  type PlanAddonId,
} from "@/lib/planAddons";
import {
  getPagePlanCharge,
  isPaidPagePlanId,
  type PaidPagePlanId,
} from "@/lib/pagePlans";
import {
  formatInr,
  formatPlanDisplayPrice,
  getRazorpayPlan,
  type PlanCycle,
} from "@/lib/razorpayPlans";
import { fetchAuthUser } from "@/lib/razorpayServer";
import {
  getAppBaseUrl,
  getStripe,
  isStripeConfigured,
} from "@/lib/stripeServer";

type OrderPayload = {
  cycle?: PlanCycle;
  switchToYearly?: boolean;
  siteId?: string;
  siteTitle?: string;
  siteSlug?: string;
  addonIds?: PlanAddonId[];
  /** Paid page plan tier (starter|professional|business|enterprise). */
  pagePlan?: PaidPagePlanId;
  /** Optional return path after Stripe success (defaults to /user/plan). */
  returnPath?: string;
};

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { message: "Stripe is not configured.", code: "STRIPE_INACTIVE" },
      { status: 503 },
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

  let body: OrderPayload;
  try {
    body = (await request.json()) as OrderPayload;
  } catch {
    return NextResponse.json({ message: "Invalid request payload" }, { status: 400 });
  }

  const cycle = body.cycle === "yearly" ? "yearly" : "monthly";
  const siteId = body.siteId?.trim();
  if (!siteId) {
    return NextResponse.json(
      { message: "Select a website to upgrade before starting payment." },
      { status: 400 },
    );
  }

  const siteTitle = body.siteTitle?.trim() || "";
  const siteSlug = body.siteSlug?.trim() || "";
  const addonIds = resolveAddonIds(body.addonIds);
  const pagePlan = isPaidPagePlanId(body.pagePlan) ? body.pagePlan : null;
  const plan = pagePlan
    ? getPagePlanCharge(pagePlan, cycle)
    : getRazorpayPlan(cycle);
  const addonCharge = sumAddonChargeAmount(addonIds, cycle);
  const addonDisplay = sumAddonDisplayAmount(addonIds, cycle);
  const totalCharge = plan.chargeAmount + addonCharge;
  const totalDisplay = plan.chargeDisplayInr + addonDisplay;
  const addonLabel = formatAddonBundleLabel(addonIds, cycle);
  const displayPrice =
    addonIds.length > 0
      ? `${formatInr(totalDisplay)}${cycle === "yearly" ? " / year" : " / month"}`
      : pagePlan
        ? `${formatInr(plan.displayAmount)}${plan.displaySuffix}`
        : formatPlanDisplayPrice(cycle);

  const baseUrl = getAppBaseUrl(request.url);
  const returnPath = (body.returnPath || "/user/plan").startsWith("/")
    ? body.returnPath || "/user/plan"
    : "/user/plan";
  const successUrl = `${baseUrl}${returnPath}${returnPath.includes("?") ? "&" : "?"}stripe_plan=1&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${baseUrl}/payment-cancel?continue=${encodeURIComponent(returnPath)}&product=${encodeURIComponent(plan.name)}&provider=Stripe`;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: totalCharge,
            product_data: {
              name: plan.name,
              description:
                addonIds.length > 0
                  ? `${siteTitle || "Website"} · ${addonLabel}`
                  : siteTitle || "Website Core plan",
            },
          },
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Keep checkout in USD — don't auto-convert to local currency.
      adaptive_pricing: { enabled: false },
      metadata: {
        kind: "plan",
        userId: user.id,
        planId: plan.planId,
        pagePlan: pagePlan || "",
        cycle,
        switchToYearly: body.switchToYearly === true ? "1" : "0",
        siteId,
        siteTitle,
        siteSlug,
        addonIds: addonIds.join(","),
      },
    });

    if (!session.url || !session.id) {
      return NextResponse.json(
        { message: "Unable to create Stripe checkout session." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      provider: "stripe",
      sessionId: session.id,
      url: session.url,
      amount: totalCharge,
      currency: "USD",
      planName: plan.name,
      cycle,
      siteId,
      siteTitle: siteTitle || undefined,
      siteSlug: siteSlug || undefined,
      addonIds,
      addonLabel,
      displayPrice,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to start Stripe checkout.",
        code: "STRIPE_CHECKOUT_FAILED",
      },
      { status: 502 },
    );
  }
}
