"use client";

import type { SectionProps } from "../../../types/section";
import CleaningContact1 from "./CleaningContact1";

const PAGE_BANNER = "/categories/cleaning/template1/banner/herobanner.png";

export default function CleaningContact2(props: SectionProps) {
  return (
    <CleaningContact1
      {...props}
      data={{
        ...props.data,
        backgroundImage: String(props.data?.backgroundImage || PAGE_BANNER),
      }}
    />
  );
}
