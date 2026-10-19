import { getBackendUrl } from "@/lib/backend";
import { getSiteOrigin } from "@/lib/publishedSeo";

async function siteExists(siteId: string): Promise<boolean> {
  try {
    const res = await fetch(`${getBackendUrl()}/sites/public/${siteId}`, {
      next: { revalidate: 600 },
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Per-published-site robots.txt (not the Lestow app robots at /robots.txt).
 * Index/follow toggles in the editor apply via meta robots on pages;
 * this file tells crawlers the site is open and points at its sitemap.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const { siteId } = await params;
  if (!(await siteExists(siteId))) {
    return new Response("Site not found", { status: 404 });
  }

  const origin = getSiteOrigin();
  const base = `${origin}/published/${encodeURIComponent(siteId)}`;
  const body = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
    },
  });
}
