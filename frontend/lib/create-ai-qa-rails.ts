/**
 * Deterministic QA rails for Create-with-AI HTML.
 * Fixes recurring model bugs WITHOUT endless prompt whack-a-mole:
 * - header white-on-white / low contrast
 * - missing footer
 * - empty card shells
 * - huge empty vertical gaps
 */

const QA_MARK = 'data-create-ai-qa-rails="1"';

function stripTags(s: string) {
  return (s || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(s: string) {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Reject CSS / selector scraps that false-match brand attrs in <style>. */
function isSaneCreateAiBrand(name: string) {
  const s = (name || "").trim();
  if (s.length < 2 || s.length > 80) return false;
  if (/[{};]|::|--[a-z]|!important|^\*|[\[\]]/i.test(s)) return false;
  if (/\b(header|nav|span|div|first-child|not\(|max-width)\b/i.test(s)) {
    return false;
  }
  return true;
}

/**
 * Read brand from real HTML attrs only — never CSS like `[data-cai-brand-label]{`.
 */
function extractCreateAiBrandFromHtml(html: string) {
  if (!html) return "";
  const bodyOnly = html.replace(/<style[\s\S]*?<\/style>/gi, " ");
  const candidates = [
    bodyOnly.match(
      /data-cai-brand-label\s*=\s*["'][^"']*["'][^>]*>([\s\S]*?)<\//i,
    )?.[1],
    bodyOnly.match(
      /<(?:span|a|strong|div)\b[^>]*\bdata-cai-brand-label\b[^>]*>([\s\S]*?)<\//i,
    )?.[1],
    bodyOnly.match(
      /alt\s*=\s*["']([^"']{2,80})["'][^>]*\bdata-create-ai-logo\b/i,
    )?.[1],
    bodyOnly.match(
      /\bdata-create-ai-logo\b[^>]*\balt\s*=\s*["']([^"']{2,80})["']/i,
    )?.[1],
    bodyOnly.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1],
  ];
  for (const raw of candidates) {
    const name = stripTags(raw || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 60);
    if (isSaneCreateAiBrand(name)) return name;
  }
  return "";
}

/** Parse #rgb / #rrggbb / rgb() → luminance 0–1 */
function colorLuminance(raw: string): number | null {
  const s = (raw || "").trim().toLowerCase();
  if (!s) return null;
  if (/^(white|#fff|#ffffff|transparent)$/i.test(s)) return 1;
  if (/^(black|#000|#000000)$/i.test(s)) return 0;
  let r = 0;
  let g = 0;
  let b = 0;
  const hex = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)?.[1];
  if (hex) {
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    }
  } else {
    const m = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (!m) return null;
    r = +m[1];
    g = +m[2];
    b = +m[3];
  }
  const rs = r / 255;
  const gs = g / 255;
  const bs = b / 255;
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function styleProp(style: string, prop: string): string {
  const re = new RegExp(
    `(?:^|;|\\s)${prop}\\s*:\\s*([^;]+)`,
    "i",
  );
  return style.match(re)?.[1]?.trim() || "";
}

/**
 * Header: force readable ink on light bars (AI loves color:#fff on #fafafa).
 * Dark intentional headers keep light text.
 */
export function fixCreateAiHeaderContrast(html: string): string {
  if (!html || !/<header\b/i.test(html)) return html;
  return html.replace(
    /<header\b([^>]*)>([\s\S]*?)<\/header>/i,
    (_m, attrs: string, inner: string) => {
      const style = attrs.match(/\bstyle=(["'])([\s\S]*?)\1/i)?.[2] || "";
      const bg =
        styleProp(style, "background-color") ||
        styleProp(style, "background") ||
        "";
      const fg = styleProp(style, "color") || "";
      const bgL = colorLuminance(bg.split(/\s/)[0] || "") ?? 0.96;
      const fgL = colorLuminance(fg) ?? 0.95;
      const bgIsLight = !bg || bgL > 0.72 || /transparent|none/i.test(bg);
      const fgIsLight = !fg || fgL > 0.72;
      const bgIsDark = bgL < 0.35;

      let nextAttrs = attrs;
      let nextInner = inner;

      if (bgIsLight && fgIsLight) {
        // Force light bar + dark ink
        if (/\bstyle=(["'])/i.test(nextAttrs)) {
          nextAttrs = nextAttrs.replace(
            /\bstyle=(["'])([\s\S]*?)\1/i,
            (_s, q: string, st: string) => {
              let s = st
                .replace(/color\s*:\s*[^;]+;?/gi, "")
                .replace(/background(?:-color)?\s*:\s*[^;]+;?/gi, "");
              s = `background:#ffffff;color:#0f172a;border-bottom:1px solid rgba(15,23,42,.08);${s}`;
              return `style=${q}${s}${q}`;
            },
          );
        } else {
          nextAttrs += ` style="background:#ffffff;color:#0f172a;border-bottom:1px solid rgba(15,23,42,.08)"`;
        }
        // Strip white/light ink from brand + nav links (keep CTA pills with own bg)
        nextInner = nextInner.replace(
          /<(a|span|div|p|nav|button)\b([^>]*)>/gi,
          (full, tag: string, a: string) => {
            if (/data-cai-menu-btn/i.test(a)) return full;
            const st = a.match(/\bstyle=(["'])([\s\S]*?)\1/i)?.[2] || "";
            const ownBg =
              styleProp(st, "background-color") || styleProp(st, "background");
            const ownBgL = colorLuminance(ownBg.split(/\s/)[0] || "");
            if (ownBg && ownBgL != null && ownBgL < 0.45) return full; // dark CTA
            if (!/color\s*:/i.test(st) && !/color\s*:/i.test(a)) {
              // class-only white text — add ink
              if (/\bstyle=(["'])/i.test(a)) {
                return `<${tag}${a.replace(
                  /\bstyle=(["'])([\s\S]*?)\1/i,
                  (_x, q: string, s: string) =>
                    `style=${q}${s.replace(/color\s*:\s*[^;]+;?/gi, "")}color:#0f172a;${q}`,
                )}>`;
              }
              return `<${tag}${a} style="color:#0f172a">`;
            }
            return `<${tag}${a.replace(
              /\bstyle=(["'])([\s\S]*?)\1/i,
              (_x, q: string, s: string) => {
                const col = styleProp(s, "color");
                const cL = colorLuminance(col);
                if (cL != null && cL > 0.7) {
                  return `style=${q}${s.replace(/color\s*:\s*[^;]+;?/gi, "")}color:#0f172a;${q}`;
                }
                return `style=${q}${s}${q}`;
              },
            )}>`;
          },
        );
      } else if (bgIsDark && fg && colorLuminance(fg)! < 0.4) {
        // Dark bar + dark text → light ink
        nextInner = nextInner.replace(
          /color\s*:\s*[^;]+/gi,
          "color:#f8fafc",
        );
      }

      if (!/data-create-ai-hdr=/i.test(nextAttrs)) {
        nextAttrs += ` data-create-ai-hdr="1"`;
      }
      return `<header${nextAttrs}>${nextInner}</header>`;
    },
  );
}

function isSaneFooterContactValue(value: string) {
  const t = (value || "").replace(/\s+/g, " ").trim();
  if (!t || t.length > 120) return false;
  // Never leak source / regex scraps into footer Contact column
  if (
    /\.test\s*\(|javascript:\)|\/i\.test|mailto:\|tel:|href\)\s*\{|function\s*\(|const\s+|let\s+|=>/i.test(
      t,
    )
  ) {
    return false;
  }
  if (/[{};<>]|placeholder\s*=|required\s*>/i.test(t)) return false;
  return true;
}

/** Strip model/rails accidents that dump JS into visible HTML. */
export function stripLeakedCreateAiSourceSnippets(html: string): string {
  if (!html) return html;
  let out = html;
  // e.g. ljavascript:)/i.test(href)) {
  out = out.replace(
    /[a-z]{0,3}javascript:\)\s*\/i\.test\(href\)\)\s*\{[^<]{0,80}/gi,
    "",
  );
  out = out.replace(
    /\/\?\(?#\|tel:\|mailto:\|javascript:\)[\s\S]{0,60}?\.test\(href\)[\s\S]{0,40}?\{/gi,
    "",
  );
  out = out.replace(
    /(?:^|>)\s*\/\^\(#\|tel:\|mailto:\|javascript:\)\/i\.test\(href\)[\s\S]{0,40}?(?=<|$)/gi,
    (m) => (m.startsWith(">") ? ">" : ""),
  );
  // Visible text nodes that are clearly code
  out = out.replace(
    /<(p|span|div|li|a)\b([^>]*)>([\s\S]*?)<\/\1>/gi,
    (full, tag: string, attrs: string, inner: string) => {
      const text = stripTags(inner);
      if (
        /\.test\s*\(\s*href\s*\)|javascript:\)\s*\/i|function\s*\(|=>\s*\{/.test(
          text,
        )
      ) {
        return "";
      }
      return full;
    },
  );
  return out;
}

/**
 * Section must be a real <section id="…"> with meaningful body — not empty div stubs.
 */
function pageHasRealSection(body: string, id: string): boolean {
  const re = new RegExp(
    `<section\\b[^>]*\\bid=["']${id}["'][^>]*>([\\s\\S]*?)<\\/section>`,
    "i",
  );
  const m = body.match(re);
  if (!m) {
    // contact may use data-create-ai-contact
    if (id === "contact") {
      const c = body.match(
        /<section\b[^>]*data-create-ai-contact=["']1["'][^>]*>([\s\S]*?)<\/section>/i,
      );
      if (!c) return false;
      return stripTags(c[1]).length >= 40 || /<form\b/i.test(c[1]);
    }
    if (id === "home" || id === "hero") {
      return /<(?:section|header|div)\b[^>]*(?:\bid=["'](?:home|hero)["']|data-create-ai-hero)/i.test(
        body,
      );
    }
    return false;
  }
  const inner = m[1] || "";
  const textLen = stripTags(inner).length;
  if (textLen < 40 && !/<img\b|<form\b|<iframe\b/i.test(inner)) return false;
  return true;
}

function pickFooterVariant(brand: string, html: string): 0 | 1 | 2 {
  const seed = `${brand}|${html.slice(0, 200)}`;
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return (Math.abs(h) % 3) as 0 | 1 | 2;
}

/** True address for footer — never HTML leftovers from id="emailAddr" etc. */
function isSaneFooterAddress(value: string) {
  const t = (value || "").replace(/\s+/g, " ").trim();
  if (t.length < 8 || t.length > 120) return false;
  if (
    /placeholder\s*=|required\s*>|type\s*=|mailto:|tel:|<[a-z/]|@|\b(email|phone|whatsapp|submit|inquiry)\b|\.test\s*\(|javascript:\)|\/i\.test/i.test(
      t,
    )
  ) {
    return false;
  }
  // Hours line is not an address
  if (
    /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i.test(t) &&
    /\b(am|pm)\b/i.test(t)
  ) {
    return false;
  }
  // Prefer street-like lines (digit or place words)
  if (
    !/\d/.test(t) &&
    !/\b(block|street|road|avenue|zone|sector|nagar|floor|building|delhi|mumbai|bangalore|chennai|kolkata|office|campus)\b/i.test(
      t,
    )
  ) {
    return false;
  }
  return true;
}

/**
 * Pull address for footer Contact column.
 * Prefer onboarding contact; else "Campus Address" / Address label in #contact.
 * Never match short "addr" inside emailAddr (that leaked placeholder=… required>).
 */
function extractFooterAddress(html: string, contactAddress?: string) {
  const fromArg = (contactAddress || "").trim();
  if (fromArg && isSaneFooterAddress(fromArg)) return fromArg.slice(0, 100);

  const contactBlock =
    html.match(
      /<(?:section|div)\b[^>]*(?:id=["']contact["']|data-create-ai-contact=["']1["'])[^>]*>([\s\S]*?)(?=<(?:section|footer)\b|<\/body>|$)/i,
    )?.[1] || html;

  // Label then value in separate nodes: Campus Address … 125, E Block…
  const afterLabel = contactBlock.match(
    /(?:campus\s+)?address\s*<\/[^>]+>\s*(?:<(?:div|p|span|strong|i|svg)[^>]*>\s*)*([^<]{8,100})/i,
  )?.[1];
  if (afterLabel && isSaneFooterAddress(afterLabel)) {
    return afterLabel.replace(/\s+/g, " ").trim().slice(0, 100);
  }

  const contactText = stripTags(contactBlock);
  const labeled = contactText.match(
    /\b(?:campus\s+)?address\b\s*[:\-–—]?\s*([A-Za-z0-9][\s\S]{6,90}?)(?=\s*(?:office\s+hours|email\s+us|call|whatsapp|send\s+an|full\s+name|interested|$))/i,
  )?.[1];
  if (labeled && isSaneFooterAddress(labeled)) {
    return labeled.replace(/\s+/g, " ").trim().slice(0, 100);
  }

  // Same-line: Address: 125, E Block…
  const inline = stripTags(html).match(
    /\b(?:campus\s+)?address\b\s*[:\-–—]\s*([A-Za-z0-9][^|]{7,90}?)(?=\s*(?:office|email|phone|call|$))/i,
  )?.[1];
  if (inline && isSaneFooterAddress(inline)) {
    return inline.replace(/\s+/g, " ").trim().slice(0, 100);
  }

  return "";
}

/**
 * Header CTA pills: force readable label ink (usually #fff on colored fill).
 * Stops dark-on-dark / light-on-light after generate + QA rails.
 */
export function ensureCreateAiHeaderCtaInk(html: string): string {
  if (!html || !/<header\b/i.test(html)) return html;
  return html.replace(
    /<header\b([^>]*)>([\s\S]*?)<\/header>/i,
    (block, hAttrs: string, inner: string) => {
      let touched = false;
      const nextInner = inner.replace(
        /<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/gi,
        (full, tag: string, attrs: string, body: string) => {
          const text = stripTags(body).replace(/\s+/g, " ").trim();
          if (!text || text.length > 40) return full;
          if (/data-cai-brand|data-create-ai-brand|data-cai-menu/i.test(attrs)) {
            return full;
          }
          const st = attrs.match(/\bstyle=(["'])([\s\S]*?)\1/i)?.[2] || "";
          const looksCta =
            tag.toLowerCase() === "button" ||
            /btn|cta|button/i.test(attrs) ||
            (/padding/i.test(st) &&
              (/background/i.test(st) || /border-radius/i.test(st))) ||
            /book|get\s*started|schedule|repair|enquire|request|consult|talk|call|visit|reserve/i.test(
              text,
            );
          if (!looksCta) return full;
          const bg =
            styleProp(st, "background-color") || styleProp(st, "background");
          const bgL = colorLuminance((bg || "").split(/\s/)[0] || "");
          // Dark / mid fill → white label; light fill → dark label
          const ink =
            bgL == null || bgL < 0.62 ? "#ffffff" : "#0f172a";
          touched = true;
          let next = attrs.replace(/\s*data-cai-btn=(["'])[^"']*\1/gi, "");
          next = `${next} data-cai-btn="hdr-cta"`;
          if (/\bstyle\s*=/i.test(next)) {
            next = next.replace(
              /\bstyle\s*=\s*(["'])([^"']*)\1/i,
              (_s, q: string, style: string) => {
                const cleaned = style
                  .replace(/color\s*:\s*[^;]+;?/gi, "")
                  .trim()
                  .replace(/;+\s*$/g, "");
                const joined = cleaned
                  ? `${cleaned};color:${ink} !important`
                  : `color:${ink} !important`;
                return `style=${q}${joined}${q}`;
              },
            );
          } else {
            next += ` style="color:${ink} !important"`;
          }
          return `<${tag}${next}>${body}</${tag}>`;
        },
      );
      if (!touched) return block;
      return `<header${hAttrs}>${nextInner}</header>`;
    },
  );
}

/** Remove every footer (closed + unclosed) and our polish orphans — then inject one. */
function stripAllFootersAndOrphans(html: string): string {
  let out = html || "";
  // Closed footers (all)
  out = out.replace(/<footer\b[\s\S]*?<\/footer>/gi, "");
  // Unclosed <footer ...> through </body> / end
  out = out.replace(/<footer\b[^>]*>[\s\S]*?(?=<\/body>|$)/gi, "");
  // Orphan polish columns left on light background (duplicate EXPLORE / CONTACT)
  out = out.replace(
    /<(?:div|section)\b[^>]*>[\s\S]*?Thanks for visiting\. Reach out anytime[\s\S]*?(?:All rights reserved\.|Add email \/ phone in chat)[\s\S]*?<\/(?:div|section)>/gi,
    "",
  );
  out = out.replace(
    /<(?:div|section)\b[^>]*>[\s\S]*?>\s*EXPLORE\s*<[\s\S]*?>\s*CONTACT\s*<[\s\S]*?(?:Add email \/ phone in chat|All rights reserved\.)[\s\S]*?<\/(?:div|section)>/gi,
    "",
  );
  // Stray copyright lines immediately before </body>
  out = out.replace(
    /(?:<p[^>]*>\s*)?©\s*\d{4}[^<]{0,80}(?:All rights reserved\.?)?\s*(?:<\/p>)?\s*(?=<\/body>)/gi,
    "",
  );
  return out;
}

/** Always have exactly one real footer. */
export function ensureCreateAiFooter(
  html: string,
  brandName?: string,
  contact?: { email?: string; mobile?: string; address?: string },
): string {
  if (!html) return html;
  return polishCreateAiFooter(html, brandName, contact);
}

/**
 * User asked "footer acha/banao" / generate rails — exactly ONE multi-block footer.
 */
export function polishCreateAiFooter(
  html: string,
  brandName?: string,
  contact?: { email?: string; mobile?: string; address?: string },
): string {
  if (!html) return html;
  const cleanHtml = stripLeakedCreateAiSourceSnippets(html);
  const fromArg = (brandName || "").trim();
  const brand =
    (isSaneCreateAiBrand(fromArg) ? fromArg.slice(0, 60) : "") ||
    extractCreateAiBrandFromHtml(cleanHtml) ||
    "Brand";
  const year = new Date().getFullYear();
  const body =
    cleanHtml.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)?.[1] ||
    cleanHtml.replace(/<style[\s\S]*?<\/style>/gi, " ");
  const specs: Array<{ id: string; label: string }> = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "gallery", label: "Gallery" },
    { id: "testimonials", label: "Reviews" },
    { id: "pricing", label: "Pricing" },
    { id: "faq", label: "FAQ" },
    { id: "team", label: "Team" },
    { id: "contact", label: "Contact" },
  ];
  const sectionLinks: Array<{ id: string; label: string }> = [];
  for (const s of specs) {
    if (s.id === "home") {
      sectionLinks.push(s);
      continue;
    }
    if (pageHasRealSection(body, s.id)) sectionLinks.push(s);
  }
  if (!sectionLinks.some((s) => s.id === "contact") && pageHasRealSection(body, "contact")) {
    sectionLinks.push({ id: "contact", label: "Contact" });
  }

  const linkColor = "#FFEDD5";
  const quickLinksHtml = sectionLinks
    .map(
      (s) =>
        `<a href="#${escapeHtml(s.id)}" style="color:${linkColor};text-decoration:none">${escapeHtml(s.label)}</a>`,
    )
    .join("\n        ");

  let email =
    (contact?.email || "").trim() ||
    cleanHtml.match(/mailto:([^"'?\s]+)/i)?.[1] ||
    cleanHtml.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i)?.[0] ||
    "";
  if (!isSaneFooterContactValue(email) || !email.includes("@")) email = "";

  let phone =
    (contact?.mobile || "").trim() ||
    cleanHtml.match(/tel:([^"'?\s]+)/i)?.[1] ||
    "";
  if (!isSaneFooterContactValue(phone) || !/\d{8,}/.test(phone.replace(/\D/g, ""))) {
    phone = "";
  }
  const address = extractFooterAddress(cleanHtml, contact?.address);

  const contactBits = [
    email &&
      `<a href="mailto:${escapeHtml(email)}" style="color:${linkColor};text-decoration:none">${escapeHtml(email)}</a>`,
    phone &&
      `<a href="tel:${escapeHtml(phone.replace(/\s+/g, ""))}" style="color:${linkColor};text-decoration:none">${escapeHtml(phone)}</a>`,
    address && isSaneFooterContactValue(address)
      ? `<span>${escapeHtml(address)}</span>`
      : "",
  ].filter(Boolean);

  const variant = pickFooterVariant(brand, cleanHtml);
  const skins = [
    {
      // warm stone — classic 4-col
      bg: "linear-gradient(165deg,#1C1917 0%,#2A2421 100%)",
      fg: "#FAF2EA",
      brand: "#FFF7ED",
      muted: "rgba(250,242,234,.12)",
      border: "rgba(255,247,237,.22)",
      tagline:
        "Premium service with clear communication — strategy, craft, and care in every engagement.",
    },
    {
      // slate — centered band (different structure)
      bg: "linear-gradient(160deg,#0f172a 0%,#1e293b 100%)",
      fg: "#e2e8f0",
      brand: "#f8fafc",
      muted: "rgba(226,232,240,.14)",
      border: "rgba(226,232,240,.22)",
      tagline:
        "Built for clarity, speed, and trust — every detail tuned to your brand.",
    },
    {
      // emerald — split brand + stacked links (different structure)
      bg: "linear-gradient(165deg,#111827 0%,#064e3b 120%)",
      fg: "#ecfdf5",
      brand: "#f0fdf4",
      muted: "rgba(236,253,245,.14)",
      border: "rgba(236,253,245,.22)",
      tagline:
        "Reliable delivery, honest communication, and outcomes you can measure.",
    },
  ] as const;
  const skin = skins[variant];

  const socialHtml = `<div style="display:flex;flex-wrap:wrap;gap:10px">
        <a href="#" aria-label="Facebook" style="width:36px;height:36px;border-radius:999px;border:1px solid ${skin.border};display:grid;place-items:center;color:${linkColor};text-decoration:none;font-size:13px">f</a>
        <a href="#" aria-label="Twitter" style="width:36px;height:36px;border-radius:999px;border:1px solid ${skin.border};display:grid;place-items:center;color:${linkColor};text-decoration:none;font-size:13px">𝕏</a>
        <a href="#" aria-label="LinkedIn" style="width:36px;height:36px;border-radius:999px;border:1px solid ${skin.border};display:grid;place-items:center;color:${linkColor};text-decoration:none;font-size:13px">in</a>
        <a href="#" aria-label="Instagram" style="width:36px;height:36px;border-radius:999px;border:1px solid ${skin.border};display:grid;place-items:center;color:${linkColor};text-decoration:none;font-size:13px">ig</a>
      </div>`;
  const contactCol = contactBits.length
    ? contactBits.join("")
    : `<span style="opacity:.7">Add email / phone in chat</span>`;
  const quickCol =
    quickLinksHtml ||
    `<a href="#home" style="color:${linkColor};text-decoration:none">Home</a>`;

  // Three real layouts — not just recolored copies of the same grid
  const layouts = [
    // 0: classic brand + 3 columns
    `<div style="max-width:1240px;margin:0 auto;display:grid;grid-template-columns:1.4fr repeat(3,minmax(140px,1fr));gap:32px;align-items:start;text-align:left">
    <div>
      <strong style="display:block;font:400 1.5rem/1.2 Instrument Serif,Georgia,serif;letter-spacing:.01em;margin-bottom:12px;color:${skin.brand}">${escapeHtml(brand)}</strong>
      <p style="margin:0;opacity:.78;font-size:14px;line-height:1.6;max-width:36ch">${escapeHtml(skin.tagline)}</p>
    </div>
    <div>
      <strong style="display:block;font-size:12px;text-transform:uppercase;letter-spacing:.1em;opacity:.65;margin-bottom:14px">Quick Links</strong>
      <div style="display:flex;flex-direction:column;gap:10px;font-size:14px">${quickCol}</div>
    </div>
    <div>
      <strong style="display:block;font-size:12px;text-transform:uppercase;letter-spacing:.1em;opacity:.65;margin-bottom:14px">Contact</strong>
      <div style="display:flex;flex-direction:column;gap:10px;font-size:14px;opacity:.92">${contactCol}</div>
    </div>
    <div>
      <strong style="display:block;font-size:12px;text-transform:uppercase;letter-spacing:.1em;opacity:.65;margin-bottom:14px">Follow</strong>
      ${socialHtml}
    </div>
  </div>`,
    // 1: centered brand band + horizontal quick links
    `<div style="max-width:900px;margin:0 auto;text-align:center">
    <strong style="display:block;font:400 1.75rem/1.2 Instrument Serif,Georgia,serif;color:${skin.brand};margin-bottom:10px">${escapeHtml(brand)}</strong>
    <p style="margin:0 auto 22px;opacity:.78;font-size:14px;line-height:1.6;max-width:42ch">${escapeHtml(skin.tagline)}</p>
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:10px 18px;font-size:14px;margin-bottom:26px">${quickCol}</div>
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:10px 20px;font-size:14px;opacity:.92;margin-bottom:22px">${contactCol}</div>
    <div style="display:flex;justify-content:center">${socialHtml}</div>
  </div>`,
    // 2: split — brand left, links+contact stacked right
    `<div style="max-width:1240px;margin:0 auto;display:grid;grid-template-columns:minmax(220px,1fr) minmax(280px,1.2fr);gap:40px;align-items:start">
    <div>
      <strong style="display:block;font:400 1.6rem/1.2 Instrument Serif,Georgia,serif;color:${skin.brand};margin-bottom:12px">${escapeHtml(brand)}</strong>
      <p style="margin:0 0 18px;opacity:.78;font-size:14px;line-height:1.6;max-width:34ch">${escapeHtml(skin.tagline)}</p>
      ${socialHtml}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px">
      <div>
        <strong style="display:block;font-size:12px;text-transform:uppercase;letter-spacing:.1em;opacity:.65;margin-bottom:14px">Quick Links</strong>
        <div style="display:flex;flex-direction:column;gap:10px;font-size:14px">${quickCol}</div>
      </div>
      <div>
        <strong style="display:block;font-size:12px;text-transform:uppercase;letter-spacing:.1em;opacity:.65;margin-bottom:14px">Contact</strong>
        <div style="display:flex;flex-direction:column;gap:10px;font-size:14px;opacity:.92">${contactCol}</div>
      </div>
    </div>
  </div>`,
  ] as const;

  const rich = `<footer data-create-ai-footer="1" data-cai-footer-polish="1" data-cai-footer-variant="${variant}" style="margin-top:64px;padding:48px 24px 28px;background:${skin.bg};color:${skin.fg};font-family:Manrope,system-ui,sans-serif">
  ${layouts[variant]}
  <div style="max-width:1240px;margin:32px auto 0;padding-top:20px;border-top:1px solid ${skin.muted};display:flex;flex-wrap:wrap;gap:10px 24px;justify-content:space-between;opacity:.65;font-size:13px">
    <p style="margin:0">© ${year} ${escapeHtml(brand)}. All rights reserved.</p>
    <p style="margin:0">Designed for ${escapeHtml(brand)}</p>
  </div>
</footer>
<style data-cai-footer-resp="1">@media (max-width:800px){footer[data-cai-footer-polish="1"][data-cai-footer-variant="0"]>div:first-child{grid-template-columns:1fr 1fr!important;gap:22px!important}footer[data-cai-footer-polish="1"][data-cai-footer-variant="0"]>div:first-child>div:first-child{grid-column:1/-1}footer[data-cai-footer-polish="1"][data-cai-footer-variant="2"]>div:first-child{grid-template-columns:1fr!important}footer[data-cai-footer-polish="1"][data-cai-footer-variant="2"]>div:first-child>div:last-child{grid-template-columns:1fr 1fr!important}}</style>`;

  let out = stripAllFootersAndOrphans(cleanHtml);
  if (/<\/body>/i.test(out)) {
    return out.replace(/<\/body>/i, `${rich}\n</body>`);
  }
  return `${out}\n${rich}`;
}

/** Drop empty card / ghost boxes AI leaves in grids. */
export function stripEmptyCreateAiCards(html: string): string {
  if (!html) return html;
  let out = html;
  for (let i = 0; i < 4; i += 1) {
    const before = out;
    out = out.replace(
      /<(div|article|li|section)\b([^>]*)>([\s\S]*?)<\/\1>/gi,
      (full, tag: string, attrs: string, inner: string) => {
        if (/id=["']/i.test(attrs) || /data-create-ai|data-cai-/i.test(attrs)) {
          return full;
        }
        const text = stripTags(inner);
        const hasMedia = /<(img|svg|video|iframe)\b/i.test(inner);
        if (!text && !hasMedia) return "";
        if (text.length < 2 && !hasMedia) return "";
        // Whitespace-only ghost card
        if (!hasMedia && /^[\s\u00a0]*$/.test(inner.replace(/<br\s*\/?>/gi, ""))) {
          return "";
        }
        return full;
      },
    );
    if (out === before) break;
  }
  return out;
}

/**
 * Empty testimonial cards (stars + initials, no quote) → fill readable quotes.
 * Avoids white-on-white / blank "Words of Praise" grids.
 */
export function ensureCreateAiTestimonialsFilled(
  html: string,
  brandName?: string,
): string {
  if (!html || !/<section\b[^>]*\bid=["']testimonials["']/i.test(html)) {
    return html;
  }
  const brand = escapeHtml((brandName || "the team").trim() || "the team");
  const fallbacks = [
    `${brand} delivered beyond expectations — clear, calm, and completely on brief.`,
    `Professional from first call to final delivery. We felt looked after throughout.`,
    `Beautiful execution and dependable communication. We will work with them again.`,
  ];

  return html.replace(
    /<section\b([^>]*\bid=["']testimonials["'][^>]*)>([\s\S]*?)<\/section>/i,
    (_m, attrs: string, inner: string) => {
      let fi = 0;
      let cardCount = 0;
      let quoteCount = 0;

      const next = inner.replace(
        /<(article|div)\b([^>]*)>([\s\S]*?)<\/\1>/gi,
        (card: string, tag: string, a: string, body: string) => {
          if (/id=["']/i.test(a) || /data-create-ai-|data-cai-/i.test(a)) {
            return card;
          }
          const text = stripTags(body).replace(/\s+/g, " ").trim();
          if (
            /^(client acclaim|words of praise|testimonials?|reviews?|what clients say)$/i.test(
              text,
            )
          ) {
            return card;
          }
          const looksLikeCard =
            /★|⭐|✩|star|data-lucide=["']star|rating/i.test(body) ||
            /border-radius:\s*999|rounded-full/i.test(`${a}${body}`) ||
            /<[pP]\b|<blockquote\b/i.test(body);
          if (!looksLikeCard) return card;

          cardCount += 1;
          const quoteNodes =
            body.match(/<(?:p|blockquote|q)\b[^>]*>[\s\S]*?<\/(?:p|blockquote|q)>/gi) ||
            [];
          let hasQuote = false;
          for (const q of quoteNodes) {
            const qt = stripTags(q)
              .replace(/["""''„]/g, "")
              .replace(/\s+/g, " ")
              .trim();
            // Ignore tiny labels / names
            if (qt.length >= 28) {
              hasQuote = true;
              quoteCount += 1;
            }
          }
          if (!hasQuote && text.length >= 70) {
            hasQuote = true;
            quoteCount += 1;
          }
          if (hasQuote) return card;

          const quote = fallbacks[fi++ % fallbacks.length]!;
          const quoteHtml = `<p data-cai-testimonial-quote="1" style="margin:14px 0 16px;color:#1c1917;font:italic 16px/1.55 Georgia,serif;opacity:1;visibility:visible">${quote}</p>`;
          if (/<(?:p|blockquote)\b[^>]*>\s*<\/(?:p|blockquote)>/i.test(body)) {
            return `<${tag}${a}>${body.replace(
              /<(?:p|blockquote)\b[^>]*>\s*<\/(?:p|blockquote)>/i,
              quoteHtml,
            )}</${tag}>`;
          }
          // Prefer after stars row
          if (/★|⭐|✩|data-lucide=["']star/i.test(body)) {
            return `<${tag}${a}>${body.replace(
              /(★|⭐|✩|<i\b[^>]*data-lucide=["']star["'][^>]*>[\s\S]*?<\/i>)+/i,
              (stars) => `${stars}${quoteHtml}`,
            )}</${tag}>`;
          }
          return `<${tag}${a}>${quoteHtml}${body}</${tag}>`;
        },
      );

      // Still no real quotes → rebuild a clean 3-card strip
      if (cardCount > 0 && quoteCount === 0 && fi === 0) {
        const cards = fallbacks
          .map((q, i) => {
            const names = ["Rajesh Kapoor", "Priya Nair", "Vikram Malhotra"];
            const roles = ["Client", "Founder", "Managing Director"];
            const initials = ["RK", "PN", "VM"];
            return `<article style="padding:24px;border-radius:16px;background:#fff;border:1px solid rgba(28,25,23,.08);box-shadow:0 10px 28px rgba(15,23,42,.06)">
<div style="color:#C9A227;letter-spacing:2px;margin-bottom:10px">★★★★★</div>
<p data-cai-testimonial-quote="1" style="margin:0 0 16px;color:#1c1917;font:italic 16px/1.55 Georgia,serif">${q}</p>
<div style="display:flex;align-items:center;gap:10px">
<span style="width:36px;height:36px;border-radius:999px;background:#1c1917;color:#fff;display:grid;place-items:center;font:700 12px/1 system-ui,sans-serif">${initials[i]}</span>
<div><strong style="display:block;color:#1c1917;font-size:14px">${names[i]}</strong><span style="font-size:12px;opacity:.7;color:#1c1917">${roles[i]}</span></div>
</div>
</article>`;
          })
          .join("");
        return `<section${attrs} data-create-ai-testimonials="1">
<p style="margin:0 0 8px;text-align:center;font-size:12px;letter-spacing:.16em;text-transform:uppercase;opacity:.7">Client acclaim</p>
<h2 style="margin:0 0 28px;text-align:center;font-size:clamp(1.6rem,3vw,2.2rem);color:inherit">Words of Praise</h2>
<div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px">${cards}</div>
</section>`;
      }

      return `<section${attrs}>${next}</section>`;
    },
  );
}

/** CSS rails: contrast safety + gap clamp (no more prompt-only fixes). */
export function injectCreateAiQaRails(html: string): string {
  if (!html) return html;
  let out = html.replace(
    /<style\b[^>]*data-create-ai-qa-rails=["']1["'][^>]*>[\s\S]*?<\/style>/gi,
    "",
  );
  const css = `<style ${QA_MARK}>
/* Only fix light headers — do not paint over intentional dark chrome.
   Never force ink on .active / aria-current — theme accent owns those. */
header[data-create-ai-hdr="1"]:not([style*="background:#0"]):not([style*="background: #0"]):not([style*="background:#1"]):not([style*="background:#2"]):not([style*="background-color:#0"]):not([style*="background-color:#1"]) a:not([style*="background"]):not([style*="background-color"]):not([data-cai-btn]):not(.active):not([aria-current="true"]):not([aria-current="page"]),
header[data-create-ai-hdr="1"]:not([style*="background:#0"]):not([style*="background: #0"]):not([style*="background:#1"]):not([style*="background:#2"]) nav a:not([data-cai-btn]):not(.active):not([aria-current="true"]):not([aria-current="page"]),
header[data-create-ai-hdr="1"]:not([style*="background:#0"]):not([style*="background: #0"]):not([style*="background:#1"]) [data-cai-brand],
header[data-create-ai-hdr="1"]:not([style*="background:#0"]):not([style*="background: #0"]):not([style*="background:#1"]) [data-create-ai-brand],
header[data-create-ai-hdr="1"]:not([style*="background:#0"]):not([style*="background: #0"]):not([style*="background:#1"]) [data-cai-brand-label]{
  color:#0f172a!important;
}
/* Soft gap clamp — don't smash designer padding entirely */
section[id]{
  min-height:0!important;
}
footer[data-create-ai-footer="1"]{
  margin-top:clamp(1.5rem,4vw,3rem);
  display:block!important;
  visibility:visible!important;
  opacity:1!important;
  min-height:160px;
}
/* Testimonials: never show empty / white-on-white quote cards */
#testimonials article,#testimonials [class*="card"],#testimonials [class*="testimonial"],
#testimonials blockquote{
  overflow:visible!important;
  color:#1c1917!important;
}
#testimonials article p,#testimonials article blockquote,#testimonials article q,
#testimonials [class*="quote"],#testimonials blockquote p,
#testimonials article span:not([style*="border-radius:999"]):not([style*="border-radius: 999"]){
  color:#1c1917!important;
  opacity:1!important;
  visibility:visible!important;
  font-size:clamp(.95rem,1.5vw,1.08rem)!important;
  line-height:1.55!important;
  overflow:visible!important;
  -webkit-line-clamp:unset!important;
  line-clamp:unset!important;
  max-height:none!important;
  white-space:normal!important;
}
</style>`;
  if (/<\/head>/i.test(out)) {
    out = out.replace(/<\/head>/i, `${css}\n</head>`);
  } else {
    out = css + out;
  }
  return out;
}

/** Inject Lucide icons into bare feature/service list items (AI often skips SVGs). */
export function ensureCreateAiLucideIcons(html: string): string {
  if (!html) return html;
  const icons = [
    "wrench",
    "zap",
    "shield-check",
    "thermometer",
    "droplets",
    "hammer",
    "check-circle",
    "star",
    "phone",
    "mail",
    "map-pin",
    "clock",
  ];
  let i = 0;
  let out = html.replace(
    /<section\b([^>]*\bid=["'](services|about|contact|home|testimonials)["'][^>]*)>([\s\S]*?)<\/section>/gi,
    (full, attrs: string, _id: string, inner: string) => {
      const next = inner.replace(
        /<li\b([^>]*)>([\s\S]*?)<\/li>/gi,
        (liFull: string, liA: string, liBody: string) => {
          if (/data-lucide|<svg\b/i.test(liBody)) return liFull;
          const text = stripTags(liBody);
          if (!text || text.length < 2) return liFull;
          const name = icons[i++ % icons.length];
          return `<li${liA}><i data-lucide="${name}" data-cai-icon="1" style="width:18px;height:18px;display:inline-block;vertical-align:-3px;margin-right:8px"></i>${liBody}</li>`;
        },
      );
      return `<section${attrs}>${next}</section>`;
    },
  );

  // Soft CSS so lucide SVGs size correctly after createIcons()
  if (
    /data-cai-icon=["']1["']/i.test(out) &&
    !/data-create-ai-lucide-css=["']1["']/i.test(out)
  ) {
    const css = `<style data-create-ai-lucide-css="1">
i[data-lucide],i[data-cai-icon]{display:inline-flex;line-height:0}
i[data-lucide] svg,i[data-cai-icon] svg{width:1.15em;height:1.15em;stroke:currentColor}
</style>`;
    if (/<\/head>/i.test(out)) {
      out = out.replace(/<\/head>/i, `${css}\n</head>`);
    } else {
      out = css + out;
    }
  }
  return out;
}

/** Run all QA rails (call from polishCreateAiExportHtml). */
export function applyCreateAiQaRails(
  html: string,
  brandName?: string,
  contact?: { email?: string; mobile?: string; address?: string },
): string {
  if (!html) return html;
  let out = stripLeakedCreateAiSourceSnippets(html);
  out = fixCreateAiHeaderContrast(out);
  out = ensureCreateAiHeaderCtaInk(out);
  out = stripEmptyCreateAiCards(out);
  out = ensureCreateAiTestimonialsFilled(out, brandName);
  out = ensureCreateAiFooter(out, brandName, contact);
  out = ensureCreateAiLucideIcons(out);
  out = injectCreateAiQaRails(out);
  // Footer last — never leave a truncated page without one
  if (!/<footer\b[^>]*data-create-ai-footer=["']1["']/i.test(out)) {
    out = ensureCreateAiFooter(out, brandName, contact);
  }
  out = stripLeakedCreateAiSourceSnippets(out);
  return out;
}
