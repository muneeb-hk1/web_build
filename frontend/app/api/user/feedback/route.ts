import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl, USER_TOKEN_COOKIE } from "@/lib/backend";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Login required" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request payload" },
      { status: 400 },
    );
  }

  const payload = (body || {}) as {
    area?: string;
    rating?: number | string;
    message?: string;
    attachments?: Array<{
      name?: string;
      url?: string;
      size?: number;
      mimeType?: string;
    }>;
  };

  const area = String(payload.area || "").trim();
  const message = String(payload.message || "").trim();
  const ratingNum = Number(payload.rating);
  const rating =
    Number.isFinite(ratingNum) && ratingNum >= 1 && ratingNum <= 5
      ? Math.round(ratingNum)
      : 0;
  const attachments = Array.isArray(payload.attachments)
    ? payload.attachments
        .map((item) => ({
          name: String(item?.name || "").trim().slice(0, 200),
          url: String(item?.url || "").trim().slice(0, 1000),
          size:
            typeof item?.size === "number" && Number.isFinite(item.size)
              ? Math.max(0, Math.floor(item.size))
              : undefined,
          mimeType:
            String(item?.mimeType || "").trim().slice(0, 120) || undefined,
        }))
        .filter((item) => item.name && item.url)
        .slice(0, 5)
    : [];

  if (!area) {
    return NextResponse.json(
      { message: "Please select what you are giving feedback on." },
      { status: 400 },
    );
  }
  if (!rating) {
    return NextResponse.json(
      { message: "Please rate your experience (1–5)." },
      { status: 400 },
    );
  }
  if (!message) {
    return NextResponse.json(
      { message: "Please share your experience and suggestions." },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(`${getBackendUrl()}/support-tickets`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: "feedback",
        topic: area,
        service: `Experience ${rating}/5`,
        message,
        attachments,
      }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Unable to send feedback." },
      { status: 500 },
    );
  }
}
