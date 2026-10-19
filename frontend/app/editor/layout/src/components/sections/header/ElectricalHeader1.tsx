"use client";

import type { SectionProps } from "../../../types/section";
import { electricalCommon, electricalData } from "../../../data/electricalContent";
import type { HeaderData } from "./electricalTypes";
import Header from "./ElectricalHeaderView";

export default function ElectricalHeader1({ data }: SectionProps) {
  const fallback = (electricalCommon.Header || {}) as HeaderData;
  const packed = electricalData(data, fallback, "header");
  return <Header data={packed} />;
}
