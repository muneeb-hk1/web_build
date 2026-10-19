"use client";

import type { SectionProps } from "../../../types/section";
import CleaningEnquiry1 from "./CleaningEnquiry1";

const PAGE_BANNER = "/categories/cleaning/template1/banner/herobanner.png";

export default function CleaningEnquiry2(props: SectionProps) {
  return (
    <CleaningEnquiry1
      {...props}
      data={{
        ...props.data,
        backgroundImage: String(props.data?.backgroundImage || PAGE_BANNER),
      }}
    />
  );
}
