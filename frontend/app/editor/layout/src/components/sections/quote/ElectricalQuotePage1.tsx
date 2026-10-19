"use client";

import type { SectionProps } from "../../../types/section";
import { electricalData, electricalSections } from "../../../data/electricalContent";
import type { QuoteSectionData, ServiceItem } from "../header/electricalTypes";
import Quote from "./ElectricalQuoteView";

export default function ElectricalQuotePage1({ data }: SectionProps) {
  const packed = electricalData(
    data,
    electricalSections.get_a_quote as QuoteSectionData,
    "quote",
  );
  const services = (
    (electricalSections.services as { items?: ServiceItem[] } | undefined)?.items || []
  ).map((item) => ({ title: item.title }));
  return <Quote data={packed} services={services} />;
}
