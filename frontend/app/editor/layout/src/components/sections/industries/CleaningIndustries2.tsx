"use client";

import type { SectionProps } from "../../../types/section";
import CleaningIndustries1 from "./CleaningIndustries1";

const PAGE_BANNER = "/categories/cleaning/template1/banner/herobanner.png";

export default function CleaningIndustries2(props: SectionProps) {
  return (
    <CleaningIndustries1
      {...props}
      data={{
        ...props.data,
        backgroundImage: String(props.data?.backgroundImage || PAGE_BANNER),
      }}
    />
  );
}
