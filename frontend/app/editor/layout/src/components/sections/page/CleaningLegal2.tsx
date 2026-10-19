"use client";

import type { SectionProps } from "../../../types/section";
import CleaningLegal1 from "./CleaningLegal1";

const PAGE_BANNER = "/categories/cleaning/template1/banner/herobanner.png";

export default function CleaningLegal2(props: SectionProps) {
  return (
    <CleaningLegal1
      {...props}
      data={{
        ...props.data,
        backgroundImage: String(props.data?.backgroundImage || PAGE_BANNER),
      }}
    />
  );
}
