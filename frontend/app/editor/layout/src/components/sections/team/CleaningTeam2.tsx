"use client";

import type { SectionProps } from "../../../types/section";
import CleaningTeam1 from "./CleaningTeam1";

const PAGE_BANNER = "/categories/cleaning/template1/banner/herobanner.png";

export default function CleaningTeam2(props: SectionProps) {
  return (
    <CleaningTeam1
      {...props}
      data={{
        ...props.data,
        backgroundImage: String(props.data?.backgroundImage || PAGE_BANNER),
      }}
    />
  );
}
