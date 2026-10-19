"use client";

import type { SectionProps } from "../../../types/section";
import CleaningPartners1 from "./CleaningPartners1";

const PAGE_BANNER = "/categories/cleaning/template1/banner/herobanner.png";

export default function CleaningPartners2(props: SectionProps) {
  return (
    <CleaningPartners1
      {...props}
      data={{
        ...props.data,
        backgroundImage: String(props.data?.backgroundImage || PAGE_BANNER),
      }}
    />
  );
}
