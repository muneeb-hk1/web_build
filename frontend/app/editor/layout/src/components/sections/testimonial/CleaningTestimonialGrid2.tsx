"use client";

import type { SectionProps } from "../../../types/section";
import CleaningTestimonialGrid1 from "./CleaningTestimonialGrid1";

const PAGE_BANNER = "/categories/cleaning/template1/banner/herobanner.png";

export default function CleaningTestimonialGrid2(props: SectionProps) {
  return (
    <CleaningTestimonialGrid1
      {...props}
      data={{
        ...props.data,
        backgroundImage: String(props.data?.backgroundImage || PAGE_BANNER),
      }}
    />
  );
}
