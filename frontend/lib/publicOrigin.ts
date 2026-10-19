const BAD_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

function stripSlash(url: string) {
  return url.replace(/\/$/, "");
}

/** Preferred public origin from env (no trailing slash). */
export function getConfiguredPublicOrigin() {
  const configured =
    process.env.NEXT_PUBLIC_PUBLISH_BASE_URL ||
    process.env.PUBLISH_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "";
  return configured ? stripSlash(configured.trim()) : "";
}

/**
 * Browser-safe public site origin for published URLs.
 * Avoids 0.0.0.0 / localhost when NEXT_PUBLIC_* is set.
 */
export function getClientPublicOrigin() {
  const configured = getConfiguredPublicOrigin();
  if (typeof window === "undefined") return configured;

  const { protocol, hostname, host } = window.location;
  if (!BAD_HOSTS.has(hostname)) {
    return `${protocol}//${host}`;
  }
  if (configured) return configured;
  return window.location.origin;
}

/** Server-side publish base URL from request + env. */
export function getPublishBaseUrlFromRequest(request: Request) {
  const configured = getConfiguredPublicOrigin();
  if (configured) return configured;

  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost =
    request.headers.get("x-forwarded-host") || request.headers.get("host");

  if (forwardedProto && forwardedHost) {
    const hostName = forwardedHost.split(":")[0];
    if (!BAD_HOSTS.has(hostName)) {
      return `${forwardedProto}://${forwardedHost}`;
    }
  }

  const requestUrl = new URL(request.url);
  if (!BAD_HOSTS.has(requestUrl.hostname)) {
    return requestUrl.origin;
  }

  return stripSlash(
    process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_PUBLISH_BASE_URL ||
      "https://preview.cssfounder.com",
  );
}
