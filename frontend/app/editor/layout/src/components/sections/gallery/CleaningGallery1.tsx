"use client";

import type { SectionProps } from "../../../types/section";
import { getAccentStyle } from "../../../lib/accentStyle";
import { WebsiteIcon } from "../../../lib/websiteIcons";

const ACCENT = "#1FA463";

const defaultItems = [
  { name: "GreenLeaf", category: "NATURE CARE", icon: "leaf", color: "#22C55E" },
  { name: "Homey", category: "REAL ESTATE", icon: "home", color: "#3B82F6" },
  { name: "OfficeHub", category: "COWORKING", icon: "building-2", color: "#8B5CF6" },
  { name: "Sparkle", category: "CLEANING", icon: "sparkles", color: "#F97316" },
  { name: "UrbanSpace", category: "LIVING", icon: "building", color: "#6366F1" },
  { name: "BuildCon", category: "CONSTRUCTION", icon: "bar-chart-3", color: "#0EA5E9" },
];

export default function CleaningGallery1({ data = {} }: SectionProps) {
  const accent = String(data.accentColor || ACCENT);
  const pretitle = String(data.pretitle || data.subtitle || "Trusted By");
  const title = String(data.title || "Leading Brands & Partners");
  const desc = String(
    data.desc ||
      data.description ||
      "We are proud to be trusted by innovative companies and organizations worldwide.",
  );
  const items = (
    Array.isArray(data.items) && data.items.length
      ? data.items
      : Array.isArray(data.galleryItems) && data.galleryItems.length
        ? data.galleryItems
        : defaultItems
  ) as Array<Record<string, any>>;

  return (
    <section
      className="relative overflow-hidden bg-[#F8F9FA] pt-4 pb-8 lg:pt-6 lg:pb-10"
      style={getAccentStyle(accent)}
      data-editor-fields="accentColor pretitle title desc items"
    >
      <div className="relative z-10 mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span className="inline-block text-[18px] font-bold tracking-wide text-[#22A46D]">
            {pretitle}
          </span>
          <h2 className="mt-3 mb-4 text-3xl leading-tight font-semibold tracking-tight text-[#0B2942] sm:text-4xl md:text-[45px]">
            {title}
          </h2>
          {desc ? (
            <p className="mx-auto max-w-lg text-[15px] leading-relaxed text-[#6B7280] md:text-[17px]">
              {desc}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {items.map((partner, index) => {
            const name = String(partner.name || partner.title || "Partner");
            const category = String(partner.category || "");
            const color = String(partner.color || accent);
            const iconKey = String(partner.icon || partner.iconName || "building");

            return (
              <div
                key={`${name}-${index}`}
                className="group relative flex cursor-pointer items-center justify-center gap-3 rounded-[12px] border border-gray-100 bg-white px-5 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
                style={{ borderBottom: `3.5px solid ${color}` }}
              >
                <WebsiteIcon
                  name={iconKey}
                  size={44}
                  strokeWidth={1.5}
                  style={{ color }}
                  className="shrink-0 transition-transform duration-300 group-hover:scale-110"
                />
                <div className="flex flex-col text-left">
                  <span className="text-[16px] leading-tight font-extrabold text-[#0D2235] transition-colors duration-300 group-hover:text-black">
                    {name}
                  </span>
                  {category ? (
                    <span
                      className="mt-0.5 text-[11px] font-bold tracking-[0.1em] uppercase transition-colors duration-300"
                      style={{ color }}
                    >
                      {category}
                    </span>
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
