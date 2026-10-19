import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { USER_TOKEN_COOKIE } from "@/lib/backend";
import {
  getCreateAiChatCreditPack,
  type CreateAiChatCreditPackId,
} from "@/lib/create-ai-chat-credits";
import {
  formatInrRupees,
  usdCentsToInrPaise,
  usdDollarsToInrRupees,
} from "@/lib/usdToInr";
import {
  ensureRazorpayCustomer,
  fetchAuthUser,
  getRazorpayCredentials,
  razorpayAuthHeader,
} from "@/lib/razorpayServer";

type OrderPayload = {
  packId?: string;
  contact?: string;
};

export async function POST(request: NextRequest) {
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
  const amountInrPaise = usdCentsToInrPaise(pack.chargeAmount);
  const displayInr = usdDollarsToInrRupees(pack.priceInr);
  const chargeCurrency = "INR";
  const displayPrice = formatInrRupees(displayInr);
  const { keyId, keySecret, useMock } = getRazorpayCredentials();

  if (useMock) {
    return NextResponse.json({
      mock: true,
      keyId: keyId || "rzp_test_mock",
      orderId: `order_cai_chat_mock_${Date.now()}`,
      customerId: `cust_mock_${user.id.slice(0, 8)}`,
      amount: amountInrPaise,
      currency: chargeCurrency,
      packId,
      credits: pack.credits,
      priceInr: pack.priceInr,
      displayPrice,
    });
  }

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { message: "Razorpay credentials are not configured on the server." },
      { status: 500 },
    );
  }

  const receipt = `cai-chat-${Date.now()}`.slice(0, 40);

  try {
    const customerId = await ensureRazorpayCustomer(
      keyId,
      keySecret,
      user,
      body.contact?.trim(),
    );
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: razorpayAuthHeader(keyId, keySecret),
      },
      body: JSON.stringify({
        amount: amountInrPaise,
        currency: chargeCurrency,
        receipt,
        notes: {
          kind: "create-ai-chat-credits",
          packId,
          credits: String(pack.credits),
          userId: user.id,
        },
      }),
    });
    const data = (await response.json()) as {
      id?: string;
      amount?: number;
      currency?: string;
      error?: { description?: string };
    };
    if (!response.ok || !data.id) {
      return NextResponse.json(
        {
          message:
            data.error?.description || "Unable to start chat credit purchase.",
        },
        { status: 502 },
      );
    }
    return NextResponse.json({
      mock: false,
      keyId,
      orderId: data.id,
      customerId,
      amount: data.amount ?? amountInrPaise,
      currency: data.currency || chargeCurrency,
      packId,
      credits: pack.credits,
      priceInr: pack.priceInr,
      displayPrice,
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to start chat credit purchase." },
      { status: 502 },
    );
  }
}
