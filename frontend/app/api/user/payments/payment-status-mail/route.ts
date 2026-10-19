import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl, USER_TOKEN_COOKIE } from "@/lib/backend";

type Body = {
  status?: "success" | "failed" | "pending";
  productLabel?: string;
  amountLabel?: string;
  reason?: string;
  retryUrl?: string;
  provider?: string;
  orderId?: string;
};

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Login required" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ message: "Invalid request payload" }, { status: 400 });
  }

  try {
    const res = await fetch(`${getBackendUrl()}/auth/user/payment-status-mail`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || "Unable to send payment email." },
        { status: res.status },
      );
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Unable to send payment email." },
      { status: 500 },
    );
  }
}
