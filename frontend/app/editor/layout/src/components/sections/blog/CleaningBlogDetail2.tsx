"use client";

import type { SectionProps } from "../../../types/section";
import CleaningBlogDetail1 from "./CleaningBlogDetail1";

const PAGE_BANNER = "/categories/cleaning/template1/banner/herobanner.png";

export default function CleaningBlogDetail2(props: SectionProps) {
  return (
    <CleaningBlogDetail1
      {...props}
      data={{
        ...props.data,
        backgroundImage: String(props.data?.backgroundImage || PAGE_BANNER),
      }}
    />
  );
}
