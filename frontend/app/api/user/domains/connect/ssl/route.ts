import { cookies } from "next/headers";
import dns from "dns/promises";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { USER_TOKEN_COOKIE } from "@/lib/backend";

export const runtime = "nodejs";
export const maxDuration = 180;

const DEFAULT_A_RECORD_IP =
  process.env.CUSTOM_DOMAIN_A_RECORD_IP || "13.205.91.11";

const SSL_SCRIPT_CANDIDATES = [
  process.env.CUSTOM_DOMAIN_SSL_SCRIPT || "",
  "/home/ubuntu/css-ai-builder-monorepo/scripts/setup-custom-domain-ssl.py",
  path.join(process.cwd(), "scripts", "setup-custom-domain-ssl.py"),
].filter(Boolean);

function normalizeDomain(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "")
    .split("/")[0]
    .split(":")[0];
}

function isSafeDomain(domain: string) {
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(
    domain,
  );
}

async function dnsPointsToServer(domain: string) {
  const hosts = [domain, `www.${domain}`];
  for (const host of hosts) {
    try {
      const addresses = await dns.resolve4(host);
      if (addresses.includes(DEFAULT_A_RECORD_IP)) return true;
    } catch {
      /* try next */
    }
  }
  return false;
}

async function checkHttpsActive(domain: string) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(`https://${domain}/`, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "text/html" },
    });
    clearTimeout(timer);
    return response.ok;
  } catch {
    return false;
  }
}

function resolveSslScript() {
  for (const candidate of SSL_SCRIPT_CANDIDATES) {
    try {
      if (candidate && fs.existsSync(candidate)) return candidate;
    } catch {
      /* ignore */
    }
  }
  return null;
}

function runSslScript(domain: string, scriptPath: string) {
  return new Promise<{ ok: boolean; output: string }>((resolve) => {
    const child = spawn(
      "sudo",
      ["-n", "python3", scriptPath, domain],
      {
        env: process.env,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    let output = "";
    child.stdout.on("data", (chunk) => {
      output += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      output += String(chunk);
    });
    child.on("error", (error) => {
      resolve({ ok: false, output: error.message });
    });
    child.on("close", (code) => {
      resolve({ ok: code === 0, output: output.slice(-4000) });
    });
  });
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const domain = normalizeDomain(
    request.nextUrl.searchParams.get("domain") || "",
  );
  if (!domain || !isSafeDomain(domain)) {
    return NextResponse.json({ message: "Domain is required" }, { status: 400 });
  }

  const active = await checkHttpsActive(domain);
  return NextResponse.json({
    domain,
    sslStatus: active ? "active" : "pending",
    httpsUrl: `https://${domain}/`,
    message: active
      ? "SSL is active. Your site is served over HTTPS."
      : "SSL is not active yet. Enable SSL after DNS is connected.",
  });
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  let body: { domain?: string };
  try {
    body = (await request.json()) as { domain?: string };
  } catch {
    return NextResponse.json({ message: "Invalid request payload" }, { status: 400 });
  }

  const domain = normalizeDomain(body.domain || "");
  if (!domain || !isSafeDomain(domain)) {
    return NextResponse.json(
      { message: "Enter a valid domain like example.com" },
      { status: 400 },
    );
  }

  const dnsOk = await dnsPointsToServer(domain);
  if (!dnsOk) {
    return NextResponse.json(
      {
        sslStatus: "pending",
        message:
          "DNS is not pointing to our server yet. Verify DNS first, then enable SSL.",
      },
      { status: 400 },
    );
  }

  // Already live — no need to re-run certbot.
  if (await checkHttpsActive(domain)) {
    return NextResponse.json({
      domain,
      sslStatus: "active",
      httpsUrl: `https://${domain}/`,
      message: "SSL is already active.",
    });
  }

  const scriptPath = resolveSslScript();
  if (!scriptPath) {
    return NextResponse.json(
      {
        sslStatus: "failed",
        message:
          "SSL installer is not available on this server. Contact support.",
      },
      { status: 500 },
    );
  }

  const result = await runSslScript(domain, scriptPath);
  const active = result.ok && (await checkHttpsActive(domain));

  return NextResponse.json(
    {
      domain,
      sslStatus: active ? "active" : "failed",
      httpsUrl: `https://${domain}/`,
      message: active
        ? "SSL activated. Your domain now opens on HTTPS."
        : "SSL setup failed. Check DNS and try again in a few minutes.",
      detail: process.env.NODE_ENV === "production" ? undefined : result.output,
    },
    { status: active ? 200 : 502 },
  );
}
