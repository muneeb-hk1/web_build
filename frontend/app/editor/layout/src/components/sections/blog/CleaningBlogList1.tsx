"use client";

import type { SectionProps } from "../../../types/section";
import NewsSection from "../layout-src/newssection/page";
import CalculateCTA from "../layout-src/calculatecta/page";

export default function CleaningBlogList1({ data = {} }: SectionProps) {
  const backgroundImage = String(data.backgroundImage || "");
  const limit = Number(data.limit) > 0 ? Number(data.limit) : 6;

  return (
    <>
      <div
        className="relative bg-cover bg-center"
        style={
          backgroundImage
            ? { backgroundImage: `url('${backgroundImage}')` }
            : undefined
        }
        data-editor-fields="limit backgroundImage"
      >
        {backgroundImage ? (
          <div className="absolute inset-0 bg-[#F8F9FA]/90" />
        ) : null}
        <div className="relative">
          <NewsSection layout="grid" limit={limit} />
        </div>
      </div>
      {data.showCta ? <CalculateCTA /> : null}
    </>
  );
}
