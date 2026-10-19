"use client";

import type { SectionProps } from "../../../types/section";
import { getAccentStyle } from "../../../lib/accentStyle";
import { WebsiteIcon } from "../../../lib/websiteIcons";

const ACCENT = "#1FA463";

const defaultItems = [
  {
    icon: "PartyPopper",
    value: "20",
    title: "Years",
    description: "We have more than 20+ years working experience.",
  },
  {
    icon: "Users",
    value: "160",
    title: "Employee",
    description: "We have more than 160+ employees working near you.",
  },
  {
    icon: "Award",
    value: "20",
    title: "Awards",
    description: "We have done many projects & get awards 20+ times.",
  },
];

export default function CleaningAwards1({ data = {} }: SectionProps) {
  const accent = String(data.accentColor || ACCENT);
  const items = (
    Array.isArray(data.items)
      ? data.items
      : Array.isArray(data.awards)
        ? data.awards
        : defaultItems
  ).slice(0, 6) as Array<Record<string, any>>;

  return (
    <section
      className="relative overflow-hidden bg-white py-16 lg:py-20"
      style={getAccentStyle(accent)}
      data-editor-fields="items"
    >
      <div className="mx-auto max-w-[1320px] px-5 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-14">
          {items.map((item, index) => {
            const iconKey = String(item.icon || item.iconName || "Award");
            const value = String(item.value || "0");
            const title = String(item.title || "");
            const description = String(
              item.description || item.desc || "",
            );

            return (
              <div
                key={`${title}-${index}`}
                className="flex items-start gap-5 transition-transform duration-300 hover:-translate-y-1 lg:gap-6"
              >
                <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-[16px] bg-[#E8F4EE] text-[#138A56] lg:h-[85px] lg:w-[85px]">
                  <WebsiteIcon name={iconKey} size={38} strokeWidth={1.5} />
                </div>
                <div className="mt-1">
                  <div className="mb-1.5 flex items-baseline gap-2">
                    <h3 className="text-[42px] leading-none font-extrabold tracking-tight text-[#138A56] lg:text-[48px]">
                      {value}
                    </h3>
                    {title ? (
                      <span className="text-[18px] font-semibold text-[#138A56] lg:text-[22px]">
                        {title}
                      </span>
                    ) : null}
                  </div>
                  {description ? (
                    <p className="text-[13px] leading-relaxed text-[#6B7280] lg:text-[14px]">
                      {description}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
