"use client";

import type { SectionProps } from "../../../types/section";
import TestimonialGrid from "../layout-src/testimonialgrid/page";
import { serviceHome1Content as siteData } from "../../../data/layoutSite";

export default function CleaningTestimonialGrid1({ data = {} }: SectionProps) {
  const backgroundImage = String(data.backgroundImage || "");
  const testimonials =
    Array.isArray(data.testimonials) && data.testimonials.length
      ? data.testimonials
      : siteData.testimonialGrid.testimonials;

  return (
    <div
      className="relative bg-cover bg-center"
      style={
        backgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : undefined
      }
      data-editor-fields="subtitle title testimonials backgroundImage"
    >
      {backgroundImage ? <div className="absolute inset-0 bg-white/88" /> : null}
      <div className="relative">
        <TestimonialGrid
          subtitle={String(data.subtitle || siteData.testimonialGrid.subtitle)}
          title={String(data.title || siteData.testimonialGrid.title)}
          testimonials={testimonials as typeof siteData.testimonialGrid.testimonials}
        />
      </div>
    </div>
  );
}
