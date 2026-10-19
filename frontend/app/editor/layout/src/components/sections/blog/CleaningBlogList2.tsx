"use client";

import type { SectionProps } from "../../../types/section";
import CleaningBlogList1 from "./CleaningBlogList1";

const PAGE_BANNER = "/categories/cleaning/template1/banner/herobanner.png";

export default function CleaningBlogList2(props: SectionProps) {
  return (
    <CleaningBlogList1
      {...props}
      data={{
        ...props.data,
        backgroundImage: String(props.data?.backgroundImage || PAGE_BANNER),
      }}
    />
  );
}
