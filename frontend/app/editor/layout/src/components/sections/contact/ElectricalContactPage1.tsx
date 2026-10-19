"use client";

import type { SectionProps } from "../../../types/section";
import { electricalData, electricalSections } from "../../../data/electricalContent";
import type { ContactSectionData, ServiceItem } from "../header/electricalTypes";
import Contact from "./ElectricalContactView";

export default function ElectricalContactPage1({ data }: SectionProps) {
  const packed = electricalData(
    data,
    electricalSections.contact as ContactSectionData,
    "contact",
  );
  const services = (
    (electricalSections.services as { items?: ServiceItem[] } | undefined)?.items || []
  ).map((item) => ({ title: item.title }));
  return <Contact data={packed} services={services} />;
}
