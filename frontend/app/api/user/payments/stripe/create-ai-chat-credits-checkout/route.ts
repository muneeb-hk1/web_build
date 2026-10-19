import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { USER_TOKEN_COOKIE } from "@/lib/backend";
import {
  getCreateAiChatCreditPack,
  type CreateAiChatCreditPackId,
} from "@/lib/create-ai-chat-credits";
import { fetchAuthUser } from "@/lib/razorpayServer";
import {
  getAppBaseUrl,
  getStripe,
  isStripeConfigured,
} from "@/lib/stripeServer";

type OrderPayload = {
  packId?: string;
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

  const pack = getCreateAiChatCreditPack(String(body.packId || ""));
  if (!pack) {
    return NextResponse.json(
      { message: "Choose a chat credit pack." },
      { status: 400 },
    );
  }

  const packId = pack.id as CreateAiChatCreditPackId;
  const baseUrl = getAppBaseUrl(request.url);
  const returnPath =
    body.returnPath && body.returnPath.startsWith("/")
      ? body.returnPath
      : "/";
  const successUrl = `${baseUrl}${returnPath}${returnPath.includes("?") ? "&" : "?"}stripe_credits=1&session_id={CHECKOUT_SESSION_ID}&packId=${packId}`;
  const cancelUrl = `${baseUrl}/payment-cancel?continue=${encodeURIComponent(returnPath)}&product=${encodeURIComponent(pack.label)}&provider=Stripe`;

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
            unit_amount: pack.chargeAmount,
            product_data: {
              name: pack.label,
              description: "Create with AI chat credits",
            },
          },
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      adaptive_pricing: { enabled: false },
      metadata: {
        kind: "create-ai-chat-credits",
        userId: user.id,
        packId,
        credits: String(pack.credits),
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
      amount: pack.chargeAmount,
      currency: "USD",
      packId,
      credits: pack.credits,
      priceInr: pack.priceInr,
      displayPrice: `$${pack.priceInr.toLocaleString("en-US")}`,
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
