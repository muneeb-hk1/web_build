"use client";

import type { SectionProps } from "../../../types/section";
import CleaningAchievement1 from "./CleaningAchievement1";

const PAGE_BANNER = "/categories/cleaning/template1/banner/herobanner.png";

export default function CleaningAchievement2(props: SectionProps) {
  return (
    <CleaningAchievement1
      {...props}
      data={{
        ...props.data,
        backgroundImage: String(props.data?.backgroundImage || PAGE_BANNER),
      }}
    />
  );
}
