"use client";

import type { SectionProps } from "../../../types/section";
import CleaningQuotes1 from "./CleaningQuotes1";

const PAGE_BANNER = "/categories/cleaning/template1/banner/herobanner.png";

export default function CleaningQuotes2(props: SectionProps) {
  return (
    <CleaningQuotes1
      {...props}
      data={{
        ...props.data,
        backgroundImage: String(props.data?.backgroundImage || PAGE_BANNER),
      }}
    />
  );
}
