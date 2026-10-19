"use client";

import type { SectionProps } from "../../../types/section";
import { electricalData, electricalSections } from "../../../data/electricalContent";
import type { ServicesSectionData } from "../header/electricalTypes";
import Services from "./ElectricalServicesView";

export default function ElectricalService1({ data }: SectionProps) {
  const packed = electricalData(
    data,
    electricalSections.services as ServicesSectionData,
    "services",
  );
  return <Services data={packed} isGrid={false} showPagination={false} />;
}
