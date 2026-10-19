"use client";

import type { SectionProps } from "../../../types/section";
import { electricalData, electricalSections } from "../../../data/electricalContent";
import type { StatsSectionData } from "../header/electricalTypes";
import Stats from "./ElectricalStatsView";

export default function ElectricalStats1({ data }: SectionProps) {
  const packed = electricalData(data, electricalSections.stats as StatsSectionData, "stats");
  return <Stats data={packed} />;
}
