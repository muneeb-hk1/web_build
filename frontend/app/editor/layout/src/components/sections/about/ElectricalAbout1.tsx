"use client";

import type { SectionProps } from "../../../types/section";
import { electricalData, electricalSections } from "../../../data/electricalContent";
import type { AboutSectionData } from "../header/electricalTypes";
import About from "./ElectricalAboutView";

export default function ElectricalAbout1({ data }: SectionProps) {
  const packed = electricalData(data, electricalSections.about as AboutSectionData, "about");
  return <About data={packed} />;
}
