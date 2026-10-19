import { NextResponse } from "next/server";
import { hasAnyAiKey } from "@/lib/aiProvider";
import { runLestowAiGenerate } from "@/lib/create-ai-lestowAi";
import {
  formatCreateAiDesignPrefsPrompt,
  normalizeCreateAiDesignPrefs,
  type CreateAiDesignPrefs,
} from "@/lib/create-ai-design-prefs";
import { applyCreateAiDesignTheme } from "@/lib/create-ai-chrome";

export const runtime = "nodejs";
export const maxDuration = 180;
export const dynamic = "force-dynamic";

type CreateSiteBody = {
  brandName?: string;
  description?: string;
  category?: string;
  websiteRelated?: string;
  pageType?: string;
  audience?: string;
  email?: string;
  mobile?: string;
  address?: string;
  pageLabel?: string;
  designPrefs?: CreateAiDesignPrefs;
  logoImage?: string;
};

/** LestowAi generate — Gemini designs the header. Palette and font are applied after. */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateSiteBody;
    const brandName = (body.brandName || "").trim() || "Your Brand";

    if (!hasAnyAiKey()) {
      return NextResponse.json(
        {
          error:
            "No AI API key configured — cannot invent a fresh design without AI.",
        },
        { status: 503 },
      );
    }

    const prefs = normalizeCreateAiDesignPrefs(body.designPrefs);
    const logo =
      typeof body.logoImage === "string" && body.logoImage.startsWith("http")
        ? body.logoImage.trim()
        : "";
    const generated = await runLestowAiGenerate({
      brandName,
      description: body.description,
      category: body.category,
      email: body.email,
      mobile: body.mobile,
      address: body.address,
      pageLabel: body.pageLabel,
      logoImage: logo,
      designPrefsPrompt: formatCreateAiDesignPrefsPrompt(prefs),
    });
    const ai = generated.ai;
    const html = applyCreateAiDesignTheme(generated.html, prefs);

    if (!html || !/<html\b/i.test(html) || html.length < 800) {
      return NextResponse.json(
        {
          error:
            "Generate incomplete — the AI did not return a full page. Please try again.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      html,
      provider: ai.provider,
      model: ai.model,
      tokensUsed: ai.tokensUsed,
      fallback: false,
      imageCount: 0,
      message: "Preview ready",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Create-site failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
