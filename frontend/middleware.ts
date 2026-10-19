import { NextRequest, NextResponse } from "next/server";

const APP_HOSTS = new Set([
  "lestow.com",
  "www.lestow.com",
  "localhost",
  "127.0.0.1",
]);

function normalizeHost(value: string | null) {
  return (value || "")
    .trim()
    .toLowerCase()
    .split(":")[0]
    .replace(/^www\./, "");
}

function isAppHost(host: string) {
  if (!host) return true;
  if (APP_HOSTS.has(host) || APP_HOSTS.has(`www.${host}`)) return true;
  // Direct server IP / local tooling
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) return true;
  return false;
}

async function resolveSiteKey(host: string, backend: string) {
  const resolveUrl = new URL("/user-state/resolve-domain", backend);
  resolveUrl.searchParams.set("domain", host);
  const response = await fetch(resolveUrl.toString(), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) return "";
  const data = (await response.json().catch(() => null)) as {
    siteId?: string;
    siteSlug?: string;
  } | null;
  return (data?.siteSlug || data?.siteId || "").trim();
}

export async function middleware(request: NextRequest) {
  const hostHeader =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  const host = normalizeHost(hostHeader);
  if (isAppHost(host)) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/maintenance-assets")
  ) {
    return NextResponse.next();
  }

  const backend =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://127.0.0.1:4000";

  try {
    const siteKey = await resolveSiteKey(host, backend);
    if (!siteKey) {
      return NextResponse.next();
    }

    const publishedPrefix = `/published/${encodeURIComponent(siteKey)}`;

    // Clean URL: /published/events[/...] → /[/...]
    if (
      pathname === publishedPrefix ||
      pathname.startsWith(`${publishedPrefix}/`)
    ) {
      const rest = pathname.slice(publishedPrefix.length) || "/";
      const clean = new URL(rest === "" ? "/" : rest, request.url);
      clean.search = search;
      return NextResponse.redirect(clean, 308);
    }

    // Root /about → rewrite to /published/{site}/about (URL stays clean)
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname =
      pathname === "/"
        ? publishedPrefix
        : `${publishedPrefix}${pathname}`;
    return NextResponse.rewrite(rewriteUrl);
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|css|js|map|txt|xml)$).*)",
  ],
};
