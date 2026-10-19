"use client";

import { ChevronRight } from "lucide-react";
import type { SectionProps } from "../../../types/section";
import { getAccentStyle } from "../../../lib/accentStyle";
import { WebsiteIcon } from "../../../lib/websiteIcons";
import CalculateCTA from "../layout-src/calculatecta/page";

const ACCENT = "#1FA463";

const defaultSteps = [
  {
    num: "01",
    title: "BOOK & SCHEDULE",
    desc: "Choose your preferred date & time and book our cleaning service in just a few clicks.",
    mainIcon: "headset",
    subIcon: "message-square-text",
  },
  {
    num: "02",
    title: "ASSESSMENT",
    desc: "Our team assesses your home and understands your cleaning needs.",
    mainIcon: "clipboard-list",
    subIcon: "home",
  },
  {
    num: "03",
    title: "CLEANING BEGINS",
    desc: "We use safe products and proven techniques to start the deep cleaning process.",
    mainIcon: "home",
    subIcon: "spray-can",
  },
  {
    num: "04",
    title: "QUALITY CHECK",
    desc: "Our supervisor inspects every area to ensure top-quality cleaning standards.",
    mainIcon: "search",
    subIcon: "clipboard-list",
  },
  {
    num: "05",
    title: "SPOTLESS HOME",
    desc: "We leave your home spotless, fresh, and ready for you to relax and enjoy.",
    mainIcon: "home",
    subIcon: "sparkles",
  },
];

function StepIcon({
  index,
  mainIconName,
  subIconName,
}: {
  index: number;
  mainIconName: string;
  subIconName: string;
}) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <WebsiteIcon
        name={mainIconName}
        size={56}
        className="stroke-[1.2] text-[#1F2937] transition-colors duration-300 group-hover:text-[#1FA463]"
      />
      {index === 1 || index === 3 ? (
        <div className="absolute right-3 bottom-5 rounded-full bg-[#FAFCFB] p-0.5 transition-colors duration-300 group-hover:bg-white">
          <WebsiteIcon
            name={subIconName}
            size={22}
            className="stroke-[2.5] text-[#1FA463]"
          />
        </div>
      ) : (
        <WebsiteIcon
          name={subIconName}
          size={index === 4 ? 28 : 22}
          className="absolute top-6 right-5 stroke-[2] text-[#1FA463]"
        />
      )}
    </div>
  );
}

export default function CleaningWhyChooseUs1({ data = {} }: SectionProps) {
  const accent = String(data.accentColor || ACCENT);
  const pretitle = String(data.pretitle || data.subtitle || "Work Process");
  const title = String(
    data.title || "Our Simple 5 Step Cleaning Process",
  );
  const desc = String(
    data.desc ||
      data.description ||
      "We follow a simple and effective process to make your home clean, fresh and comfortable.",
  );
  const steps = (
    Array.isArray(data.steps)
      ? data.steps
      : Array.isArray(data.whyChooseUsItems)
        ? data.whyChooseUsItems
        : defaultSteps
  )
    .slice(0, 6) as Array<Record<string, any>>;

  return (
    <>
    <section
      className="relative overflow-hidden bg-white pt-4 pb-16 md:pt-8 md:pb-24"
      style={getAccentStyle(accent)}
      data-editor-fields="accentColor pretitle title desc steps"
    >
      <div className="pointer-events-none absolute bottom-0 left-0 z-0 w-full">
        <svg
          viewBox="0 0 1440 120"
          className="block h-auto w-full"
          preserveAspectRatio="none"
        >
          <path
            fill="#F4F8F5"
            d="M0,60 C320,130 420,-10 840,60 C1140,110 1340,30 1440,10 L1440,120 L0,120 Z"
          />
        </svg>
      </div>

      <div className="pointer-events-none absolute top-10 right-20 h-12 w-12 rounded-full border-[1.5px] border-[#1FA463] opacity-10" />
      <div className="pointer-events-none absolute top-24 right-32 h-5 w-5 rounded-full bg-[#1FA463] opacity-[0.08]" />
      <div className="pointer-events-none absolute top-32 right-12 h-8 w-8 rounded-full border border-[#1FA463] opacity-10" />

      <div className="relative z-10 mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-block text-[18px] font-bold tracking-wide text-[#22A46D]">
            {pretitle}
          </span>
          <h2 className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-[#0B2942] sm:text-4xl md:text-[45px]">
            {title}
          </h2>
          <div className="my-4 flex items-center justify-center gap-4">
            <div className="h-[1.5px] w-12 bg-[#E5E7EB]" />
            <WebsiteIcon name="home" size={26} className="text-[var(--accent)]" />
            <div className="h-[1.5px] w-12 bg-[#E5E7EB]" />
          </div>
          {desc ? (
            <p className="mx-auto max-w-lg text-[16px] leading-relaxed text-[#6B7280] md:text-[18px]">
              {desc}
            </p>
          ) : null}
        </div>

        <div className="mx-auto flex max-w-[1150px] flex-col items-start justify-between gap-12 lg:flex-row lg:gap-0">
          {steps.map((step, index) => {
            const num = String(step.num || String(index + 1).padStart(2, "0"));
            const stepTitle = String(step.title || "");
            const stepDesc = String(step.desc || step.description || "");
            const mainIcon = String(step.mainIcon || "home");
            const subIcon = String(step.subIcon || "sparkles");

            return (
              <div
                key={`${stepTitle}-${index}`}
                className="group relative flex w-full flex-1 cursor-pointer flex-col items-center"
              >
                {index < steps.length - 1 ? (
                  <div className="absolute top-[65px] left-[50%] z-0 hidden w-full items-center justify-center px-[75px] lg:flex">
                    <div className="w-full border-t-[2px] border-dashed border-[#D1D5DB] transition-colors duration-300 group-hover:border-[var(--accent)]" />
                    <ChevronRight
                      className="-ml-2 shrink-0 text-[var(--accent)] transition-transform duration-300 group-hover:translate-x-1"
                      size={20}
                      strokeWidth={3}
                    />
                  </div>
                ) : null}

                <div className="relative z-10 mb-6 flex h-[130px] w-[130px] items-center justify-center rounded-full border border-[#1FA463]/30 bg-[#FAFCFB] shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-[var(--accent)] group-hover:bg-white group-hover:shadow-[0_15px_30px_rgba(84,138,84,0.15)]">
                  <StepIcon
                    index={index}
                    mainIconName={mainIcon}
                    subIconName={subIcon}
                  />
                  <div className="absolute -bottom-3 flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-white bg-[var(--accent)] text-[12px] font-bold text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                    {num}
                  </div>
                </div>

                <div className="px-2 text-center transition-all duration-300 group-hover:-translate-y-1">
                  <h4 className="text-[13px] font-extrabold tracking-wide text-[#1F2937] uppercase transition-colors duration-300 group-hover:text-[var(--accent)] md:text-[14px]">
                    {stepTitle}
                  </h4>
                  <div className="mx-auto mt-3 mb-4 h-[3px] w-[25px] rounded-full bg-[var(--accent)] transition-all duration-300 group-hover:w-[45px]" />
                  {stepDesc ? (
                    <p className="mx-auto max-w-[200px] text-[12px] leading-relaxed text-[#6B7280] transition-colors duration-300 group-hover:text-[#1F2937] md:text-[13px]">
                      {stepDesc}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
    {data.showCta ? <CalculateCTA /> : null}
    </>
  );
}
