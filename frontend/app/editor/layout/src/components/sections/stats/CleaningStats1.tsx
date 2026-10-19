"use client";

import type { SectionProps } from "../../../types/section";
import {
  WebsiteIcon,
  resolveWebsiteIconName,
} from "../../../lib/websiteIcons";

const ACCENT_BG = "#0B4C34";

const defaultStats = [
  { icon: "Users", value: "20+", title: "Qualified Workers" },
  { icon: "ThumbsUp", value: "4.8", title: "Our Average Rating" },
  { icon: "ClipboardCheck", value: "500+", title: "Projects Completed" },
  { icon: "Award", value: "5+", title: "Years on the Market" },
];

export default function CleaningStats1({ data = {} }: SectionProps) {
  const backgroundColor = String(data.backgroundColor || ACCENT_BG);
  const stats = (
    Array.isArray(data.stats) && data.stats.length ? data.stats : defaultStats
  ) as Array<Record<string, any>>;

  return (
    <section
      className="relative overflow-hidden py-2 lg:py-4"
      style={{ backgroundColor }}
      data-editor-fields="backgroundColor stats"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1320px] px-5 lg:px-8">
        <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-y-8 lg:grid-cols-4 lg:gap-y-0">
          {stats.map((item, index) => {
            const iconName = resolveWebsiteIconName(
              item.icon || item.iconName,
              "Users",
            );
            const value = String(item.value || "0");
            const title = String(item.title || item.label || "");

            return (
              <div
                key={`${title}-${index}`}
                className="flex items-center gap-5 border-white/10 px-4 py-4 transition-transform duration-300 hover:-translate-y-1 max-lg:border-b max-lg:last:border-b-0 lg:border-r lg:px-8 lg:py-2 lg:last:border-r-0"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/10 shadow-inner">
                  <WebsiteIcon
                    name={iconName}
                    size={28}
                    className="text-white"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <h3 className="mb-2 text-3xl leading-none font-bold tracking-tight text-white lg:text-[40px]">
                    {value}
                  </h3>
                  <p className="text-sm font-medium text-white/80 lg:text-base">
                    {title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

(
  CleaningStats1 as typeof CleaningStats1 & {
    editorFields: readonly string[];
  }
).editorFields = ["backgroundColor", "stats"];
