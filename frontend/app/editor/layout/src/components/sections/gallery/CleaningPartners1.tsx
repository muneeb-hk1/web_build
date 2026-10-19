"use client";

import type { SectionProps } from "../../../types/section";
import PartnersSection from "../layout-src/partnerssection/page";
import CalculateCTA from "../layout-src/calculatecta/page";
import { serviceHome1Content as siteData } from "../../../data/layoutSite";

export default function CleaningPartners1({ data = {} }: SectionProps) {
  const backgroundImage = String(data.backgroundImage || "");
  const items =
    Array.isArray(data.items) && data.items.length
      ? data.items
      : siteData.partners.items;

  return (
    <>
      <div
        className="relative bg-cover bg-center"
        style={
          backgroundImage
            ? { backgroundImage: `url('${backgroundImage}')` }
            : undefined
        }
        data-editor-fields="pretitle title desc items backgroundImage"
      >
        {backgroundImage ? (
          <div className="absolute inset-0 bg-[#F8F9FA]/90" />
        ) : null}
        <div className="relative">
          <PartnersSection
            subtitle={String(data.pretitle || siteData.partners.subtitle)}
            title={String(data.title || siteData.partners.title)}
            description={String(data.desc || siteData.partners.description)}
            items={items as typeof siteData.partners.items}
          />
        </div>
      </div>
      {data.showCta ? <CalculateCTA /> : null}
    </>
  );
}
