"use client";

import type { SectionProps } from "../../../types/section";
import { electricalData, electricalCommon } from "../../../data/electricalContent";
import type { TopbarData } from "./electricalTypes";
import Topbar from "./ElectricalTopbarView";

export default function ElectricalTopbar1({ data }: SectionProps) {
  const packed = electricalData(data, electricalCommon.Topbar as TopbarData, "topbar");
  if (!packed?.contact_info) return null;
  return <Topbar data={packed} />;
}
