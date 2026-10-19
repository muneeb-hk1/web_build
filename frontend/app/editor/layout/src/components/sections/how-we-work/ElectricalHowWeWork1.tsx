"use client";

import type { SectionProps } from "../../../types/section";
import { electricalData, electricalSections } from "../../../data/electricalContent";
import type { WorkProcessSectionData } from "../header/electricalTypes";
import WorkProcess from "./ElectricalWorkProcessView";

export default function ElectricalHowWeWork1({ data }: SectionProps) {
  const packed = electricalData(
    data,
    electricalSections.work_process as WorkProcessSectionData,
    "work",
  );
  return <WorkProcess data={packed} />;
}
