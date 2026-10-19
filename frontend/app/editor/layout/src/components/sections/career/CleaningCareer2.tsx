"use client";

import type { SectionProps } from "../../../types/section";
import CleaningCareer1 from "./CleaningCareer1";

const PAGE_BANNER = "/categories/cleaning/template1/banner/herobanner.png";

export default function CleaningCareer2(props: SectionProps) {
  return (
    <CleaningCareer1
      {...props}
      data={{
        ...props.data,
        backgroundImage: String(props.data?.backgroundImage || PAGE_BANNER),
      }}
    />
  );
}
