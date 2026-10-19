import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getPublishBaseUrlFromRequest } from "@/lib/publicOrigin";

const publishedSitesDir = path.join(process.cwd(), "data", "published-sites");

const createPublishedId = (templateId?: string, category?: string) => {
  const base = `${templateId || "template"}-${category || "site"}`
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${base}-${randomUUID().slice(0, 8)}`;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      templateId?: string;
      category?: string;
      pageLinks?: unknown[];
      sections?: unknown[];
      templateVariables?: Record<string, string>;
    };

    if (!Array.isArray(body.sections) || !body.sections.length) {
      return NextResponse.json(
        { error: "Sections are required to publish a site." },
        { status: 400 },
      );
    }

    const id = createPublishedId(body.templateId, body.category);
    const payload = {
      id,
      templateId: body.templateId ?? "template-1",
      category: body.category ?? "Template",
      pageLinks: body.pageLinks ?? [],
      sections: body.sections,
      templateVariables: body.templateVariables ?? {},
      publishedAt: new Date().toISOString(),
    };

    await mkdir(publishedSitesDir, { recursive: true });
    await writeFile(
      path.join(publishedSitesDir, `${id}.json`),
      JSON.stringify(payload, null, 2),
      "utf8",
    );

    const publishedPath = `/published/${id}`;

    return NextResponse.json({
      id,
      path: publishedPath,
      url: `${getPublishBaseUrlFromRequest(request)}${publishedPath}`,
    });
  } catch (error) {
    console.error("Publish failed", error);

    return NextResponse.json(
      { error: "Unable to publish this site." },
      { status: 500 },
    );
  }
}
