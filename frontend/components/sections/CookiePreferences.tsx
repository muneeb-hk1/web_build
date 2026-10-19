"use client";

import { useEffect, useState } from "react";
import SitePageShell from "./SitePageShell";

const STORAGE_KEY = "lestow-cookie-preferences";

type CookiePrefs = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

const defaults: CookiePrefs = {
  necessary: true,
  functional: true,
  analytics: false,
  marketing: false,
};

const options: {
  key: keyof CookiePrefs;
  title: string;
  body: string;
  locked?: boolean;
}[] = [
  {
    key: "necessary",
    title: "Necessary",
    body: "Required for sign-in, security, and keeping the site working. These cannot be turned off.",
    locked: true,
  },
  {
    key: "functional",
    title: "Functional",
    body: "Remember choices such as drafts and interface preferences so the builder feels consistent.",
  },
  {
    key: "analytics",
    title: "Analytics",
    body: "Help us understand how people use Lestow so we can improve pages and flows.",
  },
  {
    key: "marketing",
    title: "Marketing",
    body: "Used to measure campaigns and show more relevant product updates.",
  },
];

export default function CookiePreferences() {
  const [prefs, setPrefs] = useState<CookiePrefs>(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<CookiePrefs>;
      setPrefs({
        necessary: true,
        functional: Boolean(parsed.functional),
        analytics: Boolean(parsed.analytics),
        marketing: Boolean(parsed.marketing),
      });
    } catch {
      setPrefs(defaults);
    }
  }, []);

  const save = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  };

  return (
    <SitePageShell
      title={
        <>
          Cookie <span className="text-blue-600">preferences</span>
        </>
      }
      subtitle="Choose which optional cookies Lestow can use on this device. Necessary cookies stay on so the product works."
      bandTitle="Your privacy choices, saved on this browser."
    >
      <section className="mx-auto max-w-[720px] px-5 pb-20 pt-6 sm:px-8 sm:pb-28">
        <ul className="space-y-4">
          {options.map((option) => {
            const on = prefs[option.key];
            return (
              <li
                key={option.key}
                className="flex items-start justify-between gap-6 rounded-2xl border border-black/[0.06] bg-[#f8f8f8] px-5 py-5"
              >
                <div>
                  <h2 className="text-base font-medium">{option.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    {option.body}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-label={`${option.title} cookies`}
                  disabled={option.locked}
                  onClick={() => {
                    if (option.locked || option.key === "necessary") return;
                    setPrefs((current) => ({
                      ...current,
                      [option.key]: !current[option.key],
                    }));
                  }}
                  className={`mt-1 flex h-[22px] w-10 shrink-0 items-center rounded-full p-[3px] transition-colors disabled:cursor-not-allowed ${
                    on ? "bg-blue-600" : "bg-neutral-400"
                  }`}
                >
                  <span
                    className={`size-4 rounded-full bg-white transition-transform ${
                      on ? "translate-x-[18px]" : "translate-x-0"
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={save}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-black px-6 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Save preferences
          </button>
          {saved ? (
            <p className="text-sm text-blue-600">Preferences saved on this device.</p>
          ) : null}
        </div>
      </section>
    </SitePageShell>
  );
}
