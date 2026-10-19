"use client";

import type { SectionProps } from "../../../types/section";
import QuotesContent from "../layout-src/quotescontent/page";

export default function CleaningQuotes1({ data = {} }: SectionProps) {
  const backgroundImage = String(data.backgroundImage || "");

  return (
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
        <div className="absolute inset-0 bg-[#F8F9FA]/90" />
      ) : null}
      <div className="relative">
        <QuotesContent />
      </div>
    </div>
  );
}
