"use client";

import type { SectionProps } from "../../../types/section";
import AwardsSection from "../layout-src/awardssection/page";
import { serviceHome1Content as siteData } from "../../../data/layoutSite";

export default function CleaningAwardList1({ data = {} }: SectionProps) {
  const backgroundImage = String(data.backgroundImage || "");
  const items =
    Array.isArray(data.items) && data.items.length
      ? data.items
      : siteData.awards.items;

  return (
    <div
      className="relative bg-cover bg-center"
      style={
        backgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : undefined
      }
      data-editor-fields="subtitle titleLine1 titleHighlight desc items backgroundImage"
    >
      {backgroundImage ? <div className="absolute inset-0 bg-[#F5FAED]/90" /> : null}
      <div className="relative">
        <AwardsSection
          subtitle={String(data.subtitle || siteData.awards.subtitle)}
          titleLine1={String(data.titleLine1 || siteData.awards.titleLine1)}
          titleHighlight={String(
            data.titleHighlight || siteData.awards.titleHighlight,
          )}
          description={String(data.desc || siteData.awards.description)}
          items={items as typeof siteData.awards.items}
        />
      </div>
    </div>
  );
}
