"use client";

import type { SectionProps } from "../../../types/section";
import CleaningPricing1 from "./CleaningPricing1";

const PAGE_BANNER = "/categories/cleaning/template1/banner/herobanner.png";

export default function CleaningPricing2(props: SectionProps) {
  return (
    <CleaningPricing1
      {...props}
      data={{
        ...props.data,
        backgroundImage: String(props.data?.backgroundImage || PAGE_BANNER),
      }}
    />
  );
}
