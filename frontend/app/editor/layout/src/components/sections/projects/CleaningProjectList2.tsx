"use client";

import type { SectionProps } from "../../../types/section";
import CleaningProjectList1 from "./CleaningProjectList1";

const PAGE_BANNER = "/categories/cleaning/template1/banner/herobanner.png";

export default function CleaningProjectList2(props: SectionProps) {
  return (
    <CleaningProjectList1
      {...props}
      data={{
        ...props.data,
        backgroundImage: String(props.data?.backgroundImage || PAGE_BANNER),
      }}
    />
  );
}
