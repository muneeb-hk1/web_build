"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { SectionProps } from "../../../types/section";
import { useOptionalPreview } from "../../context/PreviewContext";
import { getAccentStyle } from "../../../lib/accentStyle";
import { getPageLabelFromHref, scrollTemplateToTop } from "../../../lib/previewNav";

const ACCENT = "#1FA463";

const defaultOptions = [
  { value: "50", label: "50 - 100 sq m" },
  { value: "100", label: "100 - 200 sq m" },
  { value: "200", label: "200+ sq m" },
];

export default function CleaningFormDetail1({ data = {} }: SectionProps) {
  const preview = useOptionalPreview();
  const accent = String(data.accentColor || ACCENT);
  const pretitle = String(
    data.pretitle || data.subtitle || "Your Cleaning Cost",
  );
  const title = String(data.title || "Calculate");
  const emailPlaceholder = String(data.emailPlaceholder || "Your Email");
  const selectPlaceholder = String(
    data.selectPlaceholder || "Square Meters",
  );
  const buttonText = String(data.buttonText || "Calculate");
  const buttonHref = String(data.buttonHref || data.buttonLink || "/contact");
  const backgroundImage = String(data.backgroundImage || "");
  const options = (
    Array.isArray(data.options) && data.options.length
      ? data.options
      : defaultOptions
  ) as Array<Record<string, any>>;

  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState("");

  const handleNavigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string,
  ) => {
    if (!preview) return;
    event.preventDefault();
    preview.setCurrentPage(getPageLabelFromHref(href, label));
    scrollTemplateToTop();
  };

  return (
    <section
      className="relative z-20 -mb-28 mt-2 px-4 md:-mb-32 md:mt-4 lg:px-6"
      style={{
        ...getAccentStyle(accent),
        ...(backgroundImage
          ? {
              backgroundImage: `url('${backgroundImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}),
      }}
      data-editor-fields="accentColor pretitle title emailPlaceholder selectPlaceholder options buttonText buttonHref backgroundImage"
    >
      <div className="relative mx-auto max-w-[1140px]">
        <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[30px] bg-white p-6 shadow-[0_0_60px_rgba(0,0,0,0.06)] md:gap-8 md:p-10 lg:flex-row lg:p-12">
          <svg
            className="pointer-events-none absolute top-0 left-0 h-full w-full opacity-40"
            viewBox="0 0 1000 200"
            preserveAspectRatio="none"
          >
            <path
              d="M0,100 C200,200 400,0 600,100 C800,200 1000,50 1000,50 L1000,200 L0,200 Z"
              fill="none"
              stroke="#F0ECE4"
              strokeWidth="2"
            />
            <path
              d="M0,150 C300,-50 500,250 1000,100"
              fill="none"
              stroke="#F0ECE4"
              strokeWidth="2"
            />
          </svg>

          <div className="relative z-10 shrink-0 text-center lg:text-left">
            <div className="mb-1 flex items-center justify-center gap-2 lg:justify-start">
              <div className="h-[2px] w-6 bg-[#16A361] md:w-8" />
              <span className="text-[11px] font-semibold tracking-widest text-[#16A361] uppercase md:text-[13px]">
                {pretitle}
              </span>
            </div>
            <h2 className="text-[32px] leading-none font-semibold tracking-tight text-[#1A1A1A] md:text-[40px]">
              {title}
            </h2>
          </div>

          <div className="relative z-10 mt-2 flex w-full flex-col items-center gap-3.5 md:mt-0 md:flex-row md:gap-5 lg:w-auto">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={emailPlaceholder}
              className="w-full rounded-full border border-[#EDEDED] bg-white px-6 py-3.5 text-[14px] text-[#777] outline-none transition-colors placeholder:text-[#999] focus:border-[#138A56] md:w-[240px] md:px-7 md:py-4 md:text-[15px] xl:w-[260px]"
            />

            <div className="relative w-full md:w-[240px] xl:w-[260px]">
              <select
                value={selected}
                onChange={(event) => setSelected(event.target.value)}
                className="w-full appearance-none rounded-full border border-[#EDEDED] bg-white px-6 py-3.5 text-[14px] text-[#555] outline-none transition-colors focus:border-[#138A56] md:px-7 md:py-4 md:text-[15px]"
              >
                <option value="">{selectPlaceholder}</option>
                {options.map((opt, i) => (
                  <option
                    key={`${opt.value || opt.label}-${i}`}
                    value={String(opt.value || opt.label || "")}
                  >
                    {String(opt.label || opt.value || "")}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-[#777] md:right-6"
              />
            </div>

            <Link
              href={buttonHref}
              onClick={(event) => handleNavigate(event, buttonHref, buttonText)}
              className="w-full whitespace-nowrap rounded-full bg-[#138A56] px-6 py-3.5 text-center text-[14px] font-bold text-white transition-colors duration-300 hover:bg-[#0D2235] md:w-[160px] md:px-8 md:py-4 md:text-[15px] lg:w-[180px]"
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
