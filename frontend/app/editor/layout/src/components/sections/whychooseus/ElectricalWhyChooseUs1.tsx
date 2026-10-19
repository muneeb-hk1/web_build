"use client";

import type { SectionProps } from "../../../types/section";
import { electricalData, electricalSections } from "../../../data/electricalContent";
import type { WhyChooseSectionData } from "../header/electricalTypes";
import WhyChoose from "./ElectricalWhyChooseView";

export default function ElectricalWhyChooseUs1({ data }: SectionProps) {
  const packed = electricalData(
    data,
    electricalSections.why_choose as WhyChooseSectionData,
    "why",
  );
  return <WhyChoose data={packed} />;
}
