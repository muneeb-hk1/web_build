import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { USER_TOKEN_COOKIE } from "@/lib/backend";
import { getCreateAiChatCreditPack } from "@/lib/create-ai-chat-credits";
import { fetchAuthUser } from "@/lib/razorpayServer";
import { getStripe, isStripeConfigured } from "@/lib/stripeServer";

type VerifyPayload = {
  sessionId?: string;
  packId?: string;
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
    if (meta.kind !== "create-ai-chat-credits") {
      return NextResponse.json(
        { message: "This Stripe session is not a chat credit purchase." },
        { status: 400 },
      );
    }
    if (meta.userId && meta.userId !== user.id) {
      return NextResponse.json(
        { message: "Payment session does not match this account." },
        { status: 403 },
      );
    }

    const packId = (body.packId || meta.packId || "").trim();
    const pack = getCreateAiChatCreditPack(packId);
    if (!pack) {
      return NextResponse.json(
        { message: "Invalid credit pack." },
        { status: 400 },
      );
    }

    const paymentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.id;

    return NextResponse.json({
      ok: true,
      provider: "stripe",
      packId: pack.id,
      credits: pack.credits,
      paymentId,
      orderId: session.id,
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
