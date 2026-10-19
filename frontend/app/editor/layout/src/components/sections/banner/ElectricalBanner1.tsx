"use client";

import type { SectionProps } from "../../../types/section";
import { electricalData, electricalSections } from "../../../data/electricalContent";
import type { HeroSectionData } from "../header/electricalTypes";
import Hero from "./ElectricalHeroView";

export default function ElectricalBanner1({ data }: SectionProps) {
  const packed = electricalData(data, electricalSections.hero as HeroSectionData, "hero");
  return <Hero data={packed} />;
}
