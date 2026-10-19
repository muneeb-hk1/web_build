"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Check,
  FileText,
  Gift,
  Layers,
  Sparkles,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    icon: Gift,
    description:
      "Build and publish on a shared URL. You stay on Free until you upgrade — Starter is the paid plan for up to 25 pages.",
    monthly: 0,
    annual: 0,
    includes: "",
    features: [
      "Website builder and editor access",
      "Publish on a shared URL",
      "Browse themes before you pay",
      "No custom domain",
      "Limited AI assist (5 tokens)",
      "Free forever until you upgrade",
    ],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Starter",
    icon: FileText,
    description:
      "Paid plan for themes with up to 25 pages — ideal for small business sites.",
    monthly: 8,
    annual: 6,
    includes: "Everything in Free, plus:",
    features: [
      "Themes up to 25 pages",
      "Hosting included (free)",
      "100 AI tokens / month",
      "Multi-page site templates",
      "Full editor and publishing",
      "Per website billing",
    ],
    cta: "Choose Starter",
    featured: false,
  },
  {
    name: "Professional",
    icon: Layers,
    description: "Themes with up to 50 pages — services, blog, and portfolio ready.",
    monthly: 18,
    annual: 14,
    includes: "Everything in Starter, plus:",
    features: [
      "Themes up to 50 pages",
      "Hosting included (free)",
      "250 AI tokens / month",
      "Larger multi-page templates",
      "Custom domain ready",
      "Per website billing",
    ],
    cta: "Choose Professional",
    featured: true,
  },
  {
    name: "Business",
    icon: Building2,
    description: "Themes with up to 100 pages — for growing brands and catalogs.",
    monthly: 48,
    annual: 38,
    includes: "Everything in Professional, plus:",
    features: [
      "Themes up to 100 pages",
      "Hosting included (free)",
      "750 AI tokens / month",
      "Advanced multi-page layouts",
      "Custom domain + SSL",
      "Per website billing",
    ],
    cta: "Choose Business",
    featured: false,
  },
  {
    name: "Enterprise",
    icon: Sparkles,
    description: "Themes with up to 125 pages — largest templates for complex sites.",
    monthly: 98,
    annual: 78,
    includes: "Everything in Business, plus:",
    features: [
      "Themes up to 125 pages",
      "Hosting included (free)",
      "2,500 AI tokens / month",
      "Largest template library access",
      "Custom domain + SSL",
      "Per website billing",
    ],
    cta: "Choose Enterprise",
    featured: false,
  },
];

const usd = (amount: number) => `$${amount.toLocaleString("en-US")}`;
const actionClass =
  "mt-auto flex min-h-11 w-full items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600";
const featuredActionClass =
  "mt-auto flex min-h-11 w-full items-center justify-center rounded-full bg-[#0a5ebd] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#084a96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600";

function Features({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((feature) => (
        <li
          key={feature}
          className="flex items-start gap-3 text-[13px] font-light leading-5 tracking-[-0.01em] text-neutral-700"
        >
          <Check
            aria-hidden="true"
            size={17}
            strokeWidth={2.2}
            className="mt-0.5 shrink-0"
          />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Pricing({
  hideHeader = false,
  onStart,
}: {
  hideHeader?: boolean;
  onStart?: () => void;
}) {
  const [annualPlans, setAnnualPlans] = useState<Record<string, boolean>>({});

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className={`scroll-mt-20 px-5 pb-10 text-black sm:px-8 sm:pb-16 ${
        hideHeader
          ? "bg-white pt-8 sm:pt-10"
          : "bg-[#f5f4f2] pt-10 sm:pt-14"
      }`}
    >
      <div className="mx-auto max-w-[1200px]">
        {hideHeader ? (
          <h2 id="pricing-heading" className="sr-only">
            Free and page-plan pricing
          </h2>
        ) : (
          <header className="mb-8 text-center sm:mb-10">
            <h2
              id="pricing-heading"
              className="text-[clamp(1.85rem,4.5vw,2.35rem)] font-normal leading-[1.08] tracking-[-0.05em]"
            >
              Transparent{" "}
              <span className="font-serif italic tracking-[-0.06em] text-[#1680ff]">
                Pricing
              </span>{" "}
              for every builder
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base font-light leading-7 tracking-[-0.02em] text-neutral-600">
              Start free, then pick a page plan that matches your theme size —
              from 25 pages up to 125 pages. One clear plan per website.
            </p>
          </header>
        )}

        <div
          className={`mx-auto flex max-w-[1080px] flex-wrap justify-center gap-5 ${
            hideHeader ? "mt-0" : "mt-2"
          }`}
        >
          {plans.map((plan) => {
            const annual = Boolean(annualPlans[plan.name]);
            const Icon = plan.icon;
            const price = annual ? plan.annual : plan.monthly;
            const featured = plan.featured;
            return (
              <article
                key={plan.name}
                aria-label={`${plan.name} plan`}
                className={
                  featured
                    ? "relative flex w-full max-w-[340px] flex-col rounded-2xl border border-[#1680ff]/35 bg-white px-5 py-6 shadow-[0_18px_50px_rgba(22,128,255,0.16)] ring-1 ring-[#1680ff]/20 sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] sm:px-5"
                    : "flex w-full max-w-[340px] flex-col rounded-2xl border border-black/[0.06] bg-white px-5 py-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] sm:px-5"
                }
              >
                {featured ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0a5ebd] px-3 py-1 text-[11px] font-medium tracking-[-0.01em] text-white shadow-sm">
                    Most popular
                  </span>
                ) : null}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-[20px] font-normal tracking-[-0.045em]">
                    {plan.name}
                    <Icon aria-hidden="true" size={17} />
                  </h3>
                  {plan.monthly > 0 && (
                    <button
                      type="button"
                      role="switch"
                      aria-checked={annual}
                      aria-label={`Annual billing for ${plan.name}`}
                      onClick={() =>
                        setAnnualPlans((current) => ({
                          ...current,
                          [plan.name]: !current[plan.name],
                        }))
                      }
                      className={`flex min-h-8 cursor-pointer items-center gap-2 rounded-md text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 ${annual ? "text-blue-600" : "text-neutral-600"
                        }`}
                    >
                      Annual
                      <span
                        aria-hidden="true"
                        className={`flex h-[18px] w-8 items-center rounded-full p-[3px] transition-colors ${annual ? "bg-blue-600" : "bg-neutral-600"
                          }`}
                      >
                        <span
                          className={`size-3 rounded-full bg-white transition-transform motion-reduce:transition-none ${annual ? "translate-x-[14px]" : "translate-x-0"
                            }`}
                        />
                      </span>
                    </button>
                  )}
                </div>
                <p className="mt-2 min-h-[3.75rem] text-[13px] font-light leading-5 tracking-[-0.01em] text-neutral-600">
                  {plan.description}
                </p>
                <div className="mt-4 min-h-[4.5rem]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p>
                      <span className="text-[30px] font-normal tracking-[-0.05em]">
                        {usd(price)}
                      </span>
                      <span className="ml-1 text-xs text-neutral-700">
                        / month
                      </span>
                    </p>
                    {annual && plan.monthly > 0 ? (
                      <span className="rounded-full bg-blue-50 px-2.5 py-1.5 text-[11px] font-medium text-blue-700">
                        Save {usd((plan.monthly - plan.annual) * 12)} / year
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-[11px] leading-4 text-neutral-700">
                    {annual && plan.monthly > 0
                      ? `${usd(plan.annual * 12)} billed annually`
                      : plan.monthly > 0
                        ? "per website"
                        : "Free forever"}
                  </p>
                </div>
                <div className="flex-1 pb-6">
                  {plan.includes ? (
                    <p className="mb-3 min-h-5 text-[13px] font-medium text-neutral-700">
                      {plan.includes}
                    </p>
                  ) : (
                    <p className="mb-3 min-h-5" aria-hidden="true" />
                  )}
                  <Features items={plan.features} />
                </div>
                {onStart ? (
                  <button
                    type="button"
                    onClick={onStart}
                    className={featured ? featuredActionClass : actionClass}
                    aria-label={`${plan.cta} ${plan.name}`}
                  >
                    {plan.cta}
                  </button>
                ) : (
                  <Link
                    href="/"
                    className={featured ? featuredActionClass : actionClass}
                    aria-label={`${plan.cta} ${plan.name}`}
                  >
                    {plan.cta}
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
