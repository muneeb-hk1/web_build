"use client";

import type { SectionProps } from "../../../types/section";
import { electricalData, electricalSections } from "../../../data/electricalContent";
import type { ThankYouSectionData } from "../header/electricalTypes";
import ThankYou from "./ElectricalThankYouView";

export default function ElectricalThankYou1({ data }: SectionProps) {
  const packed = electricalData(
    data,
    electricalSections.thank_you as ThankYouSectionData,
    "thanks",
  );
  return (
    <main className="flex flex-1 items-center justify-center py-12">
      <ThankYou data={packed} />
    </main>
  );
}
