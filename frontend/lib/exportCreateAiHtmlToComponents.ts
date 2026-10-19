/**
 * Create-with-AI HTML → Next.js React components (export-only).
 * Does not change studio/chat HTML generation.
 */

export type SplitPart = {
  /** PascalCase component name */
  name: string;
  /** Original section/block id if any */
  id: string;
  html: string;
};

export type SplitHtmlResult = {
  css: string;
  fontLinks: string[];
  scripts: string[];
  /** External <script src="..."> URLs to load before inline scripts */
  scriptSrcs: string[];
  title: string;
  parts: SplitPart[];
};

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const ID_TO_NAME: Record<string, string> = {
  home: "Hero",
  hero: "Hero",
  about: "About",
  services: "Services",
  gallery: "Gallery",
  testimonials: "Testimonials",
  contact: "Contact",
  process: "Process",
  pricing: "Pricing",
  faq: "Faq",
  team: "Team",
  footer: "Footer",
  header: "Header",
};

/** HTML attribute → React JSX prop */
const ATTR_SPECIAL: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  readonly: "readOnly",
  maxlength: "maxLength",
  minlength: "minLength",
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
  colspan: "colSpan",
  rowspan: "rowSpan",
  usemap: "useMap",
  frameborder: "frameBorder",
  allowfullscreen: "allowFullScreen",
  autocomplete: "autoComplete",
  autofocus: "autoFocus",
  autoplay: "autoPlay",
  crossorigin: "crossOrigin",
  formaction: "formAction",
  formenctype: "formEncType",
  formmethod: "formMethod",
  formnovalidate: "formNoValidate",
  formtarget: "formTarget",
  hreflang: "hrefLang",
  inputmode: "inputMode",
  novalidate: "noValidate",
  spellcheck: "spellCheck",
  srcset: "srcSet",
  viewbox: "viewBox",
  preserveaspectratio: "preserveAspectRatio",
  gradientunits: "gradientUnits",
  gradienttransform: "gradientTransform",
  patternunits: "patternUnits",
  patterncontentunits: "patternContentUnits",
  clippath: "clipPath",
  clippathunits: "clipPathUnits",
  strokewidth: "strokeWidth",
  strokelinedcap: "strokeLinecap",
  strokelinecap: "strokeLinecap",
  strokelinejoin: "strokeLinejoin",
  strokedasharray: "strokeDasharray",
  strokedashoffset: "strokeDashoffset",
  strokeopacity: "strokeOpacity",
  fillopacity: "fillOpacity",
  fillrule: "fillRule",
  cliprule: "clipRule",
  fontsize: "fontSize",
  fontfamily: "fontFamily",
  fontweight: "fontWeight",
  textanchor: "textAnchor",
  dominantbaseline: "dominantBaseline",
  onsubmit: "onSubmit",
  onclick: "onClick",
  onchange: "onChange",
  oninput: "onInput",
  onfocus: "onFocus",
  onblur: "onBlur",
  onkeydown: "onKeyDown",
  onkeyup: "onKeyUp",
  onkeypress: "onKeyPress",
  onmouseenter: "onMouseEnter",
  onmouseleave: "onMouseLeave",
  onmouseover: "onMouseOver",
  onmouseout: "onMouseOut",
};

function pascalCase(raw: string) {
  const base = (raw || "Section")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
  if (!base) return "Section";
  if (/^[0-9]/.test(base)) return `Section${base}`;
  return base;
}

function uniqueName(preferred: string, used: Set<string>) {
  let name = preferred;
  let i = 2;
  while (used.has(name)) {
    name = `${preferred}${i}`;
    i += 1;
  }
  used.add(name);
  return name;
}

function nameForBlock(tag: string, id: string, used: Set<string>) {
  const key = (id || "").toLowerCase();
  if (tag === "header") return uniqueName("Header", used);
  if (tag === "footer") return uniqueName("Footer", used);
  if (ID_TO_NAME[key]) return uniqueName(ID_TO_NAME[key], used);
  if (key) return uniqueName(pascalCase(key), used);
  return uniqueName(pascalCase(tag), used);
}

function cssPropToCamel(prop: string) {
  const p = prop.trim();
  if (p.startsWith("--")) return p;
  return p.replace(/-([a-z])/gi, (_, c: string) => c.toUpperCase());
}

function styleStringToJsxObject(style: string) {
  const entries: string[] = [];
  for (const chunk of style.split(";")) {
    const part = chunk.trim();
    if (!part) continue;
    const colon = part.indexOf(":");
    if (colon < 0) continue;
    const prop = part.slice(0, colon).trim();
    const val = part.slice(colon + 1).trim();
    if (!prop || !val) continue;
    const key = cssPropToCamel(prop);
    const keyCode = key.startsWith("--") ? JSON.stringify(key) : key;
    entries.push(`${keyCode}: ${JSON.stringify(val)}`);
  }
  return `{{ ${entries.join(", ")} }}`;
}

function attrNameToJsx(name: string) {
  const n = name.trim();
  const lower = n.toLowerCase();
  if (ATTR_SPECIAL[lower]) return ATTR_SPECIAL[lower];
  if (n.startsWith("data-") || n.startsWith("aria-")) return n;
  if (n.includes(":")) return n; // xml:space etc — rare; keep as-is may fail
  if (n.includes("-")) {
    return n.replace(/-([a-z])/gi, (_, c: string) => c.toUpperCase());
  }
  return n;
}

/** Drop attrs that break JSX / are studio-only. */
function shouldDropAttr(name: string) {
  const lower = name.toLowerCase();
  if (lower === "contenteditable" || lower === "draggable") return true;
  if (lower.startsWith("data-cai-edit")) return true;
  if (lower === "xmlns:xlink") return true;
  return false;
}

function convertEventAttr(jsxName: string): "drop" | string | null {
  if (jsxName === "onSubmit") {
    return ` onSubmit={(e) => { e.preventDefault(); }}`;
  }
  // Drop other inline DOM handlers — invalid as string props in React
  if (/^on[A-Z]/.test(jsxName)) return "drop";
  return null;
}

function convertOpenTag(tagHtml: string) {
  const match = tagHtml.match(/^<\/?([a-zA-Z0-9:-]+)([^>]*)\/?>$/);
  if (!match) return tagHtml;
  if (tagHtml.startsWith("</")) return tagHtml;
  const tag = match[1].toLowerCase();
  let attrs = match[2] || "";
  const selfClosing = tagHtml.endsWith("/>") || VOID_TAGS.has(tag);

  // Skip exotic XML namespaces that break JSX parsers
  if (tag.includes(":")) return "";

  attrs = attrs.replace(
    /([^\s=/>]+)(\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>"'=]+)))?/gi,
    (
      _full,
      rawName: string,
      eq?: string,
      dq?: string,
      sq?: string,
      bare?: string,
    ) => {
      const name = String(rawName);
      if (shouldDropAttr(name)) return "";
      if (!eq) {
        // Boolean HTML attrs → React boolean
        const jsxBool = attrNameToJsx(name);
        if (/^on[A-Z]/.test(jsxBool)) return "";
        return ` ${jsxBool}`;
      }
      const value = dq ?? sq ?? bare ?? "";
      const jsxName = attrNameToJsx(name);
      if (jsxName === "style") {
        return ` style=${styleStringToJsxObject(value)}`;
      }
      const event = convertEventAttr(jsxName);
      if (event === "drop") return "";
      if (typeof event === "string") return event;
      // href: keep hash / relative / absolute; fix void leftovers
      if (jsxName === "href") {
        const href = value.trim();
        if (!href || href === "#" || /^javascript:/i.test(href)) {
          return ` href="#"`;
        }
        return ` href=${JSON.stringify(href)}`;
      }
      return ` ${jsxName}=${JSON.stringify(value)}`;
    },
  );
  attrs = attrs.replace(/^\s+/, " ").replace(/\s{2,}/g, " ").trimEnd();

  if (selfClosing) return `<${tag}${attrs ? ` ${attrs.trim()}` : ""} />`;
  return `<${tag}${attrs ? ` ${attrs.trim()}` : ""}>`;
}

/** Pre-clean HTML so JSX conversion does not emit broken trees. */
function prepareHtmlFragment(html: string) {
  let out = html || "";
  // Never embed raw <script> inside React components
  out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<script\b[^>]*\/>/gi, "");
  // HTML comments
  out = out.replace(/<!--[\s\S]*?-->/g, "");
  // Studio / edit leftovers
  out = out.replace(/\scontenteditable=(["'])[^"']*\1/gi, "");
  out = out.replace(/\sdata-cai-edit(?:-[a-z0-9_-]+)?=(["'])[^"']*\1/gi, "");
  // Unquoted href=#foo → quoted (common AI leak that breaks JSX)
  out = out.replace(
    /\bhref\s*=\s*(#?[a-zA-Z0-9_./-][^\s>]*)/gi,
    (_m, v: string) => {
      if (v.startsWith('"') || v.startsWith("'")) return `href=${v}`;
      return `href="${v.replace(/"/g, "")}"`;
    },
  );
  // Fix common self-closing mistakes already as HTML
  out = out.replace(/<(img|br|hr|input|meta|link|source)\b([^>]*)(?<!\/)\s*>/gi, "<$1$2 />");
  return out;
}

/** Convert an HTML fragment into JSX markup string (no component wrapper). */
export function htmlFragmentToJsx(html: string): string {
  if (!html) return "";
  const input = prepareHtmlFragment(html);
  // Split tags but avoid breaking on `>` inside quotes (simple scan)
  const tokens: string[] = [];
  let i = 0;
  while (i < input.length) {
    if (input[i] === "<") {
      let j = i + 1;
      let quote: '"' | "'" | null = null;
      while (j < input.length) {
        const ch = input[j];
        if (quote) {
          if (ch === quote) quote = null;
        } else if (ch === '"' || ch === "'") {
          quote = ch;
        } else if (ch === ">") {
          j += 1;
          break;
        }
        j += 1;
      }
      tokens.push(input.slice(i, j));
      i = j;
    } else {
      let j = i;
      while (j < input.length && input[j] !== "<") j += 1;
      tokens.push(input.slice(i, j));
      i = j;
    }
  }

  const out: string[] = [];
  for (const token of tokens) {
    if (!token) continue;
    if (token.startsWith("<")) {
      if (token.startsWith("</")) {
        const m = token.match(/^<\/\s*([a-zA-Z0-9:-]+)\s*>/);
        if (m && !m[1].includes(":")) out.push(`</${m[1].toLowerCase()}>`);
      } else if (token.startsWith("<!")) {
        continue;
      } else {
        const converted = convertOpenTag(token);
        if (converted) out.push(converted);
      }
    } else {
      out.push(token.replace(/\{/g, "{'{'}").replace(/\}/g, "{'}'}"));
    }
  }
  return out.join("");
}

/**
 * Split a full Create-AI HTML document into CSS + ordered React-ready parts.
 */
export function splitCreateAiHtmlDocument(fullHtml: string): SplitHtmlResult {
  let html = fullHtml || "";
  const title =
    html
      .match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
      ?.replace(/<[^>]+>/g, "")
      .trim() || "";

  const fontLinks: string[] = [];
  html = html.replace(
    /<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi,
    (tag) => {
      const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1] || "";
      if (
        /fonts\.googleapis|fonts\.gstatic|font/i.test(href) ||
        /fonts\.googleapis|fonts\.gstatic|font/i.test(tag)
      ) {
        fontLinks.push(tag);
      }
      return "";
    },
  );

  const cssParts: string[] = [];
  html = html.replace(
    /<style\b[^>]*>([\s\S]*?)<\/style>/gi,
    (_m, css: string) => {
      cssParts.push(css.trim());
      return "";
    },
  );

  const scripts: string[] = [];
  const scriptSrcs: string[] = [];
  html = html.replace(
    /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
    (_m, attrs: string, body: string) => {
      const src = String(attrs || "").match(/\bsrc\s*=\s*(["'])([^"']+)\1/i)?.[2];
      if (src) {
        if (/^https?:\/\//i.test(src) && !/localhost|127\.0\.0\.1/i.test(src)) {
          scriptSrcs.push(src);
        }
        return "";
      }
      const code = String(body || "").trim();
      if (code) scripts.push(code);
      return "";
    },
  );

  const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  let body = bodyMatch ? bodyMatch[1] : html;
  body = body.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "");

  const used = new Set<string>();
  const parts: SplitPart[] = [];

  const pushPart = (tag: string, id: string, block: string) => {
    const trimmed = block.trim();
    if (!trimmed) return;
    if (tag === "div" && trimmed.replace(/[\s\n\r\t]+/g, "").length < 40) {
      return;
    }
    parts.push({
      name: nameForBlock(tag, id, used),
      id: id || tag,
      html: trimmed,
    });
  };

  let remaining = body.trim();
  const blockRe =
    /<(header|footer|section|main|aside)(\s[^>]*)?>[\s\S]*?<\/\1>/i;

  while (remaining) {
    remaining = remaining.trim();
    if (!remaining) break;

    const m = remaining.match(blockRe);
    if (!m || m.index === undefined) {
      const leftover = remaining.trim();
      if (leftover) pushPart("div", "extras", leftover);
      break;
    }

    if (m.index > 0) {
      const before = remaining.slice(0, m.index).trim();
      if (before) pushPart("div", "extras", before);
    }

    const block = m[0];
    const tag = m[1].toLowerCase();
    const openAttrs = m[2] || "";
    const id = openAttrs.match(/\bid=["']([^"']+)["']/i)?.[1] || "";

    if (tag === "main") {
      const inner = block
        .replace(/^<main\b[^>]*>/i, "")
        .replace(/<\/main>$/i, "");
      remaining = inner + remaining.slice(m.index + block.length);
      continue;
    }

    pushPart(tag, id, block);
    remaining = remaining.slice(m.index + block.length);
  }

  const merged: SplitPart[] = [];
  for (const part of parts) {
    const prev = merged[merged.length - 1];
    if (prev && /^Extras/i.test(prev.name) && /^Extras/i.test(part.name)) {
      prev.html += "\n" + part.html;
    } else {
      merged.push(part);
    }
  }

  // Ensure single-page header hash links point at real section ids when possible
  const sectionIds = new Set(
    merged
      .map((p) => p.id)
      .filter((id) => id && !/^(header|footer|extras)/i.test(id))
      .map((id) => id.toLowerCase()),
  );
  for (const part of merged) {
    if (!/^Header/i.test(part.name)) continue;
    part.html = part.html.replace(
      /\bhref=(["'])([^"']*)\1/gi,
      (full, q: string, href: string) => {
        const h = href.trim();
        if (/^(#|\/|https?:|mailto:|tel:)/i.test(h)) return full;
        if (/\.html$/i.test(h)) return full;
        const slug = h.replace(/^\/+/, "").toLowerCase();
        if (sectionIds.has(slug)) return `href=${q}#${slug}${q}`;
        return full;
      },
    );
  }

  return {
    css: cssParts.filter(Boolean).join("\n\n"),
    fontLinks,
    scripts,
    scriptSrcs: Array.from(new Set(scriptSrcs)),
    title,
    parts: merged,
  };
}

function componentNeedsClient(name: string, jsx: string) {
  if (/^(Contact|Header|Footer)$/i.test(name)) return true;
  if (/\bonSubmit=|\bonClick=|\bonChange=|\bonInput=/.test(jsx)) return true;
  if (/<form\b/i.test(jsx)) return true;
  return false;
}

export function buildComponentTsx(name: string, html: string) {
  let jsx = htmlFragmentToJsx(html);
  // Forms without onSubmit still need a client handler to avoid full reload
  if (/<form\b/i.test(jsx) && !/\bonSubmit=/.test(jsx)) {
    jsx = jsx.replace(
      /<form\b/gi,
      `<form onSubmit={(e) => { e.preventDefault(); }}`,
    );
  }
  const useClient = componentNeedsClient(name, jsx);
  const body = jsx
    .split("\n")
    .map((l) => (l ? `      ${l}` : ""))
    .join("\n");

  return `${useClient ? `"use client";\n\n` : ""}export default function ${name}() {
  return (
    <>
${body}
    </>
  );
}
`;
}

export function buildSiteScriptsTsx(
  scripts: string[],
  scriptSrcs: string[] = [],
) {
  const inline = scripts.filter(Boolean);
  const srcs = scriptSrcs.filter(Boolean);
  if (!inline.length && !srcs.length) {
    return `"use client";

export default function SiteScripts() {
  return null;
}
`;
  }

  return `"use client";

import { useEffect } from "react";

const SCRIPT_SRCS: string[] = ${JSON.stringify(srcs, null, 2)};
const INLINE_SCRIPTS: string[] = ${JSON.stringify(inline, null, 2)};

function safeLucideInit() {
  try {
    const lucide = (window as unknown as { lucide?: { createIcons?: () => void } })
      .lucide;
    if (lucide && typeof lucide.createIcons === "function") {
      lucide.createIcons();
    }
  } catch {
    /* icons optional */
  }
}

function loadScript(src: string) {
  return new Promise<void>((resolve) => {
    if (document.querySelector(\`script[data-cai-export-src="\${src}"]\`)) {
      resolve();
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.async = true;
    el.dataset.caiExportSrc = src;
    el.onload = () => resolve();
    el.onerror = () => resolve();
    document.body.appendChild(el);
  });
}

export default function SiteScripts() {
  useEffect(() => {
    let cancelled = false;
    const injected: HTMLScriptElement[] = [];

    (async () => {
      for (const src of SCRIPT_SRCS) {
        if (cancelled) return;
        await loadScript(src);
      }
      if (cancelled) return;

      for (const code of INLINE_SCRIPTS) {
        try {
          // Avoid embedding raw <script> in JSX — run via Function
          const run = new Function(code);
          run();
        } catch (err) {
          console.warn("[SiteScripts] inline script skipped", err);
        }
      }

      safeLucideInit();
      // Lucide may hydrate late after CDN
      window.setTimeout(safeLucideInit, 300);
      window.setTimeout(safeLucideInit, 1200);
    })();

    return () => {
      cancelled = true;
      for (const el of injected) el.remove();
    };
  }, []);

  return null;
}
`;
}

export function buildPageTsx(opts: {
  componentNames: string[];
  includeScripts: boolean;
}) {
  const imports = opts.componentNames
    .map((n) => `import ${n} from "@/components/${n}";`)
    .join("\n");
  const scriptImport = opts.includeScripts
    ? `import SiteScripts from "@/components/SiteScripts";\n`
    : "";
  const body = [
    ...opts.componentNames.map((n) => `      <${n} />`),
    ...(opts.includeScripts ? [`      <SiteScripts />`] : []),
  ].join("\n");

  return `${imports}
${scriptImport}
export default function Page() {
  return (
    <>
${body}
    </>
  );
}
`;
}
