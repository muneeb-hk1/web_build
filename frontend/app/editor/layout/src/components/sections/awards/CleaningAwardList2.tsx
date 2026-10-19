"use client";

import type { SectionProps } from "../../../types/section";
import CleaningAwardList1 from "./CleaningAwardList1";

const PAGE_BANNER = "/categories/cleaning/template1/banner/herobanner.png";

export default function CleaningAwardList2(props: SectionProps) {
  return (
    <CleaningAwardList1
      {...props}
      data={{
        ...props.data,
        backgroundImage: String(props.data?.backgroundImage || PAGE_BANNER),
      }}
    />
  );
}
