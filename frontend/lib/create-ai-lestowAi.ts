/**
 * LestowAi — 100% Desktop gemini-ai-website-builder approach.
 * Plain Gemini full-HTML. No design rails / no hardcoded layouts.
 * Mirror: Desktop/gemini-ai-website-builder builder/server.py
 */

import { generateAiText, type AiTextResult } from "@/lib/aiProvider";

/** Exact Desktop SiteForge SYSTEM_PROMPT */
export const LESTOW_AI_SYSTEM = `You are a senior product designer AND careful frontend engineer.
Return a COMPLETE, VALID, production-quality SINGLE-FILE HTML page (Tailwind CDN + Font Awesome 6).

OUTPUT
- Raw HTML only. Start with <!DOCTYPE html>, end with </html>. No markdown.

QUALITY (never skip)
- Desktop AND mobile must both look designed, not broken.
- Header: logo + nav. On mobile use a hamburger / stacked menu, never overlapping text. Design that mobile menu yourself — layout, colors, and open/close script are yours. Do not use a generic template menu.
- Footer: a real <footer> at the bottom (logo, useful links, address/phone/email, copyright). Never replace a footer request with testimonials/cards.
- Spacing, type scale, contrast, and alignment must look like a real agency site.
- Keep the same school/brand name, colors, and copy unless the user asks to change them.

EDIT vs REBUILD is given in the user message. Follow it exactly.
`;

const EDIT_KEYWORDS = [
  "footer",
  "header",
  "navbar",
  "nav ",
  "color",
  "colour",
  "button",
  "font",
  "mobile",
  "responsive",
  "thick",
  "thin",
  "padding",
  "margin",
  "sticky",
  "fix",
  "thik",
  "theek",
  "theek kro",
  "thik kro",
  "change",
  "kar do",
  "karo",
  "menu",
  "logo",
  "hover",
  "shadow",
  "rounded",
  "gradient",
  "background",
  "bg ",
  "text",
  "heading",
  "content",
  "update",
  "badlo",
  "likho",
  "hero",
  "section",
  "spacing",
  "gap",
  "width",
  "height",
  "top",
  "bottom",
  "left",
  "right",
  "align",
  "center",
  "float",
  "floating",
  "whatsapp",
  "back to top",
  "backtotop",
];

const REBUILD_KEYWORDS = [
  "nayi website",
  "new website",
  "from scratch",
  "poori site",
  "puri site",
  "redesign everything",
  "whole new",
  "scratch se",
  "ek naya",
];

export function isLestowAiSurgicalEdit(prompt: string, html: string): boolean {
  const p = (prompt || "").toLowerCase();
  if (REBUILD_KEYWORDS.some((k) => p.includes(k))) return false;
  if (!html || !/<html/i.test(html) || html.length < 1500) return false;
  if (EDIT_KEYWORDS.some((k) => p.includes(k))) return true;
  return p.split(/\s+/).filter(Boolean).length <= 18;
}

export function buildLestowAiUserMessage(
  prompt: string,
  html: string,
  opts?: { forceSurgical?: boolean; screenshotBrief?: string },
): { msg: string; surgical: boolean; temperature: number } {
  const hasShot = Boolean(opts?.screenshotBrief) || /\[Screenshot locate:/i.test(prompt);
  let surgical =
    opts?.forceSurgical === true
      ? !REBUILD_KEYWORDS.some((k) => (prompt || "").toLowerCase().includes(k))
      : isLestowAiSurgicalEdit(prompt, html);
  // Screenshot crop → always surgical (never full rebuild) unless user asked full redesign
  if (hasShot || opts?.forceSurgical) {
    surgical =
      !REBUILD_KEYWORDS.some((k) => (prompt || "").toLowerCase().includes(k)) &&
      Boolean(html && /<html/i.test(html) && html.length >= 1500);
  }
  if (surgical) {
    const shotRules = hasShot || opts?.forceSurgical
      ? `
SCREENSHOT TARGET (critical):
- The attached image is a CROP of the live page showing WHICH block to edit — not a stock photo to paste as a new hero image.
- Find the SAME block in PREVIOUS HTML using visible text / layout from the screenshot (e.g. "Personalized Guidance", "Vitality Rate", quote, coach name).
- Change ONLY that block (content and/or style as asked). Leave every other section untouched.
- If user said "content update / change" without new copy: improve/refresh text inside THAT block only, keep structure.
- NEVER redesign the whole page. NEVER invent unrelated sections.
${opts?.screenshotBrief ? `- Locate hint: ${opts.screenshotBrief}` : ""}`
      : "";
    const wantsNewHeader =
      /header|navbar|\bnav\b|menu/i.test(prompt) &&
      /new|naya|nayi|banao|bnao|bnaw|change|badlo|badal|redesign|replace|alag|different|dubara/i.test(
        prompt,
      );
    const chromeRule = wantsNewHeader
      ? `
HEADER REDESIGN (critical):
- The user asked for a new header. Replace the existing <header> with a clearly different design: layout, logo treatment, nav, and colors.
- Do not return the previous header. Keep <main> and <footer> the same unless they also asked to change those.
- Include the mobile menu in that same new header.`
      : `
6. If they asked only to fix mobile overflow/overlap: keep the desktop header look and fix the mobile menu (hamburger or wrap).`;
    return {
      surgical: true,
      temperature: wantsNewHeader ? 0.45 : 0.15,
      msg: `MODE: SURGICAL EDIT (do not redesign the website)

User asked (Hindi/English, follow the meaning): ${prompt}
${shotRules}
${chromeRule}
HARD RULES:
1. Copy the PREVIOUS HTML as the base.
2. Change ONLY the part they asked for (example: footer request = edit/add <footer> only; "Get In Touch / contact section design" = restyle that section only).
3. Do NOT invent new sections (no extra testimonials, pricing, or hero) unless asked.
4. Do NOT change brand name, page structure, or unrelated copy.
5. If they asked for footer: make a rich multi-column school/company footer, keep it at the bottom, keep the rest of the page the same.
6. If they asked for a new header or nav: replace <header> with the new design. Do not keep the old header markup.

PREVIOUS HTML:
${html.slice(0, 200_000)}`,
    };
  }
  return {
    surgical: false,
    temperature: 0.45,
    msg: `MODE: FULL PAGE BUILD / MAJOR REDESIGN

User asked: ${prompt}

Build one complete, consistent, premium website. Header + main sections + real footer.
Mobile must work. Do not mix random leftover sections.

PREVIOUS HTML (reuse brand/content if useful):
${html.slice(0, 200_000)}`,
  };
}

export function extractLestowAiHtml(raw: string): string {
  let text = (raw || "").trim();
  if (text.startsWith("```")) {
    const lines = text.split("\n");
    lines.shift();
    text = lines.join("\n");
    if (text.trimEnd().endsWith("```")) {
      text = text.trimEnd().slice(0, -3);
    }
    text = text.trim();
  }
  const lower = text.toLowerCase();
  let start = lower.indexOf("<!doctype html>");
  if (start < 0) start = lower.indexOf("<html");
  if (start >= 0) text = text.slice(start);
  const end = text.toLowerCase().lastIndexOf("</html>");
  if (end >= 0) text = text.slice(0, end + 7);
  text = text.trim();
  if (text && !/^<!DOCTYPE/i.test(text) && /<html\b/i.test(text)) {
    text = `<!DOCTYPE html>\n${text}`;
  }
  return text;
}

/** Onboarding generate — Desktop full build. */
export async function runLestowAiGenerate(params: {
  brandName: string;
  description?: string;
  category?: string;
  email?: string;
  mobile?: string;
  address?: string;
  pageLabel?: string;
  designPrefsPrompt?: string;
  logoImage?: string;
}): Promise<{ html: string; ai: AiTextResult }> {
  const brand = (params.brandName || "Brand").trim();
  const page = (params.pageLabel || "Home").trim();
  const isInner = Boolean(page) && !/^home$/i.test(page);
  const brief = [
    `Brand: ${brand}`,
    params.category ? `Category: ${params.category}` : "",
    params.description ? `About: ${params.description}` : "",
    params.email ? `Email: ${params.email}` : "",
    params.mobile ? `Phone: ${params.mobile}` : "",
    params.address ? `Address: ${params.address}` : "",
    isInner
      ? `Page: ${page}. Inner page: write the sections inside <main> only. A placeholder header and footer are fine; the saved Home header and footer replace them. Do not invent a new site header or footer.`
      : "Page: Home single-page website",
    (params.logoImage || "").startsWith("http")
      ? `Logo image URL (use this exact src in the header): ${params.logoImage}`
      : "",
    params.designPrefsPrompt || "",
  ]
    .filter(Boolean)
    .join("\n");

  const user = `MODE: FULL PAGE BUILD / MAJOR REDESIGN

User asked: Create a complete premium website from this brief.

${brief}

${
    isInner
      ? `Build this inner page's sections inside <main>. Do not design a new header, nav, or footer.`
      : `Build one complete, consistent, premium website. Header + main sections + real footer.`
  }
Mobile must work. Do not mix random leftover sections.

PREVIOUS HTML (reuse brand/content if useful):
`;

  const ai = await generateAiText({
    preferProvider: "gemini",
    strictProvider: true,
    modelTier: "fast",
    messages: [
      { role: "system", content: LESTOW_AI_SYSTEM },
      { role: "user", content: user },
    ],
    temperature: 0.45,
    maxTokens: 65536,
  });

  let html = extractLestowAiHtml(ai.text);
  if (!html || html.length < 2000 || !/<html\b/i.test(html)) {
    const finish = await generateAiText({
      preferProvider: "gemini",
      strictProvider: true,
      modelTier: "fast",
      messages: [
        { role: "system", content: LESTOW_AI_SYSTEM },
        {
          role: "user",
          content: html
            ? `Finish this incomplete HTML into a complete page.\n\n${html.slice(0, 120_000)}\n\nBrief:\n${brief}`
            : user,
        },
      ],
      temperature: 0.3,
      maxTokens: 65536,
    });
    const again = extractLestowAiHtml(finish.text);
    if (again.length > html.length) {
      return { html: again, ai: finish };
    }
  }
  return { html, ai };
}

/** Chat — Desktop surgical vs full. Screenshot → locate + surgical only. */
export async function runLestowAiChat(params: {
  prompt: string;
  html: string;
  images?: Array<{ mimeType?: string; base64: string }>;
  forceSurgical?: boolean;
  screenshotBrief?: string;
  imagesAreAssets?: boolean;
}): Promise<{ html: string; ai: AiTextResult; surgical: boolean }> {
  const images = params.images || [];
  const { msg, surgical, temperature } = buildLestowAiUserMessage(
    params.prompt,
    params.html || "",
    {
      forceSurgical: params.forceSurgical || (images.length > 0 && !params.imagesAreAssets),
      screenshotBrief: params.screenshotBrief,
    },
  );
  let ai: AiTextResult;
  if (images.length > 0) {
    const { generateAiFromImages } = await import("@/lib/aiProvider");
    ai = await generateAiFromImages({
      system: LESTOW_AI_SYSTEM,
      prompt: params.imagesAreAssets
        ? `${msg}\n\nAttached image is a FILE the user uploaded to insert (logo or photo). It is NOT a screenshot of the page. Place it where they asked. Do not redesign the rest of the page.`
        : `${msg}\n\nAttached screenshot(s) = the TARGET region on the page. Match it in HTML and edit only there.`,
      images,
      temperature,
      maxTokens: 65536,
      preferProvider: "gemini",
    });
  } else {
    ai = await generateAiText({
      preferProvider: "gemini",
      strictProvider: true,
      modelTier: "fast",
      messages: [
        { role: "system", content: LESTOW_AI_SYSTEM },
        { role: "user", content: msg },
      ],
      temperature,
      maxTokens: 65536,
    });
  }
  let next = extractLestowAiHtml(ai.text);
  if (!next || next.length < 800) {
    next = params.html;
  }
  return { html: next, ai, surgical };
}
