import { NextRequest, NextResponse } from "next/server";

function headerCountry(request: NextRequest): string {
  const raw =
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("x-country-code") ||
    request.headers.get("cloudfront-viewer-country") ||
    "";
  const code = raw.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) && code !== "XX" ? code : "";
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const first = forwarded.split(",")[0]?.trim();
  if (first) return first;
  return (
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-client-ip")?.trim() ||
    ""
  );
}

function isPrivateIp(ip: string): boolean {
  return (
    !ip ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
}

async function lookupCountryByIp(ip: string): Promise<string> {
  if (isPrivateIp(ip)) return "";

  // Prefer ipwho.is — ipapi.co is often rate-limited on shared hosts.
  try {
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(3500),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        country_code?: string;
        success?: boolean;
      };
      const code = String(data.country_code || "")
        .trim()
        .toUpperCase();
      if (data.success !== false && /^[A-Z]{2}$/.test(code) && code !== "XX") {
        return code;
      }
    }
  } catch {
    /* fall through */
  }

  try {
    const res = await fetch(
      `https://ipapi.co/${encodeURIComponent(ip)}/country_code/`,
      {
        headers: { Accept: "text/plain" },
        cache: "no-store",
        signal: AbortSignal.timeout(3500),
      },
    );
    if (res.ok) {
      const code = (await res.text()).trim().toUpperCase();
      if (/^[A-Z]{2}$/.test(code) && code !== "XX" && !code.includes("{")) {
        return code;
      }
    }
  } catch {
    /* ignore */
  }
  return "";
}

/**
 * Resolves checkout gateway from client IP / CDN country headers.
 * India → Razorpay (INR). Everyone else → Stripe (USD).
 */
export async function GET(request: NextRequest) {
  const fromHeader = headerCountry(request);
  const ip = clientIp(request);
  const fromIp = fromHeader ? "" : await lookupCountryByIp(ip);
  const country = fromHeader || fromIp || "US";
  const isIndia = country === "IN";

  return NextResponse.json(
    {
      country,
      isIndia,
      gateway: isIndia ? "razorpay" : "stripe",
    },
    {
      headers: {
        "Cache-Control": "private, max-age=300",
      },
    },
  );
}
