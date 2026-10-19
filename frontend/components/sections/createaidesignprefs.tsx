"use client";

import { useEffect } from "react";
import { Check, Sparkles } from "lucide-react";
import {
  CREATE_AI_COLOR_PALETTES,
  CREATE_AI_FONTS,
  type CreateAiDesignPrefs,
} from "@/lib/create-ai-design-prefs";

export type CreateAiPrefsPhase = "color" | "font" | "header";

export const CREATE_AI_PREFS_PHASES: CreateAiPrefsPhase[] = [
  "color",
  "font",
  "header",
];

type Props = {
  phase: CreateAiPrefsPhase;
  value: CreateAiDesignPrefs;
  onChange: (next: CreateAiDesignPrefs) => void;
};

const PHASE_META: Record<
  CreateAiPrefsPhase,
  { step: string; title: string; hint: string }
> = {
  color: {
    step: "Create with AI · Step 2",
    title: "Color palette",
    hint: "Choose a direction — or Recommended. AI will follow this on first generate.",
  },
  font: {
    step: "Create with AI · Step 3",
    title: "Font family",
    hint: "Heading + body pairing for a premium feel.",
  },
  header: {
    step: "Create with AI · Step 4",
    title: "Header options",
    hint: "Top bar and sticky header for a polished chrome.",
  },
};

function fontPair(google: string) {
  if (!google) return null;
  const [head, body] = google.split("|");
  const face = (spec: string) => spec.split(":")[0].replace(/\+/g, " ");
  if (!head) return null;
  const headingWeight = /wght@|:\d{3}/.test(head) ? 700 : 400;
  return {
    heading: face(head),
    body: body ? face(body) : face(head),
    headingWeight,
  };
}

function fontStylesheetHref(google: string) {
  return `https://fonts.googleapis.com/css2?${google
    .split("|")
    .map((spec) => `family=${spec}`)
    .join("&")}&display=swap`;
}

export default function CreateAiDesignPrefsStep({
  phase,
  value,
  onChange,
}: Props) {
  const meta = PHASE_META[phase];

  useEffect(() => {
    const added: HTMLLinkElement[] = [];
    const ensure = (rel: string, href: string, key: string) => {
      if (document.head.querySelector(`link[data-ai-font="${key}"]`)) return;
      const link = document.createElement("link");
      link.rel = rel;
      link.href = href;
      link.setAttribute("data-ai-font", key);
      document.head.appendChild(link);
      added.push(link);
    };
    ensure("preconnect", "https://fonts.googleapis.com", "preconnect");
    ensure("preconnect", "https://fonts.gstatic.com", "preconnect-gstatic");
    for (const font of CREATE_AI_FONTS) {
      if (!font.google) continue;
      ensure("stylesheet", fontStylesheetHref(font.google), font.id);
    }
    return () => {
      for (const link of added) link.remove();
    };
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-[920px] flex-col gap-4 2xl:max-w-[1100px]">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,.06)] sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#315ff4]">
          {meta.step}
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          {meta.title}
        </h2>
        <p className="mt-1.5 max-w-xl text-sm text-slate-500">{meta.hint}</p>
      </div>

      {phase === "color" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,.06)] sm:p-6">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {CREATE_AI_COLOR_PALETTES.map((p) => {
              const on = value.colorPalette === p.id;
              const recommended = p.id === "auto";
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onChange({ ...value, colorPalette: p.id })}
                  className={`relative rounded-xl border p-3 text-left transition ${
                    recommended
                      ? on
                        ? "border-[#7c3aed] shadow-sm"
                        : "border-violet-200 hover:border-violet-300"
                      : on
                        ? "border-[#315ff4] bg-blue-50/60 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                  }`}
                  style={
                    recommended
                      ? {
                          background:
                            "linear-gradient(145deg, #eef2ff 0%, #ffffff 48%, #fdf2f8 100%)",
                        }
                      : undefined
                  }
                >
                  {on && (
                    <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-[#315ff4] text-white">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                  {recommended ? (
                    <div className="mb-2 flex h-6 overflow-hidden rounded-full border border-white shadow-sm">
                      {[
                        "#315FF4",
                        "#7C3AED",
                        "#EC4899",
                        "#F59E0B",
                        "#10B981",
                        "#0EA5E9",
                      ].map((c) => (
                        <span key={c} className="h-full flex-1" style={{ background: c }} />
                      ))}
                    </div>
                  ) : (
                    <div className="mb-2 flex gap-1">
                      {p.swatches.map((c) => (
                        <span
                          key={c}
                          className="h-6 flex-1 rounded-md border border-black/5"
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                    {recommended && (
                      <Sparkles size={12} className="text-[#7c3aed]" />
                    )}
                    {p.label}
                  </div>
                  <div className="text-[11px] text-slate-500">{p.hint}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase === "font" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,.06)] sm:p-6">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {CREATE_AI_FONTS.map((f) => {
              const on = value.fontFamily === f.id;
              const pair = fontPair(f.google);
              const recommended = f.id === "auto";
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onChange({ ...value, fontFamily: f.id })}
                  className={`relative rounded-xl border px-3.5 py-3 text-left transition ${
                    recommended
                      ? on
                        ? "border-[#7c3aed] shadow-sm"
                        : "border-violet-200 hover:border-violet-300"
                      : on
                        ? "border-[#315ff4] bg-blue-50/60 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                  }`}
                  style={
                    recommended
                      ? {
                          background:
                            "linear-gradient(145deg, #eef2ff 0%, #ffffff 48%, #fdf2f8 100%)",
                        }
                      : undefined
                  }
                >
                  {on && (
                    <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-[#315ff4] text-white">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                  {recommended ? (
                    <div className="text-[1.35rem] leading-tight tracking-tight text-slate-900">
                      <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700 }}>
                        A
                      </span>
                      <span style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>a</span>
                      <span style={{ fontFamily: '"Bebas Neue", sans-serif' }}>A</span>
                    </div>
                  ) : (
                    <div
                      className="text-[1.35rem] leading-tight tracking-tight text-slate-900"
                      style={
                        pair
                          ? {
                              fontFamily: `"${pair.heading}", sans-serif`,
                              fontWeight: pair.headingWeight,
                            }
                          : undefined
                      }
                    >
                      {f.sample}
                    </div>
                  )}
                  <div
                    className="mt-1 text-[13px] leading-snug text-slate-600"
                    style={
                      pair
                        ? { fontFamily: `"${pair.body}", sans-serif`, fontWeight: 400 }
                        : undefined
                    }
                  >
                    {recommended ? "AI picks a pairing" : "The quick brown fox"}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-slate-400">
                    {recommended && (
                      <Sparkles size={12} className="text-[#7c3aed]" />
                    )}
                    <span className={recommended ? "text-slate-700" : undefined}>
                      {f.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase === "header" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,.06)] sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <YesNoCard
              title="Top bar"
              hint="Thin strip above header (phone / email)"
              value={value.topBar}
              onChange={(topBar) => onChange({ ...value, topBar })}
            />
            <YesNoCard
              title="Sticky header"
              hint="Header stays fixed while scrolling"
              value={value.stickyHeader}
              onChange={(stickyHeader) => onChange({ ...value, stickyHeader })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function YesNoCard({
  title,
  hint,
  value,
  onChange,
}: {
  title: string;
  hint: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="text-sm font-semibold text-slate-800">{title}</div>
      <p className="mb-3 mt-0.5 text-xs text-slate-500">{hint}</p>
      <div className="flex gap-2">
        {(
          [
            { v: true, label: "Yes" },
            { v: false, label: "No" },
          ] as const
        ).map((opt) => {
          const on = value === opt.v;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => onChange(opt.v)}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                on
                  ? "border-[#315ff4] bg-[#315ff4] text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
