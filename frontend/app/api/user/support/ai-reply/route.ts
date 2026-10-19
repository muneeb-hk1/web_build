import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl, USER_TOKEN_COOKIE } from "@/lib/backend";

export const runtime = "nodejs";
export const maxDuration = 60;

const FALLBACK =
  "Plz Wait some time our team join and help you";

const EDITOR_HELP_SYSTEM = `You are Lestow Assist — the offline support bot for Lestow AI Website Builder (editor help chat).

LANGUAGE MATCH (mandatory — never ignore):
- Always reply in the SAME language the user used in their latest message.
- English message → full English reply (no Hindi/Hinglish sentences).
- Hindi / Devanagari → Hindi reply.
- Hinglish (Roman Hindi mixed with English) → Hinglish reply.
- Match the user's mix: if they write mostly English with one Hindi word, still reply in English.
- Fixed sample phrases below are templates — translate them into the user's language before sending.
- FALLBACK sentence is English-only exception (keep exact when used).

GOAL: Help users with the website EDITOR. Be short, clear, step-by-step.

WHEN YOU CANNOT HELP (unknown product question, billing disputes, account deletion, payment failures, bugs you cannot diagnose, or anything outside editor how-to):
Reply EXACTLY with this sentence and nothing else:
${FALLBACK}

LESTOW EDITOR PROCESS (you know this — follow EXACTLY, never invent menus):

EDITOR MODES
- Custom / template editor (NOT redesign): full theme tools available.
- Redesign editor (URL/designId starts with rd_ / redesign flow): NO "Themes" button, NO "Theme Color", NO "Theme Fonts". Do not tell redesign users to use those.

1) Left sidebar (common)
- Dashboard → user dashboard
- Nav Menu → edit header navigation links
- Blogs / Services / Events / Portfolio / Team / Gallery / Countries / Properties → content managers (category + multi-page dependent)
- Page SEO → SEO settings
- Settings → general site/editor settings (NOT full theme marketplace)
- Help → this support chat
- AI Assist → AI that edits page content (different from Help)
- Logout

2) THEME / COLORS / FONTS — CRITICAL (wrong answers are unacceptable)
CUSTOM website editor ONLY:
- Full template/theme switch: TOP BAR button "Themes" (paint/swatch icon) — opens Themes popup to pick another template skin. NOT under Settings.
- Fine-tune colors: left sidebar "Theme Color"
- Fine-tune fonts: left sidebar "Theme Fonts"
REDESIGN editor:
- There is NO top "Themes" button and NO Theme Color / Theme Fonts sidebar items.
- For color/look changes in redesign: edit sections directly (hover section → Edit), or use AI Assist for style edits. Do NOT say Settings → Theme.
If user asks "theme change kaise?" and mode is unknown, say:
- Custom site: top bar "Themes"; colors/fonts via sidebar Theme Color / Theme Fonts.
- Redesign site: Themes option nahi hota — section edit / AI Assist use karo.

3) Edit text / images / buttons
- Click text on the preview to edit + formatting toolbar
- Hover image or button → edit control appears
- Changes auto-save

4) Header / Nav menu
- Hover the website HEADER in the preview → click Edit
- Or use sidebar "Nav Menu"
- Logo change/replace: Header brand area → Edit (image replace / existing logo text edit if template shows text instead of image)
- LOGO KE AAGE / BAGAL NAME (brand name next to logo image) — CRITICAL:
  Custom + Redesign editor me YE FEATURE ABHI NAHI HAI.
  No "add text beside logo", no drag-position next to logo, no separate brand-name chip control in this editor.
  Agar user pooche "logo ke aage/bagal/paas name likhna" / "logo ke saath company name" / "add name next to logo":
  Sidha bolo — NO invented steps — in the USER'S language, e.g.:
  Hindi/Hinglish: "Ye option abhi editor me available nahi hai. Hum team ko inform kar denge isko implement ke liye."
  English: "This option is not available in the editor yet. We'll inform the team to implement it."
  Kabhi mat bolo: header Edit → text element add → drag position, sidebar +, section edit se name chip, etc.

5) Pages
- Top bar Pages dropdown to switch pages
- Add page where available (multi-page templates)

6) Preview / Export / Publish
- Preview Website → preview
- Export Website → download (plan may apply)
- Publish / Republish → live published URL

7) Common asks
- "Menu kahan se?" → Header hover Edit OR sidebar Nav Menu
- "Banner / hero?" → Hover hero → Edit
- "Logo change?" → Header brand area → Edit (replace image / edit existing logo text only)
- "Logo ke aage name?" → NOT AVAILABLE — use the exact not-available reply in section 4
- "Theme / color?" → follow section 2 exactly (Custom vs Redesign)
- "AI se content?" → AI Assist (not Help)

MISSING FEATURE RULE (very important):
- NEVER invent menus, buttons, drag steps, or "text element add" for features that do not exist.
- If the asked editor option is not in this knowledge: say clearly it is not available + we'll inform the team to implement it — in the USER'S language (English users get English wording).
- Do NOT give fake workarounds that look like real UI steps.
- FALLBACK sentence is only for unknown/billing/account issues — not for known missing features.

RULES:
- Never say theme is inside Settings
- Never invent admin-only features, fake URLs, or fake editor steps
- Never ask for passwords
- Keep answers under ~120 words when possible
- If unsure (not covered above) → use the exact FALLBACK sentence only`;

function extractOpenAiText(data: unknown): string {
  const d = data as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
  };
  return (d.choices?.[0]?.message?.content || "").trim();
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Login required" }, { status: 401 });
  }

  let body: {
    ticketId?: string;
    message?: string;
    editorMode?: string;
    history?: Array<{ role?: string; content?: string }>;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  const ticketId = String(body.ticketId || "").trim();
  const userMessage = String(body.message || "").trim();
  const editorMode =
    String(body.editorMode || "").trim().toLowerCase() === "redesign"
      ? "redesign"
      : "custom";
  if (!ticketId || !userMessage) {
    return NextResponse.json(
      { message: "ticketId and message are required" },
      { status: 400 },
    );
  }

  // Confirm support is offline
  try {
    const presenceRes = await fetch(`${getBackendUrl()}/user/presence`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: "{}",
      cache: "no-store",
    });
    const presence = (await presenceRes.json().catch(() => ({}))) as {
      supportOnline?: boolean;
    };
    if (presenceRes.ok && presence.supportOnline === true) {
      return NextResponse.json(
        { skipped: true, reason: "support_online" },
        { status: 200 },
      );
    }
  } catch {
    /* continue — prefer AI over silence if presence check fails */
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  let replyText = FALLBACK;

  if (apiKey) {
    const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: EDITOR_HELP_SYSTEM },
      {
        role: "system",
        content:
          (editorMode === "redesign"
            ? "CURRENT EDITOR MODE: Redesign. Do NOT mention Themes button, Theme Color, or Theme Fonts — they are hidden. Guide section Edit / AI Assist instead."
            : "CURRENT EDITOR MODE: Custom/template editor. Theme switch = TOP BAR \"Themes\". Colors = sidebar Theme Color. Fonts = sidebar Theme Fonts. Never say Settings → Theme.") +
          " LANGUAGE: Reply ONLY in the same language as the user's latest message (English→English, Hindi→Hindi, Hinglish→Hinglish).",
      },
      ...history
        .filter((h) => h?.content && (h.role === "user" || h.role === "assistant"))
        .map((h) => ({
          role: h.role === "assistant" ? "assistant" : "user",
          content: String(h.content).slice(0, 1500),
        })),
      { role: "user", content: userMessage.slice(0, 2000) },
    ];

    try {
      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.3,
          max_tokens: 400,
          messages,
        }),
      });
      const openaiData = await openaiRes.json().catch(() => ({}));
      const raw = extractOpenAiText(openaiData);
      if (openaiRes.ok && raw) {
        const cleaned = raw.replace(/^["']+|["']+$/g, "").trim();
        // If model drifted from fallback instruction, normalize near-misses
        if (
          /please wait.*team|wait some time|team (will )?join/i.test(cleaned) &&
          cleaned.length < 120
        ) {
          replyText = FALLBACK;
        } else {
          replyText = cleaned.slice(0, 2000);
        }
      }
    } catch {
      replyText = FALLBACK;
    }
  }

  try {
    const res = await fetch(
      `${getBackendUrl()}/user/support-tickets/${encodeURIComponent(ticketId)}/bot-reply`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: replyText }),
        cache: "no-store",
      },
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      // If support came online mid-flight, skip quietly
      if (res.status === 400) {
        return NextResponse.json(
          { skipped: true, reason: "bot_disabled", ...(data as object) },
          { status: 200 },
        );
      }
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json({ ...(data as object), aiReply: replyText });
  } catch {
    return NextResponse.json(
      { message: "Unable to save AI reply" },
      { status: 500 },
    );
  }
}
