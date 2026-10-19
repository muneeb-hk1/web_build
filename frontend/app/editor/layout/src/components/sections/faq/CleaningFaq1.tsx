"use client";

import type { SectionProps } from "../../../types/section";
import FaqAccordion from "../layout-src/faqaccordion/page";
import CalculateCTA from "../layout-src/calculatecta/page";
import { serviceHome1Content as siteData } from "../../../data/layoutSite";

export default function CleaningFaq1({ data = {} }: SectionProps) {
  const backgroundImage = String(data.backgroundImage || "");
  const faqItems =
    Array.isArray(data.faqItems) && data.faqItems.length
      ? data.faqItems
      : siteData.faq.items;

  return (
    <>
      <div
        className="relative bg-cover bg-center"
        style={
          backgroundImage
            ? { backgroundImage: `url('${backgroundImage}')` }
            : undefined
        }
        data-editor-fields="faqItems backgroundImage"
      >
        {backgroundImage ? (
          <div className="absolute inset-0 bg-[#F8F9FA]/90" />
        ) : null}
        <div className="relative">
          <FaqAccordion items={faqItems as typeof siteData.faq.items} />
        </div>
      </div>
      {data.showCta ? <CalculateCTA /> : null}
    </>
  );
}
