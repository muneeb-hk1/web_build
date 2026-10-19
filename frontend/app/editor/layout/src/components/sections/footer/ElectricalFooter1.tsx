"use client";

import type { SectionProps } from "../../../types/section";
import { electricalData, electricalCommon } from "../../../data/electricalContent";
import type { FooterData } from "../header/electricalTypes";
import Footer from "./ElectricalFooterView";

export default function ElectricalFooter1({ data }: SectionProps) {
  const packed = electricalData(data, electricalCommon.Footer as FooterData, "footer");
  return <Footer data={packed} />;
}
