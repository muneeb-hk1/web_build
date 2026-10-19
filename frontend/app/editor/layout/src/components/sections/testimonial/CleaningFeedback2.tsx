"use client";

import type { SectionProps } from "../../../types/section";
import CleaningFeedback1 from "./CleaningFeedback1";

const PAGE_BANNER = "/categories/cleaning/template1/banner/herobanner.png";

export default function CleaningFeedback2(props: SectionProps) {
  return (
    <CleaningFeedback1
      {...props}
      data={{
        ...props.data,
        backgroundImage: String(props.data?.backgroundImage || PAGE_BANNER),
      }}
    />
  );
}
