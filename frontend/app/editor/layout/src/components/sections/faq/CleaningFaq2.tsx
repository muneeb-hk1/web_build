"use client";

import type { SectionProps } from "../../../types/section";
import CleaningFaq1 from "./CleaningFaq1";

const PAGE_BANNER = "/categories/cleaning/template1/banner/herobanner.png";

export default function CleaningFaq2(props: SectionProps) {
  return (
    <CleaningFaq1
      {...props}
      data={{
        ...props.data,
        backgroundImage: String(props.data?.backgroundImage || PAGE_BANNER),
      }}
    />
  );
}
