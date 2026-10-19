import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { USER_TOKEN_COOKIE } from "@/lib/backend";
import {
  fetchRazorpayPayment,
  getRazorpayCredentials,
} from "@/lib/razorpayServer";

/**
 * Poll Razorpay payment status (pending / OTP / bank redirect flows).
 * GET ?paymentId=pay_xxx
 */
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Login required" }, { status: 401 });
  }

  const paymentId = request.nextUrl.searchParams.get("paymentId")?.trim() || "";
  if (!paymentId) {
    return NextResponse.json({ message: "Missing paymentId" }, { status: 400 });
  }

  if (paymentId.startsWith("pay_mock_") || /_mock_/i.test(paymentId)) {
    return NextResponse.json({
      paymentId,
      status: "failed",
      orderId: null,
      message: "Mock payments cannot be confirmed.",
    });
  }

  const { keyId, keySecret, useMock } = getRazorpayCredentials();
  if (useMock) {
    return NextResponse.json({
      paymentId,
      status: "failed",
      orderId: null,
      message: "Razorpay is in mock mode.",
    });
  }

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { message: "Razorpay credentials are not configured." },
      { status: 500 },
    );
  }

  try {
    const payment = await fetchRazorpayPayment(keyId, keySecret, paymentId);
    const status = (payment.status || "unknown").toLowerCase();
    const normalized =
      status === "captured" || status === "authorized"
        ? "captured"
        : status === "failed" || status === "cancelled" || status === "canceled"
          ? "failed"
          : "pending";

    return NextResponse.json({
      paymentId: payment.id || paymentId,
      orderId: payment.order_id || null,
      status: normalized,
      rawStatus: status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to fetch payment status.",
        status: "pending",
      },
      { status: 502 },
    );
  }
}
