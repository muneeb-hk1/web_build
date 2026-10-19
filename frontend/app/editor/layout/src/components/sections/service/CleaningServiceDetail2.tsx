"use client";

import type { SectionProps } from "../../../types/section";
import CleaningServiceDetail1 from "./CleaningServiceDetail1";

const PAGE_BANNER = "/categories/cleaning/template1/banner/herobanner.png";

export default function CleaningServiceDetail2(props: SectionProps) {
  return (
    <CleaningServiceDetail1
      {...props}
      data={{
        ...props.data,
        backgroundImage: String(props.data?.backgroundImage || PAGE_BANNER),
      }}
    />
  );
}
