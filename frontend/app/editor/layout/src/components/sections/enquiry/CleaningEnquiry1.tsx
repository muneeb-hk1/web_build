"use client";

import type { SectionProps } from "../../../types/section";
import EnquiryContent from "../layout-src/enquirycontent/page";
import CalculateCTA from "../layout-src/calculatecta/page";

export default function CleaningEnquiry1({ data = {} }: SectionProps) {
  const backgroundImage = String(data.backgroundImage || "");

  return (
    <>
      <div
        className="relative bg-cover bg-center"
        style={
          backgroundImage
            ? { backgroundImage: `url('${backgroundImage}')` }
            : undefined
        }
        data-editor-fields="backgroundImage"
      >
        {backgroundImage ? (
          <div className="absolute inset-0 bg-white/90" />
        ) : null}
        <div className="relative">
          <EnquiryContent />
        </div>
      </div>
      {data.showCta ? <CalculateCTA /> : null}
    </>
  );
}
