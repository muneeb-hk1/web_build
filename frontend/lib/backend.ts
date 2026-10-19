const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";
export const USER_TOKEN_COOKIE = "user_token";

export function getBackendUrl() {
  return BACKEND_URL;
}

/** Real visitor IP from nginx / Cloudflare (not the Next→Nest localhost hop). */
export function getRequestClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const first = forwarded.split(",")[0]?.trim();
  if (first) return first.replace(/^::ffff:/i, "");
  return (
    request.headers.get("cf-connecting-ip")?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-client-ip")?.trim() ||
    ""
  ).replace(/^::ffff:/i, "");
}

/** Headers for Next.js → Nest so backend geo sees the browser IP. */
export function backendAuthHeaders(request: Request): HeadersInit {
  const ip = getRequestClientIp(request);
  return {
    "Content-Type": "application/json",
    ...(ip
      ? {
          "x-forwarded-for": ip,
          "x-real-ip": ip,
        }
      : {}),
  };
}

/** Secure cookies only work on HTTPS — HTTP production (EC2 IP) must stay insecure. */
export function userAuthCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 7) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_PUBLISH_BASE_URL ||
    "";
  const forceSecure = process.env.COOKIE_SECURE === "true";
  const forceInsecure = process.env.COOKIE_SECURE === "false";
  const secure = forceInsecure
    ? false
    : forceSecure ||
      (process.env.NODE_ENV === "production" && /^https:/i.test(appUrl));

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
